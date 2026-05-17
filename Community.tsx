import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Smile, 
  Activity, 
  CheckCircle2, 
  Zap, 
  MessageSquare,
  ChevronRight,
  BrainCircuit,
  ArrowUpRight,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { db, collection, query, where, orderBy, onSnapshot, Timestamp, limit } from '../lib/firebase';
import { format, subDays, startOfDay } from 'date-fns';
import { cn } from '../lib/utils';

const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'];

export default function Dashboard() {
  const { profile, user } = useAuth();
  const navigate = useNavigate();
  const [moodHistory, setMoodHistory] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [dailyPlan, setDailyPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile || !user) return;
    
    // Fetch summary from backend
    const fetchSummary = async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch('/api/dashboard/summary', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setSummary(data);
      } catch (err) {
        console.error('Failed to fetch summary:', err);
      }
    };

    const fetchDailyPlan = async () => {
      try {
        const token = await user.getIdToken();
        const res = await fetch('/api/wellness/daily', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        setDailyPlan(data);
      } catch (err) {
        console.error('Failed to fetch daily plan:', err);
      }
    };

    // Real-time mood data for the graph
    const q = query(
      collection(db, 'moodEntries'),
      where('userId', '==', profile.uid),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribeMoods = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Format for chart: convert Firestore timestamp to readable label
        name: doc.data().createdAt?.toDate ? format(doc.data().createdAt.toDate(), 'EEE') : '...'
      })).reverse();
      setMoodHistory(data);
      setLoading(false);
    });

    fetchSummary();
    fetchDailyPlan();
    return () => unsubscribeMoods();
  }, [profile, user]);

  const toggleTask = async (activityTitle: string) => {
    if (!user || !dailyPlan) return;
    try {
      const token = await user.getIdToken();
      
      // Optimistic update
      const updatedActivities = dailyPlan.activities.map((a: any) => 
        a.title === activityTitle ? { ...a, completed: !a.completed } : a
      );
      setDailyPlan({ ...dailyPlan, activities: updatedActivities });

      await fetch('/api/wellness/toggle', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ planId: dailyPlan.id, activityTitle })
      });
    } catch (err) {
      console.error(err);
      // Re-fetch on error
      const token = await user.getIdToken();
      const res = await fetch('/api/wellness/daily', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setDailyPlan(data);
    }
  };

  const completedTasks = dailyPlan?.activities?.filter((a: any) => a.completed).length || 0;
  const totalTasks = dailyPlan?.activities?.length || 0;

  const stats = [
    { label: 'Wellness Score', value: summary?.wellnessScore ? `${summary.wellnessScore}%` : '82%', icon: Activity, color: 'text-indigo-400', trend: '+4% from last week' },
    { label: 'Avg Mood', value: summary?.moodHistory?.length > 0 
        ? `${(summary.moodHistory.reduce((a: any, b: any) => a + (b.moodIntensity || 0), 0) / summary.moodHistory.length).toFixed(1)}/10` 
        : '7.4/10', icon: Smile, color: 'text-emerald-400', trend: 'Stable' },
    { label: 'Stress Level', value: 'Moderate', icon: Zap, color: 'text-orange-400', trend: 'Decreasing' },
    { label: 'Focus Points', value: '2,840', icon: TrendingUp, color: 'text-purple-400', trend: '+120 today' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Section */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl font-bold text-white tracking-tight">Good morning, {profile?.displayName?.split(' ')[0] || 'User'}</h2>
          <p className="text-slate-400 mt-1">Your wellness score is trending upward this week.</p>
        </motion.div>
        
        <div className="flex items-center gap-4">
           <div className="px-4 py-2 glass rounded-2xl flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse shadow-[0_0_8px_rgba(129,140,248,0.8)]"></div>
             <span className="text-sm font-medium text-slate-300">Syncing Active</span>
           </div>
           <button 
             onClick={() => window.location.reload()}
             className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 hover:bg-indigo-500 transition-all flex items-center gap-2"
           >
             <RefreshCw size={18} /> Refresh Insights
           </button>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 glass rounded-3xl hover:bg-white/10 transition-all relative overflow-hidden group border border-white/5"
          >
            <div className={cn("w-10 h-10 rounded-xl mb-4 flex items-center justify-center bg-white/5 border border-white/10 transition-colors group-hover:bg-white/10", stat.color)}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-bold uppercase tracking-widest text-[9px] mb-1">{stat.label}</p>
              <h4 className="text-2xl font-black text-white">{stat.value}</h4>
              <p className="text-[10px] text-slate-400 mt-2 font-medium">{stat.trend}</p>
            </div>
            <div className={cn("absolute -bottom-1 -right-1 w-12 h-12 rounded-full opacity-5 blur-xl", stat.color.replace('text-', 'bg-'))}></div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-2 glass rounded-[2.5rem] p-8 border border-white/5 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent"></div>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Neural Mood Flux</h3>
              <p className="text-xl font-black text-white tracking-tight">Emotional Trajectory</p>
            </div>
            <div className="flex gap-2">
               <button className="px-3 py-1.5 glass rounded-lg text-[9px] font-black text-slate-400 uppercase tracking-widest hover:text-white transition-all">Export Analysis</button>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={moodHistory.length > 0 ? moodHistory : [
                { name: 'Mon', moodIntensity: 4, stressLevel: 3 },
                { name: 'Tue', moodIntensity: 3, stressLevel: 5 },
                { name: 'Wed', moodIntensity: 5, stressLevel: 2 },
                { name: 'Thu', moodIntensity: 6, stressLevel: 4 },
                { name: 'Fri', moodIntensity: 4, stressLevel: 6 },
                { name: 'Sat', moodIntensity: 7, stressLevel: 2 },
                { name: 'Sun', moodIntensity: 8, stressLevel: 1 },
              ]}>
                <defs>
                  <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.03)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10, fontWeight: 900 }} domain={[0, 10]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }} 
                  itemStyle={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
                  cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="moodIntensity" 
                  name="Vibe Level"
                  stroke="#6366f1" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorMood)" 
                  animationDuration={2000}
                />
                <Area 
                  type="monotone" 
                  dataKey="stressLevel" 
                  name="Stress Load"
                  stroke="#ec4899" 
                  strokeWidth={2} 
                  fillOpacity={0.1}
                  fill="#ec4899"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          
          <div className="flex items-center gap-8 mt-8 justify-center">
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)]"></div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Collective Vibe</span>
             </div>
             <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-pink-500 shadow-[0_0_12px_rgba(236,72,153,0.8)]"></div>
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Neural Stress</span>
             </div>
          </div>
        </motion.div>

        {/* Right Column - AI Insights & Tasks */}
        <div className="space-y-6">
          {/* AI Insights Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
             className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-white/10 rounded-[2rem] p-8 text-white relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl group-hover:bg-brand-500/20 transition-all"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_12px_rgba(129,140,248,1)]"></div>
              <h3 className="text-[9px] font-black text-indigo-200 tracking-[0.3em] uppercase">MindCare AI Intelligence</h3>
            </div>
            
            <p className="text-sm text-slate-200 leading-relaxed font-medium mb-6">
              {summary?.journalHighlights?.length > 0 
                ? `Analyzing your recent reflections on "${summary.journalHighlights[0].title}". The underlying sentiment is highly positive.` 
                : "Your focus sessions are 22% more effective when you journal beforehand. Consider a reflection today."}
            </p>
            <button className="w-full py-4 glass hover:bg-white/10 rounded-2xl text-[10px] font-black transition-all flex items-center justify-center gap-2 uppercase tracking-[0.2em] border border-white/5 hover:border-white/20">
              Generate Synthesis <ArrowUpRight size={14} className="text-indigo-400" />
            </button>
          </motion.div>

          {/* Productivity Tracker / Action Plan */}
          <div className="glass rounded-[2rem] p-8 border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/5 rounded-full blur-2xl"></div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-black text-white uppercase tracking-[0.15em] text-[10px]">Cognitive Load</h3>
              <div className="px-2 py-1 bg-white/5 rounded-md text-[9px] font-black text-indigo-400 uppercase">
                {completedTasks}/{totalTasks} OPTIMIZED
              </div>
            </div>
            
            <div className="space-y-5">
              {(dailyPlan?.activities || [
                { title: 'Circadian Alignment', completed: true },
                { title: 'Deep Focus (2h)', completed: true },
                { title: 'Reflective Journaling', completed: false },
                { title: 'Physical Activity', completed: true },
                { title: 'Mindfulness Sync', completed: false },
              ]).slice(0, 5).map((task: any, i: number) => (
                <div 
                  key={i} 
                  className="flex items-center justify-between group cursor-pointer"
                  onClick={() => toggleTask(task.title)}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-6 h-6 rounded-xl flex items-center justify-center border-2 transition-all duration-500",
                      task.completed ? "bg-indigo-600 border-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.4)] text-white" : "border-white/10 bg-white/5 group-hover:border-white/20"
                    )}>
                      {task.completed && <CheckCircle2 size={12} strokeWidth={3} />}
                    </div>
                    <span className={cn("text-xs font-bold tracking-tight transition-all", task.completed ? "text-slate-500 line-through decoration-indigo-500/30" : "text-slate-200 group-hover:text-white")}>
                      {task.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={() => navigate('/wellness')}
              className="w-full mt-10 py-4 bg-white/5 border border-white/5 text-slate-400 rounded-2xl text-[9px] font-black hover:bg-white/10 hover:text-white transition-all uppercase tracking-[0.2em] hover:border-indigo-500/20"
            >
               Update Protocol
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section - Community & Recent */}
      <div className="grid lg:grid-cols-3 gap-8">
         <div className="lg:col-span-1 glass rounded-[2rem] p-8 border border-white/5 relative overflow-hidden">
            <h3 className="text-[10px] font-black text-slate-500 mb-6 uppercase tracking-[0.2em]">Emotional Spectrum</h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Joy', value: 40 },
                      { name: 'Focus', value: 30 },
                      { name: 'Calm', value: 20 },
                      { name: 'Stress', value: 10 },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '10px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {['Joy', 'Focus', 'Calm', 'Stress'].map((label, i) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">{label}</span>
                </div>
              ))}
            </div>
         </div>

         <div className="lg:col-span-2 glass rounded-[2rem] p-8 border border-white/5">
            <h3 className="text-[10px] font-black text-slate-500 mb-6 flex items-center justify-between uppercase tracking-[0.2em]">
              Growth Resources
              <ArrowUpRight size={14} className="text-slate-600" />
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { title: 'Neuroplasticity & Focus', type: 'Neuroscience', tag: 'CORE' },
                { title: 'Cortisol Management', type: 'Advanced Bio-hacking', tag: 'TECH' },
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-[1.5rem] bg-white/[0.03] hover:bg-white/[0.08] transition-all group cursor-pointer border border-white/5 hover:border-indigo-500/20">
                  <span className="text-[8px] font-black text-indigo-400 tracking-[0.3em]">{item.tag}</span>
                  <h4 className="font-bold text-white mt-2 group-hover:text-indigo-300 transition-colors">{item.title}</h4>
                  <p className="text-[9px] text-slate-500 mt-1 font-bold uppercase tracking-widest">{item.type}</p>
                </div>
              ))}
            </div>
         </div>
      </div>
    </div>
  );
}
