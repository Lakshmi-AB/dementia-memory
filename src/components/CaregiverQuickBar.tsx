import { Languages } from 'lucide-react';
import { languages, getLanguageConfig, storeLanguage, type AppLanguage } from '@/lib/languageConfig';

interface CaregiverQuickBarProps {
  currentLanguage: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
}

const langShortLabels: Record<AppLanguage, string> = {
  assamese: 'AS',
  khasi: 'KH',
  manipuri: 'MN',
  english: 'EN',
};

export default function CaregiverQuickBar({ currentLanguage, onLanguageChange }: CaregiverQuickBarProps) {
  const t = getLanguageConfig(currentLanguage).t;

  const handleSwitch = (lang: AppLanguage) => {
    if (lang === currentLanguage) return;
    storeLanguage(lang);
    onLanguageChange(lang);

    const config = getLanguageConfig(lang);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(config.t.languageUpdated);
      utterance.lang = config.ttsLang;
      utterance.rate = 0.8;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="sticky bottom-0 z-50 border-t border-slate-200 bg-slate-100/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-2.5">
        <div className="flex shrink-0 items-center gap-2">
          <Languages className="h-4 w-4 text-slate-400" strokeWidth={2} />
          <span className="text-xs font-bold tracking-wide text-slate-400 uppercase">
            {t.caregiverQuickActions}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {languages.map((lang) => {
            const isActive = lang.id === currentLanguage;
            const shortLabel = langShortLabels[lang.id];
            return (
              <button
                key={lang.id}
                onClick={() => handleSwitch(lang.id)}
                title={`${lang.englishName} — ${lang.nativeScript}`}
                className={`rounded-full px-3 py-1 text-xs font-bold transition-all duration-200 ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white text-slate-500 border border-slate-300 hover:bg-brand-50 hover:text-brand-700'
                }`}
              >
                {shortLabel}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
