import { useEffect, useState, useCallback } from 'react';
import { RotateCcw } from 'lucide-react';
import GameScorecard from '@/components/GameScorecard';
import { culturalIcons } from '@/lib/culturalAssets';
import type { Difficulty, GameSessionResult } from '@/types';

interface MemoryMatchGameProps {
  difficulty: Difficulty;
  onComplete: (result: GameSessionResult) => void;
  onDifficultyChange: (newDifficulty: Difficulty) => void;
}

interface Card {
  id: number;
  icon: CulturalIcon;
  flipped: boolean;
  matched: boolean;
}

import type { CulturalIcon } from '@/lib/culturalAssets';

const difficultyPairs: Record<Difficulty, number> = {
  easy: 4,
  medium: 6,
  hard: 8,
};

const gridCols: Record<Difficulty, string> = {
  easy: 'grid-cols-4',
  medium: 'grid-cols-4',
  hard: 'grid-cols-4',
};

function shuffleCards(pairCount: number): Card[] {
  const selected = culturalIcons.slice(0, pairCount);
  const pairs = [...selected, ...selected];
  return pairs
    .map((icon, i) => ({ id: i, icon, flipped: false, matched: false }))
    .sort(() => Math.random() - 0.5);
}

export default function MemoryMatchGame({ difficulty, onComplete, onDifficultyChange }: MemoryMatchGameProps) {
  const pairCount = difficultyPairs[difficulty];
  const [cards, setCards] = useState<Card[]>(() => shuffleCards(pairCount));
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [matches, setMatches] = useState(0);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [finished, setFinished] = useState(false);
  const [canFlip, setCanFlip] = useState(true);
  const [result, setResult] = useState<GameSessionResult | null>(null);
  const [oldDifficulty, setOldDifficulty] = useState<Difficulty>(difficulty);
  const [newDifficulty, setNewDifficulty] = useState<Difficulty>(difficulty);

  const reset = useCallback(() => {
    setCards(shuffleCards(pairCount));
    setFlippedIndices([]);
    setMoves(0);
    setMistakes(0);
    setMatches(0);
    setStartTime(Date.now());
    setFinished(false);
    setCanFlip(true);
    setResult(null);
  }, [pairCount]);

  useEffect(() => {
    reset();
  }, [reset, difficulty]);

  const handleFlip = useCallback((index: number) => {
    if (!canFlip || cards[index].flipped || cards[index].matched || flippedIndices.length >= 2) return;

    const newCards = [...cards];
    newCards[index] = { ...newCards[index], flipped: true };
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      setCanFlip(false);
      const [a, b] = newFlipped;
      if (newCards[a].icon.emoji === newCards[b].icon.emoji) {
        setTimeout(() => {
          setCards((prev) => {
            const updated = [...prev];
            updated[a] = { ...updated[a], matched: true };
            updated[b] = { ...updated[b], matched: true };
            return updated;
          });
          setMatches((m) => m + 1);
          setFlippedIndices([]);
          setCanFlip(true);
        }, 600);
      } else {
        setMistakes((m) => m + 1);
        setTimeout(() => {
          setCards((prev) => {
            const updated = [...prev];
            updated[a] = { ...updated[a], flipped: false };
            updated[b] = { ...updated[b], flipped: false };
            return updated;
          });
          setFlippedIndices([]);
          setCanFlip(true);
        }, 1200);
      }
    }
  }, [canFlip, cards, flippedIndices]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (matches === pairCount && !finished) {
      setFinished(true);
      const duration = Math.round((Date.now() - startTime) / 1000);
      const accuracy = Math.round((pairCount / Math.max(moves, 1)) * 100);
      const score = Math.max(0, pairCount * 100 - mistakes * 15);

      const computedResult: GameSessionResult = {
        score,
        accuracy: Math.min(100, accuracy),
        duration_seconds: duration,
        difficulty,
        mistakes,
      };

      // Adaptive AI
      const oldD = difficulty;
      let newD: Difficulty = difficulty;
      if (accuracy > 80) newD = 'hard';
      else if (accuracy >= 50) newD = 'medium';
      else newD = 'easy';

      setOldDifficulty(oldD);
      setNewDifficulty(newD);
      setResult(computedResult);
      onComplete(computedResult);
      if (newD !== oldD) onDifficultyChange(newD);
    }
  }, [matches, pairCount, finished, moves, mistakes, startTime, difficulty, onComplete, onDifficultyChange]);

  if (finished && result) {
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
            <p className="text-sm font-bold text-slate-500">MOVES</p>
            <p className="text-2xl font-bold text-slate-900">{moves}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500">MATCHES</p>
            <p className="text-2xl font-bold text-success-600">
              {matches}/{pairCount}
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500">MISTAKES</p>
            <p className="text-2xl font-bold text-error-600">{mistakes}</p>
          </div>
        </div>
        <button onClick={reset} className="btn-secondary">
          <RotateCcw className="h-5 w-5" /> Restart
        </button>
      </div>

      <div className={`grid ${gridCols[difficulty]} gap-3`}>
        {cards.map((card, index) => (
          <button
            key={card.id}
            onClick={() => handleFlip(index)}
            disabled={card.matched}
            className={`relative flex aspect-square flex-col items-center justify-center rounded-xl border-4 transition-all duration-300 ${
              card.matched
                ? 'border-success-400 bg-success-50 cursor-default animate-pop'
                : card.flipped
                  ? 'border-brand-500 bg-brand-50'
                  : 'border-slate-300 bg-white hover:border-brand-400 hover:bg-brand-50'
            }`}
          >
            {card.flipped || card.matched ? (
              <>
                <span className="text-4xl sm:text-5xl">{card.icon.emoji}</span>
                <span className="mt-1 px-1 text-center text-[10px] font-bold leading-tight text-slate-600">
                  {card.icon.name}
                </span>
              </>
            ) : (
              <span className="text-3xl text-slate-300">?</span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
