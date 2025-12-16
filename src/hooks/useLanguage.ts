import { useState, useEffect } from 'react';
import { Language, translations } from '@/i18n/translations';

export const useLanguage = () => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved === 'en' || saved === 'ru') ? saved : 'ru';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = translations[language];

  return { language, setLanguage, t };
};
