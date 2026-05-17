import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smile, 
  Meh, 
  Frown, 
  CloudRain, 
  Zap, 
  Heart,
  Plus,
  History,
  Calendar,
  Save,
  Tag,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db, collection, addDoc, Timestamp } from '../lib/firebase';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

const moodOptions = [
  { icon: Smile, label: 'Excellent', color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200' },
  { icon: Heart, label: 'Happy', color: 'text-brand-600', bg: 'bg-brand-50', border: 'border-brand-200' },
  { icon: Meh, label: 'Okay', color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-200' },
  { icon: Frown, label: 'Low', color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
  { icon: CloudRain, label: 'Stressed', color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-200' },
  { icon: Zap, label: 'Anxious', color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200' },
];

const availableTags = ['Academic', 'Social', 'Sleep', 'Health', 'Finance', 'Work', 'Family', 'Relaxation'];

export default function MoodTracking() {
  const { profile } = useAuth();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [intensity, setIntensity] = useState(5);
  const [stressLevel, setStressLevel] = useState(3);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [view, setView] = useState<'checkin' | 'history'>('checkin');

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async () => {
    if (!profile || !selectedMood) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'moodEntries'), {
        userId: profile.uid,
        mood: selectedMood,
        moodIntensity: intensity,
        stressLevel: stressLevel,
        tags: selectedTags,
        note,
        createdAt: Timestamp.now()
      });
      
      // Reset form
      setSelectedMood(null);
      setIntensity(5);
      setStressLevel(3);
      setSelectedTags([]);
      setNote('');
      setView('history');
    } catch (error) {
      console.error('Error saving mood:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Emotional Check-in</h2>
          <p className="text-slate-400 mt-1 italic text-sm">Mindful reflection leads to deeper self-awareness.</p>
        </div>
        <div className="flex glass p-1 rounded-2xl border-white/5 shadow-2xl">
          <button 
            onClick={() => setView('checkin')}
            className={cn("px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-widest", view === 'checkin' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" : "text-slate-500 lg:hover:bg-white/5")}
          >
            Log
          </button>
          <button 
            onClick={() => setView('history')}
            className={cn("px-4 py-2 rounded-xl text-xs font-bold transition-all uppercase tracking-widest", view === 'history' ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30" : "text-slate-500 lg:hover:bg-white/5")}
          >
            Trends
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {view === 'checkin' ? (
          <motion.div
            key="checkin"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            {/* Mood Cards */}
            <div className="glass rounded-[2.5rem] p-8">
              <h3 className="font-bold mb-6 text-slate-500 uppercase tracking-widest text-[10px]">Current state</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {moodOptions.map((m) => (
                  <button
                    key={m.label}
                    onClick={() => setSelectedMood(m.label)}
                    className={cn(
                      "flex flex-col items-center gap-3 p-6 rounded-3xl border transition-all group relative overflow-hidden",
                      selectedMood === m.label 
                        ? `bg-white/10 border-indigo-500/50 ${m.color} scale-105 shadow-xl shadow-indigo-500/10` 
                        : "bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10"
                    )}
                  >
                    {selectedMood === m.label && (
                      <div className="absolute inset-0 bg-indigo-500/5 blur-xl pointer-events-none"></div>
                    )}
                    <div className={cn("transition-transform group-hover:scale-110 relative z-10", selectedMood === m.label ? "scale-110" : "")}>
                       <m.icon size={32} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest relative z-10">{m.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Intensity & Details */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="glass rounded-[2.5rem] p-8 flex flex-col space-y-8">
                <div>
                  <h3 className="font-bold mb-8 text-slate-500 uppercase tracking-widest text-[10px]">Vibe Intensity: {intensity}/10</h3>
                  <div className="relative pt-2">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={intensity}
                      onChange={(e) => setIntensity(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mb-8 text-slate-500 uppercase tracking-widest text-[10px]">Neural Stress: {stressLevel}/10</h3>
                  <div className="relative pt-2">
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={stressLevel}
                      onChange={(e) => setStressLevel(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
                    />
                  </div>
                </div>

                <div className="mt-12">
                   <h3 className="font-bold mb-4 text-slate-500 uppercase tracking-widest text-[10px]">Environment Tags</h3>
                   <div className="flex flex-wrap gap-2">
                     {availableTags.map(tag => (
                       <button
                         key={tag}
                         onClick={() => toggleTag(tag)}
                         className={cn(
                           "px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all",
                           selectedTags.includes(tag)
                             ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                             : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                         )}
                       >
                         {tag}
                       </button>
                     ))}
                   </div>
                </div>
              </div>

              <div className="glass rounded-[2.5rem] p-8 flex flex-col">
                <h3 className="font-bold mb-4 text-slate-500 uppercase tracking-widest text-[10px]">Thought stream</h3>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Optional reflection on triggers or thoughts..."
                  className="flex-1 w-full bg-white/5 p-6 rounded-2xl outline-none focus:bg-white/10 border border-white/5 focus:border-indigo-500/30 transition-all text-slate-300 resize-none text-sm leading-relaxed"
                />
              </div>
            </div>

            <button
              onClick={handleSubmit}
              disabled={!selectedMood || isSubmitting}
              className="w-full py-5 bg-indigo-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-indigo-500 transition-all shadow-2xl shadow-indigo-600/30 disabled:opacity-50"
            >
              {isSubmitting ? <RefreshCw className="animate-spin" /> : <Save size={20} />}
              Sync Emotional Entry
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid gap-6"
          >
            <div className="glass rounded-[2.5rem] p-8">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                      <History size={24} />
                   </div>
                   <div>
                      <h3 className="font-bold text-xl text-white">Atmospheric Pulse</h3>
                      <p className="text-sm text-slate-400">Longitudinal emotional data analysis</p>
                   </div>
                </div>
                
                <div className="space-y-6">
                   <div className="p-8 bg-white/5 rounded-3xl border border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-8 text-center px-4">
                         {[
                           { d: 'MON', i: Smile, c: 'text-emerald-400', a: 1 },
                           { d: 'TUE', i: Meh, c: 'text-slate-400', a: 0.3 },
                           { d: 'WED', i: Heart, c: 'text-indigo-400', a: 1 },
                         ].map((day, idx) => (
                           <div key={idx} className={cn("text-center", day.a < 1 && "opacity-30")}>
                             <p className="text-[10px] font-black text-slate-500 mb-2 tracking-widest">{day.d}</p>
                             <day.i className={cn("mx-auto", day.c)} size={28} />
                           </div>
                         ))}
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-slate-500 tracking-widest uppercase mb-1">State Efficiency</p>
                         <p className="text-3xl font-black text-indigo-500">OPTIMAL</p>
                      </div>
                   </div>
                </div>
            </div>

            <div className="glass rounded-[2.5rem] p-8">
              <h3 className="font-bold mb-8 text-white uppercase tracking-widest text-xs">Dominant Stress Vectors</h3>
              <div className="space-y-6">
                {[
                  { tag: 'Academic Peak', frequency: '65%', impactIdx: 8, color: 'bg-indigo-500' },
                  { tag: 'Sleep Quality', frequency: '42%', impactIdx: 5, color: 'bg-emerald-500' },
                  { tag: 'Social Intercepts', frequency: '28%', impactIdx: 4, color: 'bg-purple-500' },
                ].map((trigger, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center font-black text-[10px] text-slate-400 uppercase">
                          {trigger.tag.split(' ')[0][0]}
                       </div>
                       <div>
                          <p className="font-bold text-slate-200 uppercase tracking-widest text-xs">{trigger.tag}</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">Sync rate: {trigger.frequency}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-6">
                       <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className={cn("h-full", trigger.color)} style={{ width: `${trigger.impactIdx * 10}%` }}></div>
                       </div>
                       <ChevronRight className="text-slate-600" size={18} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
