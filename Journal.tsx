import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Shield, 
  Brain, 
  Sparkles, 
  Target, 
  MessageCircle, 
  Heart,
  ChevronRight,
  ArrowRight,
  BookOpen
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-bottom border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold">M</div>
            <span className="text-xl font-bold tracking-tight">MindCare</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-brand-600 transition-colors">Features</a>
            <a href="#about" className="hover:text-brand-600 transition-colors">About</a>
            <a href="#faq" className="hover:text-brand-600 transition-colors">FAQ</a>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/auth" className="text-sm font-medium hover:text-brand-600 transition-colors">Sign In</Link>
            <Link to="/auth" className="px-5 py-2.5 bg-brand-600 text-white rounded-full text-sm font-medium hover:bg-brand-700 transition-all shadow-lg shadow-brand-200">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 -z-10 blur-3xl opacity-20">
          <div className="w-[500px] h-[500px] rounded-full bg-brand-500 transform translate-x-1/2 -translate-y-1/2"></div>
        </div>
        <div className="absolute bottom-0 left-0 -z-10 blur-3xl opacity-10">
          <div className="w-[500px] h-[500px] rounded-full bg-purple-500 transform -translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 text-brand-600 text-xs font-semibold mb-6">
              <Sparkles size={14} />
              <span>AI-Powered Student Wellness</span>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold leading-[1.1] mb-6 tracking-tight">
              Your Mental Well-being <br />
              <span className="text-brand-600">Reimagined</span>
            </h1>
            <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
              MindCare is a professional wellness platform designed specifically for students. Experience intelligent mood tracking, AI-assisted journaling, and real-time support to navigate academic life with clarity and resilience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/auth" className="px-8 py-4 bg-brand-600 text-white rounded-xl font-semibold hover:bg-brand-700 transition-all shadow-xl shadow-brand-200 flex items-center justify-center gap-2 group">
                Join Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#features" className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all flex items-center justify-center">
                Explore Features
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl glass p-4 aspect-video flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-br from-brand-50 to-indigo-50 -z-10"></div>
              <div className="grid grid-cols-2 gap-4 w-full h-full p-4">
                {[1,2,3,4].map(i => (
                  <div key={i} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 flex flex-col gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50"></div>
                    <div className="h-4 w-3/4 bg-slate-50 rounded"></div>
                    <div className="h-4 w-1/2 bg-slate-50 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
            {/* Floating cards */}
            <motion.div 
               animate={{ y: [0, -10, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -top-6 -right-6 p-4 bg-white rounded-2xl shadow-xl shadow-brand-100 border border-slate-100 max-w-[200px]"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-xs font-bold text-slate-400">DAILY SCORE</span>
              </div>
              <div className="text-2xl font-bold text-brand-600">88%</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold mb-4 tracking-tight">Everything you need to thrive</h2>
            <p className="text-slate-600">Thoughtfully designed features to support your mental health journey throughout your university life.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Heart, title: "Smart Mood Tracking", desc: "Identify emotional patterns with professional intensity sliders and tagging." },
              { icon: Brain, title: "AI-Powered Insights", desc: "Detect burnout risks early with our advanced emotional trend analysis engine." },
              { icon: BookOpen, title: "Rich Meta Journaling", desc: "Express yourself in a secure space with AI-generated summaries and summaries." },
              { icon: Target, title: "Focus & Productivity", desc: "Balance study and wellness with dedicated Pomodoro timers and session tracking." },
              { icon: MessageCircle, title: "Anonymous Community", desc: "Connect with peers in a safe, moderated, and supportive anonymous forum." },
              { icon: Shield, title: "Privacy First", desc: "Your data is encrypted and locked. You have complete control over your privacy." }
            ].map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200 transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 mb-6 font-bold">
                   <f.icon size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section (Mock) */}
      <section className="py-24 px-6 bg-white border-y border-slate-100">
         <div className="max-w-7xl mx-auto">
            <div className="flex flex-wrap justify-center gap-12 md:gap-24 opacity-40 grayscale filter">
               <span className="text-2xl font-black italic tracking-tighter">UNIVERSITY PARTNER</span>
               <span className="text-2xl font-black italic tracking-tighter">STUDENT UNION</span>
               <span className="text-2xl font-black italic tracking-tighter">WELLNESS CO.</span>
               <span className="text-2xl font-black italic tracking-tighter">ACADEMIC PRESS</span>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-brand-600 rounded-[3rem] p-12 lg:p-20 text-center text-white relative overflow-hidden shadow-2xl shadow-brand-200">
            <div className="absolute top-0 right-0 -z-0 opacity-10">
               <Brain size={400} className="transform translate-x-1/4 -translate-y-1/4" />
            </div>
            
            <h2 className="text-4xl lg:text-6xl font-bold mb-8 tracking-tight relative z-10">Ready to start your <br />wellness journey?</h2>
            <p className="text-brand-100 mb-10 text-lg max-w-xl mx-auto relative z-10 leading-relaxed">
              Join thousands of students who are prioritizing their mental health. Sign up today and experience the future of wellness.
            </p>
            <Link to="/auth" className="inline-flex items-center gap-2 px-10 py-5 bg-white text-brand-600 rounded-2xl font-bold hover:bg-slate-100 transition-all shadow-xl text-lg relative z-10">
              Get Started Now <ChevronRight size={22} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold">M</div>
            <span className="text-xl font-bold tracking-tight">MindCare</span>
          </div>
          <div className="flex gap-8 text-sm text-slate-500 font-medium">
            <a href="#" className="hover:text-brand-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-brand-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-brand-600 transition-colors">Contact Support</a>
          </div>
          <p className="text-sm text-slate-400">© 2024 MindCare Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
