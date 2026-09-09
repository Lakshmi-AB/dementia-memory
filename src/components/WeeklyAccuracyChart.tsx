import { TrendingUp } from 'lucide-react';
import type { GameSession } from '@/types';

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface WeeklyAccuracyChartProps {
  sessions: GameSession[];
  loading?: boolean;
}

export default function WeeklyAccuracyChart({ sessions, loading }: WeeklyAccuracyChartProps) {
  const today = new Date().getDay();

  const dayAccuracy: number[] = dayNames.map((_, dayIdx) => {
    const daySessions = sessions.filter((s) => {
      const d = new Date(s.completed_at).getDay();
      return d === dayIdx;
    });
    if (daySessions.length === 0) return 0;
    return Math.round(daySessions.reduce((sum, s) => sum + Number(s.accuracy), 0) / daySessions.length);
  });

  const maxBar = 100;
  const hasData = sessions.length > 0;

  return (
    <div className="card-pad">
      <div className="mb-6 flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-brand-600" />
        <h3 className="text-lg font-bold text-slate-900">Weekly Cognitive Accuracy</h3>
      </div>

      {loading ? (
        <p className="text-base font-semibold text-slate-400">Loading chart...</p>
      ) : !hasData ? (
        <div className="py-8 text-center">
          <TrendingUp className="mx-auto h-12 w-12 text-slate-300" />
          <p className="mt-2 text-base font-semibold text-slate-500">
            No game data yet. Accuracy will appear here after the first game session.
          </p>
        </div>
      ) : (
        <div className="flex items-end justify-between gap-3" style={{ height: '220px' }}>
          {dayLabels.map((day, i) => {
            const accuracy = dayAccuracy[i];
            const heightPct = (accuracy / maxBar) * 100;
            const isToday = i === today;
            const hasSessions = sessions.some((s) => new Date(s.completed_at).getDay() === i);

            return (
              <div key={day} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end justify-center">
                  <div
                    className={`w-full max-w-[60px] rounded-t-lg transition-all duration-500 ${
                      isToday
                        ? 'bg-gradient-to-t from-brand-600 to-brand-400'
                        : hasSessions
                          ? 'bg-gradient-to-t from-brand-400 to-brand-300'
                          : 'bg-slate-200'
                    }`}
                    style={{ height: `${hasSessions ? Math.max(heightPct, 4) : 4}%` }}
                    title={hasSessions ? `${accuracy}% accuracy` : 'No sessions'}
                  >
                    {hasSessions && accuracy > 15 && (
                      <span className="flex h-full items-center justify-center text-sm font-bold text-white">
                        {accuracy}%
                      </span>
                    )}
                  </div>
                </div>
                <span className={`text-sm font-bold ${isToday ? 'text-brand-700' : 'text-slate-500'}`}>
                  {day}
                </span>
                {isToday && <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
