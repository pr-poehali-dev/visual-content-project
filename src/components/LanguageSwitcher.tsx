import { Button } from '@/components/ui/button';
import { Language } from '@/i18n/translations';

interface LanguageSwitcherProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
}

const LanguageSwitcher = ({ currentLanguage, onLanguageChange }: LanguageSwitcherProps) => {
  return (
    <div className="fixed top-4 left-4 z-50 flex gap-2">
      <Button
        size="sm"
        variant={currentLanguage === 'ru' ? 'default' : 'outline'}
        onClick={() => onLanguageChange('ru')}
        className="font-semibold"
      >
        🇷🇺 RU
      </Button>
      <Button
        size="sm"
        variant={currentLanguage === 'en' ? 'default' : 'outline'}
        onClick={() => onLanguageChange('en')}
        className="font-semibold"
      >
        🇬🇧 EN
      </Button>
    </div>
  );
};

export default LanguageSwitcher;
