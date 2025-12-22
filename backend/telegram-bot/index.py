'''
Business: Telegram bot для приёма заявок на стикеры и AI-фотосессии
Args: event с httpMethod, body для webhook от Telegram
Returns: HTTP response с результатом обработки
'''

import json
import os
from typing import Dict, Any, Optional
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN', '')
ADMIN_TELEGRAM_ID = os.environ.get('ADMIN_TELEGRAM_ID', '')
SMTP_EMAIL = os.environ.get('SMTP_EMAIL', '')
SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', '')

def send_message(chat_id: int, text: str, parse_mode: str = 'HTML', reply_markup: Optional[Dict] = None) -> None:
    '''Отправка сообщения в Telegram с кнопками'''
    import urllib.request
    url = f'https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage'
    payload = {
        'chat_id': chat_id,
        'text': text,
        'parse_mode': parse_mode
    }
    if reply_markup:
        payload['reply_markup'] = reply_markup
    
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    urllib.request.urlopen(req)

def send_photo(chat_id: int, photo_url: str, caption: str = '', reply_markup: Optional[Dict] = None) -> None:
    '''Отправка фото в Telegram с кнопками'''
    import urllib.request
    url = f'https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendPhoto'
    payload = {
        'chat_id': chat_id,
        'photo': photo_url,
        'caption': caption,
        'parse_mode': 'HTML'
    }
    if reply_markup:
        payload['reply_markup'] = reply_markup
    
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(url, data=data, headers={'Content-Type': 'application/json'})
    urllib.request.urlopen(req)

def notify_admin(user_info: Dict[str, Any], message_text: str) -> None:
    '''Отправка уведомления админу в Telegram и на email'''
    if not ADMIN_TELEGRAM_ID:
        return
    
    username = user_info.get('username', '')
    first_name = user_info.get('first_name', '')
    last_name = user_info.get('last_name', '')
    user_id = user_info.get('id', '')
    
    full_name = f"{first_name} {last_name}".strip()
    user_link = f"@{username}" if username else f"ID: {user_id}"
    
    telegram_notification = f'''🔔 <b>Новая заявка!</b>

👤 <b>От:</b> {full_name} ({user_link})
💬 <b>Сообщение:</b>
{message_text}'''
    
    try:
        send_message(int(ADMIN_TELEGRAM_ID), telegram_notification)
    except Exception as e:
        pass
    
    if SMTP_EMAIL and SMTP_PASSWORD:
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = f'Новая заявка от {full_name}'
            msg['From'] = SMTP_EMAIL
            msg['To'] = SMTP_EMAIL
            
            html_body = f'''<html>
<body>
<h2>🔔 Новая заявка!</h2>
<p><strong>От:</strong> {full_name} ({user_link})</p>
<p><strong>Сообщение:</strong></p>
<p>{message_text}</p>
</body>
</html>'''
            
            msg.attach(MIMEText(html_body, 'html'))
            
            with smtplib.SMTP_SSL('smtp.mail.ru', 465) as server:
                server.login(SMTP_EMAIL, SMTP_PASSWORD)
                server.send_message(msg)
        except Exception as e:
            pass

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
        
        if 'callback_query' in update:
            callback = update['callback_query']
            chat_id = callback['message']['chat']['id']
            callback_data = callback['data']
            first_name = callback['from'].get('first_name', 'Друг')
            
            import urllib.request
            answer_url = f'https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/answerCallbackQuery'
            answer_data = json.dumps({'callback_query_id': callback['id']}).encode('utf-8')
            req = urllib.request.Request(answer_url, data=answer_data, headers={'Content-Type': 'application/json'})
            urllib.request.urlopen(req)
            
            text = callback_data
        
        elif 'message' in update:
            message = update['message']
            chat_id = message['chat']['id']
            text = message.get('text', '')
            first_name = message['from'].get('first_name', 'Друг')
        
        else:
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json'},
                'body': json.dumps({'ok': True})
            }
        
        if text == '/start' or text == 'start':
            vizi_image = 'https://cdn.poehali.dev/files/ce7f214b-3425-4422-9d1d-7945d8bc7da3.jpeg'
            
            welcome_msg = f'''👋 Привет, {first_name}!

Я бот студии <b>Vizi</b> — помогу тебе создать:

🎨 <b>Брендовые стикеры</b> для Telegram/WhatsApp
📸 <b>AI-фотосессии</b> любой сложности'''
            
            keyboard = {
                'inline_keyboard': [
                    [
                        {'text': '🚀  Начать общение', 'callback_data': 'start_chat'}
                    ],
                    [
                        {'text': '🎨  Брендовые стикеры', 'callback_data': 'stickers'}
                    ],
                    [
                        {'text': '📸  AI-фотосессии', 'callback_data': 'photoshoot'}
                    ],
                    [
                        {'text': '💰  Прайс-лист', 'callback_data': 'price'}
                    ],
                    [
                        {'text': '✨  Примеры работ', 'callback_data': 'portfolio'}
                    ],
                    [
                        {'text': '📞  Связаться с нами', 'callback_data': 'contact'}
                    ]
                ]
            }
            
            send_photo(chat_id, vizi_image, caption=welcome_msg, reply_markup=keyboard)
        
        elif text == '/stickers' or text == 'stickers':
            stickers_msg = '''🎨 <b>Брендовые стикеры</b>

Создам уникальные стикеры:
• Для Telegram/WhatsApp
• Корпоративные стикер-паки
• Персональные стикеры
• Стикеры для мероприятий

<b>Цены:</b>
• От 250₽ за стикер
• Минимальный заказ — 10 шт

Чтобы заказать, напиши мне подробности или нажми кнопку!'''
            
            keyboard = {
                'inline_keyboard': [
                    [{'text': '✍️ Оставить заявку', 'callback_data': 'order_stickers'}],
                    [{'text': '💰 Узнать цены', 'callback_data': 'price'}],
                    [{'text': '🔙 Главное меню', 'callback_data': 'start'}]
                ]
            }
            
            send_message(chat_id, stickers_msg, reply_markup=keyboard)
        
        elif text == '/photoshoot' or text == 'photoshoot':
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

