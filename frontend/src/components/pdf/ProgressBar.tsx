import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  label?: string;
  sublabel?: string;
}

export const ProgressBar = ({ progress, label, sublabel }: ProgressBarProps) => {
  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 text-center animate-in fade-in zoom-in duration-500">
      <div className="space-y-3">
        <h3 className="text-2xl font-bold tracking-tight text-foreground">{label || 'Processing...'}</h3>
        <p className="text-sm text-muted-foreground font-medium">{sublabel || 'Please wait while we handle your PDF'}</p>
      </div>
      <div className="relative pt-1">
        <div className="flex mb-3 items-center justify-between">
          <div>
            <span className="text-xs font-bold inline-block py-1 px-3 uppercase rounded-full text-white bg-primary shadow-sm shadow-primary/20">
              In Progress
            </span>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold inline-block text-primary">
              {progress}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-primary/10 shadow-inner">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary shadow-lg shadow-primary/20 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
          </motion.div>
        </div>
      </div>
      <div className="flex justify-center gap-4 py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent shadow-sm"></div>
      </div>
    </div>
  );
};
