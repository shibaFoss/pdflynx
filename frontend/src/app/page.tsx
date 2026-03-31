'use client';

import { ToolCard } from '@/components/home/ToolCard';
import { Layers, Scissors, Zap, Image as ImageIcon, FileImage, Sparkles, ShieldCheck, Heart } from 'lucide-react';

const TOOLS = [
  {
    title: 'Merge PDF',
    description: 'Combine multiple PDF files into one in perfect order.',
    icon: Layers,
    href: '/merge-pdf',
    color: 'bg-indigo-500 text-indigo-500'
  },
  {
    title: 'Split PDF',
    description: 'Extract pages from your PDF or separate each page into its own file.',
    icon: Scissors,
    href: '/split-pdf',
    color: 'bg-emerald-500 text-emerald-500'
  },
  {
    title: 'Compress PDF',
    description: 'Reduce the file size of your PDF without sacrificing quality.',
    icon: Zap,
    href: '/compress-pdf',
    color: 'bg-amber-500 text-amber-500'
  },
  {
    title: 'PDF to Image',
    description: 'Convert each PDF page into a high-quality PNG or JPG image.',
    icon: ImageIcon,
    href: '/pdf-to-image',
    color: 'bg-rose-500 text-rose-500'
  },
  {
    title: 'Image to PDF',
    description: 'Create a single PDF document from a collection of your images.',
    icon: FileImage,
    href: '/image-to-pdf',
    color: 'bg-blue-500 text-blue-500'
  }
];

export default function Home() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
      {/* Hero Section */}
      <section className="text-center space-y-8 pt-16 pb-8 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-[120px] -z-10 rounded-full" />
        <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary text-sm font-bold shadow-sm ring-1 ring-primary/20 backdrop-blur-sm animate-pulse-slow">
          <Sparkles size={16} />
          <span>New: AI Compression Powered by pdflynx</span>
        </div>
        <h1 className="text-6xl md:text-7xl font-extrabold tracking-tight text-foreground max-w-4xl mx-auto leading-[1.1]">
          The Ultimate <span className="text-primary italic">PDF Workspace</span> for Document Lovers.
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium leading-relaxed">
          Experience lightning-fast PDF processing. Merge, split, compress, and convert with our secure, open-source platform.
        </p>
        <div className="flex items-center justify-center gap-12 pt-8 text-muted-foreground/60 scale-90 sm:scale-100">
          <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
            <ShieldCheck size={18} />
            <span>Secure & Encrypted</span>
          </div>
          <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
            <Zap size={18} />
            <span>Lightning Fast</span>
          </div>
          <div className="flex items-center gap-2 font-bold uppercase tracking-widest text-[10px]">
            <Heart size={18} />
            <span>100% Free</span>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section className="space-y-12 pb-24 relative">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Core Toolkit</h2>
          <div className="h-[2px] flex-1 mx-8 bg-border/40 hidden sm:block" />
          <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">More coming soon</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.title} {...tool} />
          ))}
          {/* Ad Placeholder */}
          <div className="premium-card p-8 flex flex-col items-center justify-center border-dashed border-2 bg-muted/20 opacity-60">
            <div className="bg-muted p-4 rounded-xl text-muted-foreground mb-4">
              <Zap size={24} />
            </div>
            <p className="text-sm font-bold text-muted-foreground tracking-widest uppercase">Sponsored Content</p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="premium-card px-8 py-16 bg-gradient-to-br from-primary/10 to-indigo-500/10 shadow-2xl border-primary/20 relative overflow-hidden ring-4 ring-primary/5">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Layers size={300} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-center relative z-10">
          <div className="space-y-2">
            <p className="text-5xl font-black text-primary tracking-tighter">1.2M+</p>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Files Processed</p>
          </div>
          <div className="space-y-2">
            <p className="text-5xl font-black text-primary tracking-tighter">99.9%</p>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Success Rate</p>
          </div>
          <div className="space-y-2">
            <p className="text-5xl font-black text-primary tracking-tighter">5.0</p>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Average Rating</p>
          </div>
        </div>
      </section>
    </div>
  );
}
