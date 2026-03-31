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
    color: 'bg-indigo-600',
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
    color: 'bg-primary',
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
    color: 'bg-accent',
  },
];

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[120px] -z-10 animate-pulse delay-1000" />

      <section className="container mx-auto px-4 pt-12 pb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-8 max-w-4xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black border border-primary/20 backdrop-blur-xl animate-float">
            <Heart size={14} className="fill-primary" />
            <span className="uppercase tracking-widest text-[10px]">Loved by users across the world</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.85] text-foreground">
            PDF tools that <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent animate-gradient">simply</span> work.
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
            Fast, secure, and beautifully designed. Process your documents without annoying limits or complexity.
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
          className="mt-20 pt-16 border-t border-border/20 grid grid-cols-1 md:grid-cols-3 gap-12"
        >
          <div className="flex flex-col items-center text-center space-y-4">
             <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 ring-4 ring-indigo-500/5">
                <ShieldCheck size={28} />
             </div>
             <h3 className="text-xl font-bold">Privacy First</h3>
             <p className="text-muted-foreground text-sm font-medium">Your files are processed locally and deleted immediately after. We never see your data.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
             <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center text-accent ring-4 ring-accent/5">
                <Zap size={28} />
             </div>
             <h3 className="text-xl font-bold">Instant Speed</h3>
             <p className="text-muted-foreground text-sm font-medium">Blazing fast processing using high-performance backend tools and modern architectures.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
             <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary ring-4 ring-primary/5">
                <Heart size={28} className="fill-primary" />
             </div>
             <h3 className="text-xl font-bold">Simply Reliable</h3>
             <p className="text-muted-foreground text-sm font-medium">Built with care and loved by users across the world. No subscriptions or hidden fees.</p>
          </div>
        </motion.div>

        {/* Final Hook CTA */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.95 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 1 }}
           className="mt-32 relative overflow-hidden premium-card p-12 md:p-20 text-center border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5"
        >
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32" />
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/10 rounded-full blur-[100px] -ml-32 -mb-32" />
           
           <div className="relative z-10 space-y-10">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                 Ready to <span className="text-primary italic">transform</span> your workflow?
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-xl mx-auto">
                 Experience the true power of professional document tools. No signups, no limits, just pure performance.
              </p>
              <div className="flex items-center justify-center">
                 <button 
                   onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                   className="px-10 h-16 rounded-full bg-primary text-white font-black text-lg shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto"
                 >
                    Get Started Free
                 </button>
              </div>
           </div>
        </motion.div>
      </section>
    </div>
  );
}
