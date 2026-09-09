import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Reminder, ReminderInsert } from '@/types';

export function useReminders(patientId?: string) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReminders = useCallback(async () => {
    setLoading(true);
    setError(null);
    let query = supabase.from('reminders').select('*').order('time', { ascending: true });
    if (patientId) query = query.eq('patient_id', patientId);
    const { data, error: err } = await query;
    if (err) {
      setError(err.message);
    } else {
      setReminders(data as Reminder[]);
    }
    setLoading(false);
  }, [patientId]);

  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  const addReminder = useCallback(async (reminder: ReminderInsert) => {
    const { data, error: err } = await supabase
      .from('reminders')
      .insert(reminder)
      .select()
      .single();
    if (err) throw err;
    setReminders((prev) => [...prev, data as Reminder].sort((a, b) => a.time.localeCompare(b.time)));
    return data as Reminder;
  }, []);

  const toggleReminder = useCallback(async (id: string, completed: boolean) => {
    const { error: err } = await supabase
      .from('reminders')
      .update({ completed })
      .eq('id', id);
    if (err) throw err;
    setReminders((prev) =>
      prev.map((r) => (r.id === id ? { ...r, completed } : r)),
    );
  }, []);

  const deleteReminder = useCallback(async (id: string) => {
    const { error: err } = await supabase.from('reminders').delete().eq('id', id);
    if (err) throw err;
    setReminders((prev) => prev.filter((r) => r.id !== id));
  }, []);

  return { reminders, loading, error, addReminder, toggleReminder, deleteReminder, refetch: fetchReminders };
}
