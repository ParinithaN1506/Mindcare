import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { auth, googleProvider, signInWithPopup } from '../lib/firebase';
import { 
  LogIn, 
  ArrowRight,
  Shield,
  Heart,
  Brain
} from 'lucide-react';

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/dashboard');
    } catch (error) {
      console.error('Auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side - Content */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-24 bg-brand-50 w-full lg:w-1/2">
        <div className="max-w-md w-full">
           <div className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-brand-100">M</div>
            <span className="text-2xl font-bold tracking-tight">MindCare</span>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-4 tracking-tight leading-tight">Empowering Student Mental Wellness</h1>
            <p className="text-slate-600 mb-10 leading-relaxed">
              Join a community where mental health is a priority. Sign in to track your mood, maintain a journal, and access personalized AI insights.
            </p>

            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-200 shrink-0 text-brand-600">
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">Secure & Confidential</h3>
                  <p className="text-sm text-slate-500">Your data is stored securely and never shared without permission.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border border-slate-200 shrink-0 text-brand-600">
                  <Brain size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800">AI-Powered Support</h3>
                  <p className="text-sm text-slate-500">Intelligent insights to help you navigate academic stress.</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-white border border-slate-200 rounded-2xl font-bold text-slate-800 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md disabled:opacity-50"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-slate-900"></div>
              ) : (
                <>
                  <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                  Continue with Google
                </>
              )}
            </button>

            <p className="mt-8 text-center text-sm text-slate-500">
                By signing in, you agree to our <a href="#" className="text-brand-600 font-medium">Terms</a> and <a href="#" className="text-brand-600 font-medium">Privacy Policy</a>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right side - Visual (Hidden on mobile) */}
      <div className="hidden lg:flex flex-1 relative bg-brand-600 overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-900"></div>
        <div className="relative z-10 p-12 max-w-lg text-white">
           <div className="flex gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Heart className="text-white" />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Brain className="text-white" />
              </div>
           </div>
           <h2 className="text-5xl font-bold mb-6 tracking-tight leading-tight">Start Your Wellness Journey Today</h2>
           <p className="text-xl text-brand-100 opacity-80 leading-relaxed mb-8 font-light italic">
             "The first step towards wellness is recognizing that your mental health matters just as much as your grades."
           </p>
           <div className="p-6 rounded-3xl bg-white/5 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-full bg-brand-200"></div>
                 <div>
                    <p className="font-bold">Student Wellness Counselor</p>
                    <p className="text-sm opacity-60">Professional Guidance</p>
                 </div>
              </div>
           </div>
        </div>
        
        {/* Background decorations */}
        <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl"></div>
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-white/5 blur-3xl"></div>
      </div>
    </div>
  );
}
