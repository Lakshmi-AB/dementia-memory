export type CareLevel = 'mild' | 'moderate' | 'severe';
export type GameType = 'memory_match' | 'sequence_recall' | 'object_recall';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type ReminderCategory = 'medicine' | 'water' | 'exercise' | 'meal' | 'other';

export interface Patient {
  id: string;
  name: string;
  age: number | null;
  care_level: CareLevel;
  notes: string;
  favorite_topics: string[];
  avatar_color: string;
  created_at: string;
}

export interface GameSession {
  id: string;
  patient_id: string;
  game_type: GameType;
  score: number;
  accuracy: number;
  duration_seconds: number;
  difficulty: Difficulty;
  completed_at: string;
}

export interface TriviaRound {
  id: string;
  patient_id: string;
  topic: string;
  question_count: number;
  correct_count: number;
  engagement_score: number;
  completed_at: string;
}

export interface Reminder {
  id: string;
  patient_id: string | null;
  title: string;
  time: string;
  category: ReminderCategory;
  completed: boolean;
  day_of_week: number;
  created_at: string;
}

export type PatientInsert = Omit<Patient, 'id' | 'created_at'>;
export type GameSessionInsert = Omit<GameSession, 'id' | 'completed_at'>;
export type TriviaRoundInsert = Omit<TriviaRound, 'id' | 'completed_at'>;
export type ReminderInsert = Omit<Reminder, 'id' | 'created_at'>;

export interface GameResult {
  score: number;
  accuracy: number;
  duration_seconds: number;
  difficulty: Difficulty;
  mistakes: number;
}

export type GameSessionResult = Omit<GameSessionInsert, 'patient_id' | 'game_type'> & {
  mistakes: number;
};
