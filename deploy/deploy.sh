#!/usr/bin/env bash
# Blue/green деплой taza-ayim.kg без простоя.
#
# На сервере установлен как /usr/local/bin/taza-ayim-deploy (копия этого файла).
# После правок здесь его нужно переустановить:
#   scp deploy/deploy.sh root@217.114.0.30:/usr/local/bin/taza-ayim-deploy
#
# Команды:
#   taza-ayim-deploy deploy [sha]   собрать свежий master и переключить трафик
#   taza-ayim-deploy rollback       вернуть предыдущую версию (она хранится остановленной)
#   taza-ayim-deploy status         что сейчас работает
#
# Как это устроено: две копии приложения — blue (порт 3020) и green (3021).
# Новая версия собирается и запускается в свободном цвете, пока старая
# обслуживает сайт. Если /ru и /ky отвечают 200, nginx мягко переключается
# на неё (reload, без обрыва соединений), старая останавливается и остаётся
# для отката. Если сборка или проверка не прошли — сайт остаётся на старой.
#
# GitHub Actions вызывает скрипт по SSH-ключу, которому в authorized_keys
# разрешена только эта команда (command="..."); аргументы приходят в
# SSH_ORIGINAL_COMMAND и строго проверяются.
set -euo pipefail

APP_DIR=/home/projects/taza-ayim
UPSTREAM_CONF=/etc/nginx/snippets/taza-ayim-upstream.conf
IMAGE=taza-ayim
CACHE_VOLUME=taza-ayim_next-cache
LOG=/var/log/taza-ayim-deploy.log
KEEP_IMAGES=3
declare -A PORT=([blue]=3020 [green]=3021)

exec > >(tee -a "$LOG") 2>&1

log() { echo "[$(date '+%F %T')] $*"; }

# Команда: из SSH (forced command) или из командной строки
if [ -n "${SSH_ORIGINAL_COMMAND:-}" ]; then
  read -r CMD ARG _ <<<"$SSH_ORIGINAL_COMMAND"
else
  CMD="${1:-status}"
  ARG="${2:-}"
fi
ARG="${ARG:-}"

lock() {
  exec 9>/run/lock/taza-ayim-deploy.lock
  flock -w 1200 9 || { log "Другой деплой ещё идёт — выхожу"; exit 1; }
}

active_color() {
  if [ -f "$UPSTREAM_CONF" ] && grep -q "127.0.0.1:${PORT[green]};" "$UPSTREAM_CONF"; then
    echo green
  else
    echo blue
  fi
}

other_color() { [ "$1" = blue ] && echo green || echo blue; }

