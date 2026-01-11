
export enum HabitCategory {
  MENTAL_HEALTH = 'Mental Health',
  PHYSICAL_HEALTH = 'Physical Health',
  STUDY = 'Study',
  SELF_CARE = 'Self-Care'
}

export enum Mood {
  HAPPY = 'Happy',
  NORMAL = 'Normal',
  SAD = 'Sad',
  STRESSED = 'Stressed',
  ENERGETIC = 'Energetic'
}

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  icon?: string;
  goal?: string; // e.g., '10 pages', '30 minutes'
  reminderTime?: string; // e.g., '08:00'
  completedDates: string[]; // ISO Strings (YYYY-MM-DD)
  streak: number;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  mood: Mood | null;
  stressLevel: number; // 0-10
  journal: string;
  waterIntake: number; // Cups/Liters
  sleepHours: number;
  exerciseMinutes: number;
  habitProgress?: Record<string, number>; // habitId -> current numeric value
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface UserProfile {
  name: string;
  streak: number;
  totalCheckIns: number;
}
