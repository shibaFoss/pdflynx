'use client';

import { ToolCard } from '@/components/home/ToolCard';
import { 
  Layers, 
  Scissors, 
  Zap, 
  Image as ImageIcon, 
  FileImage, 
  Sparkles, 
  ShieldCheck, 
  Heart,
} from 'lucide-react';
import { motion } from 'framer-motion';

const TOOLS = [
  {
    title: 'Merge PDF',
    description: 'Combine multiple PDF files into one document in seconds.',
    icon: Layers,
    href: '/merge-pdf',
    color: 'bg-indigo-500',
  },
  {
    title: 'Split PDF',
    description: 'Separate one page or a whole range into individual PDF files.',
    icon: Scissors,
    href: '/split-pdf',
    color: 'bg-sky-500',
  },
  {
    title: 'Compress PDF',
    description: 'Reduce file size while optimizing for maximum PDF quality.',
    icon: Zap,
    href: '/compress-pdf',
    color: 'bg-amber-500',
  },
  {
    title: 'PDF to Image',
    description: 'Convert PDF pages into high-quality JPG or PNG images.',
    icon: FileImage,
    href: '/pdf-to-image',
    color: 'bg-rose-500',
  },
  {
    title: 'Image to PDF',
    description: 'Transform your images into a professional PDF document.',
    icon: ImageIcon,
    href: '/image-to-pdf',
    color: 'bg-emerald-500',
  },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute -bottom-24 right-1/4 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl -z-10" />

      <section className="container mx-auto px-4 pt-12 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 max-w-4xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20 backdrop-blur-md">
            <Sparkles size={14} />
            <span>Open Source & Forever Free</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[0.95] text-foreground">
            The PDF tools you <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">actually</span> love.
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
            Fast, secure, and beautiful. Process your documents without annoying limits or privacy concerns.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {TOOLS.map((tool, index) => (
            <ToolCard key={tool.title} {...tool} index={index} />
          ))}
          
          {/* Coming Soon Card */}
          <div className="premium-card p-8 flex flex-col justify-center items-center text-center opacity-60 border-dashed border-2 group hover:opacity-100 transition-all duration-500">
             <div className="p-4 rounded-2xl bg-secondary mb-4 group-hover:bg-primary/10 transition-colors">
                <Heart className="group-hover:text-primary transition-colors italic" />
             </div>
             <p className="font-bold text-lg">More Tools Soon</p>
             <p className="text-sm text-muted-foreground">We are constantly building more features for you.</p>
          </div>
        </motion.div>

        {/* trust section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-32 pt-20 border-t border-border/50 grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          <div className="flex flex-col items-center text-center space-y-4">
             <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                <ShieldCheck size={28} />
             </div>
             <h3 className="text-xl font-bold">Privacy First</h3>
             <p className="text-muted-foreground">Your files are processed locally and deleted immediately after. We never see your data.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
             <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <Zap size={28} />
             </div>
             <h3 className="text-xl font-bold">Instant Speed</h3>
             <p className="text-muted-foreground">Blazing fast processing using high-performance backend tools and modern architectures.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
             <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                <Heart size={28} />
             </div>
             <h3 className="text-xl font-bold">Always Free</h3>
             <p className="text-muted-foreground">No subscriptions, no hidden fees, no limits. Just open source tools for everyone.</p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
