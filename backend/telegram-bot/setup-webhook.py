#!/usr/bin/env python3
"""
Скрипт для настройки webhook Telegram бота
Использование: python setup-webhook.py
"""

import os
import json
import urllib.request
import urllib.error

# Читаем конфигурацию
with open('../func2url.json', 'r') as f:
    func_urls = json.load(f)

WEBHOOK_URL = func_urls.get('telegram-bot')
TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN', '')

if not TELEGRAM_BOT_TOKEN:
    print("❌ Ошибка: TELEGRAM_BOT_TOKEN не установлен")
    print("Установите секрет TELEGRAM_BOT_TOKEN в проекте")
    exit(1)

if not WEBHOOK_URL:
    print("❌ Ошибка: URL функции telegram-bot не найден")
    exit(1)

print(f"🔧 Настройка webhook для бота...")
print(f"📍 URL: {WEBHOOK_URL}")

# Устанавливаем webhook
api_url = f'https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/setWebhook'
data = json.dumps({'url': WEBHOOK_URL}).encode('utf-8')

try:
    req = urllib.request.Request(
        api_url,
        data=data,
        headers={'Content-Type': 'application/json'}
    )
    
    with urllib.request.urlopen(req) as response:
        result = json.loads(response.read().decode('utf-8'))
        
        if result.get('ok'):
            print("✅ Webhook успешно установлен!")
            print(f"📝 Описание: {result.get('description', 'N/A')}")
        else:
            print(f"❌ Ошибка: {result.get('description', 'Unknown error')}")
            exit(1)

except urllib.error.HTTPError as e:
    print(f"❌ HTTP Ошибка {e.code}: {e.reason}")
    print(e.read().decode('utf-8'))
    exit(1)
except Exception as e:
    print(f"❌ Ошибка: {e}")
    exit(1)

# Проверяем информацию о webhook
print("\n🔍 Проверка webhook...")
info_url = f'https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/getWebhookInfo'

try:
    req = urllib.request.Request(info_url)
    with urllib.request.urlopen(req) as response:
        info = json.loads(response.read().decode('utf-8'))
        
        if info.get('ok'):
            webhook_info = info.get('result', {})
            print(f"✅ URL: {webhook_info.get('url', 'N/A')}")
            print(f"📊 Pending updates: {webhook_info.get('pending_update_count', 0)}")
            
            if webhook_info.get('last_error_message'):
                print(f"⚠️ Последняя ошибка: {webhook_info.get('last_error_message')}")
                print(f"🕐 Время: {webhook_info.get('last_error_date', 'N/A')}")
        else:
            print(f"❌ Не удалось получить информацию о webhook")

except Exception as e:
    print(f"⚠️ Не удалось проверить webhook: {e}")

# Получаем информацию о боте
print("\n🤖 Информация о боте...")
me_url = f'https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/getMe'

try:
    req = urllib.request.Request(me_url)
    with urllib.request.urlopen(req) as response:
        me = json.loads(response.read().decode('utf-8'))
        
        if me.get('ok'):
            bot_info = me.get('result', {})
            print(f"✅ Имя: {bot_info.get('first_name', 'N/A')}")
            print(f"📛 Username: @{bot_info.get('username', 'N/A')}")
            print(f"🆔 ID: {bot_info.get('id', 'N/A')}")

except Exception as e:
    print(f"⚠️ Не удалось получить информацию о боте: {e}")

print("\n✨ Готово! Теперь отправьте боту /start для проверки")
