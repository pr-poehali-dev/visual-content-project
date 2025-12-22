import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import funcUrls from '../../backend/func2url.json';

const Admin = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadedVideos, setUploadedVideos] = useState<Array<{url: string, name: string}>>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const uploadVideo = async (file: File) => {
    if (!file.type.startsWith('video/')) {
      toast({
        title: '❌ Ошибка',
        description: 'Можно загружать только видео файлы',
        variant: 'destructive'
      });
      return;
    }

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        
        const response = await fetch(funcUrls['upload-video'], {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: file.name,
            fileData: base64,
            contentType: file.type
          })
        });

        const result = await response.json();

        if (response.ok && result.success) {
          toast({
            title: '✅ Видео загружено!',
            description: 'URL скопирован в буфер обмена'
          });
          
          setUploadedVideos(prev => [...prev, { url: result.url, name: file.name }]);
          
          navigator.clipboard.writeText(result.url);
        } else {
          throw new Error(result.error || 'Ошибка загрузки');
        }
      };
      
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: '❌ Ошибка загрузки',
        description: error instanceof Error ? error.message : 'Попробуйте снова',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      uploadVideo(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      uploadVideo(e.target.files[0]);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: '✅ Скопировано',
      description: 'URL видео в буфере обмена'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <Button 
            variant="outline" 
            onClick={() => window.location.href = '/'}
            className="mb-4"
          >
            <Icon name="ArrowLeft" size={20} className="mr-2" />
            Назад на сайт
          </Button>
          <h1 className="text-4xl font-bold mb-2">🎬 Админка - Загрузка видео</h1>
          <p className="text-gray-600">Перетащите видео или выберите файл для загрузки</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Загрузить видео</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`border-2 border-dashed rounded-lg p-12 text-center transition-all ${
                dragActive 
                  ? 'border-primary bg-primary/10' 
                  : 'border-gray-300 hover:border-primary hover:bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="animate-spin">
                    <Icon name="Loader2" size={48} className="text-primary" />
                  </div>
                  <p className="text-lg font-medium">Загрузка видео...</p>
                </div>
              ) : (
                <>
                  <Icon name="Upload" size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-lg font-medium mb-2">
                    Перетащите видео сюда
                  </p>
                  <p className="text-sm text-gray-500 mb-4">или</p>
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={handleFileInput}
                    className="hidden"
                    id="video-upload"
                    disabled={uploading}
                  />
                  <Button
                    onClick={() => document.getElementById('video-upload')?.click()}
                    disabled={uploading}
                  >
                    Выбрать файл
                  </Button>
                  <p className="text-xs text-gray-400 mt-4">
                    Поддерживаются: MP4, WebM, MOV и другие видео форматы
                  </p>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {uploadedVideos.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Загруженные видео ({uploadedVideos.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {uploadedVideos.map((video, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium mb-1">{video.name}</p>
                      <p className="text-sm text-gray-600 truncate">{video.url}</p>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(video.url)}
                      >
                        <Icon name="Copy" size={16} className="mr-1" />
                        Копировать URL
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(video.url, '_blank')}
                      >
                        <Icon name="ExternalLink" size={16} className="mr-1" />
                        Открыть
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h3 className="font-bold mb-2 flex items-center">
              <Icon name="Info" size={20} className="mr-2 text-blue-600" />
              Как добавить видео в галерею?
            </h3>
            <ol className="text-sm text-gray-700 space-y-2 ml-6 list-decimal">
              <li>Загрузите видео через форму выше</li>
              <li>Скопируйте полученный URL</li>
              <li>Откройте файл <code className="bg-white px-2 py-1 rounded">src/pages/Index.tsx</code></li>
              <li>Найдите массив <code className="bg-white px-2 py-1 rounded">videoWorks</code></li>
              <li>Добавьте новый объект с вашим URL:
                <pre className="bg-white p-2 rounded mt-2 text-xs overflow-x-auto">
{`{ title: 'Название видео', media: 'ВАШ_URL', type: 'video' }`}
                </pre>
              </li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
