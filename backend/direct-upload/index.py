import json
import boto3
import os
import psycopg2
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Управляет прямой загрузкой видео в S3:
    GET - генерирует presigned URL для загрузки
    POST - сохраняет метаданные в БД после загрузки
    Args: event - dict с httpMethod, queryStringParameters или body
          context - объект с request_id
    Returns: HTTP response с presigned URL или подтверждением сохранения
    '''
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    # GET - генерировать presigned URL
    if method == 'GET':
        try:
            query_params = event.get('queryStringParameters', {}) or {}
            file_name = query_params.get('fileName', 'video.mp4')
            content_type = query_params.get('contentType', 'video/mp4')
            
            # Генерируем уникальное имя файла
            timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
            safe_filename = file_name.replace(' ', '_')
            s3_key = f'videos/{timestamp}_{safe_filename}'
            
            # Создаем S3 клиент
            s3 = boto3.client('s3',
                endpoint_url='https://bucket.poehali.dev',
                aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
                aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
            )
            
            # Генерируем presigned URL для PUT (загрузки)
            presigned_url = s3.generate_presigned_url(
                'put_object',
                Params={
                    'Bucket': 'files',
                    'Key': s3_key,
                    'ContentType': content_type
                },
                ExpiresIn=3600  # 1 час
            )
            
            # CDN URL для доступа к файлу после загрузки
            cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{s3_key}"
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'uploadUrl': presigned_url,
                    'cdnUrl': cdn_url,
                    's3Key': s3_key
                }),
                'isBase64Encoded': False
            }
            
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': False,
                    'error': str(e)
                }),
                'isBase64Encoded': False
            }
    
    # POST - сохранить метаданные
    if method == 'POST':
        try:
            body_data = json.loads(event.get('body', '{}'))
            title = body_data.get('title')
            cdn_url = body_data.get('cdnUrl')
            s3_key = body_data.get('s3Key')
            
            if not title or not cdn_url or not s3_key:
                return {
                    'statusCode': 400,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'success': False,
                        'error': 'title, cdnUrl, and s3Key are required'
                    }),
                    'isBase64Encoded': False
                }
            
            # Сохраняем в БД
            conn = psycopg2.connect(os.environ['DATABASE_URL'])
            cursor = conn.cursor()
            cursor.execute(
                "INSERT INTO videos (title, url, type, category) VALUES (%s, %s, %s, %s) RETURNING id",
                (title, cdn_url, 'video', 'videos')
            )
            video_id = cursor.fetchone()[0]
            conn.commit()
            cursor.close()
            conn.close()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': True,
                    'videoId': video_id,
                    'cdnUrl': cdn_url
                }),
                'isBase64Encoded': False
            }
            
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'success': False,
                    'error': str(e)
                }),
                'isBase64Encoded': False
            }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