Расскажи о своих идеях или нажми кнопку!'''
            
            keyboard = {
                'inline_keyboard': [
                    [{'text': '✍️ Оставить заявку', 'callback_data': 'order_photoshoot'}],
                    [{'text': '💰 Узнать цены', 'callback_data': 'price'}],
                    [{'text': '🔙 Главное меню', 'callback_data': 'start'}]
                ]
            }
            
            send_message(chat_id, photo_msg, reply_markup=keyboard)
        
        elif text == '/price' or text == 'price':
            price_msg = '''💰 <b>Прайс-лист</b>

<b>Брендовые стикеры:</b>
• От 250₽ за стикер
• Минимальный заказ — 10 шт

<b>AI-фотосессии:</b>
• 10 фото — от 5.000₽
• 30 фото — от 12.000₽
• 100 фото — от 30.000₽

<b>Дополнительно:</b>
• Анимированные стикеры — +50%
• Срочность (1-2 дня) — +30%

Точную стоимость рассчитаю после обсуждения задачи!'''
            
            keyboard = {
                'inline_keyboard': [
                    [
                        {'text': '🎨 Стикеры', 'callback_data': 'stickers'},
                        {'text': '📸 Фотосессия', 'callback_data': 'photoshoot'}
                    ],
                    [{'text': '🔙 Главное меню', 'callback_data': 'start'}]
                ]
            }
            
            send_message(chat_id, price_msg, reply_markup=keyboard)
        
        elif text == '/portfolio' or text == 'portfolio':
            portfolio_msg = '''✨ <b>Примеры работ</b>

Смотри мои работы на сайте:
🌐 vizi-stickers.ru

