'use client';

import Link from 'next/link';
import { LucideIcon, ArrowRight, ChevronRight } from 'lucide-react';
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
      className="h-full"
    >
      <Link href={href} className="group block h-full">
        <div className="premium-card p-4 sm:p-6 flex flex-row sm:flex-col items-center sm:items-stretch h-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-500 relative overflow-hidden gap-4 sm:gap-0">
          {/* Subtle decoration */}
          <div className={`absolute top-0 right-0 w-20 h-20 ${color} opacity-[0.03] rounded-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-700 pointer-events-none`} />
          
          <div className="flex flex-col sm:flex-row items-start sm:justify-between sm:mb-6 flex-shrink-0">
            <div className={`p-3 sm:p-3.5 rounded-[14px] sm:rounded-xl ${color} text-white shadow-lg group-hover:scale-110 sm:group-hover:rotate-6 transition-all duration-500`}>
              <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            
            <div className="hidden sm:block p-1.5 rounded-full border border-border group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300">
               <ArrowRight size={16} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
            </div>
          </div>

          <div className="space-y-0.5 sm:space-y-2 flex-grow min-w-0">
            <h3 className="text-[15px] sm:text-xl font-black tracking-tight text-foreground group-hover:text-primary transition-colors truncate sm:whitespace-normal">
              {title}
            </h3>
            <p className="text-[11px] sm:text-sm text-muted-foreground font-medium sm:leading-relaxed truncate sm:whitespace-normal">
              {description}
            </p>
          </div>

          <div className="sm:hidden flex-shrink-0 text-muted-foreground/30 ml-2">
            <ChevronRight size={20} className="group-active:text-primary group-active:translate-x-1 transition-all" />
          </div>

          <div className="hidden sm:flex mt-6 pt-4 border-t border-border/50 items-center text-xs font-bold text-primary opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
             <span>Get Started</span>
             <ArrowRight size={16} className="ml-2" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
