import { Trophy, Clock, Target, AlertTriangle, RotateCcw, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { Difficulty } from '@/types';

interface GameScorecardProps {
  score: number;
  accuracy: number;
  durationSeconds: number;
  mistakes: number;
  oldDifficulty: Difficulty;
  newDifficulty: Difficulty;
  onPlayAgain: () => void;
}

const difficultyLabels: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  hard: 'Hard',
};

const difficultyColors: Record<Difficulty, string> = {
  easy: 'bg-success-100 text-success-700 border-success-300',
  medium: 'bg-warning-100 text-warning-700 border-warning-300',
  hard: 'bg-error-100 text-error-700 border-error-300',
};

function getDifficultyIcon(oldD: Difficulty, newD: Difficulty) {
  const order: Difficulty[] = ['easy', 'medium', 'hard'];
  const oldIdx = order.indexOf(oldD);
  const newIdx = order.indexOf(newD);
  if (newIdx > oldIdx) return <TrendingUp className="h-6 w-6 text-success-600" />;
  if (newIdx < oldIdx) return <TrendingDown className="h-6 w-6 text-error-600" />;
  return <Minus className="h-6 w-6 text-warning-600" />;
}

function getDifficultyMessage(oldD: Difficulty, newD: Difficulty): string {
  if (oldD === newD) {
    return `Accuracy is in the balanced range. Difficulty stays at ${difficultyLabels[newD]}.`;
  }
  const order: Difficulty[] = ['easy', 'medium', 'hard'];
  const increased = order.indexOf(newD) > order.indexOf(oldD);
  if (increased) {
    return `Great performance! AI Engine increased difficulty from ${difficultyLabels[oldD]} to ${difficultyLabels[newD]}.`;
  }
  return `AI Engine reduced difficulty from ${difficultyLabels[oldD]} to ${difficultyLabels[newD]} for a smoother experience.`;
}

export default function GameScorecard({
  score,
  accuracy,
  durationSeconds,
  mistakes,
  oldDifficulty,
  newDifficulty,
  onPlayAgain,
}: GameScorecardProps) {
  const difficultyChanged = oldDifficulty !== newDifficulty;

  return (
    <div className="flex flex-col items-center py-8 animate-pop">
      <Trophy className="h-20 w-20 text-accent-500" />
      <h3 className="mt-4 text-3xl font-bold text-slate-900">Well Done!</h3>

      {/* Stats Grid */}
      <div className="mt-6 grid w-full max-w-md grid-cols-2 gap-4">
        <div className="rounded-xl bg-brand-50 p-4 text-center">
          <Target className="mx-auto h-7 w-7 text-brand-600" />
          <p className="mt-1 text-3xl font-bold text-slate-900">{score}</p>
          <p className="text-sm font-bold text-slate-500">SCORE</p>
        </div>
        <div className="rounded-xl bg-success-50 p-4 text-center">
          <Target className="mx-auto h-7 w-7 text-success-600" />
          <p className="mt-1 text-3xl font-bold text-slate-900">{accuracy}%</p>
          <p className="text-sm font-bold text-slate-500">ACCURACY</p>
        </div>
        <div className="rounded-xl bg-accent-50 p-4 text-center">
          <Clock className="mx-auto h-7 w-7 text-accent-600" />
          <p className="mt-1 text-3xl font-bold text-slate-900">{durationSeconds}s</p>
          <p className="text-sm font-bold text-slate-500">TIME TAKEN</p>
        </div>
        <div className="rounded-xl bg-error-50 p-4 text-center">
          <AlertTriangle className="mx-auto h-7 w-7 text-error-600" />
          <p className="mt-1 text-3xl font-bold text-slate-900">{mistakes}</p>
          <p className="text-sm font-bold text-slate-500">MISTAKES</p>
        </div>
      </div>

      {/* AI Adaptive Difficulty Alert */}
      <div
        className={`mt-6 w-full max-w-md rounded-2xl border-4 p-5 animate-fade-in ${
          difficultyChanged
            ? 'border-brand-400 bg-brand-50'
            : 'border-slate-300 bg-slate-50'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white">
            {getDifficultyIcon(oldDifficulty, newDifficulty)}
          </div>
          <div className="flex-1">
            <p className="text-lg font-bold text-slate-900">
              AI Engine Updated Game Difficulty Level
            </p>
            <p className="mt-1 text-base font-semibold text-slate-600">
              {getDifficultyMessage(oldDifficulty, newDifficulty)}
            </p>
            <div className="mt-3 flex items-center gap-3">
              <span className={`badge ${difficultyColors[oldDifficulty]} border-2`}>
                {difficultyLabels[oldDifficulty]}
              </span>
              <span className="text-xl font-bold text-slate-400">→</span>
              <span className={`badge ${difficultyColors[newDifficulty]} border-2`}>
                {difficultyLabels[newDifficulty]}
              </span>
            </div>
          </div>
        </div>
      </div>

      <button onClick={onPlayAgain} className="btn-primary mt-6">
        <RotateCcw className="h-5 w-5" /> Play Again
      </button>
    </div>
  );
}
