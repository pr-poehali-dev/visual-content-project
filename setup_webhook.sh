#!/bin/bash

# Настройка webhook для Telegram бота
BOT_TOKEN="8380915711:AAEvj6r9A17pTUt3A1CsPJo6lINZBlBO9bg"
WEBHOOK_URL="https://functions.poehali.dev/6a33fdc5-867a-4789-92e3-561eb84d9f05"

echo "🔧 Настройка webhook для бота..."
echo "📍 URL: $WEBHOOK_URL"
echo ""

# Устанавливаем webhook
echo "1️⃣ Установка webhook..."
RESPONSE=$(curl -s -X POST "https://api.telegram.org/bot${BOT_TOKEN}/setWebhook" \
  -H "Content-Type: application/json" \
  -d "{\"url\": \"${WEBHOOK_URL}\"}")

echo "$RESPONSE" | python3 -m json.tool
echo ""

# Проверяем информацию о webhook
echo "2️⃣ Проверка webhook..."
curl -s "https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo" | python3 -m json.tool
echo ""

# Получаем информацию о боте
echo "3️⃣ Информация о боте..."
curl -s "https://api.telegram.org/bot${BOT_TOKEN}/getMe" | python3 -m json.tool
echo ""

echo "✨ Готово! Теперь найдите бота в Telegram и отправьте /start"
