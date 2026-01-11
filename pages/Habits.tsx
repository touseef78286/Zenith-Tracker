
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Habit, HabitCategory } from '../types';
import { CATEGORY_COLORS, HABIT_ICONS } from '../constants';

interface HabitsProps {
  habits: Habit[];
  toggleHabit: (id: string, completed: boolean) => void;
  addHabit: (name: string, category: HabitCategory, icon: string, goal?: string, reminderTime?: string) => void;
  editHabit: (id: string, name: string, category: HabitCategory, icon: string, goal?: string, reminderTime?: string) => void;
  deleteHabit: (id: string) => void;
}

const SMART_SUGGESTIONS = [
  { name: 'Deep Work Session', cat: HabitCategory.STUDY, icon: '💻', goal: '60 mins', reminder: '09:00' },
  { name: 'Posture Check', cat: HabitCategory.SELF_CARE, icon: '🧘', goal: 'Every hour', reminder: '14:00' },
  { name: 'No Junk Food', cat: HabitCategory.PHYSICAL_HEALTH, icon: '🍎', goal: 'All day', reminder: '' },
  { name: 'Gratitude Journal', cat: HabitCategory.MENTAL_HEALTH, icon: '🌿', goal: '3 things', reminder: '21:00' },
  { name: 'Morning Stretch', cat: HabitCategory.PHYSICAL_HEALTH, icon: '🏃', goal: '5 mins', reminder: '07:30' },
  { name: 'Read for Fun', cat: HabitCategory.SELF_CARE, icon: '📖', goal: '10 pages', reminder: '20:30' },
];

