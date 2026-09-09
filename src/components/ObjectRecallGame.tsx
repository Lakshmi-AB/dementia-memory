import { useEffect, useState, useCallback, useRef } from 'react';
import { Play, RotateCcw, Check, X, Eye, Clock } from 'lucide-react';
import GameScorecard from '@/components/GameScorecard';
import { culturalObjectSets, culturalIcons, type CulturalIcon } from '@/lib/culturalAssets';
import type { Difficulty, GameSessionResult } from '@/types';

interface ObjectRecallGameProps {
  difficulty: Difficulty;
  onComplete: (result: GameSessionResult) => void;
  onDifficultyChange: (newDifficulty: Difficulty) => void;
}

const difficultyConfig: Record<Difficulty, { objectCount: number; memorizeTime: number; optionCount: number }> = {
  easy: { objectCount: 4, memorizeTime: 10, optionCount: 6 },
  medium: { objectCount: 5, memorizeTime: 8, optionCount: 8 },
  hard: { objectCount: 6, memorizeTime: 6, optionCount: 10 },
};

type Phase = 'idle' | 'memorize' | 'question' | 'finished';

function pickObjects(count: number): CulturalIcon[] {
  const setIndex = Math.floor(Math.random() * culturalObjectSets.length);
  const baseSet = culturalObjectSets[setIndex];
  if (count <= baseSet.length) return baseSet.slice(0, count);
  // Need more objects than the base set — pull from culturalIcons
  const allAvailable = [...baseSet];
  for (const icon of culturalIcons) {
    if (allAvailable.length >= count) break;
    if (!allAvailable.some((a) => a.emoji === icon.emoji)) {
      allAvailable.push(icon);
    }
  }
  return allAvailable.slice(0, count);
}

function buildOptions(shown: CulturalIcon[], totalOptions: number): CulturalIcon[] {
  const shownEmojis = new Set(shown.map((s) => s.emoji));
  const distractors = culturalIcons.filter((c) => !shownEmojis.has(c.emoji));
  const shuffledDistractors = [...distractors].sort(() => Math.random() - 0.5);
  const needed = totalOptions - shown.length;
  const options = [...shown, ...shuffledDistractors.slice(0, needed)];
  return options.sort(() => Math.random() - 0.5);
}

