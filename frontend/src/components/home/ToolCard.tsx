'use client';

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
}

export const ToolCard = ({ title, description, icon: Icon, href, color }: ToolCardProps) => {
  return (
    <Link href={href} className="block group">
      <motion.div 
        whileHover={{ y: -5, scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="premium-card p-8 h-full flex flex-col items-center text-center cursor-pointer group-hover:border-primary/30 group-hover:shadow-lg group-hover:shadow-primary/5"
      >
        <div className={`p-5 rounded-2xl ${color} bg-opacity-10 text-opacity-100 mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm shadow-black/5`}>
          <Icon size={32} />
        </div>
        <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed font-medium">
          {description}
        </p>
      </motion.div>
    </Link>
  );
};
