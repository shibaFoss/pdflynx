'use client';

import { useEffect } from 'react';
import { CheckCircle2, Download, RefreshCcw, Trophy, Zap, ShieldCheck } from 'lucide-react';
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
    const end = Date.now() + 2000;
    const colors = ['#3b82f6', '#10b981'];

    (function frame() {
      confetti({ particleCount: 3, angle: 60, spread: 55, origin: { x: 0 }, colors: colors });
      confetti({ particleCount: 3, angle: 120, spread: 55, origin: { x: 1 }, colors: colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    }());
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto premium-card p-8 md:p-10 relative overflow-hidden shadow-[0_48px_100px_-24px_rgba(37,99,235,0.25)] border-primary/20 backdrop-blur-2xl rounded-[2.5rem]"
    >
      {/* High-Impact Atmospheric Layer */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-emerald-500/5 to-primary/5 -z-10" />
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-primary/10 rounded-full blur-[100px] animate-pulse" />

      <div className="flex flex-col lg:flex-row items-center gap-10 relative z-10">
        {/* Success Hero Area */}
        <div className="flex-shrink-0 flex flex-col items-center gap-4">
          <div className="relative group/check">
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-emerald-500/20 blur-[40px] rounded-full"
            />
            <div className="relative bg-emerald-500 p-7 rounded-[2rem] text-white shadow-2xl shadow-emerald-500/40 ring-8 ring-emerald-500/10 group-hover/check:rotate-12 transition-all duration-500">
              <CheckCircle2 size={42} strokeWidth={3} />
            </div>
            <div className="absolute -top-3 -right-3 bg-amber-400 p-2 rounded-xl shadow-xl animate-bounce">
              <Trophy size={14} className="text-white" />
            </div>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.2em]">Live & Optimized</span>
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full border border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest">
              <Zap size={10} className="fill-primary" />
              <span>Ultra Speed</span>
            </div>
          </div>
        </div>

        {/* Middle Divider Line (Desktop only) */}
        <div className="hidden lg:block w-px h-32 bg-border/40" />

        {/* Content & Action Area */}
        <div className="flex-1 min-w-0 text-center lg:text-left space-y-7">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-none">
              Success! <span className="text-primary">Download</span> Ready.
            </h2>
            <p className="text-base text-muted-foreground font-bold truncate max-w-md opacity-80">{filename}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Button
              onClick={onDownload}
              size="lg"
              className="w-full sm:w-auto px-10 h-16 rounded-full shadow-[0_20px_40px_-5px_rgba(37,99,235,0.4)] font-black text-lg bg-primary hover:bg-blue-600 hover:scale-[1.03] active:scale-95 transition-all group/btn relative overflow-hidden"
            >
              <div className="relative z-10 flex items-center gap-3">
                <Download size={22} strokeWidth={3} />
                <span>Download File</span>
              </div>
              <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/btn:translate-x-0 transition-transform duration-500" />
            </Button>

            <button
              onClick={onReset}
              className="flex items-center gap-3 px-8 h-16 rounded-full hover:bg-secondary text-muted-foreground hover:text-primary font-black text-sm uppercase tracking-widest transition-all group/reset"
            >
              <RefreshCcw size={18} className="group-hover/reset:rotate-180 transition-transform duration-700" />
              <span>Start Again</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-Footer Performance Trust Area */}
      <div className="mt-8 pt-8 border-t border-border/10 flex flex-wrap justify-center lg:justify-start items-center gap-x-10 gap-y-4 opacity-60 grayscale hover:grayscale-0 transition-all duration-700">
        <div className="flex items-center gap-2">
          <ShieldCheck size={14} className="text-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-widest">End-to-End Secure</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest">Pixel Perfect Quality</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest">Cloudless Processing</span>
        </div>
      </div>
    </motion.div>
  );
};
