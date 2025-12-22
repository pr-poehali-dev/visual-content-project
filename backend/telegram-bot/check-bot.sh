#!/bin/bash

echo "🤖 Проверка Telegram бота Vizi"
echo "================================"
echo ""

# Проверка наличия токена
if [ -z "$TELEGRAM_BOT_TOKEN" ]; then
    echo "❌ TELEGRAM_BOT_TOKEN не установлен"
    echo "   Установите секрет в проекте poehali.dev"
    exit 1
fi

echo "✅ TELEGRAM_BOT_TOKEN найден"
echo ""

# Информация о боте
echo "📋 Информация о боте:"
curl -s "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe" | python3 -m json.tool
echo ""

# Информация о webhook
echo "🔗 Информация о webhook:"
curl -s "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo" | python3 -m json.tool
echo ""

# Проверка доступности функции
FUNCTION_URL="https://functions.poehali.dev/6a33fdc5-867a-4789-92e3-561eb84d9f05"
echo "🌐 Проверка функции: $FUNCTION_URL"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$FUNCTION_URL")

if [ "$HTTP_CODE" == "200" ]; then
    echo "✅ Функция доступна (HTTP $HTTP_CODE)"
elif [ "$HTTP_CODE" == "402" ]; then
    echo "⚠️ Ошибка 402 Payment Required"
    echo "   Проверьте биллинг в Yandex Cloud Console"
else
    echo "❌ Функция вернула HTTP $HTTP_CODE"
fi

echo ""
echo "================================"
echo "✨ Для настройки webhook:"
echo "   python3 setup-webhook.py"
echo ""
echo "✨ Для подробного теста:"
echo "   python3 test-function.py"
