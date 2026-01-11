
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Habit, DailyLog, HabitCategory } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts';

interface InsightsProps {
  habits: Habit[];
  logs: DailyLog[];
}

const Insights: React.FC<InsightsProps> = ({ habits, logs }) => {
  const navigate = useNavigate();

  // Calculate Category Balance
  const categoryStats = useMemo(() => {
    const stats = Object.values(HabitCategory).map(cat => {
      const catHabits = habits.filter(h => h.category === cat);
      const totalPossible = catHabits.length * 7; // simplified for last 7 days
      const actual = catHabits.reduce((acc, h) => {
        // Count completions in last 7 days
        const last7Days = [...Array(7)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toISOString().split('T')[0];
        });
        return acc + h.completedDates.filter(d => last7Days.includes(d)).length;
      }, 0);

      return {
        subject: cat.split(' ')[0],
        A: totalPossible > 0 ? (actual / totalPossible) * 100 : 0,
        fullMark: 100,
      };
    });
    return stats;
  }, [habits]);

  const last7DaysData = useMemo(() => {
    return [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toISOString().split('T')[0];
      const log = logs.find(l => l.date === dateStr);
      return {
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        stress: log ? log.stressLevel : 0,
        water: log ? log.waterIntake : 0,
        sleep: log ? log.sleepHours : 0,
        habits: habits.filter(h => h.completedDates.includes(dateStr)).length
      };
    });
  }, [logs, habits]);

  const totalCompletions = habits.reduce((acc, h) => acc + h.completedDates.length, 0);
  const avgSleep = logs.length > 0 ? (logs.reduce((acc, l) => acc + l.sleepHours, 0) / logs.length).toFixed(1) : "0";

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <header className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shadow-sm btn-press transition-all"
          >
            ←
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Your Path</h1>
            <p className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">Growth Journey</p>
          </div>
        </div>
        <div className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl border border-indigo-100 dark:border-indigo-800">
           <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Level 12</span>
        </div>
      </header>

      {/* AI Path Insight - The "Nano Banana" look */}
      <section className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[40px] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
        <div className="relative bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 overflow-hidden">
           <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-black shadow-lg">Z</div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Zenith Intelligence</h3>
           </div>
           <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed italic">
             "Your consistency in <span className="text-indigo-500 font-bold">Mental Health</span> rituals is up by 22% this week. Keep focusing on sleep—it's the fuel for your next peak."
           </p>
        </div>
      </section>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 gap-4">
         <div className="bg-white dark:bg-slate-900 p-8 rounded-5xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute bottom-0 left-0 w-full bg-blue-500/10 h-1/2 group-hover:h-2/3 transition-all duration-700"></div>
            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest relative z-10">Hydration Avg</h4>
            <div className="mt-6 flex items-baseline space-x-1 relative z-10">
               <span className="text-5xl font-black text-blue-500">{(logs.reduce((acc, l) => acc + l.waterIntake, 0) / (logs.length || 1)).toFixed(1)}</span>
               <span className="text-xs font-bold text-blue-300">Cups</span>
            </div>
         </div>
         <div className="bg-white dark:bg-slate-900 p-8 rounded-5xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden group">
            <div className="absolute bottom-0 left-0 w-full bg-indigo-500/10 h-1/3 group-hover:h-1/2 transition-all duration-700"></div>
            <h4 className="text-[9px] font-black text-slate-400 uppercase tracking-widest relative z-10">Sleep Quality</h4>
            <div className="mt-6 flex items-baseline space-x-1 relative z-10">
               <span className="text-5xl font-black text-indigo-600">{avgSleep}</span>
               <span className="text-xs font-bold text-indigo-300">Hrs</span>
            </div>
         </div>
      </div>

      {/* Radar Section - Life Balance */}
      <section className="bg-white dark:bg-slate-900 p-8 rounded-5xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-8 text-center">Zenith Life Balance</h3>
        <div className="h-64 w-full flex justify-center items-center">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={categoryStats}>
              <PolarGrid stroke="#f1f5f9" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 800 }} />
              <Radar
                name="Balance"
                dataKey="A"
                stroke="#6366f1"
                fill="#6366f1"
                fillOpacity={0.5}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Stress & Mood Trend */}
      <section className="bg-white dark:bg-slate-900 p-8 rounded-5xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex justify-between items-center mb-10">
           <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Equilibrium Trend</h3>
           <div className="flex space-x-2">
              <div className="flex items-center space-x-1">
                 <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                 <span className="text-[8px] font-black text-slate-400 uppercase">Stress</span>
              </div>
              <div className="flex items-center space-x-1">
                 <div className="w-2 h-2 rounded-full bg-purple-400"></div>
                 <span className="text-[8px] font-black text-slate-400 uppercase">Habits</span>
              </div>
           </div>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={last7DaysData}>
              <defs>
                <linearGradient id="colorStress" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 800, fill: '#94a3b8' }} />
              <Tooltip 
                contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 10px 40px rgba(0,0,0,0.1)', background: '#fff' }}
              />
              <Area type="monotone" dataKey="stress" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorStress)" />
              <Area type="monotone" dataKey="habits" stroke="#a855f7" strokeWidth={2} fillOpacity={0} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* Collective Badges - Redesigned for depth */}
      <section className="space-y-6">
        <h3 className="px-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Enamel Achievements</h3>
        <div className="grid grid-cols-2 gap-4">
           <PremiumPin icon="🌱" title="Sprout" desc="Day 1 Complete" unlocked />
           <PremiumPin icon="💎" title="Flawless" desc="Full Week Goal" unlocked={totalCompletions >= 7} />
           <PremiumPin icon="🌊" title="Deep Sea" desc="10L Water Total" unlocked={logs.reduce((acc, l) => acc + l.waterIntake, 0) > 40} />
           <PremiumPin icon="🧠" title="Zen Master" desc="5 Meditations" unlocked={habits.find(h => h.name.includes('Meditate'))?.completedDates.length! >= 5} />
        </div>
      </section>
    </div>
  );
};

const PremiumPin: React.FC<{ icon: string, title: string, desc: string, unlocked: boolean }> = ({ icon, title, desc, unlocked }) => (
  <div className={`p-6 rounded-4xl border relative group transition-all duration-500 overflow-hidden ${
    unlocked 
    ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 shadow-xl' 
    : 'bg-slate-50 dark:bg-slate-950 border-dashed border-slate-200 dark:border-slate-800 opacity-50 grayscale'
  }`}>
    <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center text-4xl relative ${unlocked ? 'bg-indigo-50 dark:bg-indigo-900/30 shadow-inner' : 'bg-slate-100'}`}>
       {unlocked && (
         <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-full"></div>
       )}
       {icon}
    </div>
    <div className="text-center">
      <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 uppercase tracking-widest">{title}</h4>
      <p className="text-[9px] text-slate-400 font-bold mt-1 leading-tight">{desc}</p>
    </div>
    {unlocked && (
      <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_8px_#22c55e]"></div>
    )}
  </div>
);

export default Insights;
