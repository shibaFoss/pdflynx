'use client';

import { useEffect } from 'react';
import { CheckCircle2, Download, RefreshCcw, Share2, Star, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

interface ResultDownloadProps {
  filename: string;
  onDownload: () => void;
  onReset: () => void;
}

export const ResultDownload = ({ filename, onDownload, onReset }: ResultDownloadProps) => {
  useEffect(() => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      className="w-full max-w-2xl mx-auto text-center space-y-12 premium-card p-12 md:p-16 relative overflow-hidden group shadow-[0_32px_64px_-16px_rgba(79,70,229,0.2)] border-primary/20 backdrop-blur-sm rounded-[48px]"
    >
      {/* Animated background highlights */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-rose-500/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
      
      <div className="space-y-8 relative z-10">
        <div className="relative inline-flex items-center justify-center">
           <motion.div 
             animate={{ scale: [1, 1.1, 1] }} 
             transition={{ duration: 2, repeat: Infinity }}
             className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" 
           />
           <div className="relative bg-emerald-500 p-10 rounded-[40px] text-white shadow-2xl shadow-emerald-500/40 ring-8 ring-emerald-500/10 scale-110 mb-4 transform hover:rotate-6 transition-transform duration-500">
             <CheckCircle2 size={64} strokeWidth={2.5} />
           </div>
           <div className="absolute -top-2 -right-2 bg-amber-400 p-2.5 rounded-2xl shadow-lg animate-bounce">
              <Sparkles size={20} className="text-white" />
           </div>
        </div>

        <div className="space-y-4">
           <h2 className="text-5xl font-black tracking-tight text-foreground">Mission Accomplished!</h2>
           <p className="text-xl text-muted-foreground font-medium leading-relaxed max-w-sm mx-auto italic">
             "Your PDF has been expertly crafted and is ready for world domination."
           </p>
        </div>
      </div>

      <div className="premium-card p-8 bg-secondary/30 border-dashed border-3 rounded-[32px] flex flex-col sm:flex-row items-center justify-between gap-8 group/file transition-all hover:bg-white dark:hover:bg-slate-900 hover:border-primary/50 duration-500 relative overflow-hidden">
        <div className="flex items-center gap-6 truncate flex-1 min-w-0 pr-4">
          <div className="bg-primary p-4 rounded-2xl text-white shadow-xl ring-8 ring-primary/5 shadow-primary/30 group-hover/file:scale-110 transition-transform duration-300">
            <Download size={24} strokeWidth={2.5} />
          </div>
          <div className="text-left flex-1 truncate">
            <p className="text-lg font-black truncate group-hover/file:text-primary transition-colors">{filename}</p>
            <p className="text-xs text-muted-foreground font-bold uppercase tracking-[0.2em] mt-1 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               Ready for Download
            </p>
          </div>
        </div>
        <Button 
          onClick={onDownload} 
          size="lg" 
          className="w-full sm:w-auto px-10 h-16 rounded-[22px] shadow-2xl shadow-primary/30 font-black text-lg active:scale-95 transition-all bg-primary hover:bg-indigo-600 hover:scale-105"
        >
          Download Now
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-6">
        <button 
          onClick={onReset} 
          className="flex items-center gap-3 text-muted-foreground hover:text-primary font-bold text-base transition-all group/reset"
        >
          <RefreshCcw size={20} className="group-hover/reset:rotate-180 transition-transform duration-700" />
          <span>Convert another file</span>
        </button>
      </div>
    </motion.div>
  );
};
