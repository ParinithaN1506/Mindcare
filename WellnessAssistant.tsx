import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  Sparkles, 
  Lock, 
  Unlock, 
  FileText,
  Clock,
  MoreVertical,
  Maximize2,
  RefreshCw,
  Search,
  MessageSquare,
  BookOpen,
  ChevronLeft,
  Save
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db, collection, query, where, orderBy, onSnapshot, addDoc, Timestamp, deleteDoc, doc } from '../lib/firebase';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

export default function Journal() {
  const { profile } = useAuth();
  const [entries, setEntries] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeEntry, setActiveEntry] = useState<any>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!profile) return;
    
    const q = query(
      collection(db, 'journals'),
      where('userId', '==', profile.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setEntries(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => unsubscribe();
  }, [profile]);

  const handleSave = async () => {
    if (!profile || !content.trim()) return;

    let aiAnalysis = { summary: '', sentiment: '', keywords: [] };
    
    if (content.length > 20) {
      setIsAnalyzing(true);
      try {
        const res = await fetch('/api/ai/summarize', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content })
        });
        aiAnalysis = await res.json();
      } catch (e) {
        console.error('AI Analysis failed:', e);
      } finally {
        setIsAnalyzing(false);
      }
    }

    try {
      await addDoc(collection(db, 'journals'), {
        userId: profile.uid,
        content,
        summarizedContent: aiAnalysis.summary,
        sentiment: aiAnalysis.sentiment,
        keywords: aiAnalysis.keywords,
        isPrivate,
        createdAt: Timestamp.now()
      });
      setContent('');
      setIsAnalyzing(false);
    } catch (e) {
      console.error('Journal save failed:', e);
    }
  };

  const deleteEntry = async (id: string) => {
    if (confirm('Are you sure you want to delete this entry?')) {
      await deleteDoc(doc(db, 'journals', id));
      if (activeEntry?.id === id) setActiveEntry(null);
    }
  };

  const filteredEntries = entries.filter(e => 
    e.content.toLowerCase().includes(search.toLowerCase()) ||
    (e.keywords && e.keywords.some((k: string) => k.toLowerCase().includes(search.toLowerCase())))
  );

  return (
    <div className="grid lg:grid-cols-12 gap-8 h-[calc(100vh-140px)]">
      {/* Sidebar - Entries List */}
      <div className="lg:col-span-4 flex flex-col h-full overflow-hidden">
        <div className="glass rounded-[2rem] p-6 flex flex-col h-full relative overflow-hidden">
           <div className="mb-6">
              <h2 className="text-xl font-bold text-white tracking-tight uppercase tracking-widest text-xs">Entry Manifest</h2>
              <div className="relative mt-4">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                 <input 
                   type="text" 
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
                   placeholder="Search entries..."
                   className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/5 rounded-2xl text-xs font-medium focus:bg-white/10 outline-none transition-all text-slate-300"
                 />
              </div>
           </div>

           <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              {filteredEntries.length === 0 ? (
                <div className="text-center py-12">
                   <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-full flex items-center justify-center mx-auto text-slate-500 mb-4 transition-all">
                      <BookOpen size={24} />
                   </div>
                   <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Archive Empty</p>
                </div>
              ) : (
                filteredEntries.map(entry => (
                  <button
                    key={entry.id}
                    onClick={() => setActiveEntry(entry)}
                    className={cn(
                      "w-full text-left p-5 rounded-2xl border transition-all relative group overflow-hidden",
                      activeEntry?.id === entry.id
                        ? "bg-white/10 border-indigo-500/50 shadow-lg shadow-indigo-500/5"
                        : "bg-white/5 border-white/5 lg:hover:bg-white/10 lg:hover:border-white/10"
                    )}
                  >
                    <div className="flex items-center justify-between mb-2">
                       <span className="text-[10px] font-black text-slate-500 tracking-widest leading-none uppercase">
                          {format(entry.createdAt.toDate(), 'MMM dd, yyyy')}
                       </span>
                       {entry.isPrivate ? <Lock size={12} className="text-indigo-500/50" /> : <Unlock size={12} className="text-slate-600" />}
                    </div>
                    <h4 className="font-bold text-white line-clamp-1 mb-1 text-sm tracking-tight">{entry.content}</h4>
                    <p className="text-[10px] text-slate-500 line-clamp-1 italic font-medium">{entry.summarizedContent || 'No summary sync'}</p>
                    
                    {entry.sentiment && (
                      <div className={cn(
                        "absolute right-4 bottom-4 w-1.5 h-1.5 rounded-full blur-[1px]",
                        entry.sentiment === 'Positive' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 
                        entry.sentiment === 'Negative' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-slate-500'
                      )} />
                    )}
                  </button>
                ))
              )}
           </div>

           <button 
             onClick={() => setActiveEntry(null)}
             className="mt-6 w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 shadow-2xl shadow-indigo-600/30 lg:hover:bg-indigo-500 transition-all shrink-0"
           >
              <Plus size={18} /> New Entry
           </button>
        </div>
      </div>

      {/* Editor/Viewer */}
      <div className="lg:col-span-8 h-full">
        <AnimatePresence mode="wait">
          {activeEntry ? (
            <motion.div
              key="viewer"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass rounded-[2.5rem] p-10 h-full overflow-y-auto custom-scrollbar flex flex-col"
            >
              <div className="flex items-center justify-between mb-8 shrink-0">
                <div className="flex items-center gap-4">
                   <button onClick={() => setActiveEntry(null)} className="p-2 hover:bg-white/5 rounded-xl lg:hidden text-slate-500">
                      <ChevronLeft size={20} />
                   </button>
                   <div>
                      <h2 className="text-2xl font-bold text-white tracking-tight uppercase tracking-widest text-xs">Temporal Archive</h2>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">{format(activeEntry.createdAt.toDate(), 'MMMM dd, yyyy · hh:mm a')}</p>
                   </div>
                </div>
                <div className="flex items-center gap-2">
                   <button onClick={() => deleteEntry(activeEntry.id)} className="w-10 h-10 flex items-center justify-center text-red-400 lg:hover:bg-red-500/10 rounded-xl transition-all border border-transparent lg:hover:border-red-500/30">
                      <Trash2 size={18} />
                   </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                 <p className="text-lg text-slate-300 leading-relaxed font-serif whitespace-pre-wrap">{activeEntry.content}</p>
              </div>

              {activeEntry.summarizedContent && (
                <div className="mt-12 p-8 bg-indigo-900/20 rounded-[2rem] border border-white/5 relative overflow-hidden backdrop-blur-xl shrink-0">
                   <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl"></div>
                   <h3 className="text-[10px] font-black text-indigo-400 mb-3 flex items-center gap-2 uppercase tracking-[0.2em]">
                      AI Synthetic summary
                   </h3>
                   <p className="text-sm text-slate-300 leading-relaxed italic">"{activeEntry.summarizedContent}"</p>
                   
                   <div className="flex flex-wrap gap-2 mt-6">
                      {activeEntry.keywords?.map((k: string) => (
                        <span key={k} className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-[9px] font-black text-indigo-400 uppercase tracking-widest">
                           #{k}
                        </span>
                      ))}
                   </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="editor"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="glass rounded-[2.5rem] p-10 h-full flex flex-col relative overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8 shrink-0">
                <div>
                   <h2 className="text-2xl font-bold text-white tracking-tight uppercase tracking-widest text-xs">New Reflection</h2>
                   <p className="text-[10px] font-black text-slate-500 mt-1 italic uppercase tracking-widest">Synchronizing neural state...</p>
                </div>
                <div className="flex items-center gap-3">
                   <button 
                     onClick={() => setIsPrivate(!isPrivate)}
                     className={cn(
                       "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black border transition-all uppercase tracking-widest",
                       isPrivate 
                        ? "bg-white/5 border-white/5 text-slate-400" 
                        : "bg-indigo-600/10 border-indigo-600/30 text-indigo-400"
                     )}
                   >
                      {isPrivate ? <Lock size={14} /> : <Unlock size={14} />}
                      {isPrivate ? 'Internal' : 'Broadcast'}
                   </button>
                </div>
              </div>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Begin the stream of consciousness..."
                className="flex-1 w-full text-xl bg-white/[0.02] p-8 rounded-3xl outline-none focus:bg-white/[0.04] border border-white/5 focus:border-indigo-500/30 transition-all text-slate-300 resize-none leading-relaxed font-serif"
              />

              <div className="mt-8 flex items-center justify-between gap-4 shrink-0">
                 <div className="flex items-center gap-6 text-slate-500">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em]">
                       <Clock size={16} className="text-indigo-500/50" /> Estimated temporal depth: 2m
                    </div>
                 </div>
                 <button
                   onClick={handleSave}
                   disabled={!content.trim() || isAnalyzing}
                   className="px-10 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl shadow-indigo-600/30 lg:hover:bg-indigo-500 transition-all disabled:opacity-50 min-w-[240px]"
                 >
                   {isAnalyzing ? (
                     <>
                       <RefreshCw size={20} className="animate-spin text-white/50" /> Processing...
                     </>
                   ) : (
                     <>
                       <Save size={20} /> Sync Archive
                     </>
                   )}
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
