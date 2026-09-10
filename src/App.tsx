import { useState, useEffect, useCallback } from 'react';
import Header, { type AppMode } from '@/components/Header';
import CaregiverDashboard from '@/components/CaregiverDashboard';
import GameStation from '@/components/GameStation';
import MemoryAssistant from '@/components/MemoryAssistant';
import ElderlyHome from '@/components/elderly/ElderlyHome';
import ElderlyReminders from '@/components/elderly/ElderlyReminders';
import ElderlyVoiceAssistant from '@/components/elderly/ElderlyVoiceAssistant';
import ElderlyProgress from '@/components/elderly/ElderlyProgress';
import VoiceOnboarding from '@/components/elderly/VoiceOnboarding';
import { useVoiceOnboarding } from '@/hooks/useVoiceOnboarding';
import { getStoredLanguage, type AppLanguage } from '@/lib/languageConfig';
import { usePatients } from '@/hooks/usePatients';

type ElderlyView = 'home' | 'games' | 'reminders' | 'voice' | 'progress';
type AppState = 'onboarding' | 'app';

function App() {
  const [appState, setAppState] = useState<AppState>(() => {
    const stored = getStoredLanguage();
    return stored ? 'app' : 'onboarding';
  });
  const [mode, setMode] = useState<AppMode>('elderly');
  const [elderlyView, setElderlyView] = useState<ElderlyView>('home');
  const [language, setLanguage] = useState<AppLanguage | null>(() => getStoredLanguage());
  const { patients } = usePatients();

  const {
    phase,
    selectedLanguage,
    currentCycleIndex,
    transcript,
    error,
    startOnboarding,
    skipOnboarding,
  } = useVoiceOnboarding();

  const activePatient = patients[0] ?? null;
  const activePatientId = activePatient?.id ?? null;
  const activePatientName = activePatient?.name ?? 'Friend';

  // Start onboarding when app state is onboarding
  useEffect(() => {
    if (appState === 'onboarding') {
      startOnboarding();
    }
  }, [appState, startOnboarding]);

  // Transition to app when onboarding is done
  useEffect(() => {
    if (phase === 'done' && selectedLanguage) {
      setLanguage(selectedLanguage);
      setAppState('app');
    }
  }, [phase, selectedLanguage]);

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'caregiver' ? 'elderly' : 'caregiver'));
  }, []);

  const goElderlyHome = useCallback(() => setElderlyView('home'), []);

  useEffect(() => {
    if (mode === 'caregiver') {
      setElderlyView('home');
    }
  }, [mode]);

  // Onboarding screen
  if (appState === 'onboarding') {
    return (
      <VoiceOnboarding
        phase={phase}
        currentCycleIndex={currentCycleIndex}
        transcript={transcript}
        error={error}
        onSkip={(lang: AppLanguage) => {
          skipOnboarding(lang);
          setLanguage(lang);
          setAppState('app');
        }}
      />
    );
  }

  const currentLanguage = language ?? 'english';

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
              language={currentLanguage}
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
