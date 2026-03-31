'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, Menu, X, ChevronRight, Heart, LayoutGrid, Layers, Scissors, Zap, FileImage, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const NAV_ITEMS = [
    { name: 'All Tools', href: '/', icon: LayoutGrid },
    { name: 'Merge', href: '/merge-pdf', icon: Layers },
    { name: 'Split', href: '/split-pdf', icon: Scissors },
    { name: 'Compress', href: '/compress-pdf', icon: Zap },
    { name: 'PDF to Image', href: '/pdf-to-image', icon: FileImage },
    { name: 'Image to PDF', href: '/image-to-pdf', icon: ImageIcon }
  ];

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-background shadow-md shadow-black/5 transition-all duration-300"
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

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 bg-secondary/50 p-1 rounded-2xl border border-border/50">
          {NAV_ITEMS.map((item) => (
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
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2.5 rounded-xl bg-secondary text-foreground hover:bg-slate-200 dark:hover:bg-slate-800 transition-all active:scale-95"
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-background z-[70] lg:hidden shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-border/50">
                 <div className="text-xl font-black text-foreground">pdf<span className="text-primary italic">lynx</span></div>
                 <button 
                   onClick={() => setIsMenuOpen(false)}
                   className="p-2 rounded-full bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all active:scale-90"
                 >
                    <X size={24} />
                 </button>
              </div>

              <div className="px-4 py-8 flex-1 space-y-3 overflow-y-auto">
                {NAV_ITEMS.map((item) => (
                  <Link 
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-between p-5 rounded-3xl bg-secondary/30 border border-transparent hover:border-primary/20 hover:bg-white dark:hover:bg-slate-900 font-bold text-lg text-muted-foreground hover:text-primary transition-all group shadow-sm active:scale-[0.98]"
                  >
                    <div className="flex items-center gap-4">
                       <item.icon size={22} className="text-primary" />
                       <span className="tracking-tight">{item.name}</span>
                    </div>
                    <ChevronRight size={20} className="text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>

              <div className="p-8 border-t border-border/50 bg-secondary/10 flex flex-col items-center gap-4">
                 <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                    <Heart size={12} className="fill-primary" />
                    <span>Loved by Users</span>
                 </div>
                 <p className="text-[11px] text-muted-foreground/60 font-medium">© 2026 pdflynx suite</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
