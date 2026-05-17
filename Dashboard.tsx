import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Heart, 
  Users, 
  Timer, 
  AlertCircle, 
  ShieldCheck,
  LogOut,
  Bell,
  Menu,
  X,
  ChevronRight,
  TrendingUp,
  Map
} from 'lucide-react';
import { auth, signOut } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Moon } from 'lucide-react';

import WellnessAssistant from './WellnessAssistant';

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const { profile } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: TrendingUp, label: 'Analytics', path: '/insights' },
    { icon: Map, label: 'Wellness Protocol', path: '/wellness' },
    { icon: Heart, label: 'Mood Tracking', path: '/mood' },
    { icon: BookOpen, label: 'Journal', path: '/journal' },
    { icon: Timer, label: 'Focus Zone', path: '/focus' },
    { icon: Users, label: 'Community', path: '/community' },
    { icon: AlertCircle, label: 'Support System', path: '/emergency' },
  ];

  if (profile?.role === 'admin') {
    menuItems.push({ icon: ShieldCheck, label: 'Admin Panel', path: '/admin' });
  }

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex overflow-hidden relative transition-colors duration-300">
      {/* Background Orbs */}
      <div className="bg-orb top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-900/10" />
      <div className="bg-orb bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/10" />

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 88 }}
        className="fixed left-0 top-0 h-full backdrop-blur-3xl bg-white/[0.01] border-r border-white/5 z-50 flex flex-col transition-all duration-300"
      >
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-500/30 shrink-0 border border-white/20">
               <div className="w-4 h-4 bg-white rounded-[4px] shadow-sm"></div>
            </div>
            {isSidebarOpen && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col"
              >
                <span className="text-lg font-black tracking-tighter text-white leading-none">MINDCARE</span>
                <span className="text-[8px] font-black text-indigo-400 tracking-[0.3em] uppercase mt-1">Intelligence</span>
              </motion.div>
            )}
          </div>
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-8 h-8 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 text-slate-500 hover:text-white hover:bg-white/10 transition-all"
          >
            {isSidebarOpen ? <ChevronRight size={16} className="rotate-180" /> : <ChevronRight size={16} />}
          </button>
        </div>

        <nav className="flex-1 px-6 space-y-2 py-8 mt-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                isActive 
                  ? "bg-white/[0.08] text-white shadow-xl shadow-black/20 border border-white/10" 
                  : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"
              )}
            >
              {({ isActive: isLinkActive }) => (
                <>
                  {isLinkActive && (
                    <motion.div 
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent -z-10"
                    />
                  )}
                  <item.icon size={22} className={cn("shrink-0 transition-all duration-300", isSidebarOpen ? "" : "mx-auto", isLinkActive ? "text-indigo-400" : "group-hover:scale-110")} strokeWidth={isLinkActive ? 2.5 : 2} />
                  {isSidebarOpen && (
                    <motion.span 
                      initial={{ opacity: 0 }} 
                      animate={{ opacity: 1 }}
                      className="text-[13px] font-bold tracking-tight"
                    >
                      {item.label}
                    </motion.span>
                  )}
                  {isLinkActive && isSidebarOpen && (
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto w-1.5 h-6 rounded-full bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)]" 
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-6">
          <button
            onClick={handleLogout}
            className={cn(
              "flex items-center gap-3 p-3 rounded-xl w-full text-slate-500 hover:bg-red-500/10 hover:text-red-400 transition-all border border-transparent hover:border-red-500/20 group",
              !isSidebarOpen && "justify-center"
            )}
          >
            <LogOut size={20} className="shrink-0" />
            {isSidebarOpen && <span className="font-medium">Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-300 flex flex-col z-10",
        isSidebarOpen ? "pl-[280px]" : "pl-[88px]"
      )}>
        <header className="h-20 border-b border-white/5 px-8 flex items-center justify-between z-40">
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">
              {menuItems.find(m => window.location.pathname === m.path)?.label || 'MindCare'}
            </h1>
            <p className="text-sm text-slate-400">Welcome back, {profile?.displayName?.split(' ')[0] || 'Explorer'}</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleTheme}
              className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all text-slate-500 hover:text-indigo-400"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="w-10 h-10 rounded-xl border border-white/10 flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all relative">
              <Bell size={20} className="text-slate-500" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-background"></span>
            </button>
            <div 
              onClick={() => navigate('/profile')}
              className="flex items-center gap-3 pl-4 border-l border-white/10 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-white/20 flex items-center justify-center font-black text-white shadow-xl group-hover:scale-105 transition-transform">
                {profile?.displayName?.charAt(0) || 'U'}
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full custom-scrollbar">
          <Outlet />
        </div>

        <footer className="h-12 border-t border-white/5 px-8 flex items-center justify-between text-[10px] font-medium tracking-widest text-slate-500 uppercase">
          <div className="flex gap-6 items-center">
            <span>Status: Secure</span>
            <span className="text-indigo-400/80">Synced with University Portal</span>
          </div>
          <div className="flex gap-4 items-center">
            <span className="hidden sm:inline">Session Active</span>
            <NavLink to="/emergency" className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/20 rounded-md hover:bg-red-500/20 transition-all">Emergency Help</NavLink>
          </div>
        </footer>
      </main>

      <WellnessAssistant />
    </div>
  );
}
