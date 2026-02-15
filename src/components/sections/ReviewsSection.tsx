import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface ReviewsSectionProps {
  t: {
    reviews: {
      title: string;
      subtitle: string;
    };
  };
}

export default function ReviewsSection({ t }: ReviewsSectionProps) {
  const [currentReview, setCurrentReview] = useState(0);

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  return (
    <section id="reviews" className="py-24 bg-gradient-to-br from-primary/5 via-background to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t.reviews.title}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.reviews.subtitle}</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Card className="border-primary/20 shadow-xl bg-background/80 backdrop-blur">
              <CardContent className="p-8 sm:p-12">
                <div className="flex items-start space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon name="User" size={24} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-bold text-lg">{reviews[currentReview].author}</h4>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{reviews[currentReview].role}</span>
                    </div>
                    <div className="flex space-x-1 mb-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Icon 
                          key={i} 
                          name={i < reviews[currentReview].rating ? "Star" : "Star"} 
                          size={16} 
                          className={i < reviews[currentReview].rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} 
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <blockquote className="text-lg text-muted-foreground mb-6 leading-relaxed animate-fade-in">
                  "{reviews[currentReview].quote}"
                </blockquote>

                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">🐱</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-primary mb-1">Vizi:</p>
                      <p className="text-sm text-muted-foreground">{reviews[currentReview].comment}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-center items-center space-x-4 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length)}
                className="rounded-full"
              >
                <Icon name="ChevronLeft" size={20} />
              </Button>

              <div className="flex space-x-2">
                {reviews.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentReview(i)}
                    className={`h-2 rounded-full transition-all ${
                      i === currentReview ? 'w-8 bg-primary' : 'w-2 bg-muted'
                    }`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={() => setCurrentReview((prev) => (prev + 1) % reviews.length)}
                className="rounded-full"
              >
                <Icon name="ChevronRight" size={20} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
