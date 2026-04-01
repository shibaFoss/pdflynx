'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  FileText, Menu, X, ChevronRight, Heart, LayoutGrid,
  Layers, Scissors, Zap, FileImage, Image as ImageIcon,
  Globe, Shield, LockOpen, RefreshCw, ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ALL_TOOLS = [
  { name: 'Merge PDF',     href: '/merge-pdf',     icon: Layers,    color: 'text-indigo-500',  bg: 'bg-indigo-500/10',  desc: 'Combine multiple PDFs into one' },
  { name: 'Split PDF',     href: '/split-pdf',     icon: Scissors,  color: 'text-emerald-500', bg: 'bg-emerald-500/10', desc: 'Extract pages or split a PDF' },
  { name: 'Compress PDF',  href: '/compress-pdf',  icon: Zap,       color: 'text-amber-500',   bg: 'bg-amber-500/10',   desc: 'Reduce file size, keep quality' },
  { name: 'PDF to Image',  href: '/pdf-to-image',  icon: FileImage, color: 'text-rose-500',    bg: 'bg-rose-500/10',    desc: 'Convert PDF pages to images' },
  { name: 'Image to PDF',  href: '/image-to-pdf',  icon: ImageIcon, color: 'text-blue-500',    bg: 'bg-blue-500/10',    desc: 'Turn images into a PDF' },
  { name: 'HTML to PDF',   href: '/html-to-pdf',   icon: Globe,     color: 'text-emerald-600', bg: 'bg-emerald-600/10', desc: 'Convert web pages to PDF' },
  { name: 'Protect PDF',   href: '/protect-pdf',   icon: Shield,    color: 'text-amber-600',   bg: 'bg-amber-600/10',   desc: 'Encrypt with a password' },
  { name: 'Unlock PDF',    href: '/unlock-pdf',    icon: LockOpen,  color: 'text-orange-500',  bg: 'bg-orange-500/10',  desc: 'Remove PDF password' },
  { name: 'Rotate PDF',    href: '/rotate-pdf',    icon: RefreshCw, color: 'text-violet-500',  bg: 'bg-violet-500/10',  desc: 'Rotate pages in a PDF' },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsToolsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setIsMenuOpen(false);
    setIsToolsOpen(false);
  }, [pathname]);

  const isActiveTool = ALL_TOOLS.some(t => t.href === pathname);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-border/50 bg-background shadow-md shadow-black/5 transition-all duration-300"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
          <div className="bg-primary p-2 rounded-xl text-white transform group-hover:rotate-12 transition-all shadow-xl shadow-primary/20 ring-4 ring-primary/5">
            <FileText size={20} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-black tracking-tight text-foreground group-hover:tracking-normal transition-all">
            pdf<span className="text-primary italic">lynx</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 bg-secondary/50 p-1 rounded-2xl border border-border/50">
          {/* All Tools link */}
          <Link
            href="/"
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-xl transition-all duration-200 ${
              pathname === '/' ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground hover:text-primary hover:bg-white'
            }`}
          >
            <LayoutGrid size={15} />
            All Tools
          </Link>

          {/* Tools Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsToolsOpen(!isToolsOpen)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-xl transition-all duration-200 ${
                isActiveTool && pathname !== '/' ? 'bg-white text-primary shadow-sm' : 'text-muted-foreground hover:text-primary hover:bg-white'
              }`}
            >
              Quick Access
              <ChevronDown size={14} className={`transition-transform duration-200 ${isToolsOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isToolsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.97 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full mt-2 right-0 w-[480px] bg-background border border-border/60 rounded-3xl shadow-2xl shadow-black/10 p-3 grid grid-cols-2 gap-1.5"
                >
                  {ALL_TOOLS.map((tool) => (
                    <Link
                      key={tool.href}
                      href={tool.href}
                      onClick={() => setIsToolsOpen(false)}
                      className={`flex items-center gap-3 p-3 rounded-2xl transition-all duration-200 group ${
                        pathname === tool.href ? 'bg-primary/5 border border-primary/20' : 'hover:bg-secondary/60 border border-transparent'
                      }`}
                    >
                      <div className={`p-2 rounded-xl ${tool.bg} ${tool.color} flex-shrink-0`}>
                        <tool.icon size={16} strokeWidth={2.5} />
                      </div>
                      <div className="min-w-0">
                        <p className={`text-sm font-bold truncate ${pathname === tool.href ? 'text-primary' : 'text-foreground group-hover:text-primary'} transition-colors`}>{tool.name}</p>
                        <p className="text-[11px] text-muted-foreground font-medium truncate">{tool.desc}</p>
                      </div>
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="lg:hidden p-2.5 rounded-xl bg-secondary text-foreground hover:bg-slate-200 dark:hover:bg-slate-800 transition-all active:scale-95"
          aria-label="Toggle Menu"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
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
              {/* Drawer Header */}
              <div className="flex items-center justify-between p-5 border-b border-border/50">
                <div className="text-xl font-black text-foreground">pdf<span className="text-primary italic">lynx</span></div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-full bg-secondary text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all active:scale-90"
                >
                  <X size={22} />
                </button>
              </div>

              {/* All Tools Link */}
              <div className="px-4 pt-5 pb-2">
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center justify-between p-4 rounded-2xl font-bold text-base transition-all group ${
                    pathname === '/'
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'bg-secondary/30 text-muted-foreground hover:text-primary border border-transparent hover:border-primary/20 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LayoutGrid size={20} className={pathname === '/' ? 'text-primary' : 'text-primary'} />
                    <span>All Tools</span>
                  </div>
                  <ChevronRight size={18} className="text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </Link>
              </div>

              {/* Divider */}
              <div className="px-4 py-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 px-1">PDF Tools</p>
              </div>

              {/* Tool Links */}
              <div className="px-4 flex-1 space-y-2 overflow-y-auto pb-4">
                {ALL_TOOLS.map((tool) => (
                  <Link
                    key={tool.name}
                    href={tool.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center justify-between p-4 rounded-2xl font-bold text-base transition-all group ${
                      pathname === tool.href
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'bg-secondary/30 text-muted-foreground hover:text-primary border border-transparent hover:border-primary/20 hover:bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-xl ${tool.bg} ${tool.color}`}>
                        <tool.icon size={18} strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="font-black text-sm leading-tight">{tool.name}</p>
                        <p className="text-[11px] text-muted-foreground font-medium">{tool.desc}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                  </Link>
                ))}
              </div>

              {/* Drawer Footer */}
              <div className="p-6 border-t border-border/50 bg-secondary/10 flex flex-col items-center gap-3">
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">
                  <Heart size={11} className="fill-primary" />
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
