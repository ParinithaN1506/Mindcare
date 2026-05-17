import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Phone, 
  MapPin, 
  ShieldAlert, 
  ChevronRight, 
  LifeBuoy, 
  MessageCircle,
  ExternalLink,
  Users,
  Search,
  Heart,
  Zap,
  Info
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

export default function Emergency() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const res = await fetch('/api/support/resources');
        const data = await res.json();
        setResources(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const filtered = resources.filter(r => 
    r.title?.toLowerCase().includes(search.toLowerCase()) || 
    r.category?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <header className="text-center space-y-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-red-500/5 rounded-full blur-[100px] -z-10"></div>
        <div className="inline-flex items-center gap-3 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-[10px] font-black uppercase tracking-[0.3em]">
          <ShieldAlert size={14} /> Immediate Assistance Sector
        </div>
        <h1 className="text-5xl font-black text-white tracking-tighter decoration-red-500/30 underline-offset-8">Support Matrix</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
          The safety of your biological link is our absolute priority. Access localized and global emergency resources below.
        </p>
      </header>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Hotlines Card */}
        <div className="lg:col-span-2 glass rounded-[3rem] p-10 border border-white/5 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -z-10"></div>
           <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1">Localized Support</h3>
                <h4 className="text-2xl font-black text-white tracking-tight leading-none">Emergency Protocols</h4>
              </div>
              <div className="p-3 bg-red-500/10 rounded-2xl text-red-500 border border-red-500/20">
                <Phone size={24} />
              </div>
           </div>

           <div className="grid sm:grid-cols-2 gap-6">
             {loading ? (
               [1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white/5 rounded-3xl animate-pulse"></div>)
             ) : (
               filtered.map((item, i) => (
                 <motion.div
                   key={item.id || i}
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ delay: i * 0.1 }}
                   className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:border-red-500/30 transition-all group flex flex-col justify-between"
                 >
                   <div>
                     <div className="flex items-center justify-between mb-4">
                       <span className="px-3 py-1 bg-white/5 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.category || 'Support'}</span>
                       <Zap size={14} className="text-yellow-400 opacity-50" />
                     </div>
                     <h5 className="text-lg font-black text-white mb-2 leading-tight uppercase tracking-tight">{item.title}</h5>
                     <p className="text-xs text-slate-400 mb-6 leading-relaxed italic">"{item.description}"</p>
                   </div>
                   <div className="flex items-center justify-between">
                     <span className="text-xl font-black text-red-500 tracking-tighter">{item.contact || 'Resource Only'}</span>
                     <button className="p-3 bg-red-500/20 rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl shadow-red-500/10">
                       <Phone size={18} fill="currentColor" />
                     </button>
                   </div>
                 </motion.div>
               ))
             )}
           </div>
        </div>

        {/* Quick Links Column */}
        <div className="space-y-8">
           <div className="glass rounded-[2.5rem] p-8 border border-white/5 text-center">
              <LifeBuoy className="text-indigo-400 mx-auto mb-6" size={32} />
              <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">University Counselor</h3>
              <p className="text-xs text-slate-400 mb-8 leading-relaxed">Direct encrypted link to your designated campus psychological node.</p>
              <button className="w-full py-4 bg-indigo-600 rounded-2xl text-[10px] font-black text-white uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20 hover:scale-[1.02] transition-all active:scale-95">
                Initialize Session
              </button>
           </div>

           <div className="glass rounded-[2.5rem] p-8 border border-white/5">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-6 px-2">Knowledge Base</h3>
              <div className="space-y-4">
                {[
                  { title: 'Coping Modules', icon: Heart },
                  { title: 'Community Safe-Space', icon: Users },
                  { title: 'Emergency FAQ', icon: Info }
                ].map((link, i) => (
                  <button key={i} className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] hover:bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                    <div className="flex items-center gap-4">
                      <link.icon size={18} className="text-slate-500 group-hover:text-indigo-400" />
                      <span className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">{link.title}</span>
                    </div>
                    <ChevronRight size={16} className="text-slate-600 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
           </div>

           <div className="p-8 rounded-[2rem] bg-gradient-to-br from-red-600 to-red-900 shadow-2xl shadow-red-600/20 text-white relative overflow-hidden group border border-white/10">
              <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform">
                <ShieldAlert size={120} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 opacity-60">Global Protocol</p>
              <h4 className="text-2xl font-black tracking-tighter mb-4 uppercase">Suicide Prevention Link</h4>
              <p className="text-xs font-medium opacity-80 leading-relaxed mb-6">Immediate, free, and confidential support for people in distress, prevention and crisis resources for you or your loved ones.</p>
              <button 
                onClick={() => window.open('https://988lifeline.org', '_blank')}
                className="px-6 py-3 bg-white text-red-600 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-slate-100 transition-colors"
              >
                Link to 988 <ExternalLink size={14} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
