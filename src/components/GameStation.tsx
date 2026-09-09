import { useState, useCallback, useEffect } from 'react';
import { ArrowLeft, Gamepad2, Layers, Brain, Eye, ChevronRight, Sparkles } from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { useGameSessions } from '@/hooks/useGameSessions';
import MemoryMatchGame from '@/components/MemoryMatchGame';
import SequenceRecallGame from '@/components/SequenceRecallGame';
import ObjectRecallGame from '@/components/ObjectRecallGame';
import type { Difficulty, GameType, GameSessionResult } from '@/types';

const colorMap: Record<string, string> = {
  teal: '#14b8a6',
  blue: '#3b82f6',
  amber: '#f59e0b',
  rose: '#f43f5e',
  violet: '#8b5cf6',
  emerald: '#10b981',
};

const difficultyDesc: Record<Difficulty, string> = {
  easy: 'Fewer cards · Shorter sequences · More time',
  medium: 'Balanced challenge for steady progress',
  hard: 'More cards · Longer sequences · Less time',
};

const games: { id: GameType; label: string; icon: typeof Gamepad2; desc: string; emoji: string }[] = [
  {
    id: 'memory_match',
    label: 'Memory Match',
    icon: Layers,
    desc: 'Flip cards to find matching pairs of local NER objects.',
    emoji: '🧠',
  },
  {
    id: 'sequence_recall',
    label: 'Pattern Memory',
    icon: Brain,
    desc: 'Watch colored shapes light up, then repeat the sequence.',
    emoji: '🎯',
  },
  {
    id: 'object_recall',
    label: 'Remember the Objects',
    icon: Eye,
    desc: 'Memorize objects, then pick the ones you saw.',
    emoji: '👁️',
  },
];

interface GameStationProps {
  preselectedPatientId?: string | null;
  onBack?: () => void;
  elderlyMode?: boolean;
}

export default function GameStation({ preselectedPatientId, onBack, elderlyMode }: GameStationProps) {
  const { patients, loading, error } = usePatients();
  const { addSession } = useGameSessions();
  const [selectedPatient, setSelectedPatient] = useState<string | null>(preselectedPatientId ?? null);
  const [selectedGame, setSelectedGame] = useState<GameType | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');

  useEffect(() => {
    if (preselectedPatientId) {
      setSelectedPatient(preselectedPatientId);
    } else if (patients.length > 0 && !selectedPatient) {
      setSelectedPatient(patients[0].id);
    }
  }, [preselectedPatientId, patients, selectedPatient]);

  const handleComplete = useCallback(
    async (result: GameSessionResult) => {
      if (!selectedPatient || !selectedGame) return;
      try {
        await addSession({
          patient_id: selectedPatient,
          game_type: selectedGame,
          score: result.score,
          accuracy: result.accuracy,
          duration_seconds: result.duration_seconds,
          difficulty: result.difficulty,
        });
      } catch {
        // session save failure shouldn't block gameplay
      }
    },
    [selectedPatient, selectedGame, addSession],
  );

  const handleDifficultyChange = useCallback((newD: Difficulty) => {
    setDifficulty(newD);
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-xl font-semibold text-slate-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-error-50 border-2 border-error-200 px-4 py-3 text-error-700 font-semibold">
        {error}
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="card-pad text-center">
        <Gamepad2 className="mx-auto h-16 w-16 text-slate-300" />
        <h3 className="mt-4 text-xl font-bold text-slate-700">No patients available</h3>
        <p className="mt-1 text-lg font-semibold text-slate-500">
          Please add a patient from the Caregiver Dashboard first.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-2xl font-bold text-brand-700 hover:text-brand-800"
          >
            <ArrowLeft className="h-7 w-7" /> Back
          </button>
        )}
        <div>
          <h1 className={`font-bold text-slate-900 ${elderlyMode ? 'text-4xl' : 'text-3xl'}`}>
            Cognitive Game Station
          </h1>
          <p className="mt-1 text-lg font-semibold text-slate-500">
            {elderlyMode ? 'Pick a game and start playing!' : 'Choose a patient and game to begin cognitive training'}
          </p>
        </div>
      </div>

      {/* Patient Selection */}
      {!preselectedPatientId && (
        <div>
          <p className="label">1. Select Patient</p>
          <div className="flex flex-wrap gap-3">
            {patients.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPatient(p.id)}
                className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 transition-all ${
                  selectedPatient === p.id
                    ? 'border-brand-600 bg-brand-50'
                    : 'border-slate-300 bg-white hover:border-brand-400'
                }`}
              >
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white"
                  style={{ backgroundColor: colorMap[p.avatar_color] ?? '#14b8a6' }}
                >
                  {p.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-lg font-bold text-slate-900">{p.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedPatient && (
        <div className="animate-fade-in">
          {/* Current AI Difficulty Indicator */}
          <div className="mb-6 flex items-center gap-3 rounded-xl border-2 border-brand-200 bg-brand-50 px-5 py-3">
            <Sparkles className="h-6 w-6 text-brand-600" strokeWidth={2.5} />
            <div>
              <p className="text-sm font-bold text-brand-700">AI ADAPTIVE DIFFICULTY</p>
              <p className="text-base font-bold capitalize text-slate-900">
                Current Level: {difficulty} — {difficultyDesc[difficulty]}
              </p>
            </div>
          </div>

          {/* Game Selection */}
          <div className="mb-6">
            <p className={`label ${elderlyMode ? 'text-2xl' : ''}`}>{preselectedPatientId ? '1.' : '2.'} Choose a Game</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {games.map((game) => {
                const Icon = game.icon;
                const isSelected = selectedGame === game.id;
                return (
                  <button
                    key={game.id}
                    onClick={() => setSelectedGame(game.id)}
                    className={`card-pad text-left transition-all ${
                      isSelected ? 'border-brand-600 ring-2 ring-brand-300' : 'hover:border-brand-400'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                        isSelected ? 'bg-brand-600 text-white' : 'bg-brand-100 text-brand-700'
                      }`}>
                        <Icon className="h-7 w-7" strokeWidth={2.5} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900">{game.label}</h3>
                        <p className="text-sm font-semibold text-slate-500">{game.desc}</p>
                      </div>
                      {isSelected && <ChevronRight className="h-6 w-6 text-brand-600" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Play Area */}
          {selectedGame && (
            <div className="animate-fade-in">
              <p className={`label ${elderlyMode ? 'text-2xl' : ''}`}>{preselectedPatientId ? '2.' : '3.'} Play</p>
              {selectedGame === 'memory_match' && (
                <MemoryMatchGame
                  difficulty={difficulty}
                  onComplete={handleComplete}
                  onDifficultyChange={handleDifficultyChange}
                />
              )}
              {selectedGame === 'sequence_recall' && (
                <SequenceRecallGame
                  difficulty={difficulty}
                  onComplete={handleComplete}
                  onDifficultyChange={handleDifficultyChange}
                />
              )}
              {selectedGame === 'object_recall' && (
                <ObjectRecallGame
                  difficulty={difficulty}
                  onComplete={handleComplete}
                  onDifficultyChange={handleDifficultyChange}
                />
              )}
            </div>
          )}
        </div>
      )}

      {!selectedPatient && !preselectedPatientId && (
        <div className="card-pad text-center">
          <Gamepad2 className="mx-auto h-16 w-16 text-slate-300" />
          <p className="mt-4 text-lg font-semibold text-slate-500">
            Select a patient above to get started
          </p>
        </div>
      )}
    </div>
  );
}
