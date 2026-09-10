import { useEffect, useState } from 'react';
import { ArrowLeft, Bell, Check, Pill, Droplet, Dumbbell, Utensils, Bell as BellIcon } from 'lucide-react';
import { useReminders } from '@/hooks/useReminders';
import { getLanguageConfig, type AppLanguage } from '@/lib/languageConfig';
import type { Reminder, ReminderCategory } from '@/types';

const categoryIcons: Record<ReminderCategory, typeof Pill> = {
  medicine: Pill,
  water: Droplet,
  exercise: Dumbbell,
  meal: Utensils,
  other: BellIcon,
};

const categoryColors: Record<ReminderCategory, string> = {
  medicine: 'bg-rose-100 text-rose-700',
  water: 'bg-brand-100 text-brand-700',
  exercise: 'bg-success-100 text-success-700',
  meal: 'bg-accent-100 text-accent-700',
  other: 'bg-slate-100 text-slate-700',
};

const defaultReminders: Omit<Reminder, 'id' | 'created_at'>[] = [
  { patient_id: null, title: 'Take Morning Medicine', time: '08:00', category: 'medicine', completed: false, day_of_week: new Date().getDay() },
  { patient_id: null, title: 'Drink Water', time: '10:00', category: 'water', completed: false, day_of_week: new Date().getDay() },
  { patient_id: null, title: 'Morning Walk', time: '11:00', category: 'exercise', completed: false, day_of_week: new Date().getDay() },
  { patient_id: null, title: 'Lunch', time: '13:00', category: 'meal', completed: false, day_of_week: new Date().getDay() },
  { patient_id: null, title: 'Afternoon Medicine', time: '15:00', category: 'medicine', completed: false, day_of_week: new Date().getDay() },
  { patient_id: null, title: 'Drink Water', time: '17:00', category: 'water', completed: false, day_of_week: new Date().getDay() },
  { patient_id: null, title: 'Evening Meal', time: '19:00', category: 'meal', completed: false, day_of_week: new Date().getDay() },
  { patient_id: null, title: 'Night Medicine', time: '21:00', category: 'medicine', completed: false, day_of_week: new Date().getDay() },
];

interface ElderlyRemindersProps {
  onBack: () => void;
  patientId: string | null;
  language: AppLanguage;
}

export default function ElderlyReminders({ onBack, patientId, language }: ElderlyRemindersProps) {
  const t = getLanguageConfig(language).t;
  const { reminders, loading, toggleReminder, addReminder } = useReminders(patientId ?? undefined);
  const [seeded, setSeeded] = useState(false);

  useEffect(() => {
    if (!loading && reminders.length === 0 && !seeded) {
      setSeeded(true);
      const today = new Date().getDay();
      defaultReminders.forEach(async (r) => {
        try {
          await addReminder({ ...r, patient_id: patientId, day_of_week: today });
        } catch {
          // ignore seeding errors
        }
      });
    }
  }, [loading, reminders.length, seeded, addReminder, patientId]);

  const todayReminders = reminders.filter((r) => r.day_of_week === new Date().getDay() || r.day_of_week === 0);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <button
        onClick={onBack}
        className="mb-6 flex items-center gap-2 text-2xl font-bold text-brand-700 hover:text-brand-800"
      >
        <ArrowLeft className="h-7 w-7" /> {t.back}
      </button>

      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-accent-100 text-accent-700">
          <Bell className="h-10 w-10" strokeWidth={2.5} />
        </div>
        <h1 className="text-4xl font-bold text-slate-900">{t.navReminders}</h1>
        <p className="mt-2 text-2xl font-semibold text-slate-600">{t.remindersSubtitle}</p>
      </div>

      {loading ? (
        <p className="text-center text-2xl font-semibold text-slate-500">{t.loading}</p>
      ) : (
        <div className="space-y-4">
          {todayReminders.length === 0 ? (
            <div className="card-pad text-center">
              <p className="text-2xl font-semibold text-slate-500">{t.noReminders}</p>
            </div>
          ) : (
            todayReminders.map((reminder) => {
              const Icon = categoryIcons[reminder.category] ?? BellIcon;
              return (
                <button
                  key={reminder.id}
                  onClick={() => toggleReminder(reminder.id, !reminder.completed)}
                  className={`flex w-full items-center gap-5 rounded-2xl border-4 p-6 text-left transition-all hover:shadow-md ${
                    reminder.completed
                      ? 'border-success-300 bg-success-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${categoryColors[reminder.category]}`}>
                    <Icon className="h-8 w-8" strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <p className={`text-2xl font-bold ${reminder.completed ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                      {reminder.title}
                    </p>
                    <p className="text-xl font-semibold text-slate-500">
                      {formatTime(reminder.time)}
                    </p>
                  </div>
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full border-4 transition-all ${
                    reminder.completed
                      ? 'border-success-500 bg-success-500 text-white'
                      : 'border-slate-300 bg-white'
                  }`}>
                    {reminder.completed && <Check className="h-7 w-7" strokeWidth={3} />}
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

function formatTime(time24: string): string {
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const displayH = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${displayH}:${String(m).padStart(2, '0')} ${period}`;
}
