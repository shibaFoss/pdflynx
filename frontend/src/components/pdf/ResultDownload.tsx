'use client';

import { useEffect } from 'react';
import { CheckCircle2, Download, RefreshCcw, Share2, Star } from 'lucide-react';
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
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#4f46e5', '#6366f1', '#a5b4fc']
    });
  }, []);

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="w-full max-w-2xl mx-auto text-center space-y-12 premium-card p-12 relative overflow-hidden group shadow-2xl border-primary/20 backdrop-blur-sm"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Star size={100} />
      </div>
      <div className="absolute bottom-0 left-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <Share2 size={100} />
      </div>
      
      <div className="space-y-6 relative z-10">
        <div className="inline-flex items-center justify-center bg-green-500/10 p-8 rounded-full text-green-500 ring-8 ring-green-500/5 shadow-inner scale-110 mb-4 animate-bounce-slow">
          <CheckCircle2 size={56} />
        </div>
        <h2 className="text-4xl font-extrabold tracking-tight text-foreground">Mission Accomplished!</h2>
        <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-sm mx-auto">
          Your PDF is ready for download. We've processed it exactly as you wanted.
        </p>
      </div>

      <div className="premium-card p-6 bg-muted/50 border-dashed border-2 flex flex-col sm:flex-row items-center justify-between gap-6 group/file transition-all hover:bg-muted duration-300">
        <div className="flex items-center gap-4 truncate flex-1 min-w-0 pr-4">
          <div className="bg-primary p-3 rounded-xl text-white shadow-md ring-4 ring-primary/10 shadow-primary/20">
            <Download size={20} />
          </div>
          <div className="text-left flex-1 truncate">
            <p className="text-sm font-bold truncate group-hover/file:text-primary transition-colors">{filename}</p>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-0.5">Ready for Download</p>
          </div>
        </div>
        <Button onClick={onDownload} size="lg" className="w-full sm:w-auto px-10 rounded-full shadow-lg shadow-primary/20 animate-pulse-slow active:scale-95">
          Download Files
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
        <Button variant="outline" onClick={onReset} className="w-full sm:w-auto rounded-full px-8 font-bold border-2 border-primary/10 hover:border-primary/40 group/reset">
          <RefreshCcw size={18} className="mr-2 group-hover/reset:rotate-180 transition-transform duration-500" />
          Start New Task
        </Button>
      </div>
    </motion.div>
  );
};
