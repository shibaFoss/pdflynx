'use client';

import { useEffect } from 'react';
import { CheckCircle2, Download, RefreshCcw, Sparkles } from 'lucide-react';
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

    const interval = setInterval(function() {
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
      className="w-full max-w-2xl mx-auto text-center space-y-10 premium-card p-8 md:p-12 relative overflow-hidden group shadow-[0_32px_64px_-16px_rgba(79,70,229,0.2)] border-primary/20 backdrop-blur-sm rounded-[40px]"
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
           <div className="relative bg-emerald-500 p-8 rounded-[32px] text-white shadow-2xl shadow-emerald-500/40 ring-8 ring-emerald-500/10 scale-105 mb-2 transform hover:rotate-6 transition-transform duration-500">
             <CheckCircle2 size={48} strokeWidth={2.5} />
           </div>
           <div className="absolute -top-1 -right-1 bg-amber-400 p-2 rounded-xl shadow-lg animate-bounce">
              <Sparkles size={16} className="text-white" />
           </div>
        </div>

        <div className="space-y-3">
           <h2 className="text-4xl font-black tracking-tight text-foreground">Mission Accomplished!</h2>
           <p className="text-lg text-muted-foreground font-medium leading-relaxed max-w-sm mx-auto italic">
             &quot;Your PDF is ready for world domination.&quot;
           </p>
        </div>
      </div>

      <div className="premium-card p-6 bg-secondary/30 border-dashed border-2 rounded-[28px] flex flex-col sm:flex-row items-center justify-between gap-6 group/file transition-all hover:bg-white dark:hover:bg-slate-900 hover:border-primary/50 duration-500 relative overflow-hidden">
        <div className="flex items-center gap-4 truncate flex-1 min-w-0 pr-2">
          <div className="bg-primary p-3 rounded-xl text-white shadow-xl ring-6 ring-primary/5 shadow-primary/30 group-hover/file:scale-110 transition-transform duration-300">
            <Download size={20} strokeWidth={2.5} />
          </div>
          <div className="text-left flex-1 truncate">
            <p className="text-base font-black truncate group-hover/file:text-primary transition-colors">{filename}</p>
            <p className="text-[10px] text-muted-foreground font-extrabold uppercase tracking-[0.2em] mt-0.5 flex items-center gap-1.5">
               <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               Ready for Download
            </p>
          </div>
        </div>
        <Button 
          onClick={onDownload} 
          size="lg" 
          className="w-full sm:w-auto px-8 h-14 rounded-[18px] shadow-2xl shadow-primary/30 font-black text-base active:scale-95 transition-all bg-primary hover:bg-indigo-600 hover:scale-105"
        >
          Download Now
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-4">
        <button 
          onClick={onReset} 
          className="flex items-center gap-2 text-muted-foreground hover:text-primary font-bold text-sm transition-all group/reset"
        >
          <RefreshCcw size={18} className="group-hover/reset:rotate-180 transition-transform duration-700" />
          <span>Convert another file</span>
        </button>
      </div>
    </motion.div>
  );
};
