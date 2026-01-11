
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits';
import Wellness from './pages/Wellness';
import Insights from './pages/Insights';
import Welcome from './pages/Welcome';
import Settings from './pages/Settings';
import { Habit, DailyLog, HabitCategory } from './types';
import { INITIAL_HABITS } from './constants';

const App: React.FC = () => {
  const [showIntro, setShowIntro] = useState(() => {
    return !sessionStorage.getItem('zenith_intro_seen');
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('zenith_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('zenith_habits');
    return saved ? JSON.parse(saved) : INITIAL_HABITS;
  });

  const [logs, setLogs] = useState<DailyLog[]>(() => {
    const saved = localStorage.getItem('zenith_logs');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('zenith_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('zenith_theme', 'light');
    }
  }, [isDarkMode]);

  useEffect(() => {
    localStorage.setItem('zenith_habits', JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem('zenith_logs', JSON.stringify(logs));
  }, [logs]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  const finishIntro = () => {
    sessionStorage.setItem('zenith_intro_seen', 'true');
    setShowIntro(false);
  };

  const today = new Date().toISOString().split('T')[0];
  const todayLog = logs.find(log => log.date === today) || {
    date: today,
    mood: null,
    stressLevel: 5,
    journal: '',
    waterIntake: 0,
    sleepHours: 0,
    exerciseMinutes: 0,
    habitProgress: {}
  };

  const updateHabit = (id: string, completed: boolean) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;
    const match = habit.goal?.match(/\d+/);
    const target = match ? parseInt(match[0]) : 1;
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const dates = completed 
          ? [...new Set([...h.completedDates, today])] 
          : h.completedDates.filter(d => d !== today);
        return { ...h, completedDates: dates };
      }
      return h;
    }));
    updateLog({
      habitProgress: {
        ...(todayLog.habitProgress || {}),
        [id]: completed ? target : 0
      }
    });
  };

  const updateHabitProgress = (id: string, value: number) => {
    const habit = habits.find(h => h.id === id);
    if (!habit) return;
    const match = habit.goal?.match(/\d+/);
    const target = match ? parseInt(match[0]) : 1;
    const newValue = Math.max(0, Math.min(value, target));
    const isFullyCompleted = newValue === target;
    updateLog({ habitProgress: { ...(todayLog.habitProgress || {}), [id]: newValue } });
    setHabits(prev => prev.map(h => {
      if (h.id === id) {
        const alreadyDone = h.completedDates.includes(today);
        if (isFullyCompleted && !alreadyDone) {
          return { ...h, completedDates: [...h.completedDates, today] };
        } else if (!isFullyCompleted && alreadyDone) {
          return { ...h, completedDates: h.completedDates.filter(d => d !== today) };
        }
      }
      return h;
    }));
  };

  const updateLog = (updatedFields: Partial<DailyLog>) => {
    setLogs(prev => {
      const existing = prev.find(l => l.date === today);
      if (existing) {
        return prev.map(l => l.date === today ? { ...l, ...updatedFields } : l);
      }
      return [...prev, { ...todayLog, ...updatedFields }];
    });
  };

  const addHabit = (name: string, category: HabitCategory, icon: string, goal?: string, reminderTime?: string) => {
    const newHabit: Habit = { id: Date.now().toString(), name, category, icon, goal, reminderTime, completedDates: [], streak: 0 };
    setHabits(prev => [...prev, newHabit]);
  };

  const editHabit = (id: string, name: string, category: HabitCategory, icon: string, goal?: string, reminderTime?: string) => {
    setHabits(prev => prev.map(h => h.id === id ? { ...h, name, category, icon, goal, reminderTime } : h ));
  };

  const deleteHabit = (id: string) => setHabits(prev => prev.filter(h => h.id !== id));

  const importData = (data: { habits: Habit[], logs: DailyLog[] }) => {
    setHabits(data.habits);
    setLogs(data.logs);
  };

  const resetAllData = () => {
    localStorage.clear();
    setHabits(INITIAL_HABITS);
    setLogs([]);
    window.location.reload();
  };

  return (
    <Router>
      {/* Root Container: Full screen on mobile, constrained with shadow on desktop */}
      <div className="relative min-h-screen bg-white dark:bg-slate-950 flex flex-col md:max-w-md mx-auto md:shadow-[0_0_100px_rgba(0,0,0,0.1)] overflow-hidden transition-colors duration-500">
        {showIntro && <Welcome onFinish={finishIntro} />}
        
        {/* Main Content Area with bottom safe area for the floating nav */}
        <main className="flex-grow pb-36 pt-4 px-6 overflow-y-auto hide-scrollbar">
          <Routes>
            <Route path="/" element={<Dashboard habits={habits} todayLog={todayLog} toggleHabit={updateHabit} updateHabitProgress={updateHabitProgress} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
            <Route path="/habits" element={<Habits habits={habits} toggleHabit={updateHabit} addHabit={addHabit} editHabit={editHabit} deleteHabit={deleteHabit} />} />
            <Route path="/wellness" element={<Wellness log={todayLog} updateLog={updateLog} />} />
            <Route path="/insights" element={<Insights habits={habits} logs={logs} />} />
            <Route path="/settings" element={<Settings habits={habits} logs={logs} onImport={importData} onReset={resetAllData} isDarkMode={isDarkMode} onToggleTheme={toggleDarkMode} />} />
          </Routes>
        </main>
        
        {/* Fixed Nav: Floating and detached for modern mobile feel */}
        <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-[360px] glass dark:bg-slate-900/90 border border-white/20 dark:border-slate-800/50 flex justify-around items-center h-20 px-2 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-none z-50 transition-all">
          <NavItem to="/" icon="🏠" label="Home" />
          <NavItem to="/habits" icon="✅" label="Rituals" />
          <NavItem to="/wellness" icon="🧘" label="Self" />
          <NavItem to="/insights" icon="📊" label="Path" />
        </nav>
      </div>
    </Router>
  );
};

const NavItem: React.FC<{ to: string, icon: string, label: string }> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      className={`relative flex flex-col items-center justify-center space-y-1 w-[22%] h-[70px] rounded-[30px] transition-all duration-300 btn-press ${isActive ? 'bg-indigo-600 shadow-xl shadow-indigo-200 dark:shadow-none' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}`}
    >
      <span className={`text-xl transition-all duration-300 ${isActive ? 'scale-110' : 'grayscale opacity-40'}`}>
        {icon}
      </span>
      <span className={`text-[8px] font-black uppercase tracking-widest ${isActive ? 'text-white' : 'text-slate-400'}`}>
        {label}
      </span>
      {isActive && (
        <div className="absolute -bottom-1 w-4 h-1 bg-white/40 rounded-full nav-indicator-active" />
      )}
    </Link>
  );
};

export default App;
