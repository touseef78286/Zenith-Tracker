
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DailyLog, Mood } from '../types';
import { MOOD_EMOJIS } from '../constants';

interface WellnessProps {
  log: DailyLog;
  updateLog: (updatedFields: Partial<DailyLog>) => void;
}

const Wellness: React.FC<WellnessProps> = ({ log, updateLog }) => {
  const navigate = useNavigate();
  const currentHour = new Date().getHours();
  const showHydrationNudge = currentHour >= 12 && log.waterIntake === 0;

  return (
    <div className="space-y-8 animate-in slide-in-from-right duration-500 pb-12">
      <header className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate(-1)}
            className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shadow-sm btn-press transition-all"
          >
            ←
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Well-being</h1>
            <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">Self Check-in</p>
          </div>
        </div>
      </header>

      {/* Mood Picker */}
      <section className="bg-white dark:bg-slate-900 p-8 rounded-5xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-8 text-center">Emotional Pulse</h3>
        <div className="grid grid-cols-5 gap-3">
          {Object.values(Mood).map(m => (
            <button
              key={m}
              onClick={() => updateLog({ mood: m })}
              className={`flex flex-col items-center py-4 rounded-3xl transition-all duration-300 btn-press ${
                log.mood === m 
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none scale-110' 
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
              }`}
            >
              <span className="text-3xl mb-2">{MOOD_EMOJIS[m]}</span>
              <span className={`text-[8px] font-black uppercase tracking-tighter ${log.mood === m ? 'text-white' : 'text-slate-400'}`}>{m}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Stress Slider */}
      <section className="bg-white dark:bg-slate-900 p-8 rounded-5xl border border-slate-100 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">Stress Level</h3>
          <div className="flex items-center space-x-2">
            <span className={`w-3 h-3 rounded-full animate-pulse ${
              log.stressLevel < 4 ? 'bg-green-400' : 
              log.stressLevel < 7 ? 'bg-amber-400' : 'bg-red-500'
            }`}></span>
            <span className="text-lg font-black text-slate-800 dark:text-slate-200">{log.stressLevel}</span>
          </div>
        </div>
        <input 
          type="range"
          min="0"
          max="10"
          value={log.stressLevel}
          onChange={(e) => updateLog({ stressLevel: parseInt(e.target.value) })}
          className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer overflow-hidden"
          style={{
            background: `linear-gradient(to right, #10b981 0%, #f59e0b 50%, #ef4444 100%)`
          }}
        />
        <div className="flex justify-between mt-4 text-[9px] font-black text-slate-400 uppercase tracking-widest">
          <span>Serene</span>
          <span>Moderate</span>
          <span>Intense</span>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-indigo-600 p-8 rounded-5xl text-white shadow-xl shadow-indigo-200 dark:shadow-none relative group overflow-hidden">
          <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700"></div>
          <h4 className="text-[9px] font-black uppercase tracking-widest mb-6 opacity-70">Sleep Time</h4>
          <div className="flex items-baseline space-x-2">
            <span className="text-5xl font-black">{log.sleepHours}</span>
            <span className="text-xs font-bold opacity-60">Hrs</span>
          </div>
          <div className="mt-8 flex gap-1">
            {[...Array(10)].map((_, i) => (
              <div 
                key={i} 
                onClick={() => updateLog({ sleepHours: i + 1 })}
                className={`flex-grow h-2 rounded-full cursor-pointer transition-all ${i < log.sleepHours ? 'bg-white' : 'bg-white/20'}`}
              ></div>
            ))}
          </div>
        </div>
        
        <div className={`p-8 rounded-5xl border transition-all duration-500 relative group overflow-hidden ${showHydrationNudge ? 'bg-blue-100 border-blue-400 ring-4 ring-blue-500/10' : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}>
          <h4 className={`text-[9px] font-black uppercase tracking-widest mb-6 ${showHydrationNudge ? 'text-blue-700' : 'text-slate-400 dark:text-slate-500'}`}>Water Intake</h4>
          <div className="flex items-baseline space-x-2">
            <span className={`text-5xl font-black ${showHydrationNudge ? 'text-blue-800' : 'text-slate-800 dark:text-slate-100'}`}>{log.waterIntake}</span>
            <span className={`text-xs font-bold ${showHydrationNudge ? 'text-blue-600' : 'text-slate-500'}`}>Cups</span>
          </div>
          <div className="mt-8 grid grid-cols-4 gap-1.5">
            {[...Array(8)].map((_, i) => (
              <div 
                key={i} 
                onClick={() => updateLog({ waterIntake: i + 1 })}
                className={`h-5 rounded-xl cursor-pointer transition-all btn-press ${i < log.waterIntake ? 'bg-blue-500 shadow-md shadow-blue-100' : 'bg-blue-50 dark:bg-slate-800'}`}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* Reflection */}
      <section className="bg-white dark:bg-slate-900 p-8 rounded-5xl border border-slate-100 dark:border-slate-800 shadow-sm">
        <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-4">Mindful Reflection</h3>
        <textarea 
          placeholder="Quiet your mind... what are you thinking?"
          value={log.journal}
          onChange={(e) => updateLog({ journal: e.target.value })}
          className="w-full h-40 p-6 bg-slate-50 dark:bg-slate-800 border-none rounded-4xl focus:ring-4 focus:ring-indigo-500/5 text-slate-700 dark:text-slate-200 text-sm resize-none transition-all placeholder:text-slate-300 dark:placeholder:text-slate-700 font-medium"
        />
      </section>
    </div>
  );
};

export default Wellness;
