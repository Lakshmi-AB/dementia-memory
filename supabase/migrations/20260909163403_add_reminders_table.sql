/*
# Add reminders table for daily schedule

## Overview
Creates a reminders table to store daily scheduled reminders for elderly
patients (e.g. medicine, water, exercise). This is a single-tenant app
with no sign-in, so policies allow anon + authenticated full CRUD.

## New Tables

### reminders
- id (uuid, primary key)
- patient_id (uuid, foreign key -> patients.id, cascade delete)
- title (text, not null) — e.g. "Take Medicine"
- time (text, not null) — e.g. "08:00" in 24h format
- category (text) — "medicine", "water", "exercise", "meal", "other"
- completed (boolean, default false)
- day_of_week (int, 0-6, 0=Sunday) — which day this reminder applies to
- created_at (timestamptz)

## Security
- RLS enabled.
- anon + authenticated full CRUD (single-tenant shared data).
*/

CREATE TABLE IF NOT EXISTS reminders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid REFERENCES patients(id) ON DELETE CASCADE,
  title text NOT NULL,
  time text NOT NULL,
  category text DEFAULT 'other',
  completed boolean NOT NULL DEFAULT false,
  day_of_week int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_reminders" ON reminders;
CREATE POLICY "anon_select_reminders" ON reminders FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_reminders" ON reminders;
CREATE POLICY "anon_insert_reminders" ON reminders FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_reminders" ON reminders;
CREATE POLICY "anon_update_reminders" ON reminders FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_reminders" ON reminders;
CREATE POLICY "anon_delete_reminders" ON reminders FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_reminders_patient_id ON reminders(patient_id);
CREATE INDEX IF NOT EXISTS idx_reminders_day_of_week ON reminders(day_of_week);