export default function ObjectRecallGame({ difficulty, onComplete, onDifficultyChange }: ObjectRecallGameProps) {
  const config = difficultyConfig[difficulty];
  const [phase, setPhase] = useState<Phase>('idle');
  const [shownObjects, setShownObjects] = useState<CulturalIcon[]>([]);
  const [options, setOptions] = useState<CulturalIcon[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [countdown, setCountdown] = useState(config.memorizeTime);
  const [startTime, setStartTime] = useState<number>(0);
  const [mistakes, setMistakes] = useState(0);
  const [result, setResult] = useState<GameSessionResult | null>(null);
  const [oldDifficulty, setOldDifficulty] = useState<Difficulty>(difficulty);
  const [newDifficulty, setNewDifficulty] = useState<Difficulty>(difficulty);
  const timersRef = useRef<ReturnType<typeof setInterval>[]>([]);

  const clearTimers = () => {
    timersRef.current.forEach(clearInterval);
    timersRef.current = [];
  };

  const reset = useCallback(() => {
    clearTimers();
    setPhase('idle');
    setShownObjects([]);
    setOptions([]);
    setSelected(new Set());
    setCountdown(config.memorizeTime);
    setMistakes(0);
    setStartTime(0);
    setResult(null);
  }, [config.memorizeTime]);

  const startGame = useCallback(() => {
    clearTimers();
    const objects = pickObjects(config.objectCount);
    const opts = buildOptions(objects, config.optionCount);
    setShownObjects(objects);
    setOptions(opts);
    setSelected(new Set());
    setMistakes(0);
    setCountdown(config.memorizeTime);
    setStartTime(Date.now());
    setPhase('memorize');

    // Countdown timer
    let remaining = config.memorizeTime;
    const interval = setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        clearInterval(interval);
        setPhase('question');
      }
    }, 1000);
    timersRef.current.push(interval);
  }, [config.objectCount, config.memorizeTime, config.optionCount]);

  const toggleSelection = (emoji: string) => {
    if (phase !== 'question') return;
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(emoji)) next.delete(emoji);
      else next.add(emoji);
      return next;
    });
  };

  const submitAnswer = () => {
    if (phase !== 'question') return;
    clearTimers();

    const shownEmojis = new Set(shownObjects.map((o) => o.emoji));
    let correct = 0;
    let wrong = 0;

    // Count correct selections
    for (const emoji of selected) {
      if (shownEmojis.has(emoji)) correct++;
      else wrong++;
    }
    // Count missed objects
    for (const emoji of shownEmojis) {
      if (!selected.has(emoji)) wrong++;
    }

    const totalQuestions = shownObjects.length;
    const accuracy = Math.round((correct / totalQuestions) * 100);
    const duration = Math.round((Date.now() - startTime) / 1000);
    const score = Math.max(0, correct * 50 - wrong * 20);
    const finalMistakes = wrong;

    setMistakes(finalMistakes);

    const computedResult: GameSessionResult = {
      score,
      accuracy,
      duration_seconds: duration,
      difficulty,
      mistakes: finalMistakes,
    };

    let newD: Difficulty = difficulty;
    if (accuracy > 80) newD = 'hard';
    else if (accuracy >= 50) newD = 'medium';
    else newD = 'easy';

    setOldDifficulty(difficulty);
    setNewDifficulty(newD);
    setResult(computedResult);
    onComplete(computedResult);
    if (newD !== difficulty) onDifficultyChange(newD);
    setPhase('finished');
  };

  useEffect(() => {
    return clearTimers;
  }, []);

  if (phase === 'finished' && result) {
    return (
      <div className="card-pad">
        <GameScorecard
          score={result.score}
          accuracy={result.accuracy}
          durationSeconds={result.duration_seconds}
          mistakes={result.mistakes}
          oldDifficulty={oldDifficulty}
          newDifficulty={newDifficulty}
          onPlayAgain={reset}
        />
      </div>
    );
  }

  return (
    <div className="card-pad">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-6">
          <div>
            <p className="text-sm font-bold text-slate-500">PHASE</p>
            <p className="text-2xl font-bold capitalize text-slate-900">
              {phase === 'idle' ? '—' : phase === 'memorize' ? 'Memorize' : 'Recall'}
            </p>
          </div>
          {phase === 'memorize' && (
            <div>
              <p className="text-sm font-bold text-slate-500">TIME LEFT</p>
              <p className={`text-2xl font-bold ${countdown <= 3 ? 'text-error-600' : 'text-brand-600'}`}>
                {countdown}s
              </p>
            </div>
          )}
        </div>
        {phase === 'idle' ? (
          <button onClick={startGame} className="btn-primary">
            <Play className="h-5 w-5" /> Start Game
          </button>
        ) : (
          <button onClick={reset} className="btn-secondary">
            <RotateCcw className="h-5 w-5" /> Restart
          </button>
        )}
      </div>

      {/* Idle / Instructions */}
      {phase === 'idle' && (
        <div className="py-12 text-center">
          <Eye className="mx-auto h-16 w-16 text-slate-300" />
          <h3 className="mt-4 text-2xl font-bold text-slate-700">Remember the Objects</h3>
          <p className="mt-2 text-lg font-semibold text-slate-500">
            You will see {config.objectCount} objects for {config.memorizeTime} seconds.
            Memorize them, then pick the ones you saw from a list.
          </p>
        </div>
      )}

      {/* Memorize Phase */}
      {phase === 'memorize' && (
        <div className="animate-fade-in">
          <div className="mb-6 flex items-center justify-center gap-2">
            <Clock className="h-6 w-6 text-brand-600" />
            <p className="text-xl font-bold text-brand-600">Memorize these objects!</p>
          </div>
          {/* Countdown ring */}
          <div className="mb-8 flex justify-center">
            <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-brand-500 bg-brand-50">
              <span className="text-3xl font-bold text-brand-700">{countdown}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {shownObjects.map((obj, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-2 rounded-2xl border-4 border-brand-300 bg-brand-50 p-6 animate-pop"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <span className="text-5xl">{obj.emoji}</span>
                <span className="text-sm font-bold text-slate-700">{obj.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Question Phase */}
      {phase === 'question' && (
        <div className="animate-fade-in">
          <div className="mb-6 text-center">
            <h3 className="text-2xl font-bold text-slate-900">Which objects did you see?</h3>
            <p className="mt-1 text-lg font-semibold text-slate-500">
              Tap all the objects you remember seeing ({shownObjects.length} correct answers)
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {options.map((opt, i) => {
              const isSelected = selected.has(opt.emoji);
              return (
                <button
                  key={i}
                  onClick={() => toggleSelection(opt.emoji)}
                  className={`flex flex-col items-center gap-2 rounded-2xl border-4 p-6 transition-all ${
                    isSelected
                      ? 'border-brand-600 bg-brand-100 scale-105 shadow-md'
                      : 'border-slate-200 bg-white hover:border-brand-400 hover:scale-102'
                  }`}
                >
                  <span className="text-5xl">{opt.emoji}</span>
                  <span className="text-sm font-bold text-slate-700">{opt.name}</span>
                  {isSelected && (
                    <span className="absolute -top-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full bg-brand-600 text-white">
                      <Check className="h-4 w-4" strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
          <div className="mt-6 flex items-center justify-center gap-4">
            <span className="text-lg font-bold text-slate-500">
              Selected: {selected.size}
            </span>
            <button onClick={submitAnswer} className="btn-primary">
              <Check className="h-5 w-5" /> Submit Answer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
