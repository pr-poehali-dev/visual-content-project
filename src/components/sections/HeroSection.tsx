import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import LanguageSwitcher from '@/components/LanguageSwitcher';

interface Translation {
  nav: { portfolio: string; reviews: string; faq: string; contact: string; order: string };
  hero: { badge: string; title: string; subtitle: string; cta: string; portfolio: string };
  stats: { clients: string; projects: string; delivery: string; rating: string };
  quiz: {
    title: string;
    subtitle: string;
    step: string;
    complete: string;
    completeText: string;
    question1: string;
    question2: string;
    question3: string;
    options1: string[];
    options2: string[];
    options3: string[];
    reactions1: string[];
    reactions2: string[];
    reactions3: string[];
  };
}

interface HeroSectionProps {
  language: 'ru' | 'en';
  setLanguage: (lang: 'ru' | 'en') => void;
  t: Translation;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  setFormOpen: (open: boolean) => void;
  setChatOpen: (open: boolean) => void;
  chatOpen: boolean;
  setShowViziHint: (show: boolean) => void;
}

export default function HeroSection({
  language,
  setLanguage,
  t,
  mobileMenuOpen,
  setMobileMenuOpen,
  setFormOpen,
  setChatOpen,
  chatOpen,
  setShowViziHint
}: HeroSectionProps) {
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [photos, setPhotos] = useState([0]);
  const [stickers, setStickers] = useState([0]);

  const quizQuestions = [
    {
      question: t.quiz.question1,
      options: t.quiz.options1,
      reactions: t.quiz.reactions1
    },
    {
      question: t.quiz.question2,
      options: t.quiz.options2,
      reactions: t.quiz.reactions2
    },
    {
      question: t.quiz.question3,
      options: t.quiz.options3,
      reactions: t.quiz.reactions3
    }
  ];

  const handleAnswer = (answer: string) => {
    setQuizAnswers({ ...quizAnswers, [quizStep]: answer });
    if (quizStep === 0) {
      if (answer === t.quiz.options1[0]) setPhotos([0]);
      else if (answer === t.quiz.options1[1]) setStickers([0]);
      else { setPhotos([0]); setStickers([0]); }
    }
    setTimeout(() => {
      if (quizStep < quizQuestions.length - 1) {
        setQuizStep(quizStep + 1);
      } else {
        setQuizStep(-1);
        setFormOpen(true);
      }
    }, 1500);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAzNmMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIGZpbGw9ImhzbCh2YXIoLS1wcmltYXJ5KSkiIGZpbGwtb3BhY2l0eT0iLjAzIi8+PC9nPjwvc3ZnPg==')] opacity-40"></div>

      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                <span className="text-2xl">🐱</span>
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Vizi
              </span>
            </div>

            <nav className="hidden md:flex items-center space-x-6">
              <button onClick={() => scrollToSection('portfolio')} className="text-muted-foreground hover:text-foreground transition-colors font-medium">{t.nav.portfolio}</button>
              <button onClick={() => scrollToSection('reviews')} className="text-muted-foreground hover:text-foreground transition-colors font-medium">{t.nav.reviews}</button>
              <button onClick={() => scrollToSection('faq')} className="text-muted-foreground hover:text-foreground transition-colors font-medium">{t.nav.faq}</button>
              <button onClick={() => scrollToSection('contact')} className="text-muted-foreground hover:text-foreground transition-colors font-medium">{t.nav.contact}</button>
              <LanguageSwitcher language={language} setLanguage={setLanguage} />
              <Button onClick={() => setFormOpen(true)} className="shadow-lg hover:shadow-xl transition-all">
                {t.nav.order}
              </Button>
            </nav>

            <div className="flex md:hidden items-center space-x-2">
              <LanguageSwitcher language={language} setLanguage={setLanguage} />
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Icon name={mobileMenuOpen ? "X" : "Menu"} size={24} />
              </Button>
            </div>
          </div>

          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 flex flex-col space-y-3 border-t border-border/50 pt-4">
              <button onClick={() => scrollToSection('portfolio')} className="text-left text-muted-foreground hover:text-foreground transition-colors font-medium">{t.nav.portfolio}</button>
              <button onClick={() => scrollToSection('reviews')} className="text-left text-muted-foreground hover:text-foreground transition-colors font-medium">{t.nav.reviews}</button>
              <button onClick={() => scrollToSection('faq')} className="text-left text-muted-foreground hover:text-foreground transition-colors font-medium">{t.nav.faq}</button>
              <button onClick={() => scrollToSection('contact')} className="text-left text-muted-foreground hover:text-foreground transition-colors font-medium">{t.nav.contact}</button>
              <Button onClick={() => { setFormOpen(true); setMobileMenuOpen(false); }} className="w-full shadow-lg">
                {t.nav.order}
              </Button>
            </nav>
          )}
        </div>
      </header>

      <main className="relative z-10">
        <section className="container mx-auto px-4 pt-16 pb-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20 animate-fade-in">
              <Icon name="Sparkles" size={18} className="text-primary" />
              <span className="text-sm font-medium text-primary">{t.hero.badge}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight animate-slide-up">
              {t.hero.title}
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
              {t.hero.subtitle}
            </p>

            <div className="flex flex-wrap gap-4 justify-center items-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Button size="lg" onClick={() => setFormOpen(true)} className="shadow-xl hover:shadow-2xl transition-all text-lg">
                {t.hero.cta}
                <Icon name="ArrowRight" size={20} className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => scrollToSection('portfolio')} className="text-lg">
                {t.hero.portfolio}
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto pt-12 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              {[
                { icon: 'Users', value: '500+', label: t.stats.clients },
                { icon: 'Image', value: '2000+', label: t.stats.projects },
                { icon: 'Clock', value: '24-48h', label: t.stats.delivery },
                { icon: 'Star', value: '4.9/5', label: t.stats.rating }
              ].map((stat, i) => (
                <Card key={i} className="border-primary/20 bg-background/50 backdrop-blur hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="p-6 text-center">
                    <Icon name={stat.icon as "Users" | "Image" | "Clock" | "Star"} size={24} className="mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 pb-24">
          <Card className="max-w-2xl mx-auto shadow-2xl border-primary/20 animate-slide-up" style={{ animationDelay: '0.4s' }}>
            <CardContent className="p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon name="MessageCircle" size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">{t.quiz.title}</h3>
                  <p className="text-sm text-muted-foreground">{t.quiz.subtitle}</p>
                </div>
              </div>

              {quizStep >= 0 && quizStep < quizQuestions.length ? (
                <div className="space-y-6 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">{t.quiz.step} {quizStep + 1}/3</span>
                    <div className="flex space-x-1">
                      {quizQuestions.map((_, i) => (
                        <div key={i} className={`h-2 w-8 rounded-full transition-all ${i <= quizStep ? 'bg-primary' : 'bg-muted'}`} />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold mb-4">{quizQuestions[quizStep].question}</h4>
                    <div className="space-y-3">
                      {quizQuestions[quizStep].options.map((option, i) => (
                        <Button
                          key={i}
                          variant="outline"
                          className={`w-full justify-start text-left h-auto py-4 px-4 transition-all hover:border-primary hover:bg-primary/5 ${quizAnswers[quizStep] === option ? 'border-primary bg-primary/10' : ''}`}
                          onClick={() => handleAnswer(option)}
                          disabled={!!quizAnswers[quizStep]}
                        >
                          <span className="mr-3 text-lg">{['🎨', '✨', '🚀'][i]}</span>
                          <span className="flex-1">{option}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  {quizAnswers[quizStep] && (
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 animate-slide-up">
                      <div className="flex items-start space-x-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-lg">🐱</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-primary mb-1">Vizi:</p>
                          <p className="text-sm text-muted-foreground">
                            {quizQuestions[quizStep].reactions[quizQuestions[quizStep].options.indexOf(quizAnswers[quizStep])]}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : quizStep === -1 ? (
                <div className="text-center space-y-4 animate-fade-in">
                  <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto">
                    <Icon name="CheckCircle" size={32} className="text-green-500" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold mb-2">{t.quiz.complete}</h4>
                    <p className="text-muted-foreground">{t.quiz.completeText}</p>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </section>
      </main>

      <button
        onClick={() => {
          setChatOpen(!chatOpen);
          if (!chatOpen) {
            setTimeout(() => setShowViziHint(true), 500);
            setTimeout(() => setShowViziHint(false), 5000);
          }
        }}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 text-white shadow-2xl hover:shadow-3xl transition-all hover:scale-110 z-50 flex items-center justify-center"
      >
        <Icon name={chatOpen ? "X" : "MessageCircle"} size={28} />
      </button>
    </div>
  );
}