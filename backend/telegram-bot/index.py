'''
Business: Telegram bot для приёма заявок на стикеры и AI-фотосессии
Args: event с httpMethod, body для webhook от Telegram
Returns: HTTP response с результатом обработки
'''

import json
import os
from typing import Dict, Any, Optional

TELEGRAM_BOT_TOKEN = os.environ.get('TELEGRAM_BOT_TOKEN', '')

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
            vizi_image = 'https://cdn.poehali.dev/projects/a4b74196-9d6f-4de8-becb-0795012f6edd/files/9f7fae1a-8ac9-4167-a01b-f7b991f1e530.jpg'
            
            welcome_msg = f'''👋 Привет, {first_name}!

Я бот студии <b>Vizi</b> — помогу тебе создать:

🎨 <b>Брендовые стикеры</b> для Telegram/WhatsApp
📸 <b>AI-фотосессии</b> любой сложности'''
            
            keyboard = {
                'inline_keyboard': [
                    [
                        {'text': '🎨 Стикеры', 'callback_data': 'stickers'}
                    ],
                    [
                        {'text': '📸 Фотосессия', 'callback_data': 'photoshoot'}
                    ],
                    [
                        {'text': '💰 Цены', 'callback_data': 'price'}
                    ],
                    [
                        {'text': '✨ Портфолио', 'callback_data': 'portfolio'}
                    ],
                    [
                        {'text': '📞 Контакты', 'callback_data': 'contact'}
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
• Стикер-пак (12 шт) — от 15.000₽
• Отдельный стикер — от 1.500₽

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
🌐 vizi-stickers.com

Там найдёшь:
• Реальные кейсы клиентов
• Примеры стикеров
• AI-фотографии
• Отзывы'''
            
            keyboard = {
                'inline_keyboard': [
                    [{'text': '🌐 Открыть сайт', 'url': 'https://vizi-stickers.com'}],
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
• Email: vizi@example.com
• Сайт: vizi-stickers.com

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