Там найдёшь:
• Реальные кейсы клиентов
• Примеры стикеров
• AI-фотографии
• Отзывы'''
            
            keyboard = {
                'inline_keyboard': [
                    [{'text': '🌐 Открыть сайт', 'url': 'https://vizi-stickers.ru'}],
                    [
                        {'text': '🎨 Стикеры', 'callback_data': 'stickers'},
                        {'text': '📸 Фотосессия', 'callback_data': 'photoshoot'}
                    ],
                    [{'text': '🔙 Главное меню', 'callback_data': 'start'}]
                ]
            }
            
            send_message(chat_id, portfolio_msg, reply_markup=keyboard)
        
        elif text == '/contact' or text == 'contact':
            contact_msg = '''📞 <b>Контакты</b>

<b>Связаться со мной:</b>
• Telegram: Пиши прямо сюда!
• Email: vizi-stickers@mail.ru
• Сайт: vizi-stickers.ru

Обычно отвечаю в течение 1-2 часов ⚡️

Жду твоих идей! 🚀'''
            
            keyboard = {
                'inline_keyboard': [
                    [
                        {'text': '🎨 Заказать стикеры', 'callback_data': 'order_stickers'},
                        {'text': '📸 Заказать фото', 'callback_data': 'order_photoshoot'}
                    ],
                    [{'text': '🔙 Главное меню', 'callback_data': 'start'}]
                ]
            }
            
            send_message(chat_id, contact_msg, reply_markup=keyboard)
        
        elif text == 'start_chat':
            chat_msg = f'''💬 <b>Отлично, {first_name}!</b>

Я готов помочь тебе создать визуальный контент! 🎨

Напиши мне:
• Что именно тебе нужно (стикеры, фото, или всё вместе)
• Для какого проекта/бренда
• Какой стиль тебе нравится
• Примерный бюджет и сроки

Просто напиши всё это текстом, и я свяжусь с тобой для обсуждения деталей! 👇'''
            
            keyboard = {
                'inline_keyboard': [
                    [{'text': '🔙 Главное меню', 'callback_data': 'start'}]
                ]
            }
            
            send_message(chat_id, chat_msg, reply_markup=keyboard)
        
        elif text == 'order_stickers':
            order_msg = '''✍️ <b>Заявка на стикеры</b>

Опиши свою задачу, и я свяжусь с тобой для обсуждения!

Расскажи:
📝 Для чего нужны стикеры
🎯 Желаемый стиль
📊 Количество стикеров
⏰ Сроки

Просто напиши сообщение, и я всё запишу! 👇'''
            
            keyboard = {
                'inline_keyboard': [
                    [{'text': '🔙 Назад к стикерам', 'callback_data': 'stickers'}]
                ]
            }
            
            send_message(chat_id, order_msg, reply_markup=keyboard)
        
        elif text == 'order_photoshoot':
            order_msg = '''✍️ <b>Заявка на AI-фотосессию</b>

Расскажи о своей идее, и я свяжусь с тобой!

Напиши:
📝 Что нужно снять
🎨 Стиль и настроение
📷 Количество фото
⏰ Сроки

Жду твоего сообщения! 👇'''
            
            keyboard = {
                'inline_keyboard': [
                    [{'text': '🔙 Назад к фотосессиям', 'callback_data': 'photoshoot'}]
                ]
            }
            
            send_message(chat_id, order_msg, reply_markup=keyboard)
        
        else:
            if 'message' in update:
                user_info = update['message']['from']
                notify_admin(user_info, text)
            
            response_msg = f'''Спасибо за сообщение! 

Я записал твой запрос:
"{text}"

Скоро с тобой свяжется Vizi для обсуждения деталей 🚀'''
            
            keyboard = {
                'inline_keyboard': [
                    [
                        {'text': '🎨 Стикеры', 'callback_data': 'stickers'},
                        {'text': '📸 Фотосессия', 'callback_data': 'photoshoot'}
                    ],
                    [{'text': '🔙 Главное меню', 'callback_data': 'start'}]
                ]
            }
            
            send_message(chat_id, response_msg, reply_markup=keyboard)
        
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