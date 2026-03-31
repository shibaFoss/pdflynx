'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ProgressBarProps {
  progress: number;
  label?: string;
  sublabel?: string;
}

export const ProgressBar = ({ progress, label, sublabel }: ProgressBarProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-10 text-center animate-in fade-in zoom-in-95 duration-700">
      <div className="space-y-4">
        <h3 className="text-4xl font-black tracking-tight text-foreground">{label || 'Processing...'}</h3>
        <p className="text-lg text-muted-foreground font-medium">{sublabel || 'Our servers are working their magic on your PDF'}</p>
      </div>

      <div className="relative pt-4 space-y-4">
        <div className="flex items-end justify-between px-2">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg text-white shadow-lg shadow-primary/20">
               <Loader2 size={18} className="animate-spin" />
            </div>
            <span className="text-sm font-black text-primary uppercase tracking-widest">
              Live Progress
            </span>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-primary">
              {progress}%
            </span>
          </div>
        </div>

        <div className="relative h-6 rounded-full bg-secondary/50 border-2 border-border/50 p-1 overflow-hidden shadow-inner flex items-center">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(progress, 5)}%` }}
            transition={{ duration: 0.5, ease: "circOut" }}
            className="h-full rounded-full bg-primary shadow-2xl shadow-primary/40 relative overflow-hidden"
          >
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-white/20" />
            {/* Animated shimmer */}
            <motion.div 
               animate={{ x: ['-100%', '200%'] }}
               transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
               className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-full skew-x-[-20deg]" 
            />
          </motion.div>
        </div>
      </div>

      <div className="flex justify-center gap-8 py-4 opacity-40">
         <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
         <div className="w-2 h-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
         <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
      </div>
    </div>
  );
};
