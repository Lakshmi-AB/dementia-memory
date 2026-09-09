import { ArrowLeft, Gamepad2, Trophy, Target, CheckCircle2 } from 'lucide-react';
import { useGameSessions } from '@/hooks/useGameSessions';
import { useReminders } from '@/hooks/useReminders';

interface ElderlyProgressProps {
  onBack: () => void;
  patientId: string | null;
  patientName: string;
}

export default function ElderlyProgress({ onBack, patientId, patientName }: ElderlyProgressProps) {
  const { sessions, loading } = useGameSessions(patientId ?? undefined);
  const { reminders } = useReminders(patientId ?? undefined);

  const today = new Date().getDay();
  const todaySessions = sessions.filter((s) => {
    const d = new Date(s.completed_at).getDay();
    return d === today;
  });
  const todayReminders = reminders.filter((r) => r.day_of_week === today || r.day_of_week === 0);
  const completedReminders = todayReminders.filter((r) => r.completed).length;

  const gamesPlayed = todaySessions.length;
  const bestScore = todaySessions.length > 0
    ? Math.max(...todaySessions.map((s) => s.score))
    : 0;
  const avgAccuracy = todaySessions.length > 0
    ? Math.round(todaySessions.reduce((sum, s) => sum + Number(s.accuracy), 0) / todaySessions.length)
    : 0;

  const blocks = [
    {
      icon: Gamepad2,
      label: 'Games Played',
      value: gamesPlayed,
      sub: 'today',
      color: 'bg-brand-100 text-brand-700',
      done: gamesPlayed >= 1,
    },
    {
      icon: Trophy,
      label: 'Best Score',
      value: bestScore,
      sub: 'points',
      color: 'bg-accent-100 text-accent-700',
      done: bestScore >= 50,
    },
    {
      icon: Target,
      label: 'Accuracy',
      value: `${avgAccuracy}%`,
      sub: 'correct answers',
      color: 'bg-success-100 text-success-700',
      done: avgAccuracy >= 70,
    },
    {
      icon: CheckCircle2,
      label: 'Reminders Done',
      value: `${completedReminders}/${todayReminders.length}`,
      sub: 'completed',
      color: 'bg-rose-100 text-rose-700',
      done: completedReminders === todayReminders.length && todayReminders.length > 0,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-2xl font-bold text-brand-700 hover:text-brand-800"
      >
        <ArrowLeft className="h-7 w-7" /> Back
      </button>

      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-slate-900">My Progress</h1>
        <p className="mt-2 text-2xl font-semibold text-slate-600">
          {patientName}, here is how you are doing today
        </p>
      </div>

      {loading ? (
        <p className="text-center text-2xl font-semibold text-slate-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {blocks.map((block) => {
            const Icon = block.icon;
            return (
              <div
                key={block.label}
                className={`flex flex-col items-center gap-4 rounded-3xl border-4 p-8 text-center transition-all ${
                  block.done
                    ? 'border-success-300 bg-success-50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className={`flex h-20 w-20 items-center justify-center rounded-2xl ${block.color}`}>
                  <Icon className="h-10 w-10" strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-5xl font-bold text-slate-900">{block.value}</p>
                  <p className="mt-1 text-2xl font-bold text-slate-700">{block.label}</p>
                  <p className="text-lg font-semibold text-slate-500">{block.sub}</p>
                </div>
                {block.done && (
                  <div className="flex items-center gap-2 rounded-full bg-success-500 px-4 py-2 text-white">
                    <CheckCircle2 className="h-6 w-6" />
                    <span className="text-lg font-bold">Goal Met!</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
