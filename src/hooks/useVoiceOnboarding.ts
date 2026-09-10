import { useState, useEffect, useRef, useCallback } from 'react';
import {
  languages,
  getLanguageConfig,
  detectLanguageFromSpeech,
  getStoredLanguage,
  storeLanguage,
  type AppLanguage,
} from '@/lib/languageConfig';

type OnboardingPhase = 'idle' | 'cycling' | 'detected' | 'confirming' | 'done' | 'unsupported';

export function useVoiceOnboarding() {
  const [phase, setPhase] = useState<OnboardingPhase>('idle');
  const [selectedLanguage, setSelectedLanguage] = useState<AppLanguage | null>(null);
  const [currentCycleIndex, setCurrentCycleIndex] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const ttsTimerRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const cycleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isListeningRef = useRef(false);
  const phaseRef = useRef<OnboardingPhase>('idle');

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);

  const clearAllTimers = useCallback(() => {
    ttsTimerRef.current.forEach(clearTimeout);
    ttsTimerRef.current = [];
    if (cycleTimerRef.current) {
      clearTimeout(cycleTimerRef.current);
      cycleTimerRef.current = null;
    }
  }, []);

  const stopRecognition = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // already stopped
      }
      recognitionRef.current = null;
    }
    isListeningRef.current = false;
  }, []);

  const speak = useCallback((text: string, lang: string, onEnd?: () => void) => {
    if (!('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 0.8;
    utterance.pitch = 1;
    if (onEnd) {
      utterance.onend = onEnd;
    }
    window.speechSynthesis.speak(utterance);
  }, []);

  const startRecognition = useCallback(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setPhase('unsupported');
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListeningRef.current) return;

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;
    recognition.continuous = true;

    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          const transcriptText = result[0].transcript;
          setTranscript(transcriptText);
          const detected = detectLanguageFromSpeech(transcriptText);
          if (detected && phaseRef.current === 'cycling') {
            handleLanguageDetected(detected);
          }
        } else {
          const interimText = result[0].transcript;
          const detected = detectLanguageFromSpeech(interimText);
          if (detected && phaseRef.current === 'cycling') {
            handleLanguageDetected(detected);
          }
        }
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'no-speech' || event.error === 'aborted') return;
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setError('Microphone access is required for voice onboarding.');
      }
    };

    recognition.onend = () => {
      isListeningRef.current = false;
      if (phaseRef.current === 'cycling') {
        try {
          recognition.start();
          isListeningRef.current = true;
        } catch {
          // restart failed
        }
      }
    };

    try {
      recognition.start();
      isListeningRef.current = true;
    } catch {
      // already started
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleLanguageDetected = useCallback((lang: AppLanguage) => {
    if (phaseRef.current !== 'cycling') return;

    clearAllTimers();
    stopRecognition();
    window.speechSynthesis?.cancel();

    setPhase('detected');
    setSelectedLanguage(lang);
    storeLanguage(lang);

    const config = getLanguageConfig(lang);

    setPhase('confirming');
    speak(config.t.confirmation, config.ttsLang, () => {
      setPhase('done');
    });
  }, [clearAllTimers, stopRecognition, speak]);

  const cycleLanguage = useCallback((index: number) => {
    if (phaseRef.current !== 'cycling') return;

    const lang = languages[index];
    setCurrentCycleIndex(index);
    speak(lang.t.prompt, 'en-US', () => {
      if (phaseRef.current === 'cycling') {
        const nextIndex = (index + 1) % languages.length;
        cycleTimerRef.current = setTimeout(() => {
          cycleLanguage(nextIndex);
        }, 4000);
      }
    });
  }, [speak]);

  const startOnboarding = useCallback(() => {
    const stored = getStoredLanguage();
    if (stored) {
      setSelectedLanguage(stored);
      setPhase('done');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition || !('speechSynthesis' in window)) {
      setPhase('unsupported');
      setError('Voice features are not supported in this browser. You can still use the app with buttons.');
      return;
    }

    setPhase('cycling');
    startRecognition();
    cycleLanguage(0);
  }, [startRecognition, cycleLanguage]);

  const skipOnboarding = useCallback((lang: AppLanguage) => {
    clearAllTimers();
    stopRecognition();
    window.speechSynthesis?.cancel();
    setSelectedLanguage(lang);
    storeLanguage(lang);
    setPhase('done');
  }, [clearAllTimers, stopRecognition]);

  const cleanup = useCallback(() => {
    clearAllTimers();
    stopRecognition();
    window.speechSynthesis?.cancel();
  }, [clearAllTimers, stopRecognition]);

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return {
    phase,
    selectedLanguage,
    currentCycleIndex,
    transcript,
    error,
    startOnboarding,
    skipOnboarding,
    cleanup,
  };
}
