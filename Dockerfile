# # Используем стабильный и легкий образ
# FROM node:20-alpine AS runner

# WORKDIR /app

# # Устанавливаем переменную окружения для production
# ENV NODE_ENV=production
# # Отключаем телеметрию Next.js во время выполнения
# ENV NEXT_TELEMETRY_DISABLED=1

# # Создаем пользователя для безопасности (не запускаем от root)
# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

# # Копируем необходимые файлы из вашей локальной папки .next/standalone
# # Standalone содержит в себе и сервер, и необходимые node_modules
# COPY ./public ./public
# COPY ./.next/static ./.next/static

# # Устанавливаем права для пользователя
# USER nextjs

# # Открываем порт
# EXPOSE 3000
# ENV PORT=3000

# # Запускаем сервер через сгенерированный файл server.js
# CMD ["node", "server.js"]


# syntax=docker/dockerfile:1.4

# ========================
# Dependencies stage
# ========================
FROM node:20-slim AS deps

WORKDIR /app

# Копируем файлы зависимостей
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./

# Ставим зависимости. sharp приходит как optional-зависимость Next и
# подтягивает готовый бинарник @img/sharp-linux-x64 — собирать из исходников
# (python3/make/g++/libvips-dev) и переустанавливать вручную не нужно.
# Кэш чистим в том же слое, иначе он останется в образе.
RUN \
  if [ -f yarn.lock ]; then \
    yarn --frozen-lockfile && yarn cache clean; \
  elif [ -f package-lock.json ]; then \
    npm ci --include=optional && npm cache clean --force; \
  elif [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm && pnpm i --frozen-lockfile; \
  else \
    echo "Lockfile not found." && exit 1; \
  fi

# ========================
# Build stage
# ========================
FROM node:20-slim AS builder

WORKDIR /app

# Копируем node_modules из deps
COPY --from=deps /app/node_modules ./node_modules

# Копируем исходный код
COPY . .

# Отключаем телеметрию Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# Сборка приложения
RUN \
  if [ -f yarn.lock ]; then yarn build; \
  elif [ -f package-lock.json ]; then npm run build; \
  elif [ -f pnpm-lock.yaml ]; then corepack enable pnpm && pnpm build; \
  else npm run build; \
  fi

# ========================
# Production stage
# ========================
FROM node:20-slim AS runner

# Устанавливаем runtime зависимости
RUN apt-get update && apt-get install -y \
    dumb-init \
    curl \
    ca-certificates \
    tzdata \
    libvips42 \
    && rm -rf /var/lib/apt/lists/*

# Создаем непривилегированного пользователя
RUN groupadd --gid 1001 nodejs && \
    useradd --uid 1001 --gid nodejs --shell /bin/bash --create-home nextjs

WORKDIR /app

# Устанавливаем правильные разрешения
RUN mkdir -p /app/.next && \
    chown -R nextjs:nodejs /app

# Копируем public директорию
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Копируем standalone сборку
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./

# Копируем статические файлы
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Переключаемся на непривилегированного пользователя
USER nextjs

# Открываем порт
EXPOSE 3000

# Переменные окружения для production
ENV PORT=3000 \
    HOSTNAME="0.0.0.0" \
    NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/ || exit 1

# Метаданные
LABEL maintainer="your-email@example.com" \
      description="Next.js Production Application" \
      version="1.0"

# Используем dumb-init для правильной обработки сигналов
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# Запускаем сервер
CMD ["node", "server.js"]