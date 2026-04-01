'use client';

import { motion } from 'framer-motion';
import { Shield, EyeOff, Trash2, Lock, Clock, Database } from 'lucide-react';

const POLICIES = [
  {
    icon: Trash2,
    title: 'Instant deletion',
    desc: 'Your files are processed in real-time and deleted immediately from our servers the moment the task is complete. No backups or copies are ever made.'
  },
  {
    icon: Database,
    title: 'No file storage',
    desc: 'We do not offer cloud storage. PdfLynx acts strictly as a processing pipe—files flow in, get transformed, and flow out. Nothing rests on our disks.'
  },
  {
    icon: Lock,
    title: 'In-transit encryption',
    desc: 'All communications between your browser and our servers are secured via modern HTTPS (TLS/SSL) encryption protocols, preventing any man-in-the-middle interception.'
  },
  {
    icon: EyeOff,
    title: 'Zero human access',
    desc: 'No human being at Shri Laadli Infotech Pvt. Ltd. (or elsewhere) ever looks at your document contents. The entire operation is fully automated and headless.'
  },
  {
    icon: Clock,
    title: 'No logging of contents',
    desc: 'While we keep anonymous server logs to monitor traffic and errors, we never log the contents, filenames, or metadata of the actual PDF files you upload.'
  },
  {
    icon: Shield,
    title: 'No third parties',
    desc: 'We process the PDFs on our own backend engines. Your files are not sent to any external third-party APIs for processing.'
  }
];

export default function PrivacyPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[0%] left-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px] -z-10" />

      <div className="container mx-auto px-4 max-w-4xl py-16 space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">

        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-black border border-emerald-500/20 uppercase tracking-widest">
            <Shield size={13} className="fill-emerald-600" />
            Security Guaranteed
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground">
            Privacy Policy
          </h1>
          <p className="text-lg text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
            At PdfLynx, your privacy isn&apos;t an afterthought—it&apos;s the core foundation of our architecture. 
            Here is our promise to you regarding your documents and data.
          </p>
        </div>

        {/* Principles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {POLICIES.map((p, i) => (
            <motion.div 
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="premium-card p-8 space-y-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-[20px] bg-primary/10 flex items-center justify-center text-primary ring-4 ring-primary/5">
                <p.icon size={22} strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-black text-foreground">{p.title}</h3>
              <p className="text-sm text-muted-foreground font-medium leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Legal Text */}
        <div className="premium-card p-10 md:p-14 space-y-8 border-2">
          <div className="space-y-4">
             <h2 className="text-2xl font-black">1. Information Collection</h2>
             <p className="text-muted-foreground leading-relaxed font-medium">
               We do not require account creation, login, or any personal details to use our core PDF tools. 
               We automatically collect minimal, anonymized crash reports and technical analytics (such as operating system or browser type) solely to improve the service quality. We do not track you across other websites.
             </p>
          </div>

          <div className="space-y-4">
             <h2 className="text-2xl font-black">2. Cookie Policy</h2>
             <p className="text-muted-foreground leading-relaxed font-medium">
               PdfLynx uses essential cookies only. These are strictly necessary for the site to function (such as remembering your dark mode preference or managing your active session with the backend queue). We do not use third-party tracking or advertising cookies.
             </p>
          </div>

          <div className="space-y-4">
             <h2 className="text-2xl font-black">3. Law Enforcement</h2>
             <p className="text-muted-foreground leading-relaxed font-medium">
               Because your files are processed entirely in memory and immediately discarded, we physically do not possess any document data to hand over, even if compelled by a lawful subpoena. What we do not store, we cannot provide.
             </p>
          </div>

          <div className="pt-6 border-t border-border mt-8 space-y-2">
             <p className="text-sm font-bold text-foreground">Last Updated: April 2026</p>
             <p className="text-xs text-muted-foreground font-medium">
               This service is operated by Shri Laadli Infotech Pvt. Ltd. If you have any further questions regarding this privacy policy, please contact us at <a href="mailto:contact@pdflynx.com" className="text-primary hover:underline">contact@pdflynx.com</a>.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}
