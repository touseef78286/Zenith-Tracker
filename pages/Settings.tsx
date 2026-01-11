
import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Habit, DailyLog } from '../types';

interface SettingsProps {
  habits: Habit[];
  logs: DailyLog[];
  onImport: (data: { habits: Habit[], logs: DailyLog[] }) => void;
  onReset: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const Settings: React.FC<SettingsProps> = ({ habits, logs, onImport, onReset, isDarkMode, onToggleTheme }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const data = { habits, logs, version: "1.0", exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `zenith-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.habits && json.logs) {
          onImport({ habits: json.habits, logs: json.logs });
          alert("Success! Your data has been restored.");
        } else {
          alert("Invalid backup file format.");
        }
      } catch (err) {
        alert("Error reading file. Please make sure it's a valid Zenith backup.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-left duration-500 pb-12">
      <header className="flex items-center space-x-4">
        <button 
          onClick={() => navigate(-1)}
          className="w-12 h-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 shadow-sm btn-press transition-all"
        >
          ←
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Settings</h1>
          <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-widest">Preferences & Data</p>
        </div>
      </header>

      {/* Profile Mock */}
      <section className="bg-white dark:bg-slate-900 p-8 rounded-5xl border border-slate-100 dark:border-slate-800 shadow-sm text-center">
        <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mx-auto flex items-center justify-center text-4xl mb-4 border-4 border-white dark:border-slate-800 shadow-xl">
          👤
        </div>
        <h3 className="text-xl font-black text-slate-800 dark:text-slate-100">Zenith User</h3>
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Student Explorer</p>
      </section>

      {/* System Settings */}
      <div className="space-y-4">
        <h2 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Appearance</h2>
        <section className="bg-white dark:bg-slate-900 p-2 rounded-4xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <button 
            onClick={onToggleTheme}
            className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-3xl transition-colors"
          >
            <div className="flex items-center space-x-4">
              <span className="text-2xl">{isDarkMode ? '🌙' : '🌞'}</span>
              <div className="text-left">
                <p className="font-bold text-slate-800 dark:text-slate-100">Dark Mode</p>
                <p className="text-[10px] text-slate-400 font-medium">Easier on the eyes at night</p>
              </div>
            </div>
            <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${isDarkMode ? 'bg-indigo-600' : 'bg-slate-200'}`}>
              <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
            </div>
          </button>
        </section>
      </div>

      {/* Storage Management */}
      <div className="space-y-4">
        <h2 className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Storage & Backup</h2>
        <section className="bg-white dark:bg-slate-900 p-4 rounded-4xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-2">
          
          <button 
            onClick={handleExport}
            className="w-full flex items-center space-x-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-3xl transition-colors btn-press"
          >
            <div className="w-12 h-12 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center text-2xl">📤</div>
            <div className="text-left">
              <p className="font-bold text-slate-800 dark:text-slate-100">Backup Data</p>
              <p className="text-[10px] text-slate-400 font-medium">Download your progress as JSON</p>
            </div>
          </button>

          <button 
            onClick={handleImportClick}
            className="w-full flex items-center space-x-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-3xl transition-colors btn-press"
          >
            <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-2xl">📥</div>
            <div className="text-left">
              <p className="font-bold text-slate-800 dark:text-slate-100">Restore Data</p>
              <p className="text-[10px] text-slate-400 font-medium">Import from a backup file</p>
            </div>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept=".json" 
            className="hidden" 
          />

        </section>
      </div>

      {/* Danger Zone */}
      <div className="space-y-4">
        <h2 className="px-4 text-[10px] font-black text-red-400 uppercase tracking-[0.2em]">Danger Zone</h2>
        <section className="bg-red-50 dark:bg-red-950/20 p-4 rounded-4xl border border-red-100 dark:border-red-900/30 shadow-sm">
          <button 
            onClick={() => {
              if (window.confirm("Are you sure? This will delete all your habits, logs, and progress permanently.")) {
                onReset();
              }
            }}
            className="w-full flex items-center space-x-4 p-4 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-3xl transition-colors text-red-600 dark:text-red-400 btn-press"
          >
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-2xl flex items-center justify-center text-2xl">🗑️</div>
            <div className="text-left">
              <p className="font-bold">Reset All Data</p>
              <p className="text-[10px] font-medium opacity-70">Wipe the slate clean</p>
            </div>
          </button>
        </section>
      </div>

      <div className="text-center pt-8">
        <p className="text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-[0.5em]">Zenith Tracker v1.1.0</p>
        <p className="text-[8px] text-slate-400 mt-1 italic">Your data is stored locally on this device.</p>
      </div>
    </div>
  );
};

export default Settings;
