/*
# Cognitive Gaming & Memory Assistance Platform Schema

## Overview
Creates the core data tables for an AI-based cognitive gaming and memory
assistance platform designed for elderly dementia patients. This is a
single-tenant application (no sign-in required), so all policies allow
both the anon and authenticated roles to perform CRUD operations.

## New Tables

### patients
Stores patient profiles managed by caregivers.
- id (uuid, primary key)
- name (text, not null) — patient's display name
- age (int) — patient's age
- care_level (text) — "mild", "moderate", or "severe" dementia stage
- notes (text) — caregiver notes about the patient
- favorite_topics (text[]) — topics the patient enjoys (used for trivia)
- avatar_color (text) — a color key used to render the patient avatar
- created_at (timestamptz)

### game_sessions
Records each cognitive game play session for a patient.
- id (uuid, primary key)
- patient_id (uuid, foreign key -> patients.id, cascade delete)
- game_type (text) — "memory_match" or "sequence_recall"
- score (int) — score achieved in the session
- accuracy (numeric) — percentage of correct responses (0-100)
- duration_seconds (int) — how long the session lasted
- difficulty (text) — "easy", "medium", or "hard"
- completed_at (timestamptz)

### trivia_rounds
Records each AI memory assistant trivia round for a patient.
- id (uuid, primary key)
- patient_id (uuid, foreign key -> patients.id, cascade delete)
- topic (text) — the trivia topic/era selected
- question_count (int) — number of questions in the round
- correct_count (int) — number of correct answers
- engagement_score (numeric) — caregiver-rated engagement 0-100
- completed_at (timestamptz)

## Security
- RLS enabled on all tables.
- All tables allow anon + authenticated full CRUD (single-tenant, shared data).
- Foreign keys cascade deletes so removing a patient cleans up related sessions.
*/

CREATE TABLE IF NOT EXISTS patients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  age int,
  care_level text DEFAULT 'mild',
  notes text DEFAULT '',
  favorite_topics text[] DEFAULT '{}',
  avatar_color text DEFAULT 'teal',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_patients" ON patients;
CREATE POLICY "anon_select_patients" ON patients FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_patients" ON patients;
CREATE POLICY "anon_insert_patients" ON patients FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_patients" ON patients;
CREATE POLICY "anon_update_patients" ON patients FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_patients" ON patients;
CREATE POLICY "anon_delete_patients" ON patients FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  game_type text NOT NULL,
  score int NOT NULL DEFAULT 0,
  accuracy numeric DEFAULT 0,
  duration_seconds int DEFAULT 0,
  difficulty text DEFAULT 'easy',
  completed_at timestamptz DEFAULT now()
);

ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_game_sessions" ON game_sessions;
CREATE POLICY "anon_select_game_sessions" ON game_sessions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_game_sessions" ON game_sessions;
CREATE POLICY "anon_insert_game_sessions" ON game_sessions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_game_sessions" ON game_sessions;
CREATE POLICY "anon_update_game_sessions" ON game_sessions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_game_sessions" ON game_sessions;
CREATE POLICY "anon_delete_game_sessions" ON game_sessions FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS trivia_rounds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  topic text NOT NULL,
  question_count int NOT NULL DEFAULT 0,
  correct_count int NOT NULL DEFAULT 0,
  engagement_score numeric DEFAULT 0,
  completed_at timestamptz DEFAULT now()
);

ALTER TABLE trivia_rounds ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_trivia_rounds" ON trivia_rounds;
CREATE POLICY "anon_select_trivia_rounds" ON trivia_rounds FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_trivia_rounds" ON trivia_rounds;
CREATE POLICY "anon_insert_trivia_rounds" ON trivia_rounds FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_trivia_rounds" ON trivia_rounds;
CREATE POLICY "anon_update_trivia_rounds" ON trivia_rounds FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_trivia_rounds" ON trivia_rounds;
CREATE POLICY "anon_delete_trivia_rounds" ON trivia_rounds FOR DELETE
  TO anon, authenticated USING (true);

CREATE INDEX IF NOT EXISTS idx_game_sessions_patient_id ON game_sessions(patient_id);
CREATE INDEX IF NOT EXISTS idx_trivia_rounds_patient_id ON trivia_rounds(patient_id);
CREATE INDEX IF NOT EXISTS idx_game_sessions_completed_at ON game_sessions(completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_trivia_rounds_completed_at ON trivia_rounds(completed_at DESC);
