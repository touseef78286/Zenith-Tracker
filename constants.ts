
import { HabitCategory, Mood, Habit } from './types';

export const CATEGORY_COLORS: Record<HabitCategory, string> = {
  [HabitCategory.MENTAL_HEALTH]: 'bg-purple-100 text-purple-700 border-purple-200',
  [HabitCategory.PHYSICAL_HEALTH]: 'bg-green-100 text-green-700 border-green-200',
  [HabitCategory.STUDY]: 'bg-blue-100 text-blue-700 border-blue-200',
  [HabitCategory.SELF_CARE]: 'bg-pink-100 text-pink-700 border-pink-200',
};

export const MOOD_EMOJIS: Record<Mood, string> = {
  [Mood.HAPPY]: '😊',
  [Mood.NORMAL]: '😐',
  [Mood.SAD]: '😔',
  [Mood.STRESSED]: '😫',
  [Mood.ENERGETIC]: '⚡',
};

export const INITIAL_HABITS: Habit[] = [
  { id: '1', name: 'Meditate for 10 mins', category: HabitCategory.MENTAL_HEALTH, icon: '🧘', completedDates: [], streak: 0 },
  { id: '2', name: 'Read 10 pages', category: HabitCategory.STUDY, icon: '📖', completedDates: [], streak: 0 },
  { id: '3', name: 'Morning walk', category: HabitCategory.PHYSICAL_HEALTH, icon: '🚶', completedDates: [], streak: 0 },
];

export const MOTIVATIONAL_QUOTES = [
  "Your direction is more important than your speed.",
  "Small daily improvements are the key to staggering long-term results.",
  "Be stubborn about your goals but flexible about your methods.",
  "Growth is often a quiet, slow process.",
  "Self-care is not a luxury, it's a necessity.",
  "You don't have to be perfect to be amazing.",
  "Success is the sum of small efforts repeated day in and day out."
];

export const HABIT_ICONS = ['🧘', '📖', '🚶', '💧', '🍎', '💻', '💤', '🌿', '🎯', '⚡', '🏃', '🎨', '🎹', '🧹', '🥗'];
