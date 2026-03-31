'use client';

import Link from 'next/link';
import { Mail, Globe, ShieldCheck, Heart, Code } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="relative border-t border-border/20 bg-background mt-0 overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -z-10 -mr-48 -mb-48" />

      <div className="container mx-auto px-4 pt-12 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-16 lg:gap-10">
          <div className="lg:col-span-2 space-y-8">
            <Link href="/" className="inline-block group">
              <h3 className="text-3xl font-black tracking-tight text-foreground">pdf<span className="text-primary italic">lynx</span></h3>
            </Link>
            <p className="text-base text-muted-foreground w-full max-w-sm leading-relaxed font-medium">
              We&apos;re building the future of document processing. Simple, fast, and secure tools designed for everyone.
            </p>
            <div className="flex items-center gap-6 text-muted-foreground">
              <a href="mailto:contact@pdflynx.com">
                <Mail size={22} className="hover:text-primary transition-all cursor-pointer hover:scale-110" />
              </a>
              <Globe size={22} className="hover:text-primary transition-all cursor-pointer hover:scale-110" />
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-8 text-foreground uppercase tracking-[0.2em] text-[10px]">Tools</h4>
            <ul className="space-y-4 text-sm font-bold text-muted-foreground">
              <li><Link href="/merge-pdf" className="hover:text-primary hover:pl-2 transition-all duration-300">Merge PDF</Link></li>
              <li><Link href="/split-pdf" className="hover:text-primary hover:pl-2 transition-all duration-300">Split PDF</Link></li>
              <li><Link href="/compress-pdf" className="hover:text-primary hover:pl-2 transition-all duration-300">Compress PDF</Link></li>
              <li><Link href="/pdf-to-image" className="hover:text-primary hover:pl-2 transition-all duration-300">PDF to Image</Link></li>
              <li><Link href="/image-to-pdf" className="hover:text-primary hover:pl-2 transition-all duration-300">Image to PDF</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-8 text-foreground uppercase tracking-[0.2em] text-[10px]">Company</h4>
            <ul className="space-y-4 text-sm font-bold text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary hover:pl-2 transition-all duration-300">About Us</Link></li>
              <li><Link href="/privacy" className="hover:text-primary hover:pl-2 transition-all duration-300">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary hover:pl-2 transition-all duration-300">Terms of Service</Link></li>
              <li><Link href="/contact" className="hover:text-primary hover:pl-2 transition-all duration-300">Contact</Link></li>
            </ul>
          </div>

          <div className="space-y-8">
            <h4 className="font-bold text-foreground uppercase tracking-[0.2em] text-[10px]">Newsletter</h4>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Enter email"
                className="bg-secondary/50 border-2 border-transparent rounded-2xl text-sm px-6 py-4 w-full focus:outline-none focus:border-primary/20 focus:bg-white dark:focus:bg-slate-900 transition-all font-medium"
              />
              <button className="absolute right-2 top-2 bg-primary text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-primary/90 shadow-xl shadow-primary/20 transition-all active:scale-95">
                Join
              </button>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-secondary/30 border border-border/50">
               <ShieldCheck size={18} className="text-primary shrink-0" />
               <p className="text-[11px] text-muted-foreground font-medium leading-[1.4]">
                  Your privacy is our priority. We never share your data.
               </p>
            </div>
          </div>
        </div>

        <div className="border-t border-border/50 mt-20 pt-12 flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="flex items-center gap-6 text-[13px] font-bold text-muted-foreground/60">
             <p>© 2026 pdflynx.</p>
             <div className="w-1 h-1 rounded-full bg-border" />
             <p className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer group">
                Made with <Heart className="text-rose-500 fill-rose-500 group-hover:scale-125 transition-transform" size={14} /> and loved by users across the world.
             </p>
          </div>
          <div className="flex gap-10 text-[13px] font-bold text-muted-foreground">
             <Link href="/" className="hover:text-primary transition-colors">Server Status</Link>
             <Link href="/" className="hover:text-primary transition-colors">Documentation</Link>
             <Link href="/" className="hover:text-primary transition-colors flex items-center gap-2">
                <Code size={16} /> Source Code
             </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
