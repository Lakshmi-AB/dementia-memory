import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { GameSession, GameSessionInsert } from '@/types';

export function useGameSessions(patientId?: string) {
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('game_sessions')
      .select('*')
      .order('completed_at', { ascending: false });
    if (patientId) query = query.eq('patient_id', patientId);
    const { data, error } = await query;
    if (!error && data) setSessions(data as GameSession[]);
    setLoading(false);
  }, [patientId]);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const addSession = useCallback(async (session: GameSessionInsert) => {
    const { data, error } = await supabase
      .from('game_sessions')
      .insert(session)
      .select()
      .single();
    if (error) throw error;
    setSessions((prev) => [data as GameSession, ...prev]);
    return data as GameSession;
  }, []);

  return { sessions, loading, fetchSessions, addSession };
}
