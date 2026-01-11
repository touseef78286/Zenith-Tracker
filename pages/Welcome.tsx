
import React, { useState, useEffect } from 'react';
import { MOTIVATIONAL_QUOTES } from '../constants';

interface WelcomeProps {
  onFinish: () => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onFinish }) => {
  const [quote, setQuote] = useState('');
  const [isExiting, setIsExiting] = useState(false);
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const randomQuote = MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
    setQuote(randomQuote);

    // Progression of intro stages for staggered animations
    const timer1 = setTimeout(() => setStage(1), 400); // Show logo
    const timer2 = setTimeout(() => setStage(2), 1000); // Show quote
    const timer3 = setTimeout(() => setStage(3), 1600); // Show button
    
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  const handleStart = () => {
    setIsExiting(true);
    setTimeout(onFinish, 600);
  };

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white transition-all duration-1000 ease-in-out ${isExiting ? 'opacity-0 scale-110 blur-xl pointer-events-none' : 'opacity-100'}`}>
      
      {/* Corner Logo (Top Left) */}
      <div className={`absolute top-10 left-10 transition-all duration-1000 ${stage >= 1 ? 'opacity-20 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
        <div className="flex items-baseline">
          <span className="text-2xl font-black text-slate-900 leading-none">Z</span>
          <span className="text-[10px] font-bold text-slate-400 tracking-tighter uppercase ml-0.5">enith</span>
        </div>
      </div>

      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-50 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-purple-50 rounded-full blur-[100px]" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="flex flex-col items-center text-center px-8 max-w-sm w-full">
        
        {/* Main Logo Composition */}
        <div className={`relative mb-12 transition-all duration-1000 ease-out flex items-baseline justify-center ${stage >= 1 ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-10'}`}>
          <div className="relative">
            <h1 className="text-[140px] font-black text-slate-900 leading-none tracking-tighter select-none">
              Z
            </h1>
            {/* Glossy overlay on Z */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent translate-x-[-100%] animate-[shimmer_3s_infinite] pointer-events-none"></div>
          </div>
          
          <div className={`flex flex-col items-start transition-all duration-1000 delay-500 ease-out ${stage >= 1 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <span className="text-4xl font-light text-slate-400 -ml-4 tracking-tight select-none">enith</span>
            <div className="h-1 w-full bg-indigo-500/20 rounded-full mt-2 ml-[-12px]"></div>
          </div>
        </div>

        {/* Quote Section */}
        <div className={`transition-all duration-1000 delay-300 ${stage >= 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="w-8 h-px bg-slate-200 mx-auto mb-6"></div>
          <p className="text-slate-500 text-sm font-medium leading-relaxed italic px-4">
            “{quote}”
          </p>
        </div>

        {/* Action Button */}
        <div className={`mt-16 transition-all duration-1000 delay-500 ${stage >= 3 ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <button 
            onClick={handleStart}
            className="group relative flex flex-col items-center space-y-4 focus:outline-none"
          >
            <div className="w-16 h-16 bg-slate-900 rounded-[24px] flex items-center justify-center text-white shadow-2xl group-hover:bg-indigo-600 group-hover:-translate-y-1 transition-all duration-500">
               <span className="text-xl group-hover:scale-125 transition-transform">→</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-indigo-600 transition-colors">
              Continue
            </span>
            {/* Pulse Decoration */}
            <div className="absolute top-0 w-16 h-16 rounded-[24px] border-2 border-slate-900 animate-ping opacity-10 pointer-events-none"></div>
          </button>
        </div>
      </div>

      <footer className={`absolute bottom-10 text-[9px] font-bold text-slate-300 uppercase tracking-[0.5em] transition-all duration-1000 ${stage >= 1 ? 'opacity-100' : 'opacity-0'}`}>
        Zenith Tracker v1.0
      </footer>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) rotate(25deg); }
          100% { transform: translateX(200%) rotate(25deg); }
        }
      `}</style>
    </div>
  );
};

export default Welcome;
