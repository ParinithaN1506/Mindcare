import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Heart, 
  Send, 
  User, 
  Shield, 
  Search,
  Plus,
  MoreVertical,
  Flag
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { db, collection, query, orderBy, onSnapshot, addDoc, Timestamp, doc, updateDoc, increment, limit } from '../lib/firebase';
import { cn } from '../lib/utils';
import { formatDistanceToNow } from 'date-fns';

export default function Community() {
  const { profile } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'communityPosts'), orderBy('createdAt', 'desc'), limit(15));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handlePost = async () => {
    if (!profile || !content.trim()) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'communityPosts'), {
        content: content.trim(),
        authorId: profile.uid,
        authorName: isAnonymous ? 'Anonymous' : profile.displayName,
        isAnonymous,
        likes: 0,
        tags: [],
        createdAt: Timestamp.now()
      });
      setContent('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async (postId: string) => {
     try {
       const postRef = doc(db, 'communityPosts', postId);
       await updateDoc(postRef, {
         likes: increment(1)
       });
     } catch (e) { console.error(e); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
         <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Collective Wisdom</h2>
            <p className="text-slate-400 mt-1">A secure, moderated space for shared growth and synchronization.</p>
         </div>
         <div className="flex items-center gap-2 px-4 py-2 glass text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
            <Shield size={14} className="animate-pulse" /> Secure Node
         </div>
      </section>

      {/* New Post Box */}
      <div className="glass rounded-[2.5rem] p-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl"></div>
         <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500">
               <User size={18} />
            </div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Post to collective</span>
         </div>
         
         <textarea 
           value={content}
           onChange={(e) => setContent(e.target.value)}
           placeholder="Struggling with something? Or want to share a breakthrough?"
           className="w-full bg-white/5 p-8 rounded-[2rem] border border-white/5 outline-none focus:bg-white/10 focus:border-indigo-500/30 transition-all text-slate-200 min-h-[160px] resize-none leading-relaxed text-sm font-serif italic"
         />

         <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <label className="flex items-center gap-2 cursor-pointer group">
                  <div className={cn(
                    "w-4 h-4 rounded border flex items-center justify-center transition-all",
                    isAnonymous ? "bg-indigo-600 border-indigo-600 shadow-[0_0_8px_rgba(99,102,241,0.4)]" : "bg-white/5 border-white/10"
                  )}>
                    {isAnonymous && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                  </div>
                  <input 
                    type="checkbox" 
                    checked={isAnonymous} 
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="hidden" 
                  />
                  <span className="text-[10px] font-black text-slate-500 group-hover:text-slate-300 transition-colors uppercase tracking-[0.1em]">Anonymize Transmission</span>
               </label>
            </div>
            <button 
              onClick={handlePost}
              disabled={!content.trim() || isSubmitting}
              className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl shadow-indigo-600/30 lg:hover:bg-indigo-500 transition-all disabled:opacity-50"
            >
               Broadcast <Send size={18} />
            </button>
         </div>
      </div>

      {/* Feed */}
      <div className="space-y-6">
         {posts.map((post) => (
           <motion.div 
             key={post.id}
             initial={{ opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="glass rounded-[2rem] p-8 relative group overflow-hidden border-white/5 lg:hover:border-white/10 transition-all"
           >
              <div className="flex items-center justify-between mb-6">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-indigo-400 font-bold text-[10px] uppercase">
                       {post.authorName?.split(' ').map((n: string) => n[0]).join('') || 'A'}
                    </div>
                    <div>
                       <p className="text-xs font-black text-white uppercase tracking-widest">{post.authorName}</p>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mt-0.5">
                          Signal detected {formatDistanceToNow(post.createdAt.toDate())} ago
                       </p>
                    </div>
                 </div>
                 <button className="w-8 h-8 flex items-center justify-center text-slate-600 lg:hover:text-white lg:hover:bg-white/5 rounded-lg transition-all">
                    <MoreVertical size={18} />
                 </button>
              </div>

              <div className="mb-8">
                 <p className="text-slate-300 leading-relaxed font-serif text-sm italic">"{post.content}"</p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                 <div className="flex items-center gap-8">
                    <button 
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-3 text-slate-500 lg:hover:text-indigo-400 transition-all group"
                    >
                       <div className={cn(
                         "w-9 h-9 rounded-full flex items-center justify-center transition-all border",
                         post.likes > 0 ? "bg-indigo-600/10 border-indigo-600/30 text-indigo-400" : "bg-white/5 border-white/5 group-hover:bg-white/10"
                       )}>
                          <Heart size={16} className={cn(post.likes > 0 ? "fill-indigo-400" : "")} />
                       </div>
                       <span className="text-xs font-black tracking-widest">{post.likes}</span>
                    </button>
                    <button className="flex items-center gap-3 text-slate-500 lg:hover:text-indigo-400 transition-all group">
                       <div className="w-9 h-9 rounded-full bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all">
                          <MessageSquare size={16} />
                       </div>
                       <span className="text-xs font-black tracking-widest">RESPOND</span>
                    </button>
                 </div>
                 <button className="text-[10px] font-black text-slate-600 lg:hover:text-red-400 transition-colors flex items-center gap-2 uppercase tracking-[0.2em]">
                    <Flag size={12} /> Flag 
                 </button>
              </div>
           </motion.div>
         ))}
      </div>
    </div>
  );
}
