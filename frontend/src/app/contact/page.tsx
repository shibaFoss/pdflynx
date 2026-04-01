'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, MapPin, Send, MessageCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    // Simulate network request
    setTimeout(() => {
      setStatus('success');
    }, 1500);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[0%] right-[-10%] w-[600px] h-[600px] bg-primary/8 rounded-full blur-[140px] -z-10" />

      <div className="container mx-auto px-4 max-w-5xl py-12 md:py-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">

        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black border border-primary/20 uppercase tracking-widest">
            <MessageSquare size={13} className="fill-primary" />
            Get in touch
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
            Have a question, feedback, or need support? We&apos;d love to hear from you.
            Reach out to our team and we&apos;ll get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="premium-card p-8 space-y-6 hover:-translate-y-1 transition-transform border-2 group">
               <div className="w-14 h-14 rounded-[20px] bg-primary/10 flex items-center justify-center text-primary ring-4 ring-primary/5">
                 <Mail size={24} strokeWidth={2.5} />
               </div>
               <div>
                 <p className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-1">Email Support</p>
                 <a href="mailto:contact@pdflynx.com" className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">contact@pdflynx.com</a>
                 <p className="text-sm font-medium text-muted-foreground mt-2">Expect a reply within 24 hours.</p>
               </div>
            </div>

            <div className="premium-card p-8 space-y-6 hover:-translate-y-1 transition-transform border-2">
               <div className="w-14 h-14 rounded-[20px] bg-emerald-500/10 flex items-center justify-center text-emerald-500 ring-4 ring-emerald-500/5">
                 <MapPin size={24} strokeWidth={2.5} />
               </div>
               <div>
                 <p className="text-sm font-black uppercase tracking-widest text-muted-foreground mb-1">Our Office</p>
                 <p className="text-xl font-bold text-foreground">Shri Laadli Infotech Pvt. Ltd.</p>
                 <p className="text-sm font-medium text-muted-foreground mt-2">Operating globally since 2025 to bring you the best PDF tools.</p>
               </div>
            </div>

            <div className="p-6 rounded-3xl bg-secondary/50 border border-border/50 flex gap-4 text-muted-foreground">
               <MessageCircle size={20} className="shrink-0 text-primary" />
               <p className="text-xs font-bold leading-relaxed">
                  For bug reports, please include your browser version, OS, and the type of file you were processing.
               </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="premium-card p-8 md:p-12 w-full h-full border-2 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />

               {status === 'success' ? (
                 <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12"
                 >
                   <div className="w-24 h-24 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center ring-8 ring-emerald-500/5">
                      <CheckCircle2 size={48} strokeWidth={2.5} />
                   </div>
                   <h3 className="text-3xl font-black text-foreground">Message Sent!</h3>
                   <p className="text-muted-foreground font-medium max-w-sm">
                     Thanks for reaching out. We&apos;ve received your message and will reply to you shortly.
                   </p>
                   <Button onClick={() => setStatus('idle')} variant="outline" className="rounded-2xl px-8 mt-4 font-bold">
                     Send another message
                   </Button>
                 </motion.div>
               ) : (
                 <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground pl-1">Your Name</label>
                        <input required type="text" placeholder="John Doe" className="w-full h-14 px-6 rounded-2xl bg-secondary/50 border-2 border-transparent focus:border-primary/50 focus:bg-white outline-none text-base font-bold transition-all" />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-muted-foreground pl-1">Email Address</label>
                        <input required type="email" placeholder="john@example.com" className="w-full h-14 px-6 rounded-2xl bg-secondary/50 border-2 border-transparent focus:border-primary/50 focus:bg-white outline-none text-base font-bold transition-all" />
                     </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground pl-1">Subject</label>
                      <input required type="text" placeholder="How can we help you?" className="w-full h-14 px-6 rounded-2xl bg-secondary/50 border-2 border-transparent focus:border-primary/50 focus:bg-white outline-none text-base font-bold transition-all" />
                   </div>

                   <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-muted-foreground pl-1">Message</label>
                      <textarea required placeholder="Write your message here..." className="w-full h-40 py-4 px-6 rounded-2xl bg-secondary/50 border-2 border-transparent focus:border-primary/50 focus:bg-white outline-none text-base font-bold transition-all resize-none" />
                   </div>

                   {status === 'error' && (
                     <div className="p-4 rounded-2xl bg-destructive/10 text-destructive flex items-center gap-3 text-sm font-bold border border-destructive/20">
                       <AlertCircle size={18} /> Failed to send message. Please try emailing us directly.
                     </div>
                   )}

                   <Button 
                     type="submit" 
                     disabled={status === 'sending'}
                     size="lg" 
                     className="w-full h-16 rounded-[20px] text-lg font-black shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                   >
                     {status === 'sending' ? (
                       <span className="flex items-center gap-2">Sending...</span>
                     ) : (
                       <span className="flex items-center gap-2">Send Message <Send size={20} strokeWidth={2.5} /></span>
                     )}
                   </Button>
                 </form>
               )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