const Habits: React.FC<HabitsProps> = ({ habits, toggleHabit, addHabit, editHabit, deleteHabit }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAdding, setIsAdding] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [newReminderTime, setNewReminderTime] = useState('');
  const [newCategory, setNewCategory] = useState<HabitCategory>(HabitCategory.SELF_CARE);
  const [newIcon, setNewIcon] = useState(HABIT_ICONS[0]);
  
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('add') === 'true') {
      setIsAdding(true);
      navigate('/habits', { replace: true });
    }
  }, [location, navigate]);

  const handleSave = () => {
    if (newName.trim()) {
      if (editingHabitId) {
        editHabit(editingHabitId, newName.trim(), newCategory, newIcon, newGoal.trim() || undefined, newReminderTime || undefined);
      } else {
        addHabit(newName.trim(), newCategory, newIcon, newGoal.trim() || undefined, newReminderTime || undefined);
      }
      resetForm();
    }
  };

  const resetForm = () => {
    setNewName('');
    setNewGoal('');
    setNewReminderTime('');
    setEditingHabitId(null);
    setIsAdding(false);
    setNewCategory(HabitCategory.SELF_CARE);
    setNewIcon(HABIT_ICONS[0]);
  };

  const startEdit = (habit: Habit) => {
    setEditingHabitId(habit.id);
    setNewName(habit.name);
    setNewGoal(habit.goal || '');
    setNewReminderTime(habit.reminderTime || '');
    setNewCategory(habit.category);
    setNewIcon(habit.icon || HABIT_ICONS[0]);
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const applySuggestion = (s: typeof SMART_SUGGESTIONS[0]) => {
    addHabit(s.name, s.cat, s.icon, s.goal, s.reminder);
    resetForm();
  };

  const toggleCategoryCollapse = (category: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-right duration-300">
      <header className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate(-1)}
            aria-label="Go back"
            className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-200 transition-all active:scale-95"
          >
            ←
          </button>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{editingHabitId ? 'Edit Habit' : 'My Habits'}</h1>
        </div>
        <button 
          onClick={() => {
            if (isAdding) resetForm();
            else setIsAdding(true);
          }}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 ${
            isAdding ? 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rotate-0' : 'bg-indigo-600 dark:bg-indigo-500 text-white hover:scale-105 rotate-0'
          }`}
        >
          {isAdding ? '✕' : '+'}
        </button>
      </header>

      {isAdding && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-xl border border-indigo-50 dark:border-indigo-900/30 space-y-6 animate-in zoom-in-95 duration-200 transition-colors">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-2">{editingHabitId ? 'Update Habit Details' : 'Create Custom Habit'}</h3>
              <div className="flex items-center space-x-4">
                 <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                   {newIcon}
                 </div>
                 <input 
                  type="text"
                  placeholder="Name your habit..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="flex-grow p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 transition-all font-medium text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1 block mb-2">Goal (Optional)</label>
                <input 
                  type="text"
                  placeholder="e.g. 10 pages"
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 transition-all font-medium text-sm text-slate-800 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1 block mb-2">Reminder</label>
                <input 
                  type="time"
                  value={newReminderTime}
                  onChange={(e) => setNewReminderTime(e.target.value)}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-400/10 transition-all font-medium text-sm text-slate-800 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Category</label>
            <div className="flex flex-wrap gap-2">
              {Object.values(HabitCategory).map(cat => (
                <button
                  key={cat}
                  onClick={() => setNewCategory(cat)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border ${
                    newCategory === cat 
                      ? 'bg-indigo-600 dark:bg-indigo-500 text-white border-indigo-600 dark:border-indigo-500 shadow-md' 
                      : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">Pick an Icon</label>
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-2 bg-slate-50 dark:bg-slate-800 rounded-2xl hide-scrollbar border border-slate-100 dark:border-slate-700 shadow-inner">
              {HABIT_ICONS.map(icon => (
                <button
                  key={icon}
                  onClick={() => setNewIcon(icon)}
                  className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all ${
                    newIcon === icon 
                      ? 'bg-white dark:bg-slate-700 border-2 border-indigo-500 dark:border-indigo-400 scale-110 shadow-sm' 
                      : 'hover:bg-indigo-100/50 dark:hover:bg-indigo-900/30 grayscale opacity-70 hover:grayscale-0 hover:opacity-100'
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={!newName.trim()}
            className="w-full bg-indigo-600 dark:bg-indigo-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 dark:hover:bg-indigo-600 disabled:bg-slate-200 dark:disabled:bg-slate-800 disabled:shadow-none transition-all active:scale-[0.98]"
          >
            {editingHabitId ? 'Save Changes' : 'Add Habit'}
          </button>
        </div>
      )}

      <div className="space-y-4 pb-8">
        {Object.values(HabitCategory).map(category => {
          const categoryHabits = habits.filter(h => h.category === category);
          if (categoryHabits.length === 0) return null;
          
          const isCollapsed = collapsedCategories[category];

          return (
            <div key={category} className="space-y-3">
              <button 
                onClick={() => toggleCategoryCollapse(category)}
                className="w-full flex items-center justify-between group px-2 py-1 focus:outline-none"
              >
                <div className="flex items-center space-x-2">
                  <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isCollapsed ? 'text-slate-300 dark:text-slate-600' : 'text-slate-400 dark:text-slate-500'}`}>
                    {category}
                  </span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${isCollapsed ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500' : 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 dark:text-indigo-400'}`}>
                    {categoryHabits.length}
                  </span>
                </div>
                <div className={`text-slate-300 dark:text-slate-600 group-hover:text-indigo-400 transition-all duration-300 ${isCollapsed ? 'rotate-0' : 'rotate-180'}`}>
                  ▼
                </div>
              </button>
              
              {!isCollapsed && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  {categoryHabits.map(habit => {
                    const isCompleted = habit.completedDates.includes(today);
                    return (
                      <div key={habit.id} className="group relative flex items-center p-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
                        <button 
                          onClick={() => toggleHabit(habit.id, !isCompleted)}
                          className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mr-4 transition-all duration-300 ${
                            isCompleted ? 'bg-indigo-500 dark:bg-indigo-600 text-white scale-110 shadow-md animate-check-bounce' : 'bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 border border-slate-100 dark:border-slate-700'
                          }`}
                        >
                          {isCompleted ? (
                            <span>✓</span>
                          ) : (
                            <span className="text-slate-300 dark:text-slate-600 font-black text-xs group-hover:text-indigo-300 dark:group-hover:text-indigo-400 transition-colors">Z</span>
                          )}
                        </button>
                        <div className="flex-grow">
                          <div className="flex items-center space-x-2">
                            <span className={`text-xl ${isCompleted ? 'opacity-40 grayscale' : ''}`}>
                              {habit.icon || '✨'}
                            </span>
                            <div className="flex flex-col">
                              <h3 className={`font-semibold text-sm transition-all leading-tight ${isCompleted ? 'text-slate-400 dark:text-slate-600 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                                {habit.name}
                              </h3>
                              <div className="flex items-center space-x-3 mt-0.5">
                                {habit.goal && (
                                  <div className={`flex items-center space-x-1 ${isCompleted ? 'text-slate-300 dark:text-slate-700' : 'text-slate-400 dark:text-slate-500'}`}>
                                    <span className="text-[9px] font-bold uppercase tracking-tighter opacity-70">Goal:</span>
                                    <span className="text-[10px] font-medium">{habit.goal}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => startEdit(habit)}
                            className="p-2 text-slate-300 dark:text-slate-600 hover:text-indigo-400 dark:hover:text-indigo-300 transition-colors"
                          >
                            ✏️
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Habits;
