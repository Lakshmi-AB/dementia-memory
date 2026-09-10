import { Brain, Heart, LayoutDashboard } from 'lucide-react';
import type { AppLanguage } from '@/lib/languageConfig';
import { getLanguageConfig } from '@/lib/languageConfig';

export type AppMode = 'elderly' | 'caregiver';

interface HeaderProps {
  mode: AppMode;
  onToggleMode: () => void;
  elderlyView: string | null;
  onElderlyHome: () => void;
  language: AppLanguage;
}

export default function Header({ mode, onToggleMode, elderlyView, onElderlyHome, language }: HeaderProps) {
  const t = getLanguageConfig(language).t;

  return (
    <header
      className={`sticky top-0 z-50 border-b-2 shadow-sm transition-colors duration-300 ${
        mode === 'elderly'
          ? 'border-brand-700 bg-brand-800'
          : 'border-slate-200 bg-white'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4">
        <button
          onClick={mode === 'elderly' && elderlyView ? onElderlyHome : undefined}
          className="flex shrink-0 items-center gap-3"
        >
          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl transition-colors ${
              mode === 'elderly' ? 'bg-accent-400 text-brand-900' : 'bg-brand-600 text-white'
            }`}
          >
            <Brain className="h-6 w-6" strokeWidth={2.5} />
          </div>
          <div className="text-left">
            <h1
              className={`text-lg font-bold leading-tight transition-colors ${
                mode === 'elderly' ? 'text-white' : 'text-slate-900'
              }`}
            >
              {t.appName}
            </h1>
            <p
              className={`text-sm font-semibold transition-colors ${
                mode === 'elderly' ? 'text-brand-200' : 'text-slate-500'
              }`}
            >
              {mode === 'elderly' ? t.appTaglineElderly : t.appTaglineCaregiver}
            </p>
          </div>
        </button>

        <button
          onClick={onToggleMode}
          className={`flex items-center gap-2.5 rounded-xl px-5 py-3 text-base font-bold transition-all duration-200 ${
            mode === 'elderly'
              ? 'bg-white text-brand-700 hover:bg-brand-50 shadow-md'
              : 'bg-brand-600 text-white hover:bg-brand-700 shadow-md'
          }`}
        >
          {mode === 'elderly' ? (
            <>
              <LayoutDashboard className="h-5 w-5" strokeWidth={2.5} />
              <span className="hidden sm:inline">{t.switchToCaregiver}</span>
              <span className="sm:hidden">{t.switchToCaregiverShort}</span>
            </>
          ) : (
            <>
              <Heart className="h-5 w-5" strokeWidth={2.5} />
              <span className="hidden sm:inline">{t.switchToElderly}</span>
              <span className="sm:hidden">{t.switchToElderlyShort}</span>
            </>
          )}
        </button>
      </div>
    </header>
  );
}
