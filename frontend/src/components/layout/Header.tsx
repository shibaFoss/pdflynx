'use client';

import Link from 'next/link';
import { FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

export const Header = () => {
  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl transition-all duration-300"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-2 rounded-xl text-white transform group-hover:rotate-12 transition-all shadow-xl shadow-primary/20 ring-4 ring-primary/5">
            <FileText size={20} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-black tracking-tight text-foreground group-hover:tracking-normal transition-all">
            pdf<span className="text-primary italic">lynx</span>
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1 bg-secondary/50 p-1 rounded-2xl border border-border/50">
          {[
            { name: 'Merge', href: '/merge-pdf' },
            { name: 'Split', href: '/split-pdf' },
            { name: 'Compress', href: '/compress-pdf' },
            { name: 'PDF to Image', href: '/pdf-to-image' },
            { name: 'Image to PDF', href: '/image-to-pdf' }
          ].map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className="px-5 py-2.5 text-sm font-bold text-muted-foreground hover:text-primary hover:bg-white dark:hover:bg-slate-900 rounded-xl transition-all duration-300"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Button variant="outline" className="hidden sm:inline-flex rounded-2xl px-6 border-2 font-bold hover:bg-secondary">
            Sign In
          </Button>
          <Button className="hidden sm:inline-flex rounded-2xl px-8 shadow-xl shadow-primary/20 font-bold active:scale-95 transition-transform">
            Try Premium
          </Button>
        </div>
      </div>
    </motion.header>
  );
};
