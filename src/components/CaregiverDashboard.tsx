import { useEffect, useState } from 'react';
import {
  UserPlus, Users, Gamepad2, Brain, Trash2, Clock, Target,
  TrendingUp, Award, CheckCircle2, ChevronRight, Calendar,
} from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { useGameSessions } from '@/hooks/useGameSessions';
import { useTriviaRounds } from '@/hooks/useTriviaRounds';
import { useReminders } from '@/hooks/useReminders';
import PatientForm from '@/components/PatientForm';
import WeeklyAccuracyChart from '@/components/WeeklyAccuracyChart';
import type { Patient, GameSession, TriviaRound, Reminder } from '@/types';

const colorMap: Record<string, string> = {
  teal: '#14b8a6',
  blue: '#3b82f6',
  amber: '#f59e0b',
  rose: '#f43f5e',
  violet: '#8b5cf6',
  emerald: '#10b981',
};

const careLevelStyles: Record<string, string> = {
  mild: 'bg-success-100 text-success-700',
  moderate: 'bg-warning-100 text-warning-700',
  severe: 'bg-error-100 text-error-700',
};

export default function CaregiverDashboard() {
  const { patients, loading, error, addPatient, deletePatient } = usePatients();
  const { sessions, loading: sessionsLoading } = useGameSessions();
  const { fetchRounds } = useTriviaRounds();
  const { reminders } = useReminders();
  const [showForm, setShowForm] = useState(false);
  const [triviaRounds, setTriviaRounds] = useState<TriviaRound[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  useEffect(() => {
    fetchRounds().then(setTriviaRounds).catch(() => {});
  }, [fetchRounds, patients.length]);

  useEffect(() => {
    if (patients.length > 0 && !selectedPatientId) {
      setSelectedPatientId(patients[0].id);
    }
  }, [patients, selectedPatientId]);

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);
  const patientSessions = sessions.filter((s) => s.patient_id === selectedPatientId);
  const patientTrivia = triviaRounds.filter((t) => t.patient_id === selectedPatientId);
  const patientReminders = reminders.filter((r) => r.patient_id === selectedPatientId);
  const today = new Date().getDay();
  const todayReminders = patientReminders.filter((r) => r.day_of_week === today || r.day_of_week === 0);
  const completedReminders = todayReminders.filter((r) => r.completed).length;

  const gamesPlayed = patientSessions.length;
  const avgAccuracy = patientSessions.length > 0
    ? Math.round(patientSessions.reduce((sum, s) => sum + Number(s.accuracy), 0) / patientSessions.length)
    : 0;
  const memoryScore = patientSessions.length > 0
    ? Math.round(patientSessions.reduce((sum, s) => sum + s.score, 0) / patientSessions.length)
    : 0;

  const handleDelete = async (id: string) => {
    if (confirm('Remove this patient? This will also delete all their game and trivia history.')) {
      try {
        await deletePatient(id);
        if (selectedPatientId === id) setSelectedPatientId(null);
      } catch {
        // handled by error state
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-xl font-semibold text-slate-500">Loading patient data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Caregiver Dashboard</h1>
          <p className="mt-1 text-lg font-semibold text-slate-500">
            Monitor cognitive progress and manage patients
          </p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-primary">
          <UserPlus className="h-6 w-6" /> Add Patient
        </button>
      </div>

      {error && (
        <div className="rounded-xl bg-error-50 border-2 border-error-200 px-4 py-3 text-error-700 font-semibold">
          {error}
        </div>
      )}

      {patients.length === 0 ? (
        <div className="card-pad text-center">
          <Users className="mx-auto h-16 w-16 text-slate-300" />
          <h3 className="mt-4 text-xl font-bold text-slate-700">No patients yet</h3>
          <p className="mt-1 text-lg font-semibold text-slate-500">
            Add your first patient to start tracking their cognitive progress.
          </p>
          <button onClick={() => setShowForm(true)} className="btn-primary mt-6">
            <UserPlus className="h-6 w-6" /> Add First Patient
          </button>
        </div>
      ) : (
        <>
          {/* Patient Selector Tabs */}
          <div className="flex flex-wrap gap-2">
            {patients.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedPatientId(p.id)}
                className={`flex items-center gap-2.5 rounded-xl border-2 px-4 py-2.5 transition-all ${
                  selectedPatientId === p.id
                    ? 'border-brand-600 bg-brand-50'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ backgroundColor: colorMap[p.avatar_color] ?? '#14b8a6' }}
                >
                  {p.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-base font-bold text-slate-900">{p.name}</span>
              </button>
            ))}
          </div>

          {selectedPatient && (
            <div className="space-y-6 animate-fade-in">
              {/* Profile Overview */}
              <div className="card overflow-hidden">
                <div className="flex items-center gap-5 p-6">
                  <div
                    className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full text-3xl font-bold text-white"
                    style={{ backgroundColor: colorMap[selectedPatient.avatar_color] ?? '#14b8a6' }}
                  >
                    {selectedPatient.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl font-bold text-slate-900">{selectedPatient.name}</h2>
                      <span className={`badge ${careLevelStyles[selectedPatient.care_level] ?? careLevelStyles.mild}`}>
                        {selectedPatient.care_level}
                      </span>
                    </div>
                    <p className="mt-1 text-base font-semibold text-slate-500">
                      {selectedPatient.age ? `${selectedPatient.age} years old` : 'Age not set'}
                      {selectedPatient.favorite_topics.length > 0 && ` · Interests: ${selectedPatient.favorite_topics.join(', ')}`}
                    </p>
                    {selectedPatient.notes && (
                      <p className="mt-1 text-sm text-slate-500">{selectedPatient.notes}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(selectedPatient.id)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-error-50 hover:text-error-600"
                    aria-label="Remove patient"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Activity Summary Cards */}
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <ActivityCard
                  icon={<Gamepad2 className="h-7 w-7" />}
                  label="Games Played"
                  value={gamesPlayed}
                  sub="total sessions"
                  color="brand"
                />
                <ActivityCard
                  icon={<Target className="h-7 w-7" />}
                  label="Avg. Accuracy"
                  value={`${avgAccuracy}%`}
                  sub="correct answers"
                  color="success"
                />
                <ActivityCard
                  icon={<Award className="h-7 w-7" />}
                  label="Memory Score"
                  value={memoryScore}
                  sub="avg points"
                  color="accent"
                />
                <ActivityCard
                  icon={<CheckCircle2 className="h-7 w-7" />}
                  label="Reminders Done"
                  value={`${completedReminders}/${todayReminders.length}`}
                  sub="today"
                  color="rose"
                />
              </div>

              {/* Weekly Accuracy Chart */}
              <WeeklyAccuracyChart sessions={patientSessions} loading={sessionsLoading} />

              {/* Recent Activity */}
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <div className="card-pad">
                  <div className="mb-4 flex items-center gap-2">
                    <Gamepad2 className="h-5 w-5 text-brand-600" />
                    <h3 className="text-lg font-bold text-slate-900">Recent Game Sessions</h3>
                  </div>
                  {patientSessions.length === 0 ? (
                    <p className="text-base font-semibold text-slate-400">No games played yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {patientSessions.slice(0, 5).map((s) => (
                        <div key={s.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                          <div className="flex items-center gap-2">
                            <Gamepad2 className="h-4 w-4 text-brand-600" />
                            <span className="text-sm font-semibold capitalize text-slate-700">
                              {s.game_type.replace('_', ' ')}
                            </span>
                            <span className="text-sm text-slate-400">·</span>
                            <span className="text-sm font-semibold text-slate-500 capitalize">{s.difficulty}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                            <span>{s.score} pts</span>
                            <span className="text-slate-400">·</span>
                            <span>{Number(s.accuracy)}%</span>
                            <span className="text-slate-400">·</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {s.duration_seconds}s
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="card-pad">
                  <div className="mb-4 flex items-center gap-2">
                    <Brain className="h-5 w-5 text-accent-600" />
                    <h3 className="text-lg font-bold text-slate-900">Recent Trivia Rounds</h3>
                  </div>
                  {patientTrivia.length === 0 ? (
                    <p className="text-base font-semibold text-slate-400">No trivia rounds yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {patientTrivia.slice(0, 5).map((t) => (
                        <div key={t.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2">
                          <div className="flex items-center gap-2">
                            <Brain className="h-4 w-4 text-accent-600" />
                            <span className="text-sm font-semibold text-slate-700">{t.topic}</span>
                          </div>
                          <div className="flex items-center gap-3 text-sm font-semibold text-slate-600">
                            <span>{t.correct_count}/{t.question_count} correct</span>
                            <span className="text-slate-400">·</span>
                            <span>{Number(t.engagement_score)}% engagement</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {showForm && (
        <PatientForm
          onSubmit={addPatient}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

function ActivityCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  sub: string;
  color: 'brand' | 'accent' | 'success' | 'rose';
}) {
  const colorClasses = {
    brand: 'bg-brand-100 text-brand-700',
    accent: 'bg-accent-100 text-accent-700',
    success: 'bg-success-100 text-success-700',
    rose: 'bg-rose-100 text-rose-700',
  };
  return (
    <div className="card-pad">
      <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-xl ${colorClasses[color]}`}>
        {icon}
      </div>
      <p className="text-3xl font-bold text-slate-900">{value}</p>
      <p className="text-base font-bold text-slate-700">{label}</p>
      <p className="text-sm font-semibold text-slate-500">{sub}</p>
    </div>
  );
}
