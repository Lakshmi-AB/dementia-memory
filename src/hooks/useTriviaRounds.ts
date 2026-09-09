import { useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { TriviaRound, TriviaRoundInsert } from '@/types';

export function useTriviaRounds() {
  const fetchRounds = useCallback(async (patientId?: string) => {
    let query = supabase
      .from('trivia_rounds')
      .select('*')
      .order('completed_at', { ascending: false });
    if (patientId) query = query.eq('patient_id', patientId);
    const { data, error } = await query;
    if (error) throw error;
    return data as TriviaRound[];
  }, []);

  const addRound = useCallback(async (round: TriviaRoundInsert) => {
    const { data, error } = await supabase
      .from('trivia_rounds')
      .insert(round)
      .select()
      .single();
    if (error) throw error;
    return data as TriviaRound;
  }, []);

  return { fetchRounds, addRound };
}
