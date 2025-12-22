import json
import boto3
import os
import base64
import psycopg2
from typing import Dict, Any
from datetime import datetime

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    '''
    Управляет видео: загрузка (POST) и получение списка (GET)
    Args: event - dict с httpMethod, body (для POST: fileName, fileData, contentType)
          context - объект с request_id и другими атрибутами
    Returns: HTTP response с результатом операции
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
    
    # GET - получить список видео
    if method == 'GET':
        try:
            conn = psycopg2.connect(os.environ['DATABASE_URL'])
            cursor = conn.cursor()
            
            cursor.execute("""
                SELECT id, title, url, type, category, created_at, is_visible
                FROM videos
                WHERE is_visible = true
                ORDER BY created_at DESC
            """)
            
            rows = cursor.fetchall()
            
            videos = []
            for row in rows:
                videos.append({
                    'id': row[0],
                    'title': row[1],
                    'media': row[2],
                    'type': row[3],
                    'category': row[4],
                    'created_at': row[5].isoformat() if row[5] else None,
                    'is_visible': row[6]
                })
            
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
                    'videos': videos,
                    'count': len(videos)
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
    
    # POST - загрузить видео
    if method != 'POST':
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        file_name = body_data.get('fileName', 'video.mp4')
        file_data = body_data.get('fileData')
        content_type = body_data.get('contentType', 'video/mp4')
        video_title = body_data.get('title', file_name.split('.')[0] if '.' in file_name else file_name)
        
        if not file_data:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'success': False, 'error': 'No file data provided'}),
                'isBase64Encoded': False
            }
        
        video_bytes = base64.b64decode(file_data)
        
        s3 = boto3.client('s3',
            endpoint_url='https://bucket.poehali.dev',
            aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
            aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
        )
        
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        safe_filename = file_name.replace(' ', '_')
        s3_key = f'videos/{timestamp}_{safe_filename}'
        
        s3.put_object(
            Bucket='files',
            Key=s3_key,
            Body=video_bytes,
            ContentType=content_type
        )
        
        cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{s3_key}"
        
        # Save to database
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO videos (title, url, type, category) VALUES (%s, %s, %s, %s) RETURNING id",
            (video_title, cdn_url, 'video', 'videos')
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
                'url': cdn_url,
                'fileName': safe_filename
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