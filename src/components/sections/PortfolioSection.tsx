import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

interface PortfolioSectionProps {
  t: {
    portfolio: {
      title: string;
      subtitle: string;
      filters: { all: string; neuro: string; stickers: string; ecommerce: string; fashion: string; videos: string };
    };
  };
}

interface PortfolioItem {
  title: string;
  category: string;
  image: string;
  isVideo?: boolean;
}

export default function PortfolioSection({ t }: PortfolioSectionProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [neuroGalleryOpen, setNeuroGalleryOpen] = useState(false);
  const [currentNeuroIndex, setCurrentNeuroIndex] = useState(0);
  const [stickerGalleryOpen, setStickerGalleryOpen] = useState(false);
  const [currentStickerIndex, setCurrentStickerIndex] = useState(0);
  const [ecommerceGalleryOpen, setEcommerceGalleryOpen] = useState(false);
  const [currentEcommerceIndex, setCurrentEcommerceIndex] = useState(0);
  const [fashionGalleryOpen, setFashionGalleryOpen] = useState(false);
  const [currentFashionIndex, setCurrentFashionIndex] = useState(0);
  const [videosGalleryOpen, setVideosGalleryOpen] = useState(false);
  const [currentVideosIndex, setCurrentVideosIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchEndY, setTouchEndY] = useState(0);
  const [videoWorks] = useState<Array<{title: string, media: string, type: string}>>([
    { title: 'Aespa Stickers', media: 'https://cdn.poehali.dev/files/a51eed36-ffa7-45c8-a6ba-6afbb08e1e87.mp4', type: 'video' },
    { title: 'SUSHI ROLL', media: 'https://cdn.poehali.dev/files/5c4de9e6-4ee8-48f8-929a-72a1e53db8b5.mp4', type: 'video' },
    { title: 'TATTOO', media: 'https://cdn.poehali.dev/files/05d651a8-c5cd-4d66-9aee-e04be27f0c8d.mp4', type: 'video' },
    { title: 'Anya stickers', media: 'https://cdn.poehali.dev/files/a7c91bcd-70ff-4d90-ab36-94ca6ca94e08.mp4', type: 'video' },
    { title: 'Winnie Harlow', media: 'https://cdn.poehali.dev/files/c1af5568-3e82-42e3-afb7-9a1a7e15088b.mp4', type: 'video' },
    { title: 'KW2S', media: 'https://cdn.poehali.dev/files/29c8e0aa-9af9-4ea7-b8a5-7e87f77ce87e.mp4', type: 'video' }
  ]);
  const [videoVolume, setVideoVolume] = useState(0.7);
  const [videoMuted, setVideoMuted] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const neuroPhotos = [
    { title: 'Fashion-минимализм', media: 'https://cdn.poehali.dev/files/85226719-576c-41a5-83e7-3350b31a11d6.jpeg', type: 'image' },
    { title: 'Рождественская элегантность', media: 'https://cdn.poehali.dev/files/7c57b981-1a76-45da-9aa3-62be985a95c3.jpeg', type: 'image' },
    { title: 'Весенняя оранжерея', media: 'https://cdn.poehali.dev/files/800d83ff-97c4-435d-a060-ffcca6f5d16d.jpeg', type: 'image' },
    { title: 'Шахматная королева', media: 'https://cdn.poehali.dev/files/2fea8a02-3efa-4682-a0f0-ca5f2af7b2d7.jpeg', type: 'image' },
    { title: 'Chanel элегантность', media: 'https://cdn.poehali.dev/files/8ace4480-833b-4492-b35c-1bacfe569082.jpeg', type: 'image' },
    { title: 'Versace зимний лукбук', media: 'https://cdn.poehali.dev/files/9cda06be-bddb-4444-8a7f-4aac8bc2dc71.jpeg', type: 'image' },
    { title: 'Зимний стиль Geely', media: 'https://cdn.poehali.dev/files/852e855b-0251-49e8-aea6-217d3f10c3d9.jpeg', type: 'image' },
    { title: 'Минималистичная элегантность', media: 'https://cdn.poehali.dev/files/c0ea7e63-0320-4609-b446-6f33a65a0f72.jpeg', type: 'image' },
    { title: 'Естественная красота', media: 'https://cdn.poehali.dev/files/4eaf5416-5b22-4bd0-8917-bb94cdfaf271.jpeg', type: 'image' },
    { title: 'Портрет в интерьере', media: 'https://cdn.poehali.dev/files/dcc0c536-34fe-4e84-ba8b-8098569095fa.jpeg', type: 'image' },
    { title: 'Уличная фотосессия', media: 'https://cdn.poehali.dev/files/10ce13e6-958b-4df7-8c2d-057954dedb29.jpeg', type: 'image' },
    { title: 'Городской стиль', media: 'https://cdn.poehali.dev/files/7d3ba810-4482-414c-9555-fbc80319a53d.jpeg', type: 'image' },
    { title: 'Нейропортрет', media: 'https://cdn.poehali.dev/projects/a4b74196-9d6f-4de8-becb-0795012f6edd/files/e5ef606d-7df8-42b2-9bdc-8b02d3b09783.jpg', type: 'image' },
    { title: 'Зимняя Москва', media: 'https://cdn.poehali.dev/files/ffb55f20-d2e1-4fea-8b1d-118b8feaae69.jpeg', type: 'image' },
    { title: 'Волшебный шар', media: 'https://cdn.poehali.dev/files/895620e9-85fc-4510-9fe6-00cee5ccc347.jpeg', type: 'image' },
    { title: 'Уютное Рождество', media: 'https://cdn.poehali.dev/files/ffc743a7-fb3d-43e7-a169-e97efa541bb7.jpeg', type: 'image' },
    { title: 'Праздничный вечер', media: 'https://cdn.poehali.dev/files/6a470c32-8ef3-4a95-a291-88506d871222.jpeg', type: 'image' },
    { title: 'Рождественская Москва', media: 'https://cdn.poehali.dev/files/f168d5b2-6dd9-48ee-9756-8c45655ffedc.jpeg', type: 'image' },
    { title: 'Королевский портрет', media: 'https://cdn.poehali.dev/files/freepik__-__51817.jpeg', type: 'image' },
    { title: 'Цветочная элегантность', media: 'https://cdn.poehali.dev/files/freepik__-img1-8k__95479.jpeg', type: 'image' },
    { title: 'Зимний портрет', media: 'https://cdn.poehali.dev/files/freepik__-img1-8k__71926.jpeg', type: 'image' }
  ];

  const stickerPacks = [
    { title: 'Neo Doge', media: 'https://cdn.poehali.dev/files/54c8f35e-ca21-4e1e-a577-42a73a89c0cf.jpeg', type: 'image' },
    { title: 'Romantic cat', media: 'https://cdn.poehali.dev/files/fba67f30-be67-499f-8f1b-deef82017f17.jpeg', type: 'image' },
    { title: 'Business cat', media: 'https://cdn.poehali.dev/files/e48766cc-8c20-4b7f-bfc0-b8d2d0385f1b.jpeg', type: 'image' },
    { title: 'Mood-стикеры', media: 'https://cdn.poehali.dev/files/fb7c7237-b29c-4bf5-9c18-f93b0de0d1bf.jpeg', type: 'image' },
    { title: 'Anya, Spy', media: 'https://cdn.poehali.dev/files/a62ad3d3-5cf8-4c23-a17f-3636ab76e2c2.jpeg', type: 'image' },
    { title: 'Anya Stickers', media: 'https://cdn.poehali.dev/files/dd48d887-e43c-4b64-a9a0-66f4fea2ec97.jpeg', type: 'image' },
    { title: 'Funny', media: 'https://cdn.poehali.dev/files/0dc16e80-cceb-434f-844d-1ae54a99adfb.jpeg', type: 'image' },
    { title: 'Girls', media: 'https://cdn.poehali.dev/files/0b08ba80-c84f-4bdd-9f03-36ca9c5e87ad.jpeg', type: 'image' },
    { title: 'Aespa K-Pop', media: 'https://cdn.poehali.dev/files/bda1cd01-f1f2-4f00-9dc3-3a8f71e05a60.jpeg', type: 'image' },
    { title: 'Пара котиков', media: 'https://cdn.poehali.dev/files/36b6b574-2fc7-493c-ab81-8b903b6fe978.jpeg', type: 'image' }
  ];

  const ecommercePhotos = [
    { title: 'Gucci сумка', media: 'https://cdn.poehali.dev/files/d2085f34-1c81-49c2-9b48-c13b86afc05f.jpeg', type: 'image' },
    { title: 'Крем для лица', media: 'https://cdn.poehali.dev/files/12a24ab9-f86c-4dd5-95e9-ca87e6b67c50.jpeg', type: 'image' },
    { title: 'Наушники', media: 'https://cdn.poehali.dev/files/98d4fe43-3eb6-4c17-bce3-b7bb88ab9d9d.jpeg', type: 'image' },
    { title: 'Часы Seiko', media: 'https://cdn.poehali.dev/files/8e3db5db-cf1c-4fe6-95de-38a6b8a9e8fc.jpeg', type: 'image' },
    { title: 'Духи Bvlgari', media: 'https://cdn.poehali.dev/files/f1d1802c-70fa-421a-88f0-d6f01b9f1cc3.jpeg', type: 'image' },
    { title: 'Бутылка вина', media: 'https://cdn.poehali.dev/files/d5f1d406-0b9c-4be2-90bb-fb70dd14b4ca.jpeg', type: 'image' },
    { title: 'Детский крем', media: 'https://cdn.poehali.dev/files/af0fcf26-6fd4-41c1-88c9-81af8e5734c9.jpeg', type: 'image' },
    { title: 'Кремы для лица', media: 'https://cdn.poehali.dev/files/56c14f92-ad27-4a3f-9cee-c5f36c25f2fd.jpeg', type: 'image' },
    { title: 'Кроссовки Nike', media: 'https://cdn.poehali.dev/files/d81e2e5c-08f8-4d0d-ba00-ad60c4a34ae8.jpeg', type: 'image' },
    { title: 'Сумка Hermes', media: 'https://cdn.poehali.dev/files/85cf3c36-02f7-45c1-8b94-c27be831beeb.jpeg', type: 'image' },
    { title: 'Часы и наушники', media: 'https://cdn.poehali.dev/files/db9a3dcd-bd3f-46c6-b10c-a8c2dcbb6dde.jpeg', type: 'image' },
    { title: 'Сумка Louis Vuitton', media: 'https://cdn.poehali.dev/files/c2f1c9ca-fc97-4ea0-8b64-f83a2d0f4f68.jpeg', type: 'image' }
  ];

  const fashionStickers = [
    { title: 'Girl', media: 'https://cdn.poehali.dev/files/8c5bb99c-b34a-40e5-a1e7-df9ef9c1cb83.jpeg', type: 'image' },
    { title: 'Зимняя коллекция', media: 'https://cdn.poehali.dev/files/e2f09bb0-df88-47e5-b04a-c4ed9e7f06bc.jpeg', type: 'image' },
    { title: 'Парижский шик', media: 'https://cdn.poehali.dev/files/5e97a4c7-fcf1-4e39-999a-e4d7daa5d5f7.jpeg', type: 'image' },
    { title: 'Модный детокс', media: 'https://cdn.poehali.dev/files/925c1506-f47e-41b6-93f1-7c7e13fdb9da.jpeg', type: 'image' },
    { title: 'Новый образ', media: 'https://cdn.poehali.dev/files/4f2cbf8c-59e3-4d30-aaca-45b12e4cb5da.jpeg', type: 'image' },
    { title: 'Леди Винтаж', media: 'https://cdn.poehali.dev/files/a11e01dc-7a8f-4c93-bbe5-c74deb086c10.jpeg', type: 'image' },
    { title: 'Неделя моды', media: 'https://cdn.poehali.dev/files/a9d5bcfa-2c31-4ebd-91e4-ebfd99e0a871.jpeg', type: 'image' },
    { title: 'Кожаные куртки', media: 'https://cdn.poehali.dev/files/1fa34be4-7393-4511-893c-46e5c52e5c37.jpeg', type: 'image' }
  ];

  const portfolio: PortfolioItem[] = [
    ...neuroPhotos.map(p => ({ ...p, category: 'neuro', image: p.media })),
    ...stickerPacks.map(p => ({ ...p, category: 'stickers', image: p.media })),
    ...ecommercePhotos.map(p => ({ ...p, category: 'ecommerce', image: p.media })),
    ...fashionStickers.map(p => ({ ...p, category: 'fashion', image: p.media })),
    ...videoWorks.map(p => ({ ...p, category: 'videos', image: p.media, isVideo: true }))
  ];

  const filteredPortfolio = activeFilter === 'all' 
    ? portfolio 
    : portfolio.filter(item => item.category === activeFilter || item.category === 'all');

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.touches[0].clientX);
    setTouchEndY(e.touches[0].clientY);
  };

  const handleTouchEnd = (galleryType: string, currentIndex: number, totalItems: number, setIndex: (index: number) => void) => {
    const swipeThreshold = 50;
    const verticalSwipe = Math.abs(touchEndY - touchStartY);
    const horizontalSwipe = touchStart - touchEnd;

    if (verticalSwipe > swipeThreshold) return;

    if (horizontalSwipe > swipeThreshold) {
      setIndex(currentIndex < totalItems - 1 ? currentIndex + 1 : 0);
    } else if (horizontalSwipe < -swipeThreshold) {
      setIndex(currentIndex > 0 ? currentIndex - 1 : totalItems - 1);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVideoVolume(newVolume);
    setVideoMuted(newVolume === 0);
    videoRefs.current.forEach(video => {
      if (video) {
        video.volume = newVolume;
        video.muted = newVolume === 0;
      }
    });
  };

  const toggleMute = () => {
    const newMuted = !videoMuted;
    setVideoMuted(newMuted);
    videoRefs.current.forEach(video => {
      if (video) {
        video.muted = newMuted;
        if (newMuted) {
          video.volume = 0;
        } else {
          video.volume = videoVolume;
        }
      }
    });
    if (newMuted) {
      setVideoVolume(0);
    } else {
      setVideoVolume(0.7);
    }
  };

  const renderGalleryDialog = (
    open: boolean,
    setOpen: (open: boolean) => void,
    items: Array<{title: string, media: string, type: string}>,
    currentIndex: number,
    setCurrentIndex: (index: number) => void
  ) => (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent 
        className="max-w-5xl w-[95vw] h-[90vh] p-0 overflow-hidden bg-black/95 border-primary/20"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={() => handleTouchEnd('gallery', currentIndex, items.length, setCurrentIndex)}
      >
        <div className="relative w-full h-full flex items-center justify-center">
          {items[currentIndex].type === 'video' ? (
            <div className="relative w-full h-full">
              <video
                ref={(el) => {
                  if (el && !videoRefs.current.includes(el)) {
                    videoRefs.current.push(el);
                  }
                }}
                src={items[currentIndex].media}
                className="w-full h-full object-contain"
                controls
                autoPlay
                loop
                playsInline
                volume={videoVolume}
                muted={videoMuted}
                onLoadedMetadata={(e) => {
                  const video = e.currentTarget;
                  video.volume = videoVolume;
                  video.muted = videoMuted;
                }}
              />
              <div className="absolute bottom-20 left-4 right-4 flex items-center space-x-4 bg-black/50 backdrop-blur-sm rounded-lg p-3">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                >
                  <Icon name={videoMuted ? "VolumeX" : "Volume2"} size={20} />
                </Button>
                <Slider
                  value={[videoVolume]}
                  max={1}
                  step={0.1}
                  onValueChange={handleVolumeChange}
                  className="flex-1"
                />
              </div>
            </div>
          ) : (
            <img 
              src={items[currentIndex].media} 
              alt={items[currentIndex].title}
              className="max-w-full max-h-full object-contain"
            />
          )}

          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 rounded-full w-12 h-12"
            onClick={() => setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : items.length - 1)}
          >
            <Icon name="ChevronLeft" size={24} />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 rounded-full w-12 h-12"
            onClick={() => setCurrentIndex(currentIndex < items.length - 1 ? currentIndex + 1 : 0)}
          >
            <Icon name="ChevronRight" size={24} />
          </Button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
            <p className="text-white text-sm font-medium">{items[currentIndex].title}</p>
          </div>

          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
            <p className="text-white text-sm">{currentIndex + 1} / {items.length}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  return (
    <section id="portfolio" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t.portfolio.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.portfolio.subtitle}</p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {[
            { key: 'all', label: t.portfolio.filters.all, icon: 'Grid' },
            { key: 'neuro', label: t.portfolio.filters.neuro, icon: 'User' },
            { key: 'stickers', label: t.portfolio.filters.stickers, icon: 'Sticker' },
            { key: 'ecommerce', label: t.portfolio.filters.ecommerce, icon: 'ShoppingBag' },
            { key: 'fashion', label: t.portfolio.filters.fashion, icon: 'Shirt' },
            { key: 'videos', label: t.portfolio.filters.videos, icon: 'Video' }
          ].map(filter => (
            <Button
              key={filter.key}
              variant={activeFilter === filter.key ? 'default' : 'outline'}
              onClick={() => setActiveFilter(filter.key)}
              className="transition-all"
            >
              <Icon name={filter.icon as "Grid" | "User" | "Sticker" | "ShoppingBag" | "Shirt" | "Video"} size={18} className="mr-2" />
              {filter.label}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPortfolio.map((item, index) => (
            <Card
              key={index}
              className="group overflow-hidden border-primary/20 hover:border-primary/50 transition-all hover:shadow-xl cursor-pointer"
              onClick={() => {
                if (item.category === 'neuro') {
                  setCurrentNeuroIndex(neuroPhotos.findIndex(p => p.media === item.image));
                  setNeuroGalleryOpen(true);
                } else if (item.category === 'stickers') {
                  setCurrentStickerIndex(stickerPacks.findIndex(p => p.media === item.image));
                  setStickerGalleryOpen(true);
                } else if (item.category === 'ecommerce') {
                  setCurrentEcommerceIndex(ecommercePhotos.findIndex(p => p.media === item.image));
                  setEcommerceGalleryOpen(true);
                } else if (item.category === 'fashion') {
                  setCurrentFashionIndex(fashionStickers.findIndex(p => p.media === item.image));
                  setFashionGalleryOpen(true);
                } else if (item.category === 'videos') {
                  setCurrentVideosIndex(videoWorks.findIndex(p => p.media === item.image));
                  setVideosGalleryOpen(true);
                }
              }}
            >
              <CardContent className="p-0 relative">
                <div className="h-56 sm:h-64 relative">
                  {item.isVideo ? (
                    <video 
                      src={item.image} 
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => {
                        e.currentTarget.pause();
                        e.currentTarget.currentTime = 0;
                      }}
                    />
                  ) : (
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <div className="text-white">
                      <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                      <Badge variant="secondary" className="bg-white/20 backdrop-blur-sm text-white border-0">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {renderGalleryDialog(neuroGalleryOpen, setNeuroGalleryOpen, neuroPhotos, currentNeuroIndex, setCurrentNeuroIndex)}
      {renderGalleryDialog(stickerGalleryOpen, setStickerGalleryOpen, stickerPacks, currentStickerIndex, setCurrentStickerIndex)}
      {renderGalleryDialog(ecommerceGalleryOpen, setEcommerceGalleryOpen, ecommercePhotos, currentEcommerceIndex, setCurrentEcommerceIndex)}
      {renderGalleryDialog(fashionGalleryOpen, setFashionGalleryOpen, fashionStickers, currentFashionIndex, setCurrentFashionIndex)}
      {renderGalleryDialog(videosGalleryOpen, setVideosGalleryOpen, videoWorks, currentVideosIndex, setCurrentVideosIndex)}
    </section>
  );
}
