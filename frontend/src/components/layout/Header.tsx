import Link from 'next/link';
import { FileText } from 'lucide-react';
import { Button } from '../ui/Button';

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-primary p-2 rounded-xl text-white transform group-hover:rotate-12 transition-transform shadow-md ring-4 ring-primary/20">
            <FileText size={20} />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            pdf<span className="text-primary">lynx</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/merge-pdf" className="text-sm font-medium hover:text-primary transition-colors">Merge</Link>
          <Link href="/split-pdf" className="text-sm font-medium hover:text-primary transition-colors">Split</Link>
          <Link href="/compress-pdf" className="text-sm font-medium hover:text-primary transition-colors">Compress</Link>
          <Link href="/pdf-to-image" className="text-sm font-medium hover:text-primary transition-colors">PDF to Image</Link>
          <Link href="/image-to-pdf" className="text-sm font-medium hover:text-primary transition-colors">Image to PDF</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Button size="sm" className="hidden sm:inline-flex">Get Started</Button>
        </div>
      </div>
    </header>
  );
};
