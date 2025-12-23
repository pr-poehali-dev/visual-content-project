import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import funcUrls from '../../backend/func2url.json';

interface WebhookInfo {
  url: string;
  has_custom_certificate: boolean;
  pending_update_count: number;
  last_error_date?: number;
  last_error_message?: string;
  max_connections?: number;
}

const BotSetup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [botToken, setBotToken] = useState('');
  const [webhookInfo, setWebhookInfo] = useState<WebhookInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);

  const webhookUrl = funcUrls['telegram-bot'];

  const checkWebhook = async () => {
    if (!botToken.trim()) {
      toast({
        title: '⚠️ Введите токен',
        description: 'Необходимо ввести токен бота',
        variant: 'destructive'
      });
      return;
    }

    setChecking(true);
    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`);
      const data = await response.json();

      if (data.ok) {
        setWebhookInfo(data.result);
        toast({
          title: '✅ Webhook проверен',
          description: data.result.url ? 'Webhook установлен' : 'Webhook не установлен'
        });
      } else {
        throw new Error(data.description || 'Ошибка проверки');
      }
    } catch (error) {
      toast({
        title: '❌ Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось проверить webhook',
        variant: 'destructive'
      });
      setWebhookInfo(null);
    } finally {
      setChecking(false);
    }
  };

  const setWebhook = async () => {
    if (!botToken.trim()) {
      toast({
        title: '⚠️ Введите токен',
        description: 'Необходимо ввести токен бота',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://api.telegram.org/bot${botToken}/setWebhook?url=${encodeURIComponent(webhookUrl)}`
      );
      const data = await response.json();

      if (data.ok) {
        toast({
          title: '✅ Webhook установлен!',
          description: 'Бот готов к работе'
        });
        await checkWebhook();
      } else {
        throw new Error(data.description || 'Ошибка установки');
      }
    } catch (error) {
      toast({
        title: '❌ Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось установить webhook',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteWebhook = async () => {
    if (!botToken.trim()) {
      toast({
        title: '⚠️ Введите токен',
        description: 'Необходимо ввести токен бота',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://api.telegram.org/bot${botToken}/deleteWebhook`);
      const data = await response.json();

      if (data.ok) {
        toast({
          title: '✅ Webhook удалён',
          description: 'Бот переведён в режим polling'
        });
        setWebhookInfo(null);
      } else {
        throw new Error(data.description || 'Ошибка удаления');
      }
    } catch (error) {
      toast({
        title: '❌ Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось удалить webhook',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            На главную
          </Button>
          <h1 className="text-4xl font-bold mb-2">🤖 Настройка Telegram Бота</h1>
          <p className="text-gray-600">Установка и проверка webhook</p>
        </div>

        <Alert className="mb-6 bg-blue-50 border-blue-200">
          <Icon name="Info" size={20} className="text-blue-600" />
          <AlertDescription className="ml-2">
            <strong>Токен бота</strong> можно получить у{' '}
            <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer" className="underline">
              @BotFather
            </a>
            . Токен находится в секретах проекта (TELEGRAM_BOT_TOKEN).
          </AlertDescription>
        </Alert>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>1. Введите токен бота</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="password"
                placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                className="font-mono"
              />
              <div className="flex gap-2">
                <Button onClick={checkWebhook} disabled={checking || !botToken.trim()} variant="outline">
                  <Icon name="Search" size={16} className="mr-2" />
                  {checking ? 'Проверка...' : 'Проверить webhook'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {webhookInfo !== null && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Статус webhook</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">URL:</span>
                  {webhookInfo.url ? (
                    <Badge variant="default" className="font-mono text-xs max-w-md truncate">
                      {webhookInfo.url}
                    </Badge>
                  ) : (
                    <Badge variant="secondary">Не установлен</Badge>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Статус:</span>
                  {webhookInfo.url === webhookUrl ? (
                    <Badge variant="default" className="bg-green-500">✅ Правильный URL</Badge>
                  ) : webhookInfo.url ? (
                    <Badge variant="destructive">⚠️ Неправильный URL</Badge>
                  ) : (
                    <Badge variant="secondary">❌ Не установлен</Badge>
                  )}
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium">Ожидающих обновлений:</span>
                  <Badge variant="outline">{webhookInfo.pending_update_count}</Badge>
                </div>

                {webhookInfo.last_error_message && (
                  <Alert variant="destructive">
                    <Icon name="AlertTriangle" size={20} />
                    <AlertDescription className="ml-2">
                      <strong>Последняя ошибка:</strong>
                      <br />
                      {webhookInfo.last_error_message}
                      <br />
                      <span className="text-xs">
                        {webhookInfo.last_error_date &&
                          new Date(webhookInfo.last_error_date * 1000).toLocaleString('ru-RU')}
                      </span>
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>2. Управление webhook</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium mb-2">URL для webhook:</p>
                <code className="text-xs bg-white p-2 rounded border block break-all">{webhookUrl}</code>
              </div>

              <div className="flex gap-2">
                <Button onClick={setWebhook} disabled={loading || !botToken.trim()}>
                  <Icon name="CheckCircle" size={16} className="mr-2" />
                  {loading ? 'Установка...' : 'Установить webhook'}
                </Button>

                {webhookInfo?.url && (
                  <Button onClick={deleteWebhook} disabled={loading || !botToken.trim()} variant="destructive">
                    <Icon name="Trash2" size={16} className="mr-2" />
                    Удалить webhook
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Alert className="mt-6 bg-yellow-50 border-yellow-200">
          <Icon name="Lightbulb" size={20} className="text-yellow-600" />
          <AlertDescription className="ml-2">
            <strong>После установки webhook:</strong>
            <br />
            Откройте бота в Telegram и отправьте команду /start для проверки работы.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default BotSetup;