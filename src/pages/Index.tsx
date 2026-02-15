import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';
import HeroSection from '@/components/sections/HeroSection';
import PortfolioSection from '@/components/sections/PortfolioSection';
import ReviewsSection from '@/components/sections/ReviewsSection';
import ContactSection from '@/components/sections/ContactSection';

const Index = () => {
  const { language, setLanguage, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [showViziHint, setShowViziHint] = useState(false);

  return (
    <>
      <HeroSection
        language={language}
        setLanguage={setLanguage}
        t={t}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        setFormOpen={setFormOpen}
        setChatOpen={setChatOpen}
        chatOpen={chatOpen}
        setShowViziHint={setShowViziHint}
      />

      <PortfolioSection t={t} />

      <ReviewsSection t={t} />

      <ContactSection
        t={t}
        formOpen={formOpen}
        setFormOpen={setFormOpen}
        chatOpen={chatOpen}
        setChatOpen={setChatOpen}
        showViziHint={showViziHint}
      />
    </>
  );
};

export default Index;
