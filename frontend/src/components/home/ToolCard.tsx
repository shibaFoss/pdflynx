'use client';

import Link from 'next/link';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: string;
  index: number;
}

export function ToolCard({ title, description, icon: Icon, href, color, index }: ToolCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <Link href={href} className="group block h-full">
        <div className="premium-card p-6 flex flex-col h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
          {/* Subtle decoration */}
          <div className={`absolute top-0 right-0 w-20 h-20 ${color} opacity-[0.03] rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700`} />
          
          <div className="flex items-start justify-between mb-6">
            <div className={`p-3.5 rounded-xl ${color} text-white shadow-lg shadow-${color.split('-')[1]}-500/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
              <Icon size={24} />
            </div>
            <div className="p-1.5 rounded-full border border-border group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300">
               <ArrowRight size={16} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
            </div>
          </div>

          <div className="space-y-2 flex-grow">
            <h3 className="text-xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors">
              {title}
            </h3>
            <p className="text-sm text-muted-foreground font-medium leading-relaxed">
              {description}
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-border/50 flex items-center text-xs font-bold text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
             <span>Get Started</span>
             <ArrowRight size={16} className="ml-2" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
