import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';
import funcUrls from '../../../backend/func2url.json';

interface ContactSectionProps {
  t: {
    faq: {
      title: string;
      subtitle: string;
      items: Array<{ question: string; answer: string }>;
    };
    contact: { title: string; subtitle: string };
    form: {
      name: string;
      namePlaceholder: string;
      contact: string;
      contactPlaceholder: string;
      service: string;
      servicePlaceholder: string;
      message: string;
      messagePlaceholder: string;
      privacy: string;
      privacyLink: string;
      submit: string;
      submitting: string;
      successTitle: string;
      successDescription: string;
      errorTitle: string;
      errorDescription: string;
    };
    privacy: {
      title: string;
      content: string;
    };
    footer: {
      description: string;
      links: string;
      portfolio: string;
      reviews: string;
      faq: string;
      contact: string;
      followUs: string;
      rights: string;
    };
  };
  formOpen: boolean;
  setFormOpen: (open: boolean) => void;
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  showViziHint: boolean;
}

export default function ContactSection({ 
  t, 
  formOpen, 
  setFormOpen, 
  chatOpen, 
  setChatOpen, 
  showViziHint 
}: ContactSectionProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({ name: '', contact: '', service: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [privacyDialogOpen, setPrivacyDialogOpen] = useState(false);

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
          title: t.form.successTitle,
          description: t.form.successDescription,
        });
        setFormData({ name: '', contact: '', service: '', message: '' });
        setPrivacyAccepted(false);
        setFormOpen(false);
      } else {
        toast({
          title: t.form.errorTitle,
          description: result.error || t.form.errorDescription,
          variant: 'destructive'
        });
      }
    } catch (error: unknown) {
      toast({
        title: t.form.errorTitle,
        description: t.form.errorDescription,
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <section id="faq" className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t.faq.title}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.faq.subtitle}</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              {t.faq.items.map((item, i) => (
                <AccordionItem 
                  key={i} 
                  value={`item-${i}`}
                  className="border border-primary/20 rounded-lg px-6 bg-background/50 backdrop-blur"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4">
                    <span className="font-semibold">{item.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-4">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      <section id="contact" className="py-24 bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t.contact.title}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{t.contact.subtitle}</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="border-primary/20 shadow-xl">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                  {[
                    { icon: 'Mail', title: 'Email', value: 'vizi-stickers@mail.ru', link: 'mailto:vizi-stickers@mail.ru' },
                    { icon: 'MessageCircle', title: 'Telegram', value: '@vizi_stickers', link: 'https://t.me/vizi_stickers' }
                  ].map((contact, i) => (
                    <a 
                      key={i} 
                      href={contact.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start space-x-4 p-4 rounded-lg border border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                    >
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                        <Icon name={contact.icon as "Mail" | "MessageCircle"} size={20} className="text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{contact.title}</h4>
                        <p className="text-sm text-muted-foreground">{contact.value}</p>
                      </div>
                    </a>
                  ))}
                </div>

                <Button 
                  onClick={() => setFormOpen(true)} 
                  className="w-full shadow-lg hover:shadow-xl transition-all text-lg py-6"
                >
                  <Icon name="Send" size={20} className="mr-2" />
                  Оставить заявку
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <footer className="bg-muted/30 border-t border-border/50 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🐱</span>
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  Vizi
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{t.footer.description}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t.footer.links}</h4>
              <div className="space-y-2">
                <button onClick={() => scrollToSection('portfolio')} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t.footer.portfolio}</button>
                <button onClick={() => scrollToSection('reviews')} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t.footer.reviews}</button>
                <button onClick={() => scrollToSection('faq')} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t.footer.faq}</button>
                <button onClick={() => scrollToSection('contact')} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{t.footer.contact}</button>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-4">{t.footer.followUs}</h4>
              <div className="flex space-x-3">
                <a href="https://t.me/vizi_stickers" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <Icon name="Send" size={18} className="text-primary" />
                </a>
                <a href="mailto:vizi-stickers@mail.ru" className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition-colors">
                  <Icon name="Mail" size={18} className="text-primary" />
                </a>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground">{t.footer.rights}</p>
          </div>
        </div>
      </footer>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Оставить заявку</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">{t.form.name}</label>
              <Input 
                placeholder={t.form.namePlaceholder}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">{t.form.contact}</label>
              <Input 
                placeholder={t.form.contactPlaceholder}
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">{t.form.service}</label>
              <Select value={formData.service} onValueChange={(value) => setFormData({ ...formData, service: value })} required>
                <SelectTrigger>
                  <SelectValue placeholder={t.form.servicePlaceholder} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Нейрофотосессия">Нейрофотосессия</SelectItem>
                  <SelectItem value="Стикеры">Стикеры</SelectItem>
                  <SelectItem value="Фото товаров">Фото товаров</SelectItem>
                  <SelectItem value="Fashion стикеры">Fashion стикеры</SelectItem>
                  <SelectItem value="Другое">Другое</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">{t.form.message}</label>
              <Textarea 
                placeholder={t.form.messagePlaceholder}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={4}
              />
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox 
                id="privacy" 
                checked={privacyAccepted}
                onCheckedChange={(checked) => setPrivacyAccepted(checked === true)}
                required
              />
              <label htmlFor="privacy" className="text-sm text-muted-foreground leading-tight">
                {t.form.privacy}{' '}
                <button 
                  type="button"
                  onClick={() => setPrivacyDialogOpen(true)}
                  className="text-primary hover:underline"
                >
                  {t.form.privacyLink}
                </button>
              </label>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting || !privacyAccepted}>
              {isSubmitting ? t.form.submitting : t.form.submit}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={privacyDialogOpen} onOpenChange={setPrivacyDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t.privacy.title}</DialogTitle>
          </DialogHeader>
          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground whitespace-pre-line">{t.privacy.content}</p>
          </div>
        </DialogContent>
      </Dialog>

      {chatOpen && (
        <Card className="fixed bottom-24 right-6 w-80 sm:w-96 shadow-2xl border-primary/20 z-50 animate-slide-up">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-xl">🐱</span>
                </div>
                <div>
                  <h4 className="font-semibold">Vizi</h4>
                  <p className="text-xs text-muted-foreground">Всегда на связи</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setChatOpen(false)}>
                <Icon name="X" size={18} />
              </Button>
            </div>

            {showViziHint && (
              <div className="mb-4 p-3 bg-primary/5 rounded-lg border border-primary/20 animate-fade-in">
                <p className="text-sm text-muted-foreground">
                  Привет! 👋 Напиши мне в Telegram <a href="https://t.me/vizi_stickers" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@vizi_stickers</a> или оставь заявку на сайте!
                </p>
              </div>
            )}

            <div className="space-y-3">
              <a 
                href="https://t.me/vizi_stickers" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-3 p-3 rounded-lg border border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <Icon name="Send" size={20} className="text-primary" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Telegram</p>
                  <p className="text-xs text-muted-foreground">@vizi_stickers</p>
                </div>
                <Icon name="ExternalLink" size={16} className="text-muted-foreground" />
              </a>

              <a 
                href="mailto:vizi-stickers@mail.ru"
                className="flex items-center space-x-3 p-3 rounded-lg border border-primary/20 hover:border-primary/50 hover:bg-primary/5 transition-all"
              >
                <Icon name="Mail" size={20} className="text-primary" />
                <div className="flex-1">
                  <p className="font-medium text-sm">Email</p>
                  <p className="text-xs text-muted-foreground">vizi-stickers@mail.ru</p>
                </div>
                <Icon name="ExternalLink" size={16} className="text-muted-foreground" />
              </a>

              <Button 
                onClick={() => {
                  setFormOpen(true);
                  setChatOpen(false);
                }}
                className="w-full"
                variant="outline"
              >
                Оставить заявку
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
