
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Habit, DailyLog, Mood } from '../types';
import { MOTIVATIONAL_QUOTES, MOOD_EMOJIS, CATEGORY_COLORS } from '../constants';

interface DashboardProps {
  habits: Habit[];
  todayLog: DailyLog;
  toggleHabit: (id: string, completed: boolean) => void;
  updateHabitProgress?: (id: string, value: number) => void;
  isDarkMode?: boolean;
  toggleDarkMode?: () => void;
}

type SectionKey = 'SUMMARY' | 'QUOTE' | 'WELLNESS' | 'HABITS';

const Dashboard: React.FC<DashboardProps> = ({ habits, todayLog, toggleHabit, updateHabitProgress, isDarkMode, toggleDarkMode }) => {
  const [sectionOrder, setSectionOrder] = useState<SectionKey[]>(() => {
    const saved = localStorage.getItem('zenith_dashboard_order_v2');
    return saved ? JSON.parse(saved) : ['SUMMARY', 'WELLNESS', 'HABITS', 'QUOTE'];
  });

  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem('zenith_dashboard_order_v2', JSON.stringify(sectionOrder));
  }, [sectionOrder]);

  const today = new Date().toISOString().split('T')[0];
  const completedTodayCount = habits.filter(h => h.completedDates.includes(today)).length;
  const totalPossible = habits.length;
  const overallProgress = totalPossible > 0 ? (completedTodayCount / totalPossible) * 100 : 0;
  
  const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const quote = MOTIVATIONAL_QUOTES[dayOfYear % MOTIVATIONAL_QUOTES.length];

  const handleDragStart = (index: number) => setDraggedIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newOrder = [...sectionOrder];
    const item = newOrder.splice(draggedIndex, 1)[0];
    newOrder.splice(index, 0, item);
    setSectionOrder(newOrder);
    setDraggedIndex(index);
  };

  const renderSection = (key: SectionKey) => {
    switch (key) {
      case 'SUMMARY':
        return (
          <section key="summary" className="relative h-56 bg-gradient-to-br from-indigo-600 to-violet-700 dark:from-indigo-700 dark:to-indigo-900 rounded-5xl p-8 overflow-hidden shadow-2xl shadow-indigo-200 dark:shadow-none">
            {/* Background elements */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
            
            <div className="relative z-10 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Your Progress</h2>
                  <p className="text-white text-3xl font-black tracking-tight">Today's Peak</p>
                </div>
                <div className="flex flex-col items-end">
                   <span className="text-white text-4xl font-black">{Math.round(overallProgress)}%</span>
                </div>
              </div>
              
              <div className="w-full space-y-3">
                <div className="flex justify-between items-end">
                  <span className="text-white/80 text-[11px] font-bold">{completedTodayCount} of {totalPossible} rituals complete</span>
                </div>
                <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden backdrop-blur-md">
                  <div 
                    className="bg-white h-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,255,255,0.6)]" 
                    style={{ width: `${overallProgress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </section>
        );
      case 'QUOTE':
        return (
          <section key="quote" className="bg-white dark:bg-slate-900 p-8 rounded-4xl border border-slate-100 dark:border-slate-800 text-center relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-indigo-500/20 rounded-full"></div>
            <span className="text-4xl opacity-10 font-serif absolute top-4 left-6 italic dark:text-white">"</span>
            <p className="text-slate-600 dark:text-slate-300 text-sm font-medium italic leading-relaxed px-4">
              {quote}
            </p>
            <span className="text-4xl opacity-10 font-serif absolute bottom-2 right-6 italic dark:text-white rotate-180">"</span>
          </section>
        );
      case 'WELLNESS':
        return (
          <section key="wellness" className="grid grid-cols-2 gap-4">
            <Link to="/wellness" className="bg-white dark:bg-slate-900 p-6 rounded-4xl border border-slate-100 dark:border-slate-800 flex flex-col items-center group btn-press transition-all hover:border-indigo-200 dark:hover:border-indigo-900 shadow-sm">
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-black mb-4 uppercase tracking-[0.15em]">Mood State</span>
              <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/20 rounded-3xl flex items-center justify-center text-4xl mb-3 shadow-inner group-hover:scale-110 transition-transform">
                {todayLog.mood ? MOOD_EMOJIS[todayLog.mood] : '☁️'}
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{todayLog.mood || 'Check in'}</span>
            </Link>
            <Link to="/wellness" className="bg-white dark:bg-slate-900 p-6 rounded-4xl border border-slate-100 dark:border-slate-800 flex flex-col items-center group btn-press transition-all hover:border-blue-200 dark:hover:border-blue-900 shadow-sm">
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-black mb-4 uppercase tracking-[0.15em]">Hydration</span>
              <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-3xl flex items-center justify-center text-3xl mb-3 shadow-inner group-hover:scale-110 transition-transform">
                💧
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{todayLog.waterIntake} glasses</span>
            </Link>
          </section>
        );
      case 'HABITS':
        return (
          <section key="habits" className="space-y-4">
            <div className="flex justify-between items-center px-2">
              <h2 className="font-black text-slate-900 dark:text-slate-100 text-[10px] uppercase tracking-[0.2em]">Daily Rituals</h2>
              <Link to="/habits" className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 px-3 py-1.5 rounded-full transition-colors">VIEW ALL</Link>
            </div>
            <div className="space-y-3">
              {habits.slice(0, 5).map(habit => {
                const isCompleted = habit.completedDates.includes(today);
                return (
                  <div 
                    key={habit.id}
                    className={`group flex items-center p-5 rounded-4xl border transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-800/50' 
                        : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none'
                    }`}
                  >
                    <button 
                      onClick={() => toggleHabit(habit.id, !isCompleted)}
                      className={`w-14 h-14 rounded-3xl flex items-center justify-center text-xl mr-5 flex-shrink-0 transition-all duration-500 btn-press ${
                        isCompleted ? 'bg-indigo-600 dark:bg-indigo-500 text-white shadow-lg shadow-indigo-200 dark:shadow-none' : 'bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 border border-slate-100 dark:border-slate-700'
                      }`}
                    >
                      {isCompleted ? '✓' : <span className="font-black text-sm">Z</span>}
                    </button>
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">{habit.icon}</span>
                        <div className="flex flex-col truncate">
                          <h3 className={`font-bold text-sm tracking-tight truncate ${isCompleted ? 'text-slate-400 dark:text-slate-600 line-through' : 'text-slate-800 dark:text-slate-100'}`}>
                            {habit.name}
                          </h3>
                          <span className={`text-[9px] font-black uppercase tracking-tighter mt-0.5 ${isCompleted ? 'text-slate-300 dark:text-slate-700' : 'text-indigo-400 dark:text-indigo-500'}`}>
                            {habit.goal || 'Daily'}
                          </span>
                        </div>
                      </div>
                    </div>
                    {isCompleted && (
                      <div className="ml-2 w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000 pb-12">
      <header className="flex justify-between items-center pt-2">
        <div className="flex items-center space-x-2">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none group cursor-pointer hover:rotate-12 transition-transform">
             <span className="text-white font-black text-2xl">Z</span>
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-none">Zenith</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Tracker</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            onClick={toggleDarkMode}
            className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-xl shadow-sm btn-press transition-all"
          >
            {isDarkMode ? '🌞' : '🌙'}
          </button>
          <Link to="/settings" className="w-12 h-12 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl flex items-center justify-center text-2xl shadow-sm btn-press transition-all">
            👤
          </Link>
        </div>
      </header>

      <div className="space-y-8">
        {sectionOrder.map((key, index) => (
          <div 
            key={key} 
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            className={`transition-all duration-500 ${draggedIndex === index ? 'opacity-30 blur-sm scale-95' : 'opacity-100'}`}
          >
            {renderSection(key)}
          </div>
        ))}
      </div>

      <div className="text-center py-6 px-12">
        <div className="h-px w-full bg-slate-100 dark:bg-slate-800 mb-6"></div>
        <p className="text-[10px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.4em] mb-2">Reflect on your path</p>
        <p className="text-xs text-slate-500 dark:text-slate-500 italic">"The best time to plant a tree was 20 years ago. The second best time is now."</p>
      </div>
    </div>
  );
};

export default Dashboard;