# Новая версия должна отдать 200 на обеих языковых главных (до ~90 с на старт)
healthy() {
  local port=$1 i
  for i in $(seq 1 45); do
    if [ "$(curl -s -o /dev/null -m 5 -w '%{http_code}' "http://127.0.0.1:$port/ru")" = 200 ] &&
      [ "$(curl -s -o /dev/null -m 5 -w '%{http_code}' "http://127.0.0.1:$port/ky")" = 200 ]; then
      return 0
    fi
    sleep 2
  done
  return 1
}

switch_to() {
  local color=$1 backup
  backup=$(mktemp)
  cp "$UPSTREAM_CONF" "$backup"
  printf '# Управляется taza-ayim-deploy, вручную не редактировать\nupstream taza_ayim_app {\n    server 127.0.0.1:%s;\n}\n' \
    "${PORT[$color]}" >"$UPSTREAM_CONF"
  if nginx -t -q; then
    systemctl reload nginx
    rm -f "$backup"
    log "Трафик переключён на $color (порт ${PORT[$color]})"
  else
    cp "$backup" "$UPSTREAM_CONF"
    rm -f "$backup"
    log "ОШИБКА: nginx -t не прошёл, переключение отменено"
    return 1
  fi
}

running_image() {
  [ "$(docker inspect -f '{{.State.Running}}' "$IMAGE-$1" 2>/dev/null)" = true ] &&
    docker inspect -f '{{.Config.Image}}' "$IMAGE-$1" 2>/dev/null
}

# Храним последние $KEEP_IMAGES образов (текущий и откатный среди них).
# Чистим только свои образы: сервер общий.
prune_images() {
  docker images "$IMAGE" --format '{{.Tag}}' | grep -v '^<none>$' |
    tail -n +$((KEEP_IMAGES + 1)) | while read -r tag; do
    docker image rm "$IMAGE:$tag" >/dev/null 2>&1 || true
  done
  docker image prune -f --filter label=taza-ayim=1 >/dev/null || true
}

deploy() {
  if [ -n "$ARG" ] && ! [[ "$ARG" =~ ^[0-9a-f]{7,40}$ ]]; then
    log "Некорректный SHA: $ARG"
    exit 2
  fi

  cd "$APP_DIR"
  git fetch -q origin master
  git checkout -q master
  git merge -q --ff-only origin/master
  if [ -n "$ARG" ] && ! git merge-base --is-ancestor "$ARG" HEAD 2>/dev/null; then
    log "Коммит $ARG не найден в master"
    exit 2
  fi

  local tag cur new
  tag=$(git rev-parse --short=12 HEAD)
  cur=$(active_color)
  new=$(other_color "$cur")

  if [ "$(running_image "$cur" || true)" = "$IMAGE:$tag" ]; then
    log "Версия $tag уже работает ($cur), пропускаю"
    return 0
  fi

  log "Деплой: $(git log --oneline -1)"
  log "Сборка образа $IMAGE:$tag (сайт пока работает на $cur)..."
  if ! docker build --progress=plain --label taza-ayim=1 -t "$IMAGE:$tag" . >/tmp/taza-ayim-build.log 2>&1; then
    tail -40 /tmp/taza-ayim-build.log
    log "ОШИБКА: сборка не удалась, сайт остаётся на $cur"
    exit 1
  fi

  docker rm -f "$IMAGE-$new" >/dev/null 2>&1 || true
  docker run -d --name "$IMAGE-$new" --restart unless-stopped \
    -p "127.0.0.1:${PORT[$new]}:3000" \
    -v "$CACHE_VOLUME:/app/.next/cache" \
    "$IMAGE:$tag" >/dev/null
  log "Запущен $new (порт ${PORT[$new]}), проверяю /ru и /ky..."

  if ! healthy "${PORT[$new]}"; then
    log "ОШИБКА: новая версия не прошла проверку, сайт остаётся на $cur"
    docker logs --tail 40 "$IMAGE-$new" || true
    docker rm -f "$IMAGE-$new" >/dev/null
    exit 1
  fi

  switch_to "$new"
  sleep 15 # даём старой версии доотвечать на начатые запросы
  docker stop "$IMAGE-$cur" >/dev/null 2>&1 || true
  prune_images
  log "Готово: работает $tag ($new). Предыдущая версия сохранена для отката."
}

rollback() {
  local cur prev
  cur=$(active_color)
  prev=$(other_color "$cur")
  if ! docker inspect "$IMAGE-$prev" >/dev/null 2>&1; then
    log "Нет предыдущей версии для отката"
    exit 1
  fi

  log "Откат: $cur → $prev ($(docker inspect -f '{{.Config.Image}}' "$IMAGE-$prev"))"
  docker start "$IMAGE-$prev" >/dev/null
  if ! healthy "${PORT[$prev]}"; then
    log "ОШИБКА: предыдущая версия не отвечает, откат отменён"
    docker stop "$IMAGE-$prev" >/dev/null
    exit 1
  fi

  switch_to "$prev"
  sleep 15
  docker stop "$IMAGE-$cur" >/dev/null 2>&1 || true
  log "Откат выполнен. Следующий пуш в master снова задеплоит свежую версию."
}

status() {
  local cur
  cur=$(active_color)
  echo "Сайт обслуживает: $cur (порт ${PORT[$cur]})"
  docker ps -a --filter "name=$IMAGE-blue" --filter "name=$IMAGE-green" \
    --format '  {{.Names}}  {{.Image}}  {{.Status}}'
}

case "$CMD" in
deploy) lock && deploy ;;
rollback) lock && rollback ;;
status) status ;;
*)
  echo "Использование: taza-ayim-deploy deploy [sha] | rollback | status"
  exit 2
  ;;
esac
