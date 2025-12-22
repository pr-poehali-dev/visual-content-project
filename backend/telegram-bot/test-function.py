#!/usr/bin/env python3
"""
Скрипт для тестирования работы Cloud Function telegram-bot
"""

import json
import urllib.request
import urllib.error

FUNCTION_URL = "https://functions.poehali.dev/6a33fdc5-867a-4789-92e3-561eb84d9f05"

print("🧪 Тестирование функции telegram-bot...")
print(f"📍 URL: {FUNCTION_URL}\n")

# Тест 1: OPTIONS (CORS)
print("1️⃣ Тест OPTIONS (CORS)...")
try:
    req = urllib.request.Request(FUNCTION_URL, method='OPTIONS')
    with urllib.request.urlopen(req) as response:
        print(f"   ✅ Статус: {response.status}")
        print(f"   📋 Headers: {dict(response.headers)}")
except urllib.error.HTTPError as e:
    print(f"   ❌ HTTP Error {e.code}: {e.reason}")
    if e.code == 402:
        print("   💡 Ошибка 402 означает проблему с биллингом или лимитами")
except Exception as e:
    print(f"   ❌ Ошибка: {e}")

print()

# Тест 2: GET запрос
print("2️⃣ Тест GET...")
try:
    req = urllib.request.Request(FUNCTION_URL, method='GET')
    with urllib.request.urlopen(req) as response:
        body = response.read().decode('utf-8')
        print(f"   ✅ Статус: {response.status}")
        print(f"   📄 Body: {body}")
except urllib.error.HTTPError as e:
    print(f"   ❌ HTTP Error {e.code}: {e.reason}")
    if e.code == 402:
        print("   💡 Ошибка 402 означает проблему с биллингом или лимитами")
    try:
        error_body = e.read().decode('utf-8')
        print(f"   📄 Error body: {error_body}")
    except:
        pass
except Exception as e:
    print(f"   ❌ Ошибка: {e}")

print()

# Тест 3: POST с пустым телом
print("3️⃣ Тест POST (пустое тело)...")
try:
    data = json.dumps({}).encode('utf-8')
    req = urllib.request.Request(
        FUNCTION_URL,
        data=data,
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    with urllib.request.urlopen(req) as response:
        body = json.loads(response.read().decode('utf-8'))
        print(f"   ✅ Статус: {response.status}")
        print(f"   📄 Body: {json.dumps(body, ensure_ascii=False, indent=2)}")
except urllib.error.HTTPError as e:
    print(f"   ❌ HTTP Error {e.code}: {e.reason}")
    if e.code == 402:
        print("   💡 Ошибка 402 означает проблему с биллингом или лимитами")
except Exception as e:
    print(f"   ❌ Ошибка: {e}")

print()

# Тест 4: POST с Telegram update
print("4️⃣ Тест POST (Telegram /start)...")
test_update = {
    "message": {
        "message_id": 1,
        "from": {
            "id": 123456789,
            "first_name": "Test User",
            "username": "testuser"
        },
        "chat": {
            "id": 123456789,
            "type": "private"
        },
        "text": "/start"
    }
}

try:
    data = json.dumps(test_update).encode('utf-8')
    req = urllib.request.Request(
        FUNCTION_URL,
        data=data,
        headers={'Content-Type': 'application/json'},
        method='POST'
    )
    with urllib.request.urlopen(req) as response:
        body = json.loads(response.read().decode('utf-8'))
        print(f"   ✅ Статус: {response.status}")
        print(f"   📄 Body: {json.dumps(body, ensure_ascii=False, indent=2)}")
except urllib.error.HTTPError as e:
    print(f"   ❌ HTTP Error {e.code}: {e.reason}")
    if e.code == 402:
        print("   💡 Ошибка 402: Проверьте биллинг в Yandex Cloud")
        print("   💡 Возможно превышен бесплатный лимит запросов")
except Exception as e:
    print(f"   ❌ Ошибка: {e}")

print("\n" + "="*60)
print("📊 РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ")
print("="*60)
print("\nЕсли все тесты прошли успешно (✅), функция работает корректно.")
print("Если есть ошибки 402, проверьте:")
print("  1. Настройки биллинга в Yandex Cloud Console")
print("  2. Лимиты бесплатного тарифа")
print("  3. Состояние аккаунта")
print("\nДля настройки webhook запустите: python3 setup-webhook.py")
