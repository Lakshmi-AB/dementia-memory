import { useState, useEffect, useRef, useCallback } from 'react';
import { Gamepad2, Bell, Mic, BarChart3, Volume2, Sparkles } from 'lucide-react';
import { getLanguageConfig, detectLanguageFromSpeech, type AppLanguage } from '@/lib/languageConfig';
import type { LanguageConfig } from '@/lib/languageConfig';

type ElderlyView = 'home' | 'games' | 'reminders' | 'voice' | 'progress';

interface ElderlyHomeProps {
  onNavigate: (view: ElderlyView) => void;
  patientName: string;
  language: AppLanguage;
}

interface NavCard {
  view: Exclude<ElderlyView, 'home'>;
  emoji: string;
  icon: typeof Gamepad2;
  color: string;
  bg: string;
}

function buildCards(lang: LanguageConfig): NavCard[] {
  return [
    {
      view: 'games',
      emoji: '🧠',
      icon: Gamepad2,
      color: 'text-brand-700',
      bg: 'bg-brand-100 hover:bg-brand-200 border-brand-300',
    },
    {
      view: 'reminders',
      emoji: '🔔',
      icon: Bell,
      color: 'text-accent-700',
      bg: 'bg-accent-100 hover:bg-accent-200 border-accent-300',
    },
    {
      view: 'voice',
      emoji: '🎤',
      icon: Mic,
      color: 'text-rose-700',
      bg: 'bg-rose-100 hover:bg-rose-200 border-rose-300',
    },
    {
      view: 'progress',
      emoji: '📊',
      icon: BarChart3,
      color: 'text-success-700',
      bg: 'bg-success-100 hover:bg-success-200 border-success-300',
    },
  ];
}

export default function ElderlyHome({ onNavigate, patientName, language }: ElderlyHomeProps) {
  const langConfig = getLanguageConfig(language);
  const cards = buildCards(langConfig);

  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [greetingPlayed, setGreetingPlayed] = useState(false);
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = langConfig.ttsLang;
      utterance.rate = 0.8;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  }, [langConfig.ttsLang]);

  // Play greeting on first mount and whenever language changes
  useEffect(() => {
    const greeting = `${langConfig.morningGreeting} ${patientName}! ${langConfig.homePrompt}`;
    if (!greetingPlayed) {
      setGreetingPlayed(true);
      setTimeout(() => speak(greeting), 500);
    } else {
      speak(greeting);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [language]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch { /* noop */ }
      }
      window.speechSynthesis?.cancel();
    };
  }, []);

  const processCommand = useCallback((text: string): ElderlyView | null => {
    const lower = text.toLowerCase();
    const navKeywords: Record<Exclude<ElderlyView, 'home'>, string[]> = {
      games: ['game', 'play', 'brain', langConfig.navGame.toLowerCase()],
      reminders: ['remind', 'schedule', 'reminder', langConfig.navReminders.toLowerCase()],
      voice: ['voice', 'assistant', 'speak', 'talk', langConfig.navVoice.toLowerCase()],
      progress: ['progress', 'score', 'how am i', langConfig.navProgress.toLowerCase()],
    };

    for (const [view, keywords] of Object.entries(navKeywords)) {
      for (const kw of keywords) {
        if (kw && lower.includes(kw)) return view as ElderlyView;
      }
    }
    return null;
  }, [langConfig]);

  const startVoiceCommand = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    setListening(true);
    setTranscript('');
    setResponse('');

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    recognition.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript;
      setTranscript(speechResult);
      const command = processCommand(speechResult);
      if (command) {
        setResponse(langConfig.goodJob);
        speak(langConfig.goodJob);
        setTimeout(() => onNavigate(command), 1500);
      } else {
        setResponse(langConfig.fallback);
        speak(langConfig.fallback);
      }
    };

    recognition.onerror = () => {
      setResponse(langConfig.fallback);
      speak(langConfig.fallback);
    };

    recognition.onend = () => {
      isListeningRef.current = false;
      setListening(false);
    };

    isListeningRef.current = true;
    try { recognition.start(); } catch { /* noop */ }
  }, [processCommand, speak, langConfig, onNavigate]);

  const stopVoiceCommand = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* noop */ }
    }
    isListeningRef.current = false;
    setListening(false);
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Greeting */}
      <div className="mb-8 text-center">
        <div className="mb-4 flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-brand-500" />
          <span className="rounded-full bg-brand-100 px-4 py-1 text-lg font-bold text-brand-700">
            {langConfig.nativeName} {langConfig.nativeScript}
          </span>
          <Sparkles className="h-8 w-8 text-brand-500" />
        </div>
        <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
          {langConfig.morningGreeting}
        </h1>
        <p className="mt-2 text-3xl font-bold text-brand-700">{patientName}!</p>
        <p className="mt-3 text-2xl font-semibold text-slate-600">
          {langConfig.homePrompt}
        </p>
      </div>

      {/* Voice command bar */}
      <div className="mb-8 flex flex-col items-center gap-4">
        <button
          onClick={listening ? stopVoiceCommand : startVoiceCommand}
          className={`flex h-20 w-20 items-center justify-center rounded-full transition-all duration-300 ${
            listening
              ? 'bg-error-500 text-white animate-pulse scale-110 shadow-xl shadow-error-300'
              : 'bg-brand-600 text-white hover:bg-brand-700 hover:scale-105 shadow-lg'
          }`}
        >
          <Mic className="h-10 w-10" strokeWidth={2} />
        </button>
        <p className="text-xl font-bold text-slate-600">
          {listening ? 'Listening...' : 'Tap to speak a command'}
        </p>

        {transcript && (
          <div className="w-full max-w-lg rounded-2xl border-2 border-slate-200 bg-slate-50 p-4 animate-fade-in">
            <p className="text-sm font-bold text-slate-500">YOU SAID:</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">"{transcript}"</p>
          </div>
        )}

        {response && (
          <div className="flex w-full max-w-lg items-start gap-3 rounded-2xl border-2 border-brand-200 bg-brand-50 p-4 animate-fade-in">
            <Volume2 className="h-7 w-7 shrink-0 text-brand-600" />
            <p className="text-xl font-semibold text-slate-900">{response}</p>
          </div>
        )}
      </div>

      {/* Action cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;
          const labelMap: Record<Exclude<ElderlyView, 'home'>, string> = {
            games: langConfig.navGame,
            reminders: langConfig.navReminders,
            voice: langConfig.navVoice,
            progress: langConfig.navProgress,
          };
          return (
            <button
              key={card.view}
              onClick={() => onNavigate(card.view)}
              className={`flex flex-col items-center gap-4 rounded-3xl border-4 p-10 text-center transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] ${card.bg}`}
            >
              <span className="text-6xl" aria-hidden="true">{card.emoji}</span>
              <Icon className={`h-10 w-10 ${card.color}`} strokeWidth={2.5} />
              <div>
                <h2 className="text-3xl font-bold text-slate-900">{labelMap[card.view]}</h2>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
