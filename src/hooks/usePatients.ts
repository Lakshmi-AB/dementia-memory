import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Patient, PatientInsert } from '@/types';

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await supabase
      .from('patients')
      .select('*')
      .order('created_at', { ascending: false });
    if (err) {
      setError(err.message);
    } else {
      setPatients(data as Patient[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const addPatient = useCallback(
    async (patient: PatientInsert) => {
      const { data, error: err } = await supabase
        .from('patients')
        .insert(patient)
        .select()
        .single();
      if (err) throw err;
      setPatients((prev) => [data as Patient, ...prev]);
      return data as Patient;
    },
    [],
  );

  const deletePatient = useCallback(async (id: string) => {
    const { error: err } = await supabase.from('patients').delete().eq('id', id);
    if (err) throw err;
    setPatients((prev) => prev.filter((p) => p.id !== id));
  }, []);

  return { patients, loading, error, addPatient, deletePatient, refetch: fetchPatients };
}
