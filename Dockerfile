# Используем стабильный и легкий образ
FROM node:20-alpine AS runner

WORKDIR /app

# Устанавливаем переменную окружения для production
ENV NODE_ENV=production
# Отключаем телеметрию Next.js во время выполнения
ENV NEXT_TELEMETRY_DISABLED=1

# Создаем пользователя для безопасности (не запускаем от root)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Копируем необходимые файлы из вашей локальной папки .next/standalone
# Standalone содержит в себе и сервер, и необходимые node_modules
COPY ./public ./public
COPY ./.next/static ./.next/static

# Устанавливаем права для пользователя
USER nextjs

# Открываем порт
EXPOSE 3000
ENV PORT=3000

# Запускаем сервер через сгенерированный файл server.js
CMD ["node", "server.js"]
