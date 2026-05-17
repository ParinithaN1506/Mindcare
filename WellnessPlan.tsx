import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Coffee, 
  Brain, 
  Zap,
  Target,
  BarChart,
  ChevronRight,
  Plus,
  RefreshCw
} from 'lucide-react';
import { formatTime, cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';
import { db, collection, addDoc, Timestamp } from '../lib/firebase';

type TimerMode = 'work' | 'shortBreak' | 'longBreak';

export default function Focus() {
  const { profile } = useAuth();
  const [mode, setMode] = useState<TimerMode>('work');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [totalSessions, setTotalSessions] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const configs = {
    work: { label: 'Deep Focus', time: 25 * 60, color: 'text-brand-600', bg: 'bg-brand-50', bar: 'bg-brand-600' },
    shortBreak: { label: 'Mini Break', time: 5 * 60, color: 'text-green-600', bg: 'bg-green-50', bar: 'bg-green-600' },
    longBreak: { label: 'Long Rest', time: 15 * 60, color: 'text-indigo-600', bg: 'bg-indigo-50', bar: 'bg-indigo-600' },
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const handleTimerComplete = async () => {
    setIsActive(false);
    if (timerRef.current) clearInterval(timerRef.current);
    
    if (mode === 'work') {
      setTotalSessions(prev => prev + 1);
      // Log to Firestore
      if (profile) {
        await addDoc(collection(db, 'productivityLogs'), {
          userId: profile.uid,
          sessionType: 'work',
          durationMinutes: 25,
          timestamp: Timestamp.now(),
          completed: true
        });
      }
    }
    
    // Auto switch modes or just stop
    alert(`${configs[mode].label} complete!`);
  };

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(configs[mode].time);
  };

  const switchMode = (newMode: TimerMode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(configs[newMode].time);
  };

  const progress = ((configs[mode].time - timeLeft) / configs[mode].time) * 100;

  return (
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-8">
        <div>
           <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
            <h3 className="text-[10px] font-black text-indigo-400 tracking-[0.2em] uppercase">Deep Study Protocol</h3>
          </div>
          <h2 className="text-4xl font-bold text-white tracking-tight">Focus Chamber</h2>
          <p className="text-slate-400 mt-2 text-lg italic">Synchronize your attention for maximum information synthesis.</p>
        </div>

        <div className="glass rounded-[3.5rem] p-12 flex flex-col items-center justify-center relative overflow-hidden text-center border-white/5 shadow-2xl">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
             <motion.div 
                className={cn("h-full", configs[mode].bar)} 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
             />
          </div>

          <div className="flex gap-4 mb-12 glass p-1 rounded-full border-white/5">
            {(['work', 'shortBreak', 'longBreak'] as TimerMode[]).map(m => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={cn(
                  "px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all",
                  mode === m 
                    ? `bg-white/10 text-white shadow-xl` 
                    : "text-slate-500 hover:text-slate-300"
                )}
              >
                {configs[m].label}
              </button>
            ))}
          </div>

          <motion.h1 
             key={timeLeft}
             initial={{ scale: 0.98, opacity: 0.9 }}
             animate={{ scale: 1, opacity: 1 }}
             className="text-[10rem] font-black tabular-nums tracking-tighter leading-none mb-12 text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            {formatTime(timeLeft)}
          </motion.h1>

          <div className="flex items-center gap-8">
            <button
              onClick={resetTimer}
              className="w-14 h-14 rounded-full glass flex items-center justify-center text-slate-500 hover:text-white transition-all border-white/5"
            >
              <RotateCcw size={24} />
            </button>
            <button
              onClick={toggleTimer}
              className={cn(
                "w-24 h-24 rounded-full flex items-center justify-center text-white shadow-[0_0_40px_rgba(99,102,241,0.2)] transition-all transform hover:scale-110",
                isActive ? "bg-orange-600 shadow-orange-600/30" : "bg-indigo-600 shadow-indigo-600/30"
              )}
            >
              {isActive ? <Pause size={42} fill="currentColor" /> : <Play size={42} fill="currentColor" className="ml-2" />}
            </button>
            <div className="w-14 h-14 opacity-0"></div>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <div className="glass rounded-[2.5rem] p-8 border-white/5">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Efficiency Analytics</h3>
              <BarChart className="text-indigo-400" size={18} />
           </div>
           
           <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/5 transition-all lg:hover:bg-white/10">
                 <p className="text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest leading-none">Cycles Processed</p>
                 <h4 className="text-3xl font-black text-white">{totalSessions}</h4>
              </div>
              <div className="p-6 bg-white/5 rounded-3xl border border-white/5 transition-all lg:hover:bg-white/10">
                 <p className="text-[10px] font-black text-slate-500 mb-2 uppercase tracking-widest leading-none">Net Focus Depth</p>
                 <h4 className="text-3xl font-black text-white">{totalSessions * 25}m</h4>
              </div>
           </div>

           <div className="space-y-5">
              <h4 className="text-[10px] font-black text-indigo-400/60 uppercase tracking-widest mb-4">Longitudinal Trends</h4>
              {[
                { day: 'Friday', duration: '3.5h', color: 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]' },
                { day: 'Thursday', duration: '2.8h', color: 'bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.5)]' },
                { day: 'Wednesday', duration: '4.2h', color: 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between group cursor-pointer">
                   <span className="text-xs font-bold text-slate-400 group-hover:text-slate-200 transition-colors uppercase tracking-widest">{item.day}</span>
                   <div className="flex items-center gap-6">
                      <span className="text-sm font-black text-white">{item.duration}</span>
                      <div className={cn("w-2 h-2 rounded-full", item.color)}></div>
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 rounded-[2.5rem] p-8 text-white relative overflow-hidden border border-white/10">
           <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
           <h3 className="text-xl font-bold mb-4 flex items-center gap-3 uppercase tracking-widest text-xs">
              <RefreshCw size={16} className="text-indigo-400 animate-spin-slow" /> Cognitive Optimization
           </h3>
           <p className="text-slate-300 text-sm leading-relaxed mb-6 font-serif italic">
             "Integration of study intervals with rapid-eye-movement rest periods increases long-term neural retention by approximately 23%."
           </p>
           <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 lg:hover:text-white transition-colors group">
             Exploit Deep Work Protocols <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
           </button>
        </div>
      </div>
    </div>
  );
}
