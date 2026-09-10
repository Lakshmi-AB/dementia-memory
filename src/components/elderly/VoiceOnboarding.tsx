import { useEffect } from 'react';
import { Mic, Volume2, Globe, Loader2 } from 'lucide-react';
import { languages } from '@/lib/languageConfig';
import type { AppLanguage } from '@/lib/languageConfig';

interface VoiceOnboardingProps {
  phase: string;
  currentCycleIndex: number;
  transcript: string;
  error: string | null;
  onSkip: (lang: AppLanguage) => void;
}

export default function VoiceOnboarding({
  phase,
  currentCycleIndex,
  transcript,
  error,
  onSkip,
}: VoiceOnboardingProps) {
  useEffect(() => {
    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  if (phase === 'unsupported') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-brand-800 to-brand-900 px-6">
        <div className="max-w-md text-center">
          <Globe className="mx-auto h-20 w-20 text-accent-400" />
          <h1 className="mt-6 text-3xl font-bold text-white">Choose Your Language</h1>
          <p className="mt-3 text-xl font-semibold text-brand-200">
            Voice features aren't available in this browser, but you can still select your language below.
          </p>
          {error && (
            <p className="mt-2 text-base font-semibold text-accent-300">{error}</p>
          )}
          <div className="mt-8 grid grid-cols-2 gap-4">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => onSkip(lang.id)}
                className="rounded-2xl border-2 border-brand-600 bg-brand-700 px-6 py-5 text-white transition-all hover:scale-105 hover:border-accent-400 hover:bg-brand-600"
              >
                <p className="text-2xl font-bold">{lang.nativeName}</p>
                <p className="text-lg font-semibold text-brand-200">{lang.nativeScript}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const isCycling = phase === 'cycling';
  const isConfirming = phase === 'confirming' || phase === 'detected';

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-brand-800 to-brand-900 px-6">
      {/* Animated mic icon */}
      <div className="relative mb-8">
        {isCycling && (
          <div className="absolute inset-0 animate-ping rounded-full bg-accent-400 opacity-30" />
        )}
        <div
          className={`relative flex h-32 w-32 items-center justify-center rounded-full transition-all duration-500 ${
            isCycling
              ? 'bg-accent-400 text-brand-900 scale-110 shadow-2xl shadow-accent-400/50'
              : isConfirming
                ? 'bg-success-500 text-white scale-110 shadow-2xl shadow-success-400/50'
                : 'bg-brand-600 text-white'
          }`}
        >
          {isCycling ? (
            <Mic className="h-16 w-16" strokeWidth={2} />
          ) : isConfirming ? (
            <Volume2 className="h-16 w-16" strokeWidth={2} />
          ) : (
            <Loader2 className="h-16 w-16 animate-spin" strokeWidth={2} />
          )}
        </div>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-white sm:text-5xl">
        {isCycling && 'Welcome to MindSpark'}
        {isConfirming && 'Language Confirmed!'}
      </h1>

      {/* Subtitle */}
      <p className="mt-4 text-center text-2xl font-semibold text-brand-200">
        {isCycling && 'Please say the name of your language'}
        {isConfirming && 'Taking you to your home screen...'}
      </p>

      {/* Language cycle display */}
      {isCycling && (
        <div className="mt-10 w-full max-w-lg">
          <div className="space-y-3">
            {languages.map((lang, i) => {
              const isActive = i === currentCycleIndex;
              return (
                <div
                  key={lang.id}
                  className={`flex items-center gap-4 rounded-2xl border-2 px-6 py-4 transition-all duration-300 ${
                    isActive
                      ? 'border-accent-400 bg-accent-400/20 scale-105 shadow-lg'
                      : 'border-brand-600 bg-brand-700/40 opacity-50'
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl font-bold ${
                      isActive ? 'bg-accent-400 text-brand-900' : 'bg-brand-600 text-brand-200'
                    }`}
                  >
                    {lang.nativeName.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-xl font-bold ${isActive ? 'text-white' : 'text-brand-300'}`}
                    >
                      {lang.nativeName}
                      <span className="ml-2 text-lg">{lang.nativeScript}</span>
                    </p>
                    <p className={`text-base font-semibold ${isActive ? 'text-accent-200' : 'text-brand-400'}`}>
                      {lang.prompt}
                    </p>
                  </div>
                  {isActive && (
                    <div className="flex gap-1">
                      <span className="h-3 w-3 animate-bounce rounded-full bg-accent-400" style={{ animationDelay: '0ms' }} />
                      <span className="h-3 w-3 animate-bounce rounded-full bg-accent-400" style={{ animationDelay: '150ms' }} />
                      <span className="h-3 w-3 animate-bounce rounded-full bg-accent-400" style={{ animationDelay: '300ms' }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Live transcript */}
      {isCycling && transcript && (
        <div className="mt-6 rounded-2xl bg-brand-700/60 px-6 py-3 animate-fade-in">
          <p className="text-sm font-bold text-brand-300">I HEARD:</p>
          <p className="text-xl font-bold text-white">"{transcript}"</p>
        </div>
      )}

      {/* Skip button */}
      {isCycling && (
        <div className="mt-8">
          <p className="mb-3 text-center text-sm font-semibold text-brand-400">
            Can't use voice? Tap a language to continue:
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {languages.map((lang) => (
              <button
                key={lang.id}
                onClick={() => onSkip(lang.id)}
                className="rounded-lg border border-brand-500 px-4 py-2 text-sm font-bold text-brand-200 transition-all hover:bg-brand-600 hover:text-white"
              >
                {lang.nativeName}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
