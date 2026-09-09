import { Gamepad2, Bell, Mic, BarChart3, ArrowLeft } from 'lucide-react';

type ElderlyView = 'home' | 'games' | 'reminders' | 'voice' | 'progress';

interface ElderlyHomeProps {
  onNavigate: (view: ElderlyView) => void;
  patientName: string;
}

const cards: {
  view: Exclude<ElderlyView, 'home'>;
  emoji: string;
  label: string;
  desc: string;
  icon: typeof Gamepad2;
  color: string;
  bg: string;
}[] = [
  {
    view: 'games',
    emoji: '🧠',
    label: 'Play Game',
    desc: 'Memory games to exercise your mind',
    icon: Gamepad2,
    color: 'text-brand-700',
    bg: 'bg-brand-100 hover:bg-brand-200 border-brand-300',
  },
  {
    view: 'reminders',
    emoji: '🔔',
    label: 'My Reminders',
    desc: 'Your schedule for today',
    icon: Bell,
    color: 'text-accent-700',
    bg: 'bg-accent-100 hover:bg-accent-200 border-accent-300',
  },
  {
    view: 'voice',
    emoji: '🎤',
    label: 'Voice Assistant',
    desc: 'Tap and speak to me',
    icon: Mic,
    color: 'text-rose-700',
    bg: 'bg-rose-100 hover:bg-rose-200 border-rose-300',
  },
  {
    view: 'progress',
    emoji: '📊',
    label: 'My Progress',
    desc: 'See how well you are doing',
    icon: BarChart3,
    color: 'text-success-700',
    bg: 'bg-success-100 hover:bg-success-200 border-success-300',
  },
];

export default function ElderlyHome({ onNavigate, patientName }: ElderlyHomeProps) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
          Hello, {patientName}!
        </h1>
        <p className="mt-3 text-2xl font-semibold text-slate-600">
          What would you like to do today?
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.view}
              onClick={() => onNavigate(card.view)}
              className={`flex flex-col items-center gap-4 rounded-3xl border-4 p-10 text-center transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] ${card.bg}`}
            >
              <span className="text-6xl" aria-hidden="true">{card.emoji}</span>
              <Icon className={`h-10 w-10 ${card.color}`} strokeWidth={2.5} />
              <div>
                <h2 className="text-3xl font-bold text-slate-900">{card.label}</h2>
                <p className="mt-1 text-xl font-semibold text-slate-600">{card.desc}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
