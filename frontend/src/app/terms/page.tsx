'use client';

import { motion } from 'framer-motion';
import { Scale, FileText, CheckCircle2, AlertTriangle, Scale as ScaleIcon } from 'lucide-react';

const TERMS = [
  {
    icon: CheckCircle2,
    title: '1. Acceptance of Terms',
    content: "By accessing and using PdfLynx, operated by Shri Laadli Infotech Pvt. Ltd., you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service."
  },
  {
    icon: FileText,
    title: '2. Service Description',
    content: "PdfLynx provides a suite of online tools primarily designed for processing PDF documents (e.g., merging, splitting, compressing, converting). We provide this service entirely for free, without any requirement for user registration or subscriptions."
  },
  {
    icon: AlertTriangle,
    title: '3. User Conduct & Restrictions',
    content: "You agree to use the service only for lawful purposes. You are strictly prohibited from utilizing PdfLynx to process any illegal, copyright-infringing, malicious, or abusive materials. You also agree not to maliciously overload the service via automated scraping or unauthorized API access."
  },
  {
    icon: ScaleIcon,
    title: '4. Disclaimer of Warranties',
    content: "The service is provided on an 'AS IS' and 'AS AVAILABLE' basis. Shri Laadli Infotech Pvt. Ltd. expressly disclaims all warranties of any kind, whether express or implied. We do not guarantee that the service will be uninterrupted, absolutely secure, or entirely error-free."
  },
  {
    icon: AlertTriangle,
    title: '5. Limitation of Liability',
    content: "Under no circumstances shall Shri Laadli Infotech Pvt. Ltd. or its founders be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use the service, including the potential loss or corruption of your document files."
  },
  {
    icon: FileText,
    title: '6. Modifications to Service',
    content: "We reserve the right to modify, suspend, or discontinue the service (or any part thereof) with or without notice at any time. We shall not be liable to you or to any third party for any modification, suspension, or discontinuance of the service."
  }
];

export default function TermsPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[0%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] -z-10" />

      <div className="container mx-auto px-4 max-w-4xl py-16 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">

        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-500/10 text-slate-600 text-xs font-black border border-slate-500/20 uppercase tracking-widest dark:text-slate-400">
            <Scale size={13} className="fill-slate-600 dark:fill-slate-400" />
            Legal Agreement
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
            Terms of Service
          </h1>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
            Please read these terms and conditions carefully before using PdfLynx.
          </p>
        </div>

        {/* Terms Content */}
        <div className="premium-card p-8 md:p-14 space-y-12 border-2">
          {TERMS.map((term, i) => (
            <motion.div 
              key={term.title}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center text-primary border border-border">
                    <term.icon size={20} />
                 </div>
                 <h2 className="text-2xl font-black text-foreground tracking-tight">{term.title}</h2>
              </div>
              <p className="text-muted-foreground leading-relaxed font-medium pl-14">
                {term.content}
              </p>
            </motion.div>
          ))}

          <div className="pt-8 border-t border-border mt-12 space-y-2">
             <p className="text-sm font-bold text-foreground">Last Updated: April 2026</p>
             <p className="text-xs text-muted-foreground font-medium">
               These terms are governed by the laws of our operating jurisdiction. Operated by Shri Laadli Infotech Pvt. Ltd. If you have any further questions, please contact us at <a href="mailto:contact@pdflynx.com" className="text-primary hover:underline font-bold">contact@pdflynx.com</a>.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
