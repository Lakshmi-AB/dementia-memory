import { useState, useEffect } from 'react';
import Header, { type AppMode } from '@/components/Header';
import CaregiverDashboard from '@/components/CaregiverDashboard';
import GameStation from '@/components/GameStation';
import MemoryAssistant from '@/components/MemoryAssistant';
import ElderlyHome from '@/components/elderly/ElderlyHome';
import ElderlyReminders from '@/components/elderly/ElderlyReminders';
import ElderlyVoiceAssistant from '@/components/elderly/ElderlyVoiceAssistant';
import ElderlyProgress from '@/components/elderly/ElderlyProgress';
import { usePatients } from '@/hooks/usePatients';

type ElderlyView = 'home' | 'games' | 'reminders' | 'voice' | 'progress';

function App() {
  const [mode, setMode] = useState<AppMode>('caregiver');
  const [elderlyView, setElderlyView] = useState<ElderlyView>('home');
  const { patients } = usePatients();

  const activePatient = patients[0] ?? null;
  const activePatientId = activePatient?.id ?? null;
  const activePatientName = activePatient?.name ?? 'Friend';

  const toggleMode = () => {
    setMode((prev) => (prev === 'caregiver' ? 'elderly' : 'caregiver'));
  };

  const goElderlyHome = () => setElderlyView('home');

  useEffect(() => {
    if (mode === 'caregiver') {
      setElderlyView('home');
    }
  }, [mode]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        mode={mode}
        onToggleMode={toggleMode}
        elderlyView={elderlyView !== 'home' ? elderlyView : null}
        onElderlyHome={goElderlyHome}
      />

      {mode === 'caregiver' && (
        <main className="p-8">
          <div className="mx-auto max-w-6xl">
            <CaregiverDashboard />
          </div>
        </main>
      )}

      {mode === 'elderly' && (
        <main className="min-h-[calc(100vh-73px)] bg-gradient-to-b from-brand-50 to-slate-50">
          {elderlyView === 'home' && (
            <ElderlyHome
              onNavigate={(v) => setElderlyView(v)}
              patientName={activePatientName}
            />
          )}
          {elderlyView === 'games' && (
            <div className="mx-auto max-w-6xl px-4 py-4">
              <GameStation
                preselectedPatientId={activePatientId}
                onBack={goElderlyHome}
                elderlyMode
              />
            </div>
          )}
          {elderlyView === 'reminders' && (
            <ElderlyReminders onBack={goElderlyHome} patientId={activePatientId} />
          )}
          {elderlyView === 'voice' && (
            <ElderlyVoiceAssistant onBack={goElderlyHome} />
          )}
          {elderlyView === 'progress' && (
            <ElderlyProgress
              onBack={goElderlyHome}
              patientId={activePatientId}
              patientName={activePatientName}
            />
          )}
        </main>
      )}
    </div>
  );
}

export default App;
