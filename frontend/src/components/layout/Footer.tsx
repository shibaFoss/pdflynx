import Link from 'next/link';
import { Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-white dark:bg-slate-950 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <h3 className="text-xl font-bold tracking-tight text-foreground">pdf<span className="text-primary">lynx</span></h3>
            <p className="text-sm text-muted-foreground w-full max-w-xs leading-relaxed">
              The ultimate open-source PDF processing platform. Simple, fast, and secure. Built with care for document lovers.
            </p>
            <div className="flex items-center gap-4 text-muted-foreground">
              <Mail size={18} className="hover:text-primary transition-colors cursor-pointer" />
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-6 text-foreground uppercase tracking-wider text-sm">Tools</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/merge-pdf" className="hover:text-primary transition-colors">Merge PDF</Link></li>
              <li><Link href="/split-pdf" className="hover:text-primary transition-colors">Split PDF</Link></li>
              <li><Link href="/compress-pdf" className="hover:text-primary transition-colors">Compress PDF</Link></li>
              <li><Link href="/pdf-to-image" className="hover:text-primary transition-colors">PDF to Image</Link></li>
              <li><Link href="/image-to-pdf" className="hover:text-primary transition-colors">Image to PDF</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-6 text-foreground uppercase tracking-wider text-sm">Company</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="font-semibold text-foreground uppercase tracking-wider text-sm">Newsletter</h4>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter email"
                className="bg-muted border border-border rounded-xl text-sm px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button className="bg-primary text-white px-4 py-2 rounded-xl font-medium text-sm hover:bg-primary/90 shadow-sm transition-all shadow-primary/20">
                Join
              </button>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Get the latest updates and tips on PDF processing.
            </p>
          </div>
        </div>
        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 pdflynx. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/" className="hover:text-primary transition-colors">Status</Link>
            <Link href="/" className="hover:text-primary transition-colors">Help Center</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
