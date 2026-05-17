import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Users, 
  ShieldCheck, 
  AlertTriangle, 
  Search, 
  Filter,
  BarChart3,
  Download,
  MoreHorizontal,
  TrendingUp,
  Brain,
  Activity,
  History,
  FileText,
  AlertOctagon,
  ChevronRight
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { db, collection, query, onSnapshot, getDocs, orderBy, limit, where } from '../lib/firebase';
import { cn } from '../lib/utils';
import { format } from 'date-fns';

export default function Admin() {
  const { profile } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [insights, setInsights] = useState<any[]>([]);
  const [moodTrends, setMoodTrends] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'directory' | 'analytics' | 'risk'>('analytics');

  useEffect(() => {
    if (profile?.role !== 'admin') return;
    
    // Fetch users
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Fetch Risk Insights
    const qInsights = query(
      collection(db, 'aiInsights'), 
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    const unsubInsights = onSnapshot(qInsights, (snapshot) => {
      setInsights(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });

    // Mock trend data (in a real app, you'd aggregate moodEntries)
    setMoodTrends([
      { date: '05/10', score: 72, risk: 12 },
      { date: '05/11', score: 68, risk: 15 },
      { date: '05/12', score: 75, risk: 10 },
      { date: '05/13', score: 70, risk: 18 },
      { date: '05/14', score: 62, risk: 25 },
      { date: '05/15', score: 58, risk: 30 },
      { date: '05/16', score: 65, risk: 20 },
    ]);

    setLoading(false);

    return () => {
      unsubUsers();
      unsubInsights();
    };
  }, [profile]);

  if (profile?.role !== 'admin') {
    return <div className="p-12 text-center font-bold text-red-500">ACCESS DENIED</div>;
  }

  return (
    <div className="space-y-10">
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)]"></div>
              <h3 className="text-[10px] font-black text-purple-400 tracking-[0.2em] uppercase">Control Layer Zero</h3>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight uppercase">Platform Oversight</h2>
            <p className="text-slate-400 mt-1 italic text-sm">Real-time health monitoring and administrative synchronization.</p>
         </div>
         <button className="px-8 py-3 glass border-white/5 rounded-2xl flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 lg:hover:text-white lg:hover:border-white/20 transition-all shadow-xl">
            <Download size={18} className="text-indigo-400" /> Generate Intelligence
         </button>
      </section>

      <div className="grid md:grid-cols-3 gap-6">
         {[
           { label: 'Total Synchronized', value: users.length, color: 'text-indigo-400', glow: 'shadow-indigo-500/10', icon: Users },
           { label: 'Divergence Alerts', value: insights.filter(i => i.riskLevel === 'high').length || '3' + ' Critical', color: 'text-red-400', glow: 'shadow-red-500/10', icon: AlertTriangle },
           { label: 'Active Sessions', value: '24 Today', color: 'text-emerald-400', glow: 'shadow-emerald-500/10', icon: Activity },
         ].map((stat, i) => (
           <div key={i} className={cn("glass p-8 rounded-[2rem] border-white/5 shadow-2xl relative overflow-hidden group transition-all lg:hover:border-white/10", stat.glow)}>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all"></div>
              <div className={cn("w-12 h-12 rounded-2xl mb-6 flex items-center justify-center bg-white/5 border border-white/10", stat.color)}>
                 <stat.icon size={24} />
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
              <h4 className={cn("text-3xl font-black mt-2 tracking-tighter", stat.color)}>{stat.value}</h4>
           </div>
         ))}
      </div>

      <div className="flex items-center gap-4 border-b border-white/5 pb-4">
        {[
          { id: 'analytics', label: 'Intelligence Analytics', icon: TrendingUp },
          { id: 'risk', label: 'Risk Monitoring', icon: AlertOctagon },
          { id: 'directory', label: 'Identity Manifest', icon: Users },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === tab.id 
                ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20" 
                : "text-slate-500 lg:hover:text-slate-300"
            )}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="glass rounded-[2.5rem] p-8 border-white/5 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Collective Wellness Index</h3>
                  <TrendingUp className="text-emerald-400" size={18} />
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={moodTrends}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        stroke="#475569" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <YAxis 
                        stroke="#475569" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                        domain={[0, 100]}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0f172a', 
                          border: '1px solid #ffffff10',
                          borderRadius: '12px',
                          fontSize: '10px',
                          fontWeight: 'bold'
                        }}
                        itemStyle={{ color: '#818cf8' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#818cf8" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorScore)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="glass rounded-[2.5rem] p-8 border-white/5 shadow-2xl">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Risk Divergence Probability</h3>
                  <AlertTriangle className="text-red-400" size={18} />
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={moodTrends}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        stroke="#475569" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <YAxis 
                        stroke="#475569" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false} 
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0f172a', 
                          border: '1px solid #ffffff10',
                          borderRadius: '12px',
                          fontSize: '10px',
                          fontWeight: 'bold'
                        }}
                      />
                      <Bar dataKey="risk" fill="#f87171" radius={[4, 4, 0, 0]} barSize={20} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { label: 'Neural Processing', value: '98.4%', trend: '+0.2%', icon: Brain },
                { label: 'Data Sync Rate', value: '1.2ms', trend: '-0.1ms', icon: Activity },
                { label: 'Insight Accuracy', value: '94.1%', trend: '+2.4%', icon: ShieldCheck },
              ].map((m, i) => (
                <div key={i} className="glass p-6 rounded-3xl border-white/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-white/5 rounded-lg text-indigo-400">
                      <m.icon size={16} />
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{m.label}</span>
                  </div>
                  <div className="flex items-baseline justify-between">
                    <h4 className="text-2xl font-black text-white">{m.value}</h4>
                    <span className="text-[10px] font-bold text-emerald-400">{m.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'risk' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {insights.filter(i => i.riskLevel === 'high' || i.riskLevel === 'medium').length > 0 ? (
                insights.filter(i => i.riskLevel === 'high' || i.riskLevel === 'medium').map((item) => (
                  <div key={item.id} className={cn(
                    "glass p-8 rounded-[2.5rem] border-white/5 relative overflow-hidden group",
                    item.riskLevel === 'high' ? "border-red-500/20" : "border-amber-500/20"
                  )}>
                    <div className={cn(
                      "absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl",
                      item.riskLevel === 'high' ? "bg-red-500/5 group-hover:bg-red-500/10" : "bg-amber-500/5 group-hover:bg-amber-500/10"
                    )}></div>
                    <div className="flex items-center justify-between mb-6">
                      <div className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border",
                        item.riskLevel === 'high' ? "bg-red-500/5 border-red-500/20 text-red-400" : "bg-amber-500/5 border-amber-500/20 text-amber-400"
                      )}>
                        {item.riskLevel} Severity
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">
                        {item.createdAt?.toDate ? format(item.createdAt.toDate(), 'HH:mm') : 'Recently'}
                      </span>
                    </div>
                    <h5 className="text-sm font-bold text-white mb-2 uppercase tracking-wide">{item.insightType || 'Behavioral Divergence'}</h5>
                    <p className="text-xs text-slate-400 leading-relaxed italic mb-6">"{item.content}"</p>
                    <button className="w-full py-3 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 lg:hover:bg-white/10 lg:hover:text-white transition-all flex items-center justify-center gap-2">
                      Deploy Intervention <ChevronRight size={14} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="col-span-full py-20 text-center glass rounded-[2.5rem] border-white/5">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">No critical risks detected in current sector</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'directory' && (
          <div className="glass rounded-[2.5rem] border-white/5 shadow-2xl overflow-hidden relative">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
             <div className="p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">User Directory Manifest</h3>
                <div className="flex gap-4 w-full sm:w-auto">
                   <div className="relative flex-1">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                      <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Filter identities..." 
                        className="pl-12 pr-6 py-3 bg-white/5 rounded-xl outline-none border border-white/5 text-xs text-white w-full focus:bg-white/10 focus:border-indigo-500/30 transition-all" 
                      />
                   </div>
                   <button className="p-3 bg-white/5 border border-white/5 rounded-xl lg:hover:bg-white/10 transition-all">
                      <Filter size={18} className="text-slate-400" />
                   </button>
                </div>
             </div>
             
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                   <thead className="bg-white/[0.02]">
                      <tr className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                         <th className="px-10 py-6">Biological Identity</th>
                         <th className="px-10 py-6">Priority Level</th>
                         <th className="px-10 py-6">Wellness Index</th>
                         <th className="px-10 py-6">Last Ping</th>
                         <th className="px-10 py-6 text-right">Ops</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                      {users.filter(u => u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchQuery.toLowerCase())).map(u => (
                        <tr key={u.id} className="lg:hover:bg-white/[0.03] transition-colors group">
                           <td className="px-10 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/10 flex items-center justify-center font-black text-xs text-indigo-400 uppercase tracking-widest cursor-default">
                                    {u.displayName?.split(' ').map((n: any) => n[0]).join('')}
                                 </div>
                                 <div>
                                    <p className="text-sm font-bold text-white tracking-tight leading-none mb-1">{u.displayName}</p>
                                    <p className="text-[10px] text-slate-500 uppercase tracking-widest">{u.email}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-10 py-6">
                              <span className={cn(
                                "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border",
                                u.role === 'student' ? "bg-white/5 border-white/10 text-slate-400" :
                                u.role === 'counselor' ? "bg-indigo-500/5 border-indigo-500/20 text-indigo-400 shadow-[0_0_10px_rgba(99,102,241,0.1)]" :
                                "bg-purple-500/5 border-purple-500/20 text-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.1)]"
                              )}>
                                 {u.role}
                              </span>
                           </td>
                           <td className="px-10 py-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-16 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    <motion.div 
                                      initial={{ width: 0 }}
                                      whileInView={{ width: `${u.wellnessScore || 0}%` }}
                                      className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" 
                                    />
                                 </div>
                                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{u.wellnessScore || 0}%</span>
                              </div>
                           </td>
                           <td className="px-10 py-6">
                              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight italic">
                                {u.createdAt?.toDate ? format(u.createdAt.toDate(), 'MMM dd') : 'Recently'}
                              </p>
                           </td>
                           <td className="px-10 py-6 text-right text-slate-600 lg:hover:text-indigo-400">
                              <button className="p-3 bg-white/5 border border-white/5 rounded-xl lg:hover:bg-indigo-600 lg:hover:text-white transition-all shadow-xl">
                                 <MoreHorizontal size={18} />
                              </button>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
             {(users.length === 0 || users.filter(u => u.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchQuery.toLowerCase())).length === 0) && !loading && (
               <div className="p-20 text-center">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">No identities found in current sector</p>
               </div>
             )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
