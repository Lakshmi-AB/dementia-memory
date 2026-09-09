import { useEffect, useState, useCallback, useRef } from 'react';
import { Play, RotateCcw, Check, X } from 'lucide-react';
import GameScorecard from '@/components/GameScorecard';
import { patternShapes } from '@/lib/culturalAssets';
import type { Difficulty, GameSessionResult } from '@/types';

interface SequenceRecallGameProps {
  difficulty: Difficulty;
  onComplete: (result: GameSessionResult) => void;
  onDifficultyChange: (newDifficulty: Difficulty) => void;
}

const difficultyConfig: Record<Difficulty, { startLen: number; maxLen: number; showDelay: number; showDuration: number }> = {
  easy: { startLen: 3, maxLen: 5, showDelay: 900, showDuration: 600 },
  medium: { startLen: 4, maxLen: 7, showDelay: 700, showDuration: 500 },
  hard: { startLen: 5, maxLen: 9, showDelay: 500, showDuration: 400 },
};

type Phase = 'idle' | 'showing' | 'input' | 'correct' | 'wrong' | 'finished';

export default function SequenceRecallGame({ difficulty, onComplete, onDifficultyChange }: SequenceRecallGameProps) {
  const config = difficultyConfig[difficulty];
  const [sequence, setSequence] = useState<number[]>([]);
  const [phase, setPhase] = useState<Phase>('idle');
  const [userInput, setUserInput] = useState<number[]>([]);
  const [litIndex, setLitIndex] = useState<number | null>(null);
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalRounds, setTotalRounds] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [startTime, setStartTime] = useState<number>(0);
  const [result, setResult] = useState<GameSessionResult | null>(null);
  const [oldDifficulty, setOldDifficulty] = useState<Difficulty>(difficulty);
  const [newDifficulty, setNewDifficulty] = useState<Difficulty>(difficulty);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearAllTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
  };

  const reset = useCallback(() => {
    clearAllTimeouts();
    setSequence([]);
    setPhase('idle');
    setUserInput([]);
    setLitIndex(null);
    setRound(0);
    setScore(0);
    setCorrectCount(0);
    setTotalRounds(0);
    setMistakes(0);
    setStartTime(0);
    setResult(null);
  }, []);

  const startGame = useCallback(() => {
    clearAllTimeouts();
    const seq = Array.from({ length: config.startLen }, () => Math.floor(Math.random() * patternShapes.length));
    setSequence(seq);
    setRound(1);
    setScore(0);
    setCorrectCount(0);
    setTotalRounds(0);
    setMistakes(0);
    setStartTime(Date.now());
    setUserInput([]);
    setPhase('showing');
  }, [config.startLen]);

  const finishGame = useCallback(() => {
    const duration = Math.round((Date.now() - startTime) / 1000);
    const accuracy = totalRounds > 0 ? Math.round((correctCount / totalRounds) * 100) : 0;

    const computedResult: GameSessionResult = {
      score,
      accuracy,
      duration_seconds: duration,
      difficulty,
      mistakes,
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
  }, [startTime, totalRounds, correctCount, score, difficulty, mistakes, onComplete, onDifficultyChange]);

  const nextRound = useCallback(() => {
    if (sequence.length >= config.maxLen) {
      setPhase('finished');
      finishGame();
      return;
    }
    const seq = [...sequence, Math.floor(Math.random() * patternShapes.length)];
    setSequence(seq);
    setRound((r) => r + 1);
    setUserInput([]);
    setPhase('showing');
  }, [sequence, config.maxLen, finishGame]);

  // Show sequence animation
  useEffect(() => {
    if (phase !== 'showing') return;
    clearAllTimeouts();
    let delay = 500;
    sequence.forEach((_, i) => {
      const t1 = setTimeout(() => setLitIndex(sequence[i]), delay);
      const t2 = setTimeout(() => setLitIndex(null), delay + config.showDuration);
      timeoutsRef.current.push(t1, t2);
      delay += config.showDelay;
    });
    const tEnd = setTimeout(() => {
      setPhase('input');
      setLitIndex(null);
    }, delay + 200);
    timeoutsRef.current.push(tEnd);
    return clearAllTimeouts;
  }, [phase, sequence, config.showDelay, config.showDuration]);

  const handlePadPress = (padIndex: number) => {
    if (phase !== 'input') return;
    setLitIndex(padIndex);
    setTimeout(() => setLitIndex(null), 300);

    const newInput = [...userInput, padIndex];
    const stepIndex = newInput.length - 1;

    if (newInput[stepIndex] !== sequence[stepIndex]) {
      setMistakes((m) => m + 1);
      setTotalRounds((t) => t + 1);
      setPhase('wrong');
      setTimeout(() => {
        setPhase('finished');
        finishGame();
      }, 1500);
      return;
    }

    if (newInput.length === sequence.length) {
      setScore((s) => s + sequence.length * 10);
      setCorrectCount((c) => c + 1);
      setTotalRounds((t) => t + 1);
      setPhase('correct');
      setTimeout(() => nextRound(), 1000);
    } else {
      setUserInput(newInput);
    }
  };

  useEffect(() => {
    return clearAllTimeouts;
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
            <p className="text-sm font-bold text-slate-500">ROUND</p>
            <p className="text-2xl font-bold text-slate-900">{round || '—'}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500">SCORE</p>
            <p className="text-2xl font-bold text-brand-600">{score}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500">MISTAKES</p>
            <p className="text-2xl font-bold text-error-600">{mistakes}</p>
          </div>
        </div>
        {phase === 'idle' || phase === 'finished' ? (
          <button onClick={startGame} className="btn-primary">
            <Play className="h-5 w-5" /> Start Game
          </button>
        ) : (
          <button onClick={reset} className="btn-secondary">
            <RotateCcw className="h-5 w-5" /> Restart
          </button>
        )}
      </div>

      <div className="mb-6 text-center">
        {phase === 'idle' && (
          <p className="text-lg font-semibold text-slate-500">
            Watch the colored shapes light up in order, then tap them in the exact same sequence.
          </p>
        )}
        {phase === 'showing' && (
          <p className="text-xl font-bold text-brand-600">Watch carefully...</p>
        )}
        {phase === 'input' && (
          <p className="text-xl font-bold text-success-600">Your turn — tap the shapes in order!</p>
        )}
        {phase === 'correct' && (
          <p className="text-xl font-bold text-success-600 flex items-center justify-center gap-2 animate-pop">
            <Check className="h-6 w-6" /> Correct! Next round...
          </p>
        )}
        {phase === 'wrong' && (
          <p className="text-xl font-bold text-error-600 flex items-center justify-center gap-2 animate-shake">
            <X className="h-6 w-6" /> Oops! Wrong shape. Game over.
          </p>
        )}
      </div>

      <div className="mx-auto grid max-w-lg grid-cols-3 gap-4 sm:grid-cols-5">
        {patternShapes.map((shape, i) => (
          <button
            key={shape.id}
            onClick={() => handlePadPress(i)}
            disabled={phase !== 'input'}
            className={`aspect-square rounded-2xl border-4 transition-all duration-200 ${
              litIndex === i ? `${shape.lit} scale-95 ${shape.border}` : `${shape.bg} ${shape.border}`
            } ${phase === 'input' ? 'cursor-pointer hover:scale-105' : 'cursor-default'}`}
            aria-label={shape.label}
          >
            <span className={`text-xs font-bold ${litIndex === i ? 'text-slate-900' : 'text-white/80'}`}>
              {shape.label.split(' ')[0]}
            </span>
          </button>
        ))}
      </div>

      {/* User input progress */}
      {phase === 'input' && (
        <div className="mt-6 flex justify-center gap-2">
          {sequence.map((_, i) => (
            <div
              key={i}
              className={`h-3 w-10 rounded-full ${i < userInput.length ? 'bg-success-500' : 'bg-slate-200'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
