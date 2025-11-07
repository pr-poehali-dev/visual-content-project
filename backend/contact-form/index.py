'''
Business: Обработка заявок с формы на сайте и отправка на email
Args: event с httpMethod, body (name, contact, service, message)
Returns: HTTP response с результатом отправки
'''

import json
import os
from typing import Dict, Any
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

SMTP_EMAIL = os.environ.get('SMTP_EMAIL', '')
SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', '')

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
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    try:
        body_str = event.get('body', '{}')
        data = json.loads(body_str)
        
        name = data.get('name', '')
        contact = data.get('contact', '')
        service = data.get('service', '')
        message = data.get('message', '')
        
        if not name or not contact or not service:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Заполните все обязательные поля'})
            }
        
        service_names = {
            'stickers': '🎨 Стикеры',
            'neuro': '📸 Нейрофотосессии',
            'full': '💼 Полный пакет'
        }
        service_name = service_names.get(service, service)
        
        if not SMTP_EMAIL or not SMTP_PASSWORD:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': 'Email не настроен'})
            }
        
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f'Новая заявка от {name}'
        msg['From'] = SMTP_EMAIL
        msg['To'] = SMTP_EMAIL
        
        html_body = f'''<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
<div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
<h2 style="color: #9333ea; border-bottom: 2px solid #9333ea; padding-bottom: 10px;">🔔 Новая заявка с сайта!</h2>

<div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
<p style="margin: 10px 0;"><strong>👤 Имя:</strong> {name}</p>
<p style="margin: 10px 0;"><strong>📧 Контакт:</strong> {contact}</p>
<p style="margin: 10px 0;"><strong>🎯 Услуга:</strong> {service_name}</p>
</div>

<div style="margin: 20px 0;">
<p style="margin: 10px 0;"><strong>💬 Сообщение:</strong></p>
<p style="background: #fff; padding: 15px; border-left: 4px solid #9333ea; border-radius: 5px;">
{message if message else '<i>Не указано</i>'}
</p>
</div>

<hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
<p style="color: #666; font-size: 12px; text-align: center;">
Заявка отправлена с сайта vizi-stickers.ru
</p>
</div>
</body>
</html>'''
        
        msg.attach(MIMEText(html_body, 'html'))
        
        with smtplib.SMTP_SSL('smtp.mail.ru', 465) as server:
            server.login(SMTP_EMAIL, SMTP_PASSWORD)
            server.send_message(msg)
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'success': True,
                'message': 'Заявка успешно отправлена!'
            })
        }
    
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'Ошибка при отправке заявки',
                'details': str(e)
            })
        }
