import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { Badge } from '@/components/ui/badge';
import funcUrls from '../../backend/func2url.json';

interface Video {
  id: number;
  title: string;
  media: string;
  type: string;
  is_visible: boolean;
  created_at: string;
}

const Admin = () => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [uploadedVideos, setUploadedVideos] = useState<Array<{url: string, name: string}>>([]);
  const [allVideos, setAllVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const compressVideo = async (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      video.preload = 'metadata';
      video.src = URL.createObjectURL(file);
      
      video.onloadedmetadata = () => {
        const maxWidth = 1280;
        const maxHeight = 720;
        let width = video.videoWidth;
        let height = video.videoHeight;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        const mediaRecorder = new MediaRecorder(canvas.captureStream(30), {
          mimeType: 'video/webm;codecs=vp8',
          videoBitsPerSecond: 1000000
        });
        
        const chunks: Blob[] = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => resolve(new Blob(chunks, { type: 'video/webm' }));
        mediaRecorder.onerror = reject;
        
        mediaRecorder.start();
        video.play();
        
        const drawFrame = () => {
          if (video.ended || video.paused) {
            mediaRecorder.stop();
            URL.revokeObjectURL(video.src);
            return;
          }
          ctx?.drawImage(video, 0, 0, width, height);
          requestAnimationFrame(drawFrame);
        };
        
        drawFrame();
      };
      
      video.onerror = reject;
    });
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
      let processedFile: File | Blob = file;
      const maxSize = 10 * 1024 * 1024;
      
      if (file.size > maxSize) {
        toast({
          title: '🔄 Сжатие видео...',
          description: 'Файл больше 10MB, сжимаем автоматически'
        });
        
        try {
          processedFile = await compressVideo(file);
          const newName = file.name.replace(/\.[^.]+$/, '.webm');
          processedFile = new File([processedFile], newName, { type: 'video/webm' });
          
          toast({
            title: '✅ Видео сжато',
            description: `Размер уменьшен с ${(file.size / 1024 / 1024).toFixed(1)}MB до ${(processedFile.size / 1024 / 1024).toFixed(1)}MB`
          });
        } catch (compressionError) {
          toast({
            title: '⚠️ Сжатие не удалось',
            description: 'Загружаем оригинальный файл. Максимум 10MB.',
            variant: 'destructive'
          });
          
          if (file.size > maxSize) {
            throw new Error('Файл слишком большой (больше 10MB). Сожмите видео вручную.');
          }
        }
      }
      
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        
        const response = await fetch(funcUrls['upload-video'], {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fileName: processedFile instanceof File ? processedFile.name : file.name,
            fileData: base64,
            contentType: processedFile.type,
            title: videoTitle || file.name.split('.').slice(0, -1).join('.')
          })
        });

        if (response.status === 413) {
          throw new Error('Видео слишком большое! Максимум 10MB. Попробуйте сжать сильнее.');
        }
        
        const result = await response.json();

        if (response.ok && result.success) {
          toast({
            title: '✅ Видео загружено!',
            description: 'Видео добавлено в галерею автоматически'
          });
          
          setUploadedVideos(prev => [...prev, { url: result.url, name: file.name }]);
          setVideoTitle('');
          loadAllVideos();
          
          navigator.clipboard.writeText(result.url);
        } else {
          throw new Error(result.error || 'Ошибка загрузки');
        }
      };
      
      reader.readAsDataURL(processedFile);
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

  const loadAllVideos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${funcUrls['upload-video']}?all=true`, {
        method: 'GET'
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.videos) {
          setAllVideos(result.videos);
        }
      }
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (videoId: number, currentVisibility: boolean) => {
    try {
      const response = await fetch(funcUrls['upload-video'], {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId,
          isVisible: !currentVisibility
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({
          title: currentVisibility ? '👁️ Видео скрыто' : '✅ Видео показано',
          description: currentVisibility ? 'Видео убрано из галереи' : 'Видео добавлено в галерею'
        });
        loadAllVideos();
      } else {
        throw new Error(result.error || 'Ошибка изменения видимости');
      }
    } catch (error) {
      toast({
        title: '❌ Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось изменить видимость',
        variant: 'destructive'
      });
    }
  };

  const deleteVideo = async (videoId: number, title: string) => {
    if (!confirm(`Удалить видео "${title}"? Это действие необратимо.`)) {
      return;
    }

    try {
      const response = await fetch(`${funcUrls['upload-video']}?videoId=${videoId}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({
          title: '🗑️ Видео удалено',
          description: 'Файл удалён из базы и хранилища'
        });
        loadAllVideos();
      } else {
        throw new Error(result.error || 'Ошибка удаления');
      }
    } catch (error) {
      toast({
        title: '❌ Ошибка',
        description: error instanceof Error ? error.message : 'Не удалось удалить видео',
        variant: 'destructive'
      });
    }
  };

  useEffect(() => {
    loadAllVideos();
  }, []);

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
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Название видео (опционально)
              </label>
              <Input
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Введите название видео"
                className="max-w-md"
              />
              <p className="text-xs text-gray-500 mt-1">
                Если не указано, будет использовано имя файла
              </p>
            </div>
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
                    Поддерживаются: MP4, WebM, MOV<br/>
                    📦 Максимальный размер: 10 MB<br/>
                    🔄 Автоматическое сжатие для больших файлов
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

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Все видео в базе ({allVideos.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Icon name="Loader2" size={32} className="animate-spin text-primary" />
              </div>
            ) : allVideos.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Видео еще не загружены</p>
            ) : (
              <div className="space-y-3">
                {allVideos.map((video) => (
                  <div 
                    key={video.id}
                    className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                      video.is_visible 
                        ? 'bg-green-50 border-green-200' 
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-lg">{video.title}</p>
                        <Badge variant={video.is_visible ? 'default' : 'secondary'} className="text-xs">
                          {video.is_visible ? '✅ Показано' : '👁️ Скрыто'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{video.media}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Загружено: {new Date(video.created_at).toLocaleString('ru-RU')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant={video.is_visible ? 'outline' : 'default'}
                        onClick={() => toggleVisibility(video.id, video.is_visible)}
                        className="whitespace-nowrap"
                      >
                        <Icon name={video.is_visible ? 'EyeOff' : 'Eye'} size={16} className="mr-1" />
                        {video.is_visible ? 'Скрыть' : 'Показать'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(video.media)}
                      >
                        <Icon name="Copy" size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(video.media, '_blank')}
                      >
                        <Icon name="ExternalLink" size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteVideo(video.id, video.title)}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-8 bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <h3 className="font-bold mb-2 flex items-center text-green-800">
              <Icon name="CheckCircle" size={20} className="mr-2 text-green-600" />
              Управление видимостью
            </h3>
            <p className="text-sm text-gray-700 mb-3">
              Вы можете скрывать или показывать видео в галерее одним кликом.
              Скрытые видео остаются в базе, но не отображаются на сайте.
            </p>
            <div className="bg-white rounded p-3 border border-green-200">
              <p className="text-xs text-gray-600 mb-2">✨ Возможности:</p>
              <ul className="text-xs text-gray-700 space-y-1 ml-4 list-disc">
                <li>Скрыть видео из галереи без удаления</li>
                <li>Показать скрытое видео обратно</li>
                <li>Копировать прямую ссылку на видео</li>
                <li>Просмотреть все загруженные видео</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Admin;