'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Heart, Zap, ShieldCheck, Users, Target, Globe,
  Layers, Smartphone, ExternalLink, ArrowRight,
  Star, Code2, Cpu
} from 'lucide-react';

const FOUNDERS = [
  {
    name: 'Shiba Prasad',
    role: 'Founder & CEO',
    image: '/team/shiba.webp',
    color: 'from-primary to-indigo-600',
    bio: 'Visionary developer who started PdfLynx from a personal frustration with clunky, privacy-invasive PDF tools. Passionate about building elegant software that simply works.',
  },
  {
    name: 'Chandan Mishra',
    role: 'Co-Founder & CTO',
    image: '/team/chandan.webp',
    color: 'from-violet-500 to-purple-700',
    bio: 'Backend architect and performance enthusiast responsible for PdfLynx\'s blazing-fast processing engine. Believes great software should be both powerful and invisible.',
  },
];

const STATS = [
  { value: '9+',    label: 'PDF Tools',         icon: Layers },
  { value: '2025',  label: 'Founded',            icon: Star },
  { value: '100%',  label: 'Free to Use',        icon: Heart },
  { value: '0',     label: 'Files We Store',     icon: ShieldCheck },
];

const VALUES = [
  {
    icon: ShieldCheck,
    title: 'Privacy First',
    desc: 'Files are processed in memory and deleted the moment you\'re done. We never store, sell, or see your documents.',
    color: 'text-indigo-500',
    bg: 'bg-indigo-500/10',
  },
  {
    icon: Zap,
    title: 'Blazing Performance',
    desc: 'Powered by an async job queue and industry-grade Linux tools, your PDFs are handled instantly even under heavy load.',
    color: 'text-amber-500',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Target,
    title: 'No Nonsense',
    desc: 'No accounts. No subscriptions. No hidden limits. Just open the tool, upload your file, and download in seconds.',
    color: 'text-rose-500',
    bg: 'bg-rose-500/10',
  },
  {
    icon: Globe,
    title: 'Built for Everyone',
    desc: 'From students to enterprises, PdfLynx is designed to be intuitive for anyone with a document problem to solve.',
    color: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true as const },
  transition: { duration: 0.7, ease: 'easeOut' as const },
};

export default function AboutPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/8 rounded-full blur-[140px] -z-10" />
      <div className="absolute bottom-[20%] left-[-10%] w-[500px] h-[500px] bg-accent/8 rounded-full blur-[140px] -z-10" />

      <div className="container mx-auto px-4 max-w-5xl">

        {/* ─── Hero ─────────────────────────────────── */}
        <motion.section {...fadeUp} className="text-center pt-16 pb-12 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black border border-primary/20 uppercase tracking-widest">
            <Heart size={13} className="fill-primary" />
            Our Story
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] text-foreground">
            We believe<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">PDFs shouldn&apos;t be hard.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
            The PdfLynx team is here to make managing documents effortless. From our own experience, 
            we know that dealing with PDF files can eat up hours of your day. Your time deserves better.
          </p>
        </motion.section>

        {/* ─── Stats ────────────────────────────────── */}
        <motion.section {...fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-16">
          {STATS.map((s) => (
            <div key={s.label} className="premium-card p-6 text-center space-y-3 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="mx-auto w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <s.icon size={20} strokeWidth={2.5} />
              </div>
              <p className="text-3xl font-black text-foreground">{s.value}</p>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </motion.section>

        {/* ─── Origin Story ─────────────────────────── */}
        <motion.section {...fadeUp} className="premium-card p-10 md:p-16 rounded-[40px] mb-16 border-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full blur-[80px] -mr-16 -mt-16" />
          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 text-primary font-black text-sm uppercase tracking-widest">
              <Code2 size={16} />
              How It Started
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground leading-tight">
              Born from frustration,<br />built with purpose.
            </h2>
            <div className="space-y-4 text-muted-foreground font-medium leading-relaxed text-base">
              <p>
                <strong className="text-foreground">Shri Laadli Infotech Pvt. Ltd.</strong> was founded in <strong className="text-foreground">2025</strong> with one mission: to ship software that solves real problems without demanding your money or your patience. PdfLynx is our flagship product, born out of a firsthand frustration with bloated, ad-riddled PDF websites.
              </p>
              <p>
                We had simple tasks — merging a report here, compressing a presentation there — yet every available tool demanded sign-ups, subscriptions, or bombarded us with intrusive ads. So we built what we actually wanted: a fast, private, and beautiful PDF suite that treats users with respect.
              </p>
              <p>
                What started as an internal tool became a product we are genuinely proud to share with the world. PdfLynx is completely free and will always remain so, because we believe access to great productivity tools should not be a privilege.
              </p>
            </div>
          </div>
        </motion.section>

        {/* ─── Core Values ──────────────────────────── */}
        <motion.section {...fadeUp} className="mb-16 space-y-8">
          <div className="text-center space-y-3">
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">What We Stand For</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">Our Core Principles</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {VALUES.map((v) => (
              <div key={v.title} className="premium-card p-8 space-y-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className={`w-12 h-12 rounded-2xl ${v.bg} ${v.color} flex items-center justify-center ring-4 ring-current/10`}>
                  <v.icon size={22} strokeWidth={2.5} />
                </div>
                <h3 className={`text-xl font-black ${v.color} group-hover:translate-x-1 transition-transform`}>{v.title}</h3>
                <p className="text-muted-foreground font-medium leading-relaxed text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ─── Founders ─────────────────────────────── */}
        <motion.section {...fadeUp} className="mb-16 space-y-8">
          <div className="text-center space-y-3">
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">The People Behind It</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">Meet The Team</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FOUNDERS.map((f) => (
              <div key={f.name} className="premium-card p-8 space-y-5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className={`relative w-24 h-24 rounded-[24px] overflow-hidden bg-gradient-to-br ${f.color} shadow-lg ring-4 ring-primary/10`}>
                  <Image src={f.image} alt={f.name} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-xl font-black text-foreground">{f.name}</p>
                  <p className="text-sm font-bold text-primary uppercase tracking-widest">{f.role}</p>
                </div>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">{f.bio}</p>
                <div className="inline-flex items-center gap-1.5 text-xs font-black text-muted-foreground/50 uppercase tracking-widest">
                  <Users size={12} />
                  Shri Laadli Infotech Pvt. Ltd.
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ─── Other Products ───────────────────────── */}
        <motion.section {...fadeUp} className="mb-16 space-y-6">
          <div className="text-center space-y-3">
            <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">What Else We Build</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">Our Other Products</h2>
          </div>
          <a
            href="https://ytder.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group premium-card p-8 flex items-center gap-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-2 hover:border-rose-500/30"
          >
            <div className="p-4 rounded-[20px] bg-rose-500/10 text-rose-500 ring-4 ring-rose-500/5 flex-shrink-0">
              <Smartphone size={32} strokeWidth={2.5} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-xl font-black text-foreground">AIO-YTDER</p>
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-600 border border-rose-500/20">Android App</span>
              </div>
              <p className="text-sm text-muted-foreground font-medium">A powerful all-in-one video downloader for Android. Download videos from any platform, manage your library, and enjoy media offline — all in one app.</p>
              <p className="text-xs text-rose-500 font-bold mt-2 flex items-center gap-1">
                ytder.com <ExternalLink size={11} />
              </p>
            </div>
            <ArrowRight size={20} className="text-muted-foreground/30 group-hover:text-rose-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
          </a>
        </motion.section>

        {/* ─── Tech Stack Note ──────────────────────── */}
        <motion.section {...fadeUp} className="mb-16">
          <div className="premium-card p-8 md:p-12 rounded-[40px] border-2 border-primary/20 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/8 rounded-full blur-[100px] -mr-32 -mt-32" />
            <div className="relative z-10 space-y-4">
              <div className="mx-auto w-14 h-14 rounded-[20px] bg-primary/10 flex items-center justify-center text-primary">
                <Cpu size={28} strokeWidth={2.5} />
              </div>
              <h2 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
                Engineered for reliability
              </h2>
              <p className="text-muted-foreground font-medium max-w-xl mx-auto leading-relaxed">
                PdfLynx runs on a battle-tested stack: a <strong className="text-foreground">Fastify</strong> backend with an asynchronous job queue, powered by industry-standard Linux tools like <strong className="text-foreground">Ghostscript</strong>, <strong className="text-foreground">qpdf</strong>, and <strong className="text-foreground">ImageMagick</strong>. The frontend is built with <strong className="text-foreground">Next.js 16</strong> and deployed behind a hardened Nginx reverse proxy. Every architectural choice was made to ensure your experience is fast, private, and rock-solid.
              </p>
            </div>
          </div>
        </motion.section>

        {/* ─── CTA ──────────────────────────────────── */}
        <motion.section {...fadeUp} className="text-center pb-20 space-y-6">
          <h2 className="text-3xl font-black tracking-tight text-foreground">
            Ready to get started?
          </h2>
          <p className="text-muted-foreground font-medium max-w-md mx-auto">
            No sign-ups. No limits. Just powerful PDF tools, completely free.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-10 h-14 rounded-full bg-primary text-white font-black text-base shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
          >
            Explore All Tools
            <ArrowRight size={18} strokeWidth={3} />
          </Link>
        </motion.section>

      </div>
    </div>
  );
}
