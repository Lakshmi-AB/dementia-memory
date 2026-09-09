import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Mic, Square, Volume2 } from 'lucide-react';

interface ElderlyVoiceAssistantProps {
  onBack: () => void;
}

type VoiceState = 'idle' | 'listening' | 'processing' | 'responding';

const responses: Record<string, string> = {
  game: "Let's play a memory game! I'll take you to the Game Station where you can choose from fun brain exercises.",
  reminder: "Here are your reminders for today. You can check them off as you complete each one.",
  progress: "You're doing great! Let me show you your progress for today.",
  hello: "Hello! I'm your memory assistant. I can help you play games, check reminders, or see your progress. What would you like to do?",
  help: "I can help you with three things: play a brain game, check your daily reminders, or see your progress. Just tell me what you need!",
  water: "Time to drink some water! Staying hydrated helps keep your mind sharp.",
  medicine: "Please take your medicine as scheduled. Your caregiver will be happy to know you're staying on track.",
  default: "I heard you! I'm here to help with games, reminders, and your progress. What would you like to do?",
};

export default function ElderlyVoiceAssistant({ onBack }: ElderlyVoiceAssistantProps) {
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {
          // already stopped
        }
      }
    };
  }, []);

  const getResponse = (text: string): string => {
    const lower = text.toLowerCase();
    if (lower.includes('game') || lower.includes('play')) return responses.game;
    if (lower.includes('remind') || lower.includes('schedule')) return responses.reminder;
    if (lower.includes('progress') || lower.includes('score')) return responses.progress;
    if (lower.includes('hello') || lower.includes('hi')) return responses.hello;
    if (lower.includes('help')) return responses.help;
    if (lower.includes('water')) return responses.water;
    if (lower.includes('medicine') || lower.includes('medic')) return responses.medicine;
    return responses.default;
  };

  const startListening = () => {
    setTranscript('');
    setResponse('');
    setVoiceState('listening');

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceState('processing');
      setTimeout(() => {
        setResponse("I'm sorry, voice recognition isn't available in your browser. But I can still help you — just use the buttons on the home screen!");
        setVoiceState('responding');
      }, 1500);
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const speechResult = event.results[0][0].transcript;
      setTranscript(speechResult);
      setVoiceState('processing');
      setTimeout(() => {
        setResponse(getResponse(speechResult));
        setVoiceState('responding');
        speakResponse(getResponse(speechResult));
      }, 1000);
    };

    recognition.onerror = () => {
      setVoiceState('processing');
      setTimeout(() => {
        setResponse("I didn't quite catch that. Could you try again?");
        setVoiceState('responding');
      }, 1000);
    };

    recognition.onend = () => {
      if (voiceState === 'listening') {
        setVoiceState('processing');
      }
    };

    try {
      recognition.start();
    } catch {
      // already started
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // already stopped
      }
    }
    setVoiceState('idle');
  };

  const speakResponse = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-2xl font-bold text-brand-700 hover:text-brand-800"
      >
        <ArrowLeft className="h-7 w-7" /> Back
      </button>

      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-slate-900">Voice Assistant</h1>
        <p className="mt-2 text-2xl font-semibold text-slate-600">
          Tap the microphone and speak to me
        </p>
      </div>

      <div className="flex flex-col items-center gap-8">
        {/* Mic Button */}
        <button
          onClick={voiceState === 'listening' ? stopListening : startListening}
          className={`flex h-48 w-48 items-center justify-center rounded-full transition-all duration-300 ${
            voiceState === 'listening'
              ? 'bg-error-500 text-white animate-pulse scale-110 shadow-2xl shadow-error-300'
              : voiceState === 'processing'
                ? 'bg-accent-500 text-white scale-105 shadow-xl'
                : voiceState === 'responding'
                  ? 'bg-success-500 text-white shadow-xl'
                  : 'bg-brand-600 text-white hover:bg-brand-700 hover:scale-105 shadow-lg'
          }`}
        >
          {voiceState === 'listening' ? (
            <Square className="h-20 w-20 fill-white" strokeWidth={2} />
          ) : (
            <Mic className="h-20 w-20" strokeWidth={2} />
          )}
        </button>

        {/* State Label */}
        <p className="text-2xl font-bold text-slate-700">
          {voiceState === 'idle' && 'Tap to speak'}
          {voiceState === 'listening' && 'Listening...'}
          {voiceState === 'processing' && 'Thinking...'}
          {voiceState === 'responding' && 'Here is what I found:'}
        </p>

        {/* Transcript */}
        {transcript && (
          <div className="w-full rounded-2xl border-4 border-slate-200 bg-slate-50 p-6 animate-fade-in">
            <p className="text-sm font-bold text-slate-500">YOU SAID:</p>
            <p className="mt-1 text-2xl font-semibold text-slate-900">"{transcript}"</p>
          </div>
        )}

        {/* Response */}
        {response && (
          <div className="w-full rounded-2xl border-4 border-brand-200 bg-brand-50 p-6 animate-fade-in">
            <div className="flex items-start gap-3">
              <Volume2 className="h-8 w-8 shrink-0 text-brand-600" />
              <p className="text-2xl font-semibold text-slate-900">{response}</p>
            </div>
          </div>
        )}

        {/* Hint */}
        {voiceState === 'idle' && !transcript && (
          <div className="rounded-2xl bg-slate-100 p-6 text-center">
            <p className="text-xl font-semibold text-slate-600">
              Try saying: "Play a game", "What are my reminders?", or "Show my progress"
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
