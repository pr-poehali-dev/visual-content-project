import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import funcUrls from '../../backend/func2url.json';

const Index = () => {
  const { toast } = useToast();
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [photos, setPhotos] = useState([0]);
  const [stickers, setStickers] = useState([0]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentReview, setCurrentReview] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [showViziHint, setShowViziHint] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', contact: '', service: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);
  const [neuroGalleryOpen, setNeuroGalleryOpen] = useState(false);
  const [currentNeuroIndex, setCurrentNeuroIndex] = useState(0);
  const [stickerGalleryOpen, setStickerGalleryOpen] = useState(false);
  const [currentStickerIndex, setCurrentStickerIndex] = useState(0);
  const [ecommerceGalleryOpen, setEcommerceGalleryOpen] = useState(false);
  const [currentEcommerceIndex, setCurrentEcommerceIndex] = useState(0);
  const [fashionGalleryOpen, setFashionGalleryOpen] = useState(false);
  const [currentFashionIndex, setCurrentFashionIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);
  const [touchEndY, setTouchEndY] = useState(0);

  const quizQuestions = [
    {
      question: 'Где ваша аудитория?',
      options: ['Telegram', 'VK', 'Instagram*', 'Везде'],
      reactions: {
        'Telegram': 'Круто! Там огромное сообщество! 🚀',
        'VK': 'ВК — мощная платформа! 💪',
        'Instagram*': 'Визуал в Инстаграме королевствует! 👑',
        'Везде': 'Амбициозно! Мне это нравится! 🌟'
      }
    },
    {
      question: 'Главная боль прямо сейчас?',
      options: ['Контент скучный', 'Фотосессии дороги', 'Не выделяемся', 'Нет времени'],
      reactions: {
        'Контент скучный': 'Понимаю... Пора менять! 🎨',
        'Фотосессии дороги': 'Знаю это чувство! AI решит это! ✨',
        'Не выделяемся': 'Давайте создадим узнаваемый стиль!',
        'Нет времени': 'Я беру это на себя! Быстро и качественно! ⚡'
      }
    },
    {
      question: 'Сколько готовы инвестировать?',
      options: ['До 10К', '10-30К', '30-50К', '50К+'],
      reactions: {
        'До 10К': 'Есть крутые варианты в этом диапазоне! 💡',
        '10-30К': 'Отлично! Максимальный результат! 🎯',
        '30-50К': 'Wow! Можем сделать что-то невероятное! 🚀',
        '50К+': 'Это будет шедевр! 👑'
      }
    }
  ];

  const reviews = [
    { 
      quote: 'Обращалась в Визи за AI-портретом для профиля — результат супер! Всё сделали быстро, учли мои пожелания по цветам и стилю. Теперь у меня крутая картинка, которую все отмечают. Рекомендую!', 
      author: 'Анна С.', 
      role: 'Личный заказ', 
      rating: 5,
      comment: 'Анна теперь постоянный клиент! Персональный подход — наша фишка 😊' 
    },
    { 
      quote: 'С женой заказывали семейные нейро-фото в Визи для нового года. Оригинальные работы, быстрая обработка, всё получали онлайн. Цена чуть выше обычной студии, но эффект получился вау!', 
      author: 'Евгений Л.', 
      role: 'Семейный заказ', 
      rating: 4,
      comment: 'Семейные фото — особый жанр! Рад, что эффект оправдал ожидания 🎄' 
    },
    { 
      quote: 'Очень понравилось работать с Визи — заказывала аниме-аватар, сделали быстро и показали варианты на выбор. Можно всё обсудить через чат, ребята всегда на связи! Обязательно обращусь ещё.', 
      author: 'Мария Р.', 
      role: 'Аниме-аватар', 
      rating: 5,
      comment: 'Мария выбирала из 5 вариантов! Всегда даём выбор 💬' 
    },
    { 
      quote: 'Визи делали AI-портреты для корпоративного сайта. Понравился современный стиль, всё получили в срок, подход творческий. Команда помогла подобрать варианты, коллеги оценили! Однозначно рекомендую.', 
      author: 'Артём М.', 
      role: 'Корпоративный заказ', 
      rating: 5,
      comment: 'Корпоративные проекты — моя любовь! Стиль и профессионализм 💼' 
    },
    { 
      quote: 'Сотрудничаем с Визи уже полгода — заказываем визуалы для клиентских проектов. Ребята берут оптовые заказы, работают в сроки, готовы к корректировкам. Цена адекватная для bulk-заказов, качество стабильное. Как подрядчик рекомендую!', 
      author: 'MediaAgency "БХ"', 
      role: 'B2B агентство', 
      rating: 5,
      comment: 'Полгода сотрудничества! Оптовые заказы — это наша сила 🤝' 
    },
    { 
      quote: 'Обратились в Визи для генерации иллюстраций под нашу платформу. Команда сразу поняла техническое задание, предложила несколько подходов к стилю. Получили готовый контент в срок, без переделок. Рассчитываем на дальнейшее сотрудничество!', 
      author: 'ООО "Стартап Лаб"', 
      role: 'B2B стартап', 
      rating: 5,
      comment: 'Техзадание поняли с первого раза! Говорим на языке стартапов 🚀' 
    },
    { 
      quote: 'Используем Визи для создания аватаров товаров и промо-визуалов в каталог. Срок выполнения быстрый, можно оформить большой заказ и получить скидку. Вышло выгоднее, чем нанимать внутреннего дизайнера. Пока работаем над единообразием стиля, но в целом доволен!', 
      author: 'Елена К.', 
      role: 'E-commerce', 
      rating: 4,
      comment: 'E-commerce визуалы — наша специализация! Единообразие стиля — в работе 🛒' 
    }
  ];

  const neuroPhotos = [
    { title: 'Fashion-минимализм', image: 'https://cdn.poehali.dev/files/85226719-576c-41a5-83e7-3350b31a11d6.jpeg' },
    { title: 'Рождественская элегантность', image: 'https://cdn.poehali.dev/files/7c57b981-1a76-45da-9aa3-62be985a95c3.jpeg' },
    { title: 'Весенняя оранжерея', image: 'https://cdn.poehali.dev/files/800d83ff-97c4-435d-a060-ffcca6f5d16d.jpeg' },
    { title: 'Шахматная королева', image: 'https://cdn.poehali.dev/files/2fea8a02-3efa-4682-a0f0-ca5f2af7b2d7.jpeg' },
    { title: 'Chanel элегантность', image: 'https://cdn.poehali.dev/files/8ace4480-833b-4492-b35c-1bacfe569082.jpeg' },
    { title: 'Versace зимний лукбук', image: 'https://cdn.poehali.dev/files/9cda06be-bddb-4444-8a7f-4aac8bc2dc71.jpeg' },
    { title: 'Зимний стиль Geely', image: 'https://cdn.poehali.dev/files/852e855b-0251-49e8-aea6-217d3f10c3d9.jpeg' },
    { title: 'Минималистичная элегантность', image: 'https://cdn.poehali.dev/files/c0ea7e63-0320-4609-b446-6f33a65a0f72.jpeg' },
    { title: 'Естественная красота', image: 'https://cdn.poehali.dev/files/4eaf5416-5b22-4bd0-8917-bb94cdfaf271.jpeg' },
    { title: 'Портрет в интерьере', image: 'https://cdn.poehali.dev/files/dcc0c536-34fe-4e84-ba8b-8098569095fa.jpeg' },
    { title: 'Уличная фотосессия', image: 'https://cdn.poehali.dev/files/10ce13e6-958b-4df7-8c2d-057954dedb29.jpeg' },
    { title: 'Городской стиль', image: 'https://cdn.poehali.dev/files/7d3ba810-4482-414c-9555-fbc80319a53d.jpeg' },
    { title: 'Нейропортрет', image: 'https://cdn.poehali.dev/projects/a4b74196-9d6f-4de8-becb-0795012f6edd/files/e5ef606d-7df8-42b2-9bdc-8b02d3b09783.jpg' },
    { title: 'Зимняя Москва', image: 'https://cdn.poehali.dev/files/ffb55f20-d2e1-4fea-8b1d-118b8feaae69.jpeg' },
    { title: 'Волшебный шар', image: 'https://cdn.poehali.dev/files/895620e9-85fc-4510-9fe6-00cee5ccc347.jpeg' },
    { title: 'Уютное Рождество', image: 'https://cdn.poehali.dev/files/ffc743a7-fb3d-43e7-a169-e97efa541bb7.jpeg' },
    { title: 'Праздничный вечер', image: 'https://cdn.poehali.dev/files/6a470c32-8ef3-4a95-a291-88506d871222.jpeg' },
    { title: 'Рождественская Москва', image: 'https://cdn.poehali.dev/files/f168d5b2-6dd9-48ee-9756-8c45655ffedc.jpeg' }
  ];

  const stickerPhotos = [
    { title: 'Кибер-котик', image: 'https://cdn.poehali.dev/files/b3feacff-a433-4015-b44e-02ae36404264.jpeg' },
    { title: 'Стикерпак Vizi', image: 'https://cdn.poehali.dev/files/0acc6698-fd67-4b82-abfc-2b57943caedd.jpeg' },
    { title: 'Фотограф-камера', image: 'https://cdn.poehali.dev/files/4097e8c1-83cc-4b98-b2c5-70ba74345b8a.jpeg' },
    { title: 'Фотограф студия', image: 'https://cdn.poehali.dev/files/f2f3edfb-252d-4440-a806-8587f251c296.jpeg' },
    { title: 'Кофе стикеры', image: 'https://cdn.poehali.dev/files/f0502733-f2ce-4853-9345-d64894f87501.jpeg' },
    { title: 'Кофе эмоции', image: 'https://cdn.poehali.dev/files/44b1682c-a3c7-4872-aebf-8f2f51177920.jpeg' }
  ];

  const ecommercePhotos = [
    { title: 'Новогодняя игрушка', image: 'https://cdn.poehali.dev/files/a65ea833-5a00-408c-80c1-cca73d592a2c.jpeg' },
    { title: 'Пряничный домик', image: 'https://cdn.poehali.dev/files/ec48fe3e-3c51-4813-b8f5-a4d7680288cf.jpeg' },
    { title: 'Геометрия уюта', image: 'https://cdn.poehali.dev/files/2c579169-bd1a-4310-975d-5cc2c0b45a8b.jpeg' }
  ];

  const fashionPhotos = [
    { title: 'Стикеры для авто', image: 'https://cdn.poehali.dev/files/ea9af10e-aa28-4e38-abcd-1ce40e0bbe4a.jpeg' },
    { title: 'Дизайнерские стикеры', image: 'https://cdn.poehali.dev/files/272b3cde-20db-4113-a8fc-9e3801e65553.jpeg' },
    { title: 'Fashion стиль', image: 'https://cdn.poehali.dev/files/5833a839-e1a9-4a63-b2a0-e6dc71fd9c5c.jpeg' },
    { title: 'Путешествия', image: 'https://cdn.poehali.dev/files/778b28d3-f95c-4ede-ae6d-42002f28e4f4.jpeg' },
    { title: 'Креативные мемы', image: 'https://cdn.poehali.dev/files/c08e79cc-6ac9-4357-bbf6-2ec5d4eeda98.jpeg' },
    { title: 'Йога и гармония', image: 'https://cdn.poehali.dev/files/2d9822cf-2427-48c0-8fc6-e56e4edc8a24.jpeg' }
  ];

  const portfolio = [
    { category: 'stickers', emoji: '🎨', title: 'Брендовый стикерпак', gradient: 'from-red-400 to-orange-400', image: 'https://cdn.poehali.dev/files/b3feacff-a433-4015-b44e-02ae36404264.jpeg', hasGallery: true },
    { category: 'neuro', emoji: '📸', title: 'Нейрофотосессия', gradient: 'from-teal-400 to-cyan-500', image: 'https://cdn.poehali.dev/files/895620e9-85fc-4510-9fe6-00cee5ccc347.jpeg', hasGallery: true },
    { category: 'fashion', emoji: '👗', title: 'Fashion стикеры', gradient: 'from-emerald-400 to-teal-400', image: 'https://cdn.poehali.dev/files/5833a839-e1a9-4a63-b2a0-e6dc71fd9c5c.jpeg', hasGallery: true },
    { category: 'ecommerce', emoji: '🛒', title: 'E-commerce фото', gradient: 'from-indigo-500 to-blue-600', image: 'https://cdn.poehali.dev/files/a65ea833-5a00-408c-80c1-cca73d592a2c.jpeg', hasGallery: true }
  ];

  const handleQuizAnswer = (answer: string) => {
    setQuizAnswers({ ...quizAnswers, [`q${quizStep}`]: answer });
    
    setTimeout(() => {
      if (quizStep < quizQuestions.length - 1) {
        setQuizStep(quizStep + 1);
      } else {
        setQuizStep(-1);
        setTimeout(() => setChatOpen(true), 1000);
      }
    }, 1500);
  };

  const tradPhotoCost = photos[0] === 0 ? 0 : 10000 + (photos[0] / 10 - 1) * 5000;
  const tradStickerCost = stickers[0] === 0 ? 0 : 5000 + (stickers[0] / 10 - 1) * 5000;
  const tradCost = tradPhotoCost + tradStickerCost;
  const tradTime = photos[0] === 0 ? 0 : 7 + (photos[0] / 10 - 1) * 3;
  const tradProcessed = Math.ceil(photos[0] / 3);
  
  const neuroPhotoCost = photos[0] === 0 ? 0 : 5000 + (photos[0] / 10 - 1) * 3000;
  const neuroStickerCost = stickers[0] === 0 ? 0 : 2500 + (stickers[0] / 10 - 1) * 1500;
  const neuroCost = neuroPhotoCost + neuroStickerCost;
  const neuroTime = photos[0] === 0 ? 0 : 2 + Math.floor(photos[0] / 30) * 0.5;
  const neuroProcessed = photos[0];
  
  const savings = tradCost - neuroCost;
  const timeSaved = tradTime - neuroTime;

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const nextNeuroPhoto = () => {
    setCurrentNeuroIndex((prev) => (prev + 1) % neuroPhotos.length);
  };

  const prevNeuroPhoto = () => {
    setCurrentNeuroIndex((prev) => (prev - 1 + neuroPhotos.length) % neuroPhotos.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
    setTouchEndY(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = () => {
    const swipeX = Math.abs(touchStart - touchEnd);
    const swipeY = Math.abs(touchStartY - touchEndY);
    
    if (swipeY > swipeX && swipeY > 100) {
      setNeuroGalleryOpen(false);
    } else if (touchStart - touchEnd > 75) {
      nextNeuroPhoto();
    } else if (touchStart - touchEnd < -75) {
      prevNeuroPhoto();
    }
  };

  const nextStickerPhoto = () => {
    setCurrentStickerIndex((prev) => (prev + 1) % stickerPhotos.length);
  };

  const prevStickerPhoto = () => {
    setCurrentStickerIndex((prev) => (prev - 1 + stickerPhotos.length) % stickerPhotos.length);
  };

  const handleStickerTouchEnd = () => {
    const swipeX = Math.abs(touchStart - touchEnd);
    const swipeY = Math.abs(touchStartY - touchEndY);
    
    if (swipeY > swipeX && swipeY > 100) {
      setStickerGalleryOpen(false);
    } else if (touchStart - touchEnd > 75) {
      nextStickerPhoto();
    } else if (touchStart - touchEnd < -75) {
      prevStickerPhoto();
    }
  };

  const nextEcommercePhoto = () => {
    setCurrentEcommerceIndex((prev) => (prev + 1) % ecommercePhotos.length);
  };

  const prevEcommercePhoto = () => {
    setCurrentEcommerceIndex((prev) => (prev - 1 + ecommercePhotos.length) % ecommercePhotos.length);
  };

  const handleEcommerceTouchEnd = () => {
    const swipeX = Math.abs(touchStart - touchEnd);
    const swipeY = Math.abs(touchStartY - touchEndY);
    
    if (swipeY > swipeX && swipeY > 100) {
      setEcommerceGalleryOpen(false);
    } else if (touchStart - touchEnd > 75) {
      nextEcommercePhoto();
    } else if (touchStart - touchEnd < -75) {
      prevEcommercePhoto();
    }
  };

  const nextFashionPhoto = () => {
    setCurrentFashionIndex((prev) => (prev + 1) % fashionPhotos.length);
  };

  const prevFashionPhoto = () => {
    setCurrentFashionIndex((prev) => (prev - 1 + fashionPhotos.length) % fashionPhotos.length);
  };

  const handleFashionTouchEnd = () => {
    const swipeX = Math.abs(touchStart - touchEnd);
    const swipeY = Math.abs(touchStartY - touchEndY);
    
    if (swipeY > swipeX && swipeY > 100) {
      setFashionGalleryOpen(false);
    } else if (touchStart - touchEnd > 75) {
      nextFashionPhoto();
    } else if (touchStart - touchEnd < -75) {
      prevFashionPhoto();
    }
  };

  const filteredPortfolio = activeFilter === 'all' 
    ? portfolio 
    : portfolio.filter(item => item.category === activeFilter || item.category === 'all');

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(funcUrls['contact-form'], {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast({
          title: '✅ Заявка отправлена!',
          description: 'Мы свяжемся с вами в ближайшее время',
        });
        setFormData({ name: '', contact: '', service: '', message: '' });
        setFormOpen(false);
      } else {
        toast({
          title: '❌ Ошибка',
          description: result.error || 'Не удалось отправить заявку',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: '❌ Ошибка',
        description: 'Не удалось отправить заявку. Попробуйте позже.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowViziHint(true);
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [reviews.length]);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 right-4 z-50 w-12 h-12 bg-primary rounded-full shadow-lg flex items-center justify-center lg:hidden hover:scale-110 transition-transform"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <Icon name={mobileMenuOpen ? "X" : "Menu"} size={24} className="text-white" />
      </button>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-sm lg:hidden animate-fade-in">
          <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center h-full gap-6">
            <button
              className="text-2xl font-bold text-white hover:text-purple-400 transition-colors"
              onClick={() => {
                scrollToSection('quiz');
                setMobileMenuOpen(false);
              }}
            >
              🎯 Квиз
            </button>
            <button
              className="text-2xl font-bold text-white hover:text-purple-400 transition-colors"
              onClick={() => {
                scrollToSection('calculator');
                setMobileMenuOpen(false);
              }}
            >
              💰 Калькулятор
            </button>
            <button
              className="text-2xl font-bold text-white hover:text-purple-400 transition-colors"
              onClick={() => {
                scrollToSection('portfolio');
                setMobileMenuOpen(false);
              }}
            >
              🎨 Портфолио
            </button>
            <button
              className="text-2xl font-bold text-white hover:text-purple-400 transition-colors"
              onClick={() => {
                scrollToSection('reviews');
                setMobileMenuOpen(false);
              }}
            >
              ⭐ Отзывы
            </button>
            <button
              className="text-2xl font-bold text-white hover:text-purple-400 transition-colors"
              onClick={() => {
                scrollToSection('faq');
                setMobileMenuOpen(false);
              }}
            >
              ❓ FAQ
            </button>
            <Button
              size="lg"
              className="mt-8 bg-purple-400 hover:bg-purple-300"
              onClick={() => {
                setFormOpen(true);
                setMobileMenuOpen(false);
              }}
            >
              🚀 Начать проект
            </Button>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative min-h-[100svh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white overflow-hidden py-8 px-4">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="container mx-auto text-center z-10 animate-fade-in max-w-4xl">
          <div className="text-6xl sm:text-7xl mb-4 sm:mb-5">😼</div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-3 sm:mb-4 leading-tight px-4">Привет! Я Визи 👋</h1>
          <p className="text-base sm:text-lg md:text-xl mb-8 sm:mb-10 opacity-90 max-w-xl mx-auto px-4">
            Помогаю брендам создавать контент, который запоминают и используют!
          </p>
          
          <div className="grid grid-cols-2 gap-3 sm:gap-3 max-w-lg mx-auto px-4">
            <Button size="sm" className="bg-white text-gray-900 hover:bg-purple-400 hover:text-white shadow-lg font-bold text-sm sm:text-sm py-5 sm:py-5 h-auto active:scale-95 transition-transform" onClick={() => scrollToSection('portfolio')}>
              <Icon name="Palette" className="mr-1" size={16} />
              Стикеры
            </Button>
            <Button size="sm" className="bg-white text-gray-900 hover:bg-purple-400 hover:text-white shadow-lg font-bold text-sm sm:text-sm py-5 sm:py-5 h-auto active:scale-95 transition-transform" onClick={() => scrollToSection('portfolio')}>
              <Icon name="Camera" className="mr-1" size={16} />
              AI-фото
            </Button>
            <Button size="sm" variant="outline" className="border-2 border-white text-white bg-white/10 hover:bg-white hover:text-gray-900 font-bold text-sm sm:text-sm py-5 sm:py-5 h-auto active:scale-95 transition-transform" onClick={() => scrollToSection('calculator')}>
              <Icon name="Calculator" className="mr-1" size={16} />
              Калькулятор
            </Button>
            <Button size="sm" variant="outline" className="border-2 border-white text-white bg-white/10 hover:bg-white hover:text-gray-900 font-bold text-sm sm:text-sm py-5 sm:py-5 h-auto active:scale-95 transition-transform" onClick={() => scrollToSection('portfolio')}>
              <Icon name="Sparkles" className="mr-1" size={16} />
              Примеры
            </Button>
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <section id="quiz" className="py-16 sm:py-20 container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 sm:mb-12 leading-tight px-2">Давайте найдём ваше идеальное решение 🎯</h2>
        
        {quizStep >= 0 && quizStep < quizQuestions.length ? (
          <Card className="max-w-3xl mx-auto animate-fade-in">
            <CardContent className="p-4 sm:p-8">
              <div className="mb-6">
                <div className="h-2 bg-secondary/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-purple-600 transition-all duration-500"
                    style={{ width: `${((quizStep + 1) / quizQuestions.length) * 100}%` }}
                  />
                </div>
              </div>
              
              <h3 className="text-lg sm:text-xl font-bold text-center mb-6 sm:mb-8 px-2">{quizQuestions[quizStep].question}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                {quizQuestions[quizStep].options.map((option) => (
                  <Button
                    key={option}
                    variant="outline"
                    size="lg"
                    className="h-auto py-3 sm:py-5 text-sm sm:text-base hover:border-primary hover:bg-primary hover:text-white active:scale-95 transition-transform"
                    onClick={() => handleQuizAnswer(option)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
              
              {quizAnswers[`q${quizStep}`] && (
                <Card className="mt-6 bg-primary/5 border-l-4 border-primary animate-fade-in">
                  <CardContent className="p-4 flex items-center gap-4">
                    <span className="text-4xl">😼</span>
                    <p className="text-lg">{quizQuestions[quizStep].reactions[quizAnswers[`q${quizStep}`]]}</p>
                  </CardContent>
                </Card>
              )}
              
              {quizStep === 0 && (
                <p className="text-xs text-gray-500 mt-4 text-center">
                  * Instagram принадлежит компании Meta, которая признана экстремистской организацией и запрещена на территории РФ
                </p>
              )}
            </CardContent>
          </Card>
        ) : quizStep === -1 ? (
          <div className="text-center animate-fade-in">
            <h3 className="text-3xl font-bold mb-6">🎉 Идеальное предложение готово!</h3>
            <Card className="max-w-md mx-auto bg-primary/5 border-l-4 border-primary">
              <CardContent className="p-6 flex items-center gap-4">
                <span className="text-5xl">😼</span>
                <p className="text-lg">Я знаю, что вам нужно! Вы готовы начать?</p>
              </CardContent>
            </Card>
            <Button size="lg" className="mt-8" onClick={() => setFormOpen(true)}>
              Начать прямо сейчас
            </Button>
          </div>
        ) : null}
      </section>

      {/* Calculator Section */}
      <section id="calculator" className="py-16 sm:py-20 bg-secondary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 sm:mb-12 leading-tight px-2">Сколько вы экономите? 💰</h2>
          
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-4 sm:p-8">
              <div className="space-y-8 mb-8">
                <div>
                  <div className="flex justify-between mb-4">
                    <span className="font-semibold">📸 Количество фото</span>
                    <Badge variant="secondary" className="text-lg">{photos[0]}</Badge>
                  </div>
                  <Slider value={photos} onValueChange={setPhotos} min={0} max={100} step={10} />
                </div>
                
                <div>
                  <div className="flex justify-between mb-4">
                    <span className="font-semibold">🎨 Стикеров в паке</span>
                    <Badge variant="secondary" className="text-lg">{stickers[0]}</Badge>
                  </div>
                  <Slider value={stickers} onValueChange={setStickers} min={0} max={100} step={10} />
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <Card className="border-red-300 bg-red-50">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-lg mb-4">📷 Традиционная фотосессия</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>Стоимость:</span><span className="font-bold">{tradCost.toLocaleString('ru-RU')}₽</span></div>
                      <div className="flex justify-between"><span>Время:</span><span>{tradTime} {tradTime === 1 ? 'день' : tradTime < 5 ? 'дня' : 'дней'}</span></div>
                      <div className="flex justify-between"><span>Обработанные:</span><span>{tradProcessed}</span></div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-green-300 bg-green-50">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-lg mb-4">🤖 С нами (Нейрофото + стикеры)</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>Стоимость:</span><span className="font-bold">{neuroCost.toLocaleString('ru-RU')}₽</span></div>
                      <div className="flex justify-between"><span>Время:</span><span>{neuroTime} {neuroTime === 1 || neuroTime === 0 ? 'день' : neuroTime < 5 ? 'дня' : 'дней'}</span></div>
                      <div className="flex justify-between"><span>Обработанные:</span><span>{neuroProcessed}</span></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="bg-gradient-to-r from-green-500 to-cyan-500 text-white text-center">
                <CardContent className="p-4 sm:p-8">
                  <p className="text-base sm:text-lg mb-2">Вы экономите:</p>
                  <p className="text-3xl sm:text-5xl font-bold mb-3 sm:mb-4">{savings.toLocaleString('ru-RU')}₽</p>
                  <p className="text-lg sm:text-2xl font-semibold mb-4">и {timeSaved} {timeSaved === 1 || timeSaved === 0 ? 'день' : timeSaved < 5 ? 'дня' : 'дней'}</p>
                  <div className="flex items-center justify-center gap-2 sm:gap-4 bg-white/20 rounded-lg p-3 sm:p-4">
                    <span className="text-3xl sm:text-4xl">😼</span>
                    <p className="text-sm sm:text-base">Впечатляет, правда? 💰</p>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-16 sm:py-20 container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 sm:mb-10 leading-tight px-2">Вот что мы создали 🎨</h2>
        
        <div className="flex flex-wrap gap-2 justify-center mb-8 sm:mb-12 px-2">
          {['all', 'stickers', 'neuro', 'fashion', 'ecommerce'].map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? 'default' : 'outline'}
              onClick={() => setActiveFilter(filter)}
              className="hover-scale text-xs sm:text-sm"
              size="sm"
            >
              {filter === 'all' && '🎨 Все'}
              {filter === 'stickers' && '💬 Стикеры'}
              {filter === 'neuro' && '📸 Фото'}
              {filter === 'fashion' && '👔 Fashion'}
              {filter === 'ecommerce' && '🛍️ Shop'}
            </Button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredPortfolio.map((item, index) => (
            <Card 
              key={index} 
              className="group cursor-pointer overflow-hidden hover-scale"
              onClick={() => {
                if (item.hasGallery) {
                  if (item.category === 'neuro') {
                    setNeuroGalleryOpen(true);
                  } else if (item.category === 'stickers') {
                    setStickerGalleryOpen(true);
                  } else if (item.category === 'ecommerce') {
                    setEcommerceGalleryOpen(true);
                  } else if (item.category === 'fashion') {
                    setFashionGalleryOpen(true);
                  }
                }
              }}
            >
              <div className="h-48 sm:h-64 relative">
                <img 
                  src={item.image} 
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-end p-4 sm:p-6">
                  <div className="w-full">
                    <p className="text-white text-lg sm:text-xl font-bold mb-1">{item.emoji} {item.title}</p>
                    {item.hasGallery && <p className="text-white/80 text-xs sm:text-sm">Нажмите для просмотра галереи</p>}
                  </div>
                </div>
                <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-6">
                  <p className="text-xl font-bold mb-4">{item.title}</p>
                  {item.hasGallery && <Button variant="secondary" size="sm">Смотреть все</Button>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-16 sm:py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 sm:mb-12 leading-tight px-2">Что говорят клиенты ⭐</h2>
          
          <div className="max-w-4xl mx-auto relative">
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="p-6 sm:p-10">
                <div className="mb-4">
                  <p className="text-yellow-400 text-2xl sm:text-3xl mb-2">
                    {'★'.repeat(reviews[currentReview].rating)}{'☆'.repeat(5 - reviews[currentReview].rating)}
                  </p>
                </div>
                
                <p className="text-base sm:text-lg md:text-xl mb-6 leading-relaxed text-left">"{reviews[currentReview].quote}"</p>
                
                <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/20">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-2xl">
                    {reviews[currentReview].author.charAt(0)}
                  </div>
                  <div className="text-left">
                    <p className="text-base sm:text-lg font-semibold">{reviews[currentReview].author}</p>
                    <p className="text-sm sm:text-base opacity-80">{reviews[currentReview].role}</p>
                  </div>
                </div>
                
                <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-400/30">
                  <CardContent className="p-4 flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 vizi-cyber-glow">
                      <img 
                        src="https://cdn.poehali.dev/files/ce7f214b-3425-4422-9d1d-7945d8bc7da3.jpeg"
                        alt="Визи"
                        className="w-full h-full object-cover scale-110 vizi-neon"
                      />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold mb-1">Комментарий Визи:</p>
                      <p className="text-sm sm:text-base">{reviews[currentReview].comment}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex items-center justify-between mt-6">
                  <button
                    onClick={() => setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length)}
                    className="w-12 h-12 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all active:scale-95 touch-manipulation"
                  >
                    <Icon name="ChevronLeft" size={28} />
                  </button>
                  
                  <div className="flex gap-2">
                    {reviews.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                          currentReview === index ? 'bg-white w-6 sm:w-8' : 'bg-white/50'
                        }`}
                        onClick={() => setCurrentReview(index)}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={() => setCurrentReview((prev) => (prev + 1) % reviews.length)}
                    className="w-12 h-12 sm:w-12 sm:h-12 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all active:scale-95 touch-manipulation"
                  >
                    <Icon name="ChevronRight" size={28} />
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 sm:py-20 container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-10 sm:mb-12 leading-tight px-2">Часто задаваемые вопросы ❓</h2>
        
        <Accordion type="single" collapsible className="max-w-3xl mx-auto">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-sm sm:text-lg">Сколько времени занимает разработка?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-3 sm:mb-4 text-sm sm:text-base">Обычно 24-72 часа в зависимости от сложности и количества.</p>
              <Card className="bg-primary/5 border-l-4 border-primary">
                <CardContent className="p-3 text-sm">
                  <strong>😼 Визи:</strong> Но обычно я справляюсь быстрее! ⚡
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-sm sm:text-lg">Можно ли использовать для коммерческих проектов?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-3 sm:mb-4 text-sm sm:text-base">Да, вы получаете полные права на коммерческое использование.</p>
              <Card className="bg-primary/5 border-l-4 border-primary">
                <CardContent className="p-3 text-sm">
                  <strong>😼 Визи:</strong> Ваше спокойствие — моя цель! 🛡️
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-base sm:text-lg">В каких форматах вы отдаёте файлы?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-4">PNG, WebP и по запросу любые нужные форматы. Всё оптимизировано для соцсетей.</p>
              <Card className="bg-primary/5 border-l-4 border-primary">
                <CardContent className="p-3 text-sm">
                  <strong>😼 Визи:</strong> Всё готово к загрузке! 🚀
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4">
            <AccordionTrigger className="text-base sm:text-lg">Подходит ли для маркетплейсов?</AccordionTrigger>
            <AccordionContent>
              <p className="mb-4">Да! AI-контент идеален для Wildberries, Ozon, Яндекс.Маркета и соцсетей.</p>
              <Card className="bg-primary/5 border-l-4 border-primary">
                <CardContent className="p-3 text-sm">
                  <strong>😼 Визи:</strong> Работает везде! 🚀
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-primary via-purple-600 to-violet-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="text-6xl sm:text-6xl mb-5 sm:mb-6">😼</div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-5 leading-tight px-2">Готовы создать контент, который выделит вас?</h2>
          <p className="text-base sm:text-lg mb-8 sm:mb-10 opacity-90 px-4">Присоединяйтесь к 10+ брендам, которые уже получают результаты</p>
          
          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-6 justify-center mb-6 sm:mb-10 max-w-3xl mx-auto">
            <div className="flex items-center gap-2 sm:gap-3">
              <Icon name="CheckCircle2" size={20} className="flex-shrink-0" />
              <span className="text-sm sm:text-base">Экономия 50% бюджета</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Icon name="CheckCircle2" size={20} className="flex-shrink-0" />
              <span className="text-sm sm:text-base">Готово за 48 часов</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Icon name="CheckCircle2" size={20} className="flex-shrink-0" />
              <span className="text-sm sm:text-base">15+ частных заказов</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Icon name="CheckCircle2" size={20} className="flex-shrink-0" />
              <span className="text-sm sm:text-base">Гарантия результата</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6 sm:mb-8 max-w-md mx-auto">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100 w-full sm:w-auto" onClick={() => setFormOpen(true)}>
              Начать прямо сейчас
            </Button>
            <Button size="lg" variant="outline" className="border-white bg-white text-black hover:bg-gray-100 w-full sm:w-auto" onClick={() => setChatOpen(true)}>
              Поговорить с Визи
            </Button>
          </div>
          
          <Card className="max-w-md mx-auto bg-white/20 border-white/30">
            <CardContent className="p-4 sm:p-6">
              <p className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">🔥 Осталось 3 слота по спеццене</p>
              <p className="text-xs sm:text-sm opacity-90">Не упустите шанс! Завтра может быть поздно!</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Chat Widget */}
      <div className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 vizi-float">
        <div 
          className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 shadow-2xl shadow-purple-500/50 hover:shadow-purple-400/70 hover:vizi-wiggle cursor-pointer flex items-center justify-center overflow-hidden border-4 border-purple-400 transition-all hover:scale-110 vizi-cyber-glow"
          onClick={() => {
            setChatOpen(!chatOpen);
            setShowViziHint(false);
          }}
          onMouseEnter={(e) => e.currentTarget.classList.add('vizi-wiggle')}
          onAnimationEnd={(e) => e.currentTarget.classList.remove('vizi-wiggle')}
        >
          <img 
            src="https://cdn.poehali.dev/files/ce7f214b-3425-4422-9d1d-7945d8bc7da3.jpeg"
            alt="Визи"
            loading="lazy"
            className="w-full h-full object-cover scale-110 vizi-neon"
          />
        </div>
        
        {showViziHint && !chatOpen && (
          <div className="absolute bottom-20 right-0 w-64 sm:w-72 bg-white rounded-lg shadow-2xl p-3 sm:p-4 animate-scale-in border-2 border-purple-400">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 vizi-cyber-glow">
                <img 
                  src="https://cdn.poehali.dev/files/ce7f214b-3425-4422-9d1d-7945d8bc7da3.jpeg"
                  alt="Визи"
                  loading="lazy"
                  className="w-full h-full object-cover scale-110 vizi-neon"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">👋 Привет! Я Визи</p>
                <p className="text-xs text-gray-600 mt-1">Помогу подобрать идеальный пакет для твоего бренда!</p>
              </div>
              <button 
                onClick={() => setShowViziHint(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
          </div>
        )}
        
        {chatOpen && (
          <Card className="absolute bottom-20 right-0 w-80 sm:w-96 shadow-2xl animate-scale-in max-h-[60vh] flex flex-col overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-gradient-to-r from-gray-900 via-purple-900 to-gray-800 text-white p-4 rounded-t-lg font-bold flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden vizi-cyber-glow">
                  <img 
                    src="https://cdn.poehali.dev/files/ce7f214b-3425-4422-9d1d-7945d8bc7da3.jpeg"
                    alt="Визи"
                    className="w-full h-full object-cover scale-110 vizi-neon"
                  />
                </div>
                <span>Визи - Ваш консультант</span>
              </div>
              <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0 vizi-cyber-glow">
                    <img 
                      src="https://cdn.poehali.dev/files/ce7f214b-3425-4422-9d1d-7945d8bc7da3.jpeg"
                      alt="Визи"
                      className="w-full h-full object-cover scale-110 vizi-neon"
                    />
                  </div>
                  <Card className="flex-1 bg-secondary/10">
                    <CardContent className="p-3 text-sm">
                      Привет! Я Визи, твой личный консультант. Как я могу помочь?
                    </CardContent>
                  </Card>
                </div>
                <div className="space-y-2">
                  <Button variant="default" size="sm" className="w-full justify-start bg-primary hover:bg-primary/90" onClick={() => window.open('https://t.me/Vizi1st_bot', '_blank')}>
                    🚀 Начать общение
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => window.open('https://t.me/Vizi1st_bot', '_blank')}>
                    💰 Сколько стоит?
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => scrollToSection('portfolio')}>
                    🎨 Примеры работ
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => setFormOpen(true)}>
                    📝 Как заказать?
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Contact Form Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-2xl">Заказать визуальный контент</DialogTitle>
          </DialogHeader>
          <form className="space-y-3 sm:space-y-4" onSubmit={handleFormSubmit}>
            <div>
              <label className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2 block">Ваше имя *</label>
              <Input 
                required 
                placeholder="Иван Иванов" 
                className="text-sm sm:text-base"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2 block">Контакт (email или телефон) *</label>
              <Input 
                required 
                placeholder="ivan@example.com" 
                className="text-sm sm:text-base"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2 block">Какая услуга вас интересует? *</label>
              <Select 
                required 
                value={formData.service}
                onValueChange={(value) => setFormData({ ...formData, service: value })}
              >
                <SelectTrigger className="text-sm sm:text-base">
                  <SelectValue placeholder="Выберите услугу" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="stickers">🎨 Стикеры</SelectItem>
                  <SelectItem value="neuro">📸 Нейрофотосессии</SelectItem>
                  <SelectItem value="full">💼 Полный пакет</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2 block">Сообщение</label>
              <Textarea 
                placeholder="Расскажите о вашем проекте..." 
                className="text-sm sm:text-base" 
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>
            <div className="flex items-start gap-2">
              <Checkbox 
                id="privacy" 
                checked={privacyAccepted}
                onCheckedChange={(checked) => setPrivacyAccepted(checked as boolean)}
              />
              <label htmlFor="privacy" className="text-xs sm:text-sm text-gray-600 cursor-pointer">
                Я согласен на{' '}
                <button
                  type="button"
                  className="text-primary underline hover:text-primary/80"
                  onClick={() => setPrivacyDialogOpen(true)}
                >
                  обработку персональных данных
                </button>
              </label>
            </div>
            <Button 
              type="submit" 
              className="w-full text-sm sm:text-base" 
              size="lg"
              disabled={isSubmitting || !privacyAccepted}
            >
              {isSubmitting ? 'Отправка...' : 'Отправить заявку'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Neuro Gallery Dialog */}
      <Dialog open={neuroGalleryOpen} onOpenChange={setNeuroGalleryOpen}>
        <DialogContent className="max-w-[100vw] sm:max-w-3xl h-[100dvh] sm:h-auto mx-0 sm:mx-4 p-0 sm:p-6 border-0 sm:border gap-0">
          <DialogHeader className="absolute top-0 left-0 right-0 z-30 bg-black/80 backdrop-blur-md p-3 sm:relative sm:bg-transparent sm:backdrop-blur-none sm:pb-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-sm sm:text-2xl text-white sm:text-foreground">📸 Нейрофотосессия</DialogTitle>
                <button
                  onClick={() => setNeuroGalleryOpen(false)}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all active:scale-90 touch-manipulation"
                >
                  <Icon name="X" size={20} className="text-white sm:text-foreground" />
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 sm:hidden">
                <div className="w-8 h-1 bg-white/30 rounded-full"></div>
                <p className="text-xs text-white/60">Свайп вверх/вниз для закрытия</p>
              </div>
            </div>
          </DialogHeader>
          <div className="relative flex-1 flex flex-col h-full">
            <div 
              className="relative w-full flex-1 overflow-hidden bg-black"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {neuroPhotos.map((photo, index) => (
                <img 
                  key={index}
                  src={photo.image} 
                  alt={photo.title}
                  loading="eager"
                  className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
                    index === currentNeuroIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                />
              ))}
              <button
                onClick={prevNeuroPhoto}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-16 h-16 sm:w-14 sm:h-14 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm active:scale-90 touch-manipulation z-20 shadow-lg"
              >
                <Icon name="ChevronLeft" size={32} />
              </button>
              <button
                onClick={nextNeuroPhoto}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-16 h-16 sm:w-14 sm:h-14 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm active:scale-90 touch-manipulation z-20 shadow-lg"
              >
                <Icon name="ChevronRight" size={32} />
              </button>
            </div>
            <div className="absolute bottom-16 sm:relative sm:bottom-auto left-0 right-0 z-30 bg-black/80 backdrop-blur-md p-2 sm:bg-transparent sm:backdrop-blur-none sm:mt-4 text-center space-y-1">
              <p className="text-xs sm:text-lg font-semibold text-white sm:text-foreground">{neuroPhotos[currentNeuroIndex].title}</p>
              <p className="text-xs sm:text-sm text-gray-300 sm:text-gray-500">{currentNeuroIndex + 1} / {neuroPhotos.length}</p>
            </div>
            <div className="absolute bottom-4 sm:relative sm:bottom-auto left-0 right-0 z-30 flex gap-1.5 sm:gap-2 justify-center sm:mt-4 flex-wrap px-4">
              {neuroPhotos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentNeuroIndex(index)}
                  className={`h-1.5 sm:h-3 rounded-full transition-all touch-manipulation active:scale-95 ${
                    index === currentNeuroIndex ? 'bg-white sm:bg-primary w-6 sm:w-10' : 'bg-white/50 sm:bg-gray-300 w-1.5 sm:w-3'
                  }`}
                />
              ))}
            </div>
          </div>
          <Button onClick={() => setNeuroGalleryOpen(false)} className="hidden sm:block w-full mt-4 text-sm sm:text-base">Закрыть</Button>
        </DialogContent>
      </Dialog>

      {/* Sticker Gallery Dialog */}
      <Dialog open={stickerGalleryOpen} onOpenChange={setStickerGalleryOpen}>
        <DialogContent className="max-w-[100vw] sm:max-w-3xl h-[100dvh] sm:h-auto mx-0 sm:mx-4 p-0 sm:p-6 border-0 sm:border gap-0">
          <DialogHeader className="absolute top-0 left-0 right-0 z-30 bg-black/80 backdrop-blur-md p-3 sm:relative sm:bg-transparent sm:backdrop-blur-none sm:pb-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-sm sm:text-2xl text-white sm:text-foreground">🎨 Брендовый стикерпак</DialogTitle>
                <button
                  onClick={() => setStickerGalleryOpen(false)}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all active:scale-90 touch-manipulation"
                >
                  <Icon name="X" size={20} className="text-white sm:text-foreground" />
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 sm:hidden">
                <div className="w-8 h-1 bg-white/30 rounded-full"></div>
                <p className="text-xs text-white/60">Свайп вверх/вниз для закрытия</p>
              </div>
            </div>
          </DialogHeader>
          <div className="relative flex-1 flex flex-col h-full">
            <div 
              className="relative w-full flex-1 overflow-hidden bg-gray-100"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleStickerTouchEnd}
            >
              {stickerPhotos.map((photo, index) => (
                <img 
                  key={index}
                  src={photo.image} 
                  alt={photo.title}
                  loading="eager"
                  className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
                    index === currentStickerIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                />
              ))}
              <button
                onClick={prevStickerPhoto}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-16 h-16 sm:w-14 sm:h-14 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm active:scale-90 touch-manipulation z-20 shadow-lg"
              >
                <Icon name="ChevronLeft" size={32} />
              </button>
              <button
                onClick={nextStickerPhoto}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-16 h-16 sm:w-14 sm:h-14 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm active:scale-90 touch-manipulation z-20 shadow-lg"
              >
                <Icon name="ChevronRight" size={32} />
              </button>
            </div>
            <div className="absolute bottom-16 sm:relative sm:bottom-auto left-0 right-0 z-30 bg-black/80 backdrop-blur-md p-2 sm:bg-transparent sm:backdrop-blur-none sm:mt-4 text-center space-y-1">
              <p className="text-xs sm:text-lg font-semibold text-white sm:text-foreground">{stickerPhotos[currentStickerIndex].title}</p>
              <p className="text-xs sm:text-sm text-gray-300 sm:text-gray-500">{currentStickerIndex + 1} / {stickerPhotos.length}</p>
            </div>
            <div className="absolute bottom-4 sm:relative sm:bottom-auto left-0 right-0 z-30 flex gap-1.5 sm:gap-2 justify-center sm:mt-4 px-4">
              {stickerPhotos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStickerIndex(index)}
                  className={`h-1.5 sm:h-3 rounded-full transition-all touch-manipulation active:scale-95 ${
                    index === currentStickerIndex ? 'bg-primary w-6 sm:w-10' : 'bg-gray-300 w-1.5 sm:w-3'
                  }`}
                />
              ))}
            </div>
          </div>
          <Button onClick={() => setStickerGalleryOpen(false)} className="hidden sm:block w-full mt-4 text-sm sm:text-base">Закрыть</Button>
        </DialogContent>
      </Dialog>

      {/* E-commerce Gallery Dialog */}
      <Dialog open={ecommerceGalleryOpen} onOpenChange={setEcommerceGalleryOpen}>
        <DialogContent className="max-w-[100vw] sm:max-w-3xl h-[100dvh] sm:h-auto mx-0 sm:mx-4 p-0 sm:p-6 border-0 sm:border gap-0">
          <DialogHeader className="absolute top-0 left-0 right-0 z-30 bg-black/80 backdrop-blur-md p-3 sm:relative sm:bg-transparent sm:backdrop-blur-none sm:pb-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-sm sm:text-2xl text-white sm:text-foreground">🛒 E-commerce фото</DialogTitle>
                <button
                  onClick={() => setEcommerceGalleryOpen(false)}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all active:scale-90 touch-manipulation"
                >
                  <Icon name="X" size={20} className="text-white sm:text-foreground" />
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 sm:hidden">
                <div className="w-8 h-1 bg-white/30 rounded-full"></div>
                <p className="text-xs text-white/60">Свайп вверх/вниз для закрытия</p>
              </div>
            </div>
          </DialogHeader>
          <div className="relative flex-1 flex flex-col h-full">
            <div 
              className="relative w-full flex-1 overflow-hidden bg-black"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleEcommerceTouchEnd}
            >
              {ecommercePhotos.map((photo, index) => (
                <img 
                  key={index}
                  src={photo.image} 
                  alt={photo.title}
                  loading="eager"
                  className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
                    index === currentEcommerceIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                />
              ))}
              <button
                onClick={prevEcommercePhoto}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-16 h-16 sm:w-14 sm:h-14 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm active:scale-90 touch-manipulation z-20 shadow-lg"
              >
                <Icon name="ChevronLeft" size={32} />
              </button>
              <button
                onClick={nextEcommercePhoto}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-16 h-16 sm:w-14 sm:h-14 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm active:scale-90 touch-manipulation z-20 shadow-lg"
              >
                <Icon name="ChevronRight" size={32} />
              </button>
            </div>
            <div className="absolute bottom-16 sm:relative sm:bottom-auto left-0 right-0 z-30 bg-black/80 backdrop-blur-md p-2 sm:bg-transparent sm:backdrop-blur-none sm:mt-4 text-center space-y-1">
              <p className="text-xs sm:text-lg font-semibold text-white sm:text-foreground">{ecommercePhotos[currentEcommerceIndex].title}</p>
              <p className="text-xs sm:text-sm text-gray-300 sm:text-gray-500">{currentEcommerceIndex + 1} / {ecommercePhotos.length}</p>
            </div>
            <div className="absolute bottom-4 sm:relative sm:bottom-auto left-0 right-0 z-30 flex gap-1.5 sm:gap-2 justify-center sm:mt-4 px-4">
              {ecommercePhotos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentEcommerceIndex(index)}
                  className={`h-1.5 sm:h-3 rounded-full transition-all touch-manipulation active:scale-95 ${
                    index === currentEcommerceIndex ? 'bg-white sm:bg-primary w-6 sm:w-10' : 'bg-white/50 sm:bg-gray-300 w-1.5 sm:w-3'
                  }`}
                />
              ))}
            </div>
          </div>
          <Button onClick={() => setEcommerceGalleryOpen(false)} className="hidden sm:block w-full mt-4 text-sm sm:text-base">Закрыть</Button>
        </DialogContent>
      </Dialog>

      {/* Fashion Gallery Dialog */}
      <Dialog open={fashionGalleryOpen} onOpenChange={setFashionGalleryOpen}>
        <DialogContent className="max-w-[100vw] sm:max-w-3xl h-[100dvh] sm:h-auto mx-0 sm:mx-4 p-0 sm:p-6 border-0 sm:border gap-0">
          <DialogHeader className="absolute top-0 left-0 right-0 z-30 bg-black/80 backdrop-blur-md p-3 sm:relative sm:bg-transparent sm:backdrop-blur-none sm:pb-2">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-sm sm:text-2xl text-white sm:text-foreground">👗 Fashion стикеры</DialogTitle>
                <button
                  onClick={() => setFashionGalleryOpen(false)}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all active:scale-90 touch-manipulation"
                >
                  <Icon name="X" size={20} className="text-white sm:text-foreground" />
                </button>
              </div>
              <div className="flex items-center justify-center gap-2 sm:hidden">
                <div className="w-8 h-1 bg-white/30 rounded-full"></div>
                <p className="text-xs text-white/60">Свайп вверх/вниз для закрытия</p>
              </div>
            </div>
          </DialogHeader>
          <div className="relative flex-1 flex flex-col h-full">
            <div 
              className="relative w-full flex-1 overflow-hidden bg-gray-100"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleFashionTouchEnd}
            >
              {fashionPhotos.map((photo, index) => (
                <img 
                  key={index}
                  src={photo.image} 
                  alt={photo.title}
                  loading="eager"
                  className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
                    index === currentFashionIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                />
              ))}
              <button
                onClick={prevFashionPhoto}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-16 h-16 sm:w-14 sm:h-14 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm active:scale-90 touch-manipulation z-20 shadow-lg"
              >
                <Icon name="ChevronLeft" size={32} />
              </button>
              <button
                onClick={nextFashionPhoto}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-16 h-16 sm:w-14 sm:h-14 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-sm active:scale-90 touch-manipulation z-20 shadow-lg"
              >
                <Icon name="ChevronRight" size={32} />
              </button>
            </div>
            <div className="absolute bottom-16 sm:relative sm:bottom-auto left-0 right-0 z-30 bg-black/80 backdrop-blur-md p-2 sm:bg-transparent sm:backdrop-blur-none sm:mt-4 text-center space-y-1">
              <p className="text-xs sm:text-lg font-semibold text-white sm:text-foreground">{fashionPhotos[currentFashionIndex].title}</p>
              <p className="text-xs sm:text-sm text-gray-300 sm:text-gray-500">{currentFashionIndex + 1} / {fashionPhotos.length}</p>
            </div>
            <div className="absolute bottom-4 sm:relative sm:bottom-auto left-0 right-0 z-30 flex gap-1.5 sm:gap-2 justify-center sm:mt-4 px-4">
              {fashionPhotos.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentFashionIndex(index)}
                  className={`h-1.5 sm:h-3 rounded-full transition-all touch-manipulation active:scale-95 ${
                    index === currentFashionIndex ? 'bg-primary w-6 sm:w-10' : 'bg-gray-300 w-1.5 sm:w-3'
                  }`}
                />
              ))}
            </div>
          </div>
          <Button onClick={() => setFashionGalleryOpen(false)} className="hidden sm:block w-full mt-4 text-sm sm:text-base">Закрыть</Button>
        </DialogContent>
      </Dialog>

      {/* Privacy Policy Dialog */}
      <Dialog open={privacyDialogOpen} onOpenChange={setPrivacyDialogOpen}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-2xl">Политика конфиденциальности и обработка персональных данных</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-sm text-gray-700">
            <section>
              <h3 className="font-bold text-base mb-2">1. Общие положения</h3>
              <p>Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей сайта vizi-stickers.ru (далее — Сайт).</p>
            </section>
            
            <section>
              <h3 className="font-bold text-base mb-2">2. Собираемые данные</h3>
              <p>При заполнении формы обратной связи мы собираем следующую информацию:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Имя и фамилия</li>
                <li>Контактные данные (email или телефон)</li>
                <li>Информация о запрашиваемых услугах</li>
                <li>Дополнительная информация, указанная в сообщении</li>
              </ul>
            </section>
            
            <section>
              <h3 className="font-bold text-base mb-2">3. Цели обработки данных</h3>
              <p>Ваши персональные данные используются исключительно для:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Обработки вашей заявки</li>
                <li>Связи с вами для уточнения деталей заказа</li>
                <li>Предоставления запрашиваемых услуг</li>
                <li>Улучшения качества обслуживания</li>
              </ul>
            </section>
            
            <section>
              <h3 className="font-bold text-base mb-2">4. Защита данных</h3>
              <p>Мы принимаем необходимые меры для защиты ваших персональных данных от несанкционированного доступа, изменения, раскрытия или уничтожения.</p>
            </section>
            
            <section>
              <h3 className="font-bold text-base mb-2">5. Передача данных третьим лицам</h3>
              <p>Мы не передаем ваши персональные данные третьим лицам, за исключением случаев, предусмотренных законодательством РФ.</p>
            </section>
            
            <section>
              <h3 className="font-bold text-base mb-2">6. Ваши права</h3>
              <p>Вы имеете право:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Получать информацию о обработке ваших данных</li>
                <li>Требовать исправления неточных данных</li>
                <li>Требовать удаления ваших данных</li>
                <li>Отозвать согласие на обработку данных</li>
              </ul>
            </section>
            
            <section>
              <h3 className="font-bold text-base mb-2">7. Контакты</h3>
              <p>По вопросам обработки персональных данных обращайтесь:</p>
              <p className="mt-2">
                Email: <a href="mailto:vizi-stickers@mail.ru" className="text-primary underline">vizi-stickers@mail.ru</a>
              </p>
            </section>
            
            <section>
              <h3 className="font-bold text-base mb-2">8. Согласие на обработку</h3>
              <p>Отправляя форму обратной связи, вы подтверждаете, что:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Ознакомились с настоящей Политикой конфиденциальности</li>
                <li>Даете согласие на обработку ваших персональных данных</li>
                <li>Понимаете цели обработки данных</li>
              </ul>
            </section>
          </div>
          <Button onClick={() => setPrivacyDialogOpen(false)} className="w-full mt-4">Закрыть</Button>
        </DialogContent>
      </Dialog>

      {/* Footer with Privacy Link */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-gray-400 mb-4">
            <p>© 2024 Vizi Studio. Все права защищены.</p>
            <span className="hidden sm:inline">•</span>
            <button
              onClick={() => setPrivacyDialogOpen(true)}
              className="text-gray-400 hover:text-white underline transition-colors"
            >
              Политика конфиденциальности
            </button>
            <span className="hidden sm:inline">•</span>
            <a href="mailto:vizi-stickers@mail.ru" className="text-gray-400 hover:text-white transition-colors">
              vizi-stickers@mail.ru
            </a>
          </div>
          <p className="text-xs text-gray-500 max-w-3xl mx-auto">
            * Instagram и Facebook принадлежат компании Meta Platforms Inc., которая признана экстремистской организацией и запрещена на территории Российской Федерации
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;