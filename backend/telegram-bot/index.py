'''
Business: Telegram bot для приёма заявок на стикеры и AI-фотосессии
Args: event с httpMethod, body для webhook от Telegram
Returns: HTTP response с результатом обработки
'''

import json
import os
from typing import Dict, Any, Optional

TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN', '')

def send_message(chat_id: int, text: str, parse_mode: str = 'HTML') -> None:
    '''Отправка сообщения в Telegram'''
    import urllib.request
    url = f'https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage'
    data = json.dumps({
        'chat_id': chat_id,
        'text': text,
        'parse_mode': parse_mode
    }).encode('utf-8')
    
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    urllib.request.urlopen(req)

def send_photo(chat_id: int, photo_url: str, caption: str = '') -> None:
    '''Отправка фото в Telegram'''
    import urllib.request
    url = f'https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendPhoto'
    data = json.dumps({
        'chat_id': chat_id,
        'photo': photo_url,
        'caption': caption,
        'parse_mode': 'HTML'
    }).encode('utf-8')
    
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    urllib.request.urlopen(req)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    if method != 'POST':
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True})
        }
    
    try:
        body_str = event.get('body', '{}')
        update = json.loads(body_str)
        
        if 'message' not in update:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'ok': True})
            }
        
        message = update['message']
        chat_id = message['chat']['id']
        text = message.get('text', '')
        first_name = message['from'].get('first_name', 'Друг')
        
        if text == '/start':
            welcome_msg = f'''👋 Привет, {first_name}!

Я бот студии <b>Vizi</b> — помогу тебе:

🎨 <b>Брендовые стикеры</b>
Уникальные стикеры для твоего бренда или личного использования

📸 <b>AI-фотосессии</b>
Профессиональные фото, созданные с помощью ИИ

💰 <b>Рассчитать стоимость</b>

Выбери команду:
/stickers — Заказать стикеры
/photoshoot — AI-фотосессия
/price — Узнать цены
/portfolio — Примеры работ
/contact — Связаться с нами'''
            
            send_message(chat_id, welcome_msg)
        
        elif text == '/stickers':
            stickers_msg = '''🎨 <b>Брендовые стикеры</b>

Создам уникальные стикеры:
• Для Telegram/WhatsApp
• Корпоративные стикер-паки
• Персональные стикеры
• Стикеры для мероприятий

<b>Цены:</b>
• Стикер-пак (12 шт) — от 15.000₽
• Отдельный стикер — от 1.500₽

Чтобы заказать, напиши:
📝 Что нужно (стикеры для бренда/личные)
🎯 Стиль (минимализм/мультяшный/реализм)
📊 Количество стикеров'''
            
            send_message(chat_id, stickers_msg)
        
        elif text == '/photoshoot':
            photo_msg = '''📸 <b>AI-фотосессия</b>

Создам профессиональные фото:
• Портреты для соцсетей
• Бизнес-фото
• Креативные сюжеты
• Продуктовые съёмки

<b>Цены:</b>
• 10 фото — от 5.000₽
• 30 фото — от 12.000₽
• 100 фото — от 30.000₽

Напиши:
📝 Что нужно снять
🎨 Стиль и настроение
📷 Количество фото'''
            
            send_message(chat_id, photo_msg)
        
        elif text == '/price':
            price_msg = '''💰 <b>Прайс-лист</b>

<b>Брендовые стикеры:</b>
• Стикер-пак (12 шт) — от 15.000₽
• Отдельный стикер — от 1.500₽

<b>AI-фотосессии:</b>
• 10 фото — от 5.000₽
• 30 фото — от 12.000₽
• 100 фото — от 30.000₽

<b>Дополнительно:</b>
• Анимированные стикеры — +50%
• Срочность (1-2 дня) — +30%

Точную стоимость рассчитаю после обсуждения задачи!'''
            
            send_message(chat_id, price_msg)
        
        elif text == '/portfolio':
            portfolio_msg = '''✨ <b>Примеры работ</b>

Смотри мои работы на сайте:
🌐 https://vizi-stickers.com

Там найдёшь:
• Реальные кейсы клиентов
• Примеры стикеров
• AI-фотографии
• Отзывы'''
            
            send_message(chat_id, portfolio_msg)
        
        elif text == '/contact':
            contact_msg = '''📞 <b>Контакты</b>

<b>Связаться со мной:</b>
• Telegram: Пиши прямо сюда!
• Email: vizi@example.com
• Сайт: vizi-stickers.com

Обычно отвечаю в течение 1-2 часов ⚡️

Жду твоих идей! 🚀'''
            
            send_message(chat_id, contact_msg)
        
        else:
            response_msg = f'''Спасибо за сообщение! 

Я записал твой запрос:
"{text}"

Скоро с тобой свяжется Vizi для обсуждения деталей 🚀

А пока посмотри команды:
/stickers — Заказать стикеры
/photoshoot — AI-фотосессия
/price — Узнать цены'''
            
            send_message(chat_id, response_msg)
        
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True})
        }
    
    except Exception as e:
        return {
            'statusCode': 200,
            'headers': {'Content-Type': 'application/json'},
            'body': json.dumps({'ok': True, 'error': str(e)})
        }
