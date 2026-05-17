import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { db, doc, setDoc } from '../lib/firebase';
import { cn } from '../lib/utils';
import { 
  CheckCircle2, 
  User, 
  Book, 
  Activity, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'student' | 'counselor' | 'admin'>('student');
  const [displayName, setDisplayName] = useState('');
  const { profile, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const handleComplete = async () => {
    if (!profile) return;
    try {
      await setDoc(doc(db, 'users', profile.uid), {
        ...profile,
        role,
        displayName: displayName || profile.displayName,
        onboardingCompleted: true
      });
      await refreshProfile();
      navigate('/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
    }
  };

  const steps = [
    {
      title: 'Welcome to MindCare',
      desc: 'Let\'s get your profile set up correctly to personalize your experience.',
      icon: ShieldCheck
    },
    {
      title: 'Identity',
      desc: 'How should we address you within the platform?',
      icon: User
    },
    {
      title: 'Your Role',
      desc: 'Are you here as a student seeking wellness or a counselor providing support?',
      icon: Book
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden">
        <div className="h-2 bg-slate-100 w-full">
           <motion.div 
             className="h-full bg-brand-600"
             initial={{ width: '0%' }}
             animate={{ width: `${(step / 3) * 100}%` }}
           />
        </div>

        <div className="p-10 lg:p-16">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-3xl bg-brand-50 flex items-center justify-center text-brand-600 mx-auto mb-8">
                  <ShieldCheck size={40} />
                </div>
                <h2 className="text-3xl font-bold mb-4 tracking-tight">Your Privacy Matters</h2>
                <p className="text-slate-500 mb-10 leading-relaxed">
                  Before we begin, rest assured that your mental wellness journey is private and secure. All data on MindCare is encrypted and handled with the highest professional standards.
                </p>
                <button
                  onClick={() => setStep(2)}
                  className="w-full py-4 bg-brand-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-brand-700 transition-all shadow-xl shadow-brand-100"
                >
                  Continue <ArrowRight size={20} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-3xl font-bold mb-4 tracking-tight">Tell us your name</h2>
                <p className="text-slate-500 mb-8">This is how you will appear in your dashboard and community posts.</p>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your display name"
                  className="w-full p-4 rounded-2xl border border-slate-200 mb-10 focus:ring-2 focus:ring-brand-500 outline-none transition-all"
                />
                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all">Back</button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!displayName && !profile?.displayName}
                    className="flex-[2] py-4 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-xl shadow-brand-100 disabled:opacity-50"
                  >
                    Next Step
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <h2 className="text-3xl font-bold mb-4 tracking-tight">Select your role</h2>
                <p className="text-slate-500 mb-8">Choose the role that best describes your purpose on MindCare.</p>
                
                <div className="grid grid-cols-1 gap-4 mb-10">
                  {[
                    { id: 'student', title: 'Student', desc: 'Focus on your wellness, track mood, and journal.' },
                    { id: 'counselor', title: 'Counselor', desc: 'Provide professional support and manage cases.' }
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setRole(r.id as any)}
                      className={cn(
                        "p-6 rounded-2xl border text-left transition-all",
                        role === r.id 
                          ? "border-brand-600 bg-brand-50" 
                          : "border-slate-200 hover:border-brand-300"
                      )}
                    >
                      <h4 className={cn("font-bold mb-1", role === r.id ? "text-brand-600" : "text-slate-800")}>{r.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">{r.desc}</p>
                    </button>
                  ))}
                </div>

                <div className="flex gap-4">
                   <button onClick={() => setStep(2)} className="flex-1 py-4 text-slate-500 font-bold hover:bg-slate-50 rounded-2xl transition-all">Back</button>
                   <button
                    onClick={handleComplete}
                    className="flex-[2] py-4 bg-brand-600 text-white rounded-2xl font-bold hover:bg-brand-700 transition-all shadow-xl shadow-brand-100"
                  >
                    Complete Setup
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
