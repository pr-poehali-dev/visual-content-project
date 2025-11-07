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
import Icon from '@/components/ui/icon';

const Index = () => {
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [photos, setPhotos] = useState([50]);
  const [stickers, setStickers] = useState([20]);
  const [revisions, setRevisions] = useState([5]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentReview, setCurrentReview] = useState(0);
  const [chatOpen, setChatOpen] = useState(false);
  const [showViziHint, setShowViziHint] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const quizQuestions = [
    {
      question: 'Где ваша аудитория?',
      options: ['Telegram', 'VK', 'Instagram', 'Везде'],
      reactions: {
        'Telegram': 'Круто! Там огромное сообщество! 🚀',
        'VK': 'ВК — мощная платформа! 💪',
        'Instagram': 'Визуал в Инстаграме королевствует! 👑',
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
    { quote: 'Охват +250%, и это за месяц!', author: 'Анна', role: 'Fashion бренд', comment: 'Анна теперь постоянный клиент! 😊' },
    { quote: 'Экономия 40К, результат за 2 дня', author: 'Дмитрий', role: 'Маркетолог', comment: 'Дмитрий привёл ещё 3 клиентов! 🙌' },
    { quote: 'Стикеры прямо отпадные!', author: 'София', role: 'Блогер (187К подписчиков)', comment: 'София делится везде! 🔥' }
  ];

  const portfolio = [
    { category: 'stickers', emoji: '🎨', title: 'Брендовый стикерпак', gradient: 'from-red-400 to-orange-400', image: 'https://cdn.poehali.dev/projects/a4b74196-9d6f-4de8-becb-0795012f6edd/files/b19a4884-4d74-495c-8df5-481e8b5d684f.jpg' },
    { category: 'neuro', emoji: '📸', title: 'Нейрофотосессия', gradient: 'from-teal-400 to-cyan-500', image: 'https://cdn.poehali.dev/projects/a4b74196-9d6f-4de8-becb-0795012f6edd/files/2662295c-14dd-4a8b-89af-55fa1e804858.jpg' },
    { category: 'fashion', emoji: '👗', title: 'Fashion стикеры', gradient: 'from-emerald-400 to-teal-400', image: 'https://cdn.poehali.dev/projects/a4b74196-9d6f-4de8-becb-0795012f6edd/files/27e6b5e9-f2c8-4456-ac38-68f3c707c5c0.jpg' },
    { category: 'stickers', emoji: '✨', title: 'Премиум пакет', gradient: 'from-yellow-500 to-orange-500', image: 'https://cdn.poehali.dev/projects/a4b74196-9d6f-4de8-becb-0795012f6edd/files/b588faf7-e0bd-4817-9163-e615929da64e.jpg' },
    { category: 'ecommerce', emoji: '🛒', title: 'E-commerce фото', gradient: 'from-indigo-500 to-blue-600', image: 'https://cdn.poehali.dev/projects/a4b74196-9d6f-4de8-becb-0795012f6edd/files/9956dca4-9d62-4780-b348-3b20fc9448d1.jpg' },
    { category: 'neuro', emoji: '🎯', title: 'Нейропортрет', gradient: 'from-purple-500 to-violet-600', image: 'https://cdn.poehali.dev/projects/a4b74196-9d6f-4de8-becb-0795012f6edd/files/e5ef606d-7df8-42b2-9bdc-8b02d3b09783.jpg' }
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

  const tradCost = photos[0] * 1500 + stickers[0] * 2000 + revisions[0] * 500;
  const neuroCost = Math.round((photos[0] * 50 + stickers[0] * 200) * 1.2);
  const savings = tradCost - neuroCost;

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const filteredPortfolio = activeFilter === 'all' 
    ? portfolio 
    : portfolio.filter(item => item.category === activeFilter || item.category === 'all');

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowViziHint(true);
    }, 20000);

    return () => clearTimeout(timer);
  }, []);

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
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>
        
        <div className="container mx-auto px-4 text-center z-10 animate-fade-in">
          <div className="text-6xl sm:text-8xl mb-4 sm:mb-6 animate-bounce">😼</div>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold mb-3 sm:mb-6 px-2">Привет! Я Визи 👋</h1>
          <p className="text-base sm:text-xl md:text-2xl mb-6 sm:mb-12 opacity-95 max-w-2xl mx-auto px-2">
            Помогаю брендам создавать контент, который запоминают и используют!
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 max-w-2xl mx-auto px-2">
            <Button size="lg" className="button-pulse bg-white text-gray-900 hover:bg-purple-400 hover:text-white hover-scale shadow-lg shadow-purple-500/50 hover:shadow-purple-400/80 hover:shadow-2xl font-bold text-sm sm:text-base py-3 sm:py-4 transition-all duration-300" onClick={() => scrollToSection('portfolio')}>
              <Icon name="Palette" className="mr-1 sm:mr-2" size={18} /> Брендовые стикеры
            </Button>
            <Button size="lg" className="button-pulse bg-white text-gray-900 hover:bg-purple-400 hover:text-white hover-scale shadow-lg shadow-purple-500/50 hover:shadow-purple-400/80 hover:shadow-2xl font-bold text-sm sm:text-base py-3 sm:py-4 transition-all duration-300" onClick={() => scrollToSection('portfolio')}>
              <Icon name="Camera" className="mr-1 sm:mr-2" size={18} /> AI-фотосессии
            </Button>
            <Button size="lg" variant="outline" className="button-pulse border-2 border-white text-white bg-white/10 backdrop-blur hover:bg-white hover:text-gray-900 hover-scale hover:shadow-2xl hover:shadow-white/50 font-bold text-sm sm:text-base py-3 sm:py-4 transition-all duration-300" onClick={() => scrollToSection('calculator')}>
              <Icon name="Calculator" className="mr-1 sm:mr-2" size={18} /> Рассчитать
            </Button>
            <Button size="lg" variant="outline" className="button-pulse border-2 border-white text-white bg-white/10 backdrop-blur hover:bg-white hover:text-gray-900 hover-scale hover:shadow-2xl hover:shadow-white/50 font-bold text-sm sm:text-base py-3 sm:py-4 transition-all duration-300" onClick={() => scrollToSection('portfolio')}>
              <Icon name="Sparkles" className="mr-1 sm:mr-2" size={18} /> Примеры
            </Button>
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <section id="quiz" className="py-8 sm:py-20 container mx-auto px-4">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-center mb-6 sm:mb-16 px-2">Давайте найдём ваше идеальное решение 🎯</h2>
        
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
              
              <h3 className="text-lg sm:text-2xl font-bold text-center mb-4 sm:mb-8">{quizQuestions[quizStep].question}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                {quizQuestions[quizStep].options.map((option) => (
                  <Button
                    key={option}
                    variant="outline"
                    size="lg"
                    className="h-auto py-4 sm:py-6 text-base sm:text-lg hover:border-primary hover:bg-primary hover:text-white hover-scale"
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
      <section id="calculator" className="py-8 sm:py-20 bg-secondary/5">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-center mb-6 sm:mb-16 px-2">Сколько вы экономите? 💰</h2>
          
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-4 sm:p-8">
              <div className="space-y-8 mb-8">
                <div>
                  <div className="flex justify-between mb-4">
                    <span className="font-semibold">📸 Количество фото</span>
                    <Badge variant="secondary" className="text-lg">{photos[0]}</Badge>
                  </div>
                  <Slider value={photos} onValueChange={setPhotos} min={10} max={100} step={1} />
                </div>
                
                <div>
                  <div className="flex justify-between mb-4">
                    <span className="font-semibold">🎨 Стикеров в паке</span>
                    <Badge variant="secondary" className="text-lg">{stickers[0]}</Badge>
                  </div>
                  <Slider value={stickers} onValueChange={setStickers} min={10} max={30} step={1} />
                </div>
                
                <div>
                  <div className="flex justify-between mb-4">
                    <span className="font-semibold">🔄 Правок</span>
                    <Badge variant="secondary" className="text-lg">{revisions[0]}</Badge>
                  </div>
                  <Slider value={revisions} onValueChange={setRevisions} min={1} max={10} step={1} />
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                <Card className="border-red-300 bg-red-50">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-lg mb-4">📷 Традиционная фотосессия</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>Стоимость:</span><span className="font-bold">{tradCost.toLocaleString('ru-RU')}₽</span></div>
                      <div className="flex justify-between"><span>Время:</span><span>14 дней</span></div>
                      <div className="flex justify-between"><span>Вариантов:</span><span>{photos[0] + stickers[0]}</span></div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-green-300 bg-green-50">
                  <CardContent className="p-6">
                    <h4 className="font-bold text-lg mb-4">🤖 С нами (Нейрофото + стикеры)</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span>Стоимость:</span><span className="font-bold">{neuroCost.toLocaleString('ru-RU')}₽</span></div>
                      <div className="flex justify-between"><span>Время:</span><span>2 дня</span></div>
                      <div className="flex justify-between"><span>Вариантов:</span><span>{photos[0] * 2 + stickers[0] * 3}</span></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card className="bg-gradient-to-r from-green-500 to-cyan-500 text-white text-center">
                <CardContent className="p-4 sm:p-8">
                  <p className="text-base sm:text-lg mb-2">Вы экономите:</p>
                  <p className="text-3xl sm:text-5xl font-bold mb-3 sm:mb-4">{savings.toLocaleString('ru-RU')}₽</p>
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
      <section id="portfolio" className="py-8 sm:py-20 container mx-auto px-4">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-center mb-6 sm:mb-12 px-2">Вот что мы создали 🎨</h2>
        
        <div className="flex flex-wrap gap-2 justify-center mb-6 sm:mb-12 px-2">
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {filteredPortfolio.map((item, index) => (
            <Card key={index} className="group cursor-pointer overflow-hidden hover-scale">
              <div className="h-48 sm:h-64 relative">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-primary/90 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-6">
                  <p className="text-xl font-bold mb-4">{item.title}</p>
                  <Button variant="secondary" size="sm">Подробнее</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-8 sm:py-20 bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-center mb-6 sm:mb-16 px-2">Что говорят клиенты ⭐</h2>
          
          <Card className="max-w-3xl mx-auto bg-white/10 backdrop-blur border-white/20">
            <CardContent className="p-4 sm:p-12 text-center">
              <p className="text-lg sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-6">"{reviews[currentReview].quote}"</p>
              <p className="text-base sm:text-xl font-semibold mb-1 sm:mb-2">{reviews[currentReview].author}</p>
              <p className="text-sm sm:text-lg opacity-90 mb-3 sm:mb-4">{reviews[currentReview].role}</p>
              <p className="text-xl sm:text-2xl mb-4 sm:mb-6">⭐⭐⭐⭐⭐</p>
              
              <Card className="bg-white/20 border-white/30">
                <CardContent className="p-3 sm:p-4 flex items-center gap-2 sm:gap-4">
                  <span className="text-2xl sm:text-4xl">😼</span>
                  <p className="text-sm sm:text-base">{reviews[currentReview].comment}</p>
                </CardContent>
              </Card>
              
              <div className="flex justify-center gap-2 mt-4 sm:mt-8">
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
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-8 sm:py-20 container mx-auto px-4">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-center mb-6 sm:mb-16 px-2">Часто задаваемые вопросы ❓</h2>
        
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
      <section className="py-20 bg-gradient-to-br from-primary via-purple-600 to-violet-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <div className="text-6xl mb-6">😼</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-4">Готовы создать контент, который выделит вас?</h2>
          <p className="text-lg sm:text-xl mb-8 sm:mb-12 opacity-95 px-4">Присоединяйтесь к 89+ брендам, которые уже получают результаты</p>
          
          <div className="flex flex-wrap gap-4 sm:gap-6 justify-center mb-8 sm:mb-12 px-4">
            <div className="flex items-center gap-3">
              <Icon name="CheckCircle2" size={28} />
              <span className="text-base sm:text-lg">Экономия 90% бюджета</span>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="CheckCircle2" size={28} />
              <span className="text-base sm:text-lg">Готово за 48 часов</span>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="CheckCircle2" size={28} />
              <span className="text-base sm:text-lg">Гарантия результата</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-3 sm:gap-4 justify-center mb-6 sm:mb-8 px-4">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100 hover-scale" onClick={() => setFormOpen(true)}>
              Начать прямо сейчас
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/20 hover-scale" onClick={() => setChatOpen(true)}>
              Поговорить с Визи
            </Button>
          </div>
          
          <Card className="max-w-2xl mx-auto bg-white/20 border-white/30">
            <CardContent className="p-6">
              <p className="text-lg font-semibold mb-2">🔥 Осталось 3 слота по спеццене этого месяца</p>
              <p className="text-sm opacity-90">Не упустите шанс! Завтра может быть поздно!</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Chat Widget */}
      <div className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-50 vizi-float">
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
            className="w-full h-full object-cover scale-110 vizi-neon"
          />
        </div>
        
        {showViziHint && !chatOpen && (
          <div className="absolute bottom-24 left-0 w-64 bg-white rounded-lg shadow-2xl p-4 animate-scale-in border-2 border-purple-400">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 vizi-cyber-glow">
                <img 
                  src="https://cdn.poehali.dev/files/ce7f214b-3425-4422-9d1d-7945d8bc7da3.jpeg"
                  alt="Визи"
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
          <Card className="absolute bottom-24 left-0 w-80 shadow-2xl animate-scale-in">
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
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => window.open('https://t.me/vizi_stickers_bot', '_blank')}>
                    💰 Сколько стоит?
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => scrollToSection('portfolio')}>
                    🎨 Примеры работ
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => window.open('https://t.me/vizi_stickers_bot', '_blank')}>
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
          <form className="space-y-3 sm:space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Спасибо! Мы свяжемся с вами в ближайшее время'); setFormOpen(false); }}>
            <div>
              <label className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2 block">Ваше имя *</label>
              <Input required placeholder="Иван Иванов" className="text-sm sm:text-base" />
            </div>
            <div>
              <label className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2 block">Контакт (email или телефон) *</label>
              <Input required placeholder="ivan@example.com" className="text-sm sm:text-base" />
            </div>
            <div>
              <label className="text-xs sm:text-sm font-semibold mb-1 sm:mb-2 block">Какая услуга вас интересует? *</label>
              <Select required>
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
              <Textarea placeholder="Расскажите о вашем проекте..." className="text-sm sm:text-base" rows={3} />
            </div>
            <Button type="submit" className="w-full text-sm sm:text-base" size="lg">Отправить заявку</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;