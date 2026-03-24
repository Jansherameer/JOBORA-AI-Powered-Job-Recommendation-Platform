import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles, Zap, Globe, Briefcase, ArrowRight, Clock, Target,
  BarChart3, Star, MousePointer2, Shield, X, CheckCircle2,
  Upload, Search, Send, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  };

  const companies = [
    { name: 'MICROSOFT', variant: 'primary' },
    { name: 'GOOGLE', variant: 'emerald' },
    { name: 'APPLE', variant: 'dark' },
    { name: 'AMAZON', variant: 'orange' },
    { name: 'META', variant: 'primary' },
    { name: 'NETFLIX', variant: 'red' },
    { name: 'SPOTIFY', variant: 'emerald' },
    { name: 'TESLA', variant: 'red' },
    { name: 'STRIPE', variant: 'purple' },
    { name: 'AIRBNB', variant: 'pink' },
    { name: 'UBER', variant: 'dark' },
    { name: 'SALESFORCE', variant: 'cyan' },
    { name: 'ADOBE', variant: 'red' },
    { name: 'SHOPIFY', variant: 'emerald' },
    { name: 'SLACK', variant: 'purple' },
    { name: 'ZOOM', variant: 'primary' },
    { name: 'FIGMA', variant: 'pink' },
    { name: 'NOTION', variant: 'dark' },
    { name: 'DATADOG', variant: 'purple' },
    { name: 'SNOWFLAKE', variant: 'cyan' },
  ];

  const steps = [
    {
      icon: <Upload size={22} />,
      tag: 'STEP 1',
      tagVariant: 'primary',
      title: 'Upload Your Resume',
      description: 'Drop your PDF or DOCX and our AI instantly extracts your skills, experience level, and career trajectory.',
    },
    {
      icon: <Search size={22} />,
      tag: 'STEP 2',
      tagVariant: 'purple',
      title: 'AI Matches You',
      description: 'Our engine scans thousands of live openings and ranks them by semantic match to your unique profile.',
    },
    {
      icon: <Send size={22} />,
      tag: 'STEP 3',
      tagVariant: 'emerald',
      title: 'Apply With Confidence',
      description: 'Review your top matches, see which skills align, and apply directly — all from one dashboard.',
    },
  ];

  const features = [
    {
      icon: <Clock className="text-primary" size={24} />,
      tag: 'PRODUCTIVITY',
      tagVariant: 'primary',
      title: 'Eliminate the Time Sink',
      description: 'Traditional searching takes 20+ hours a week. Jobora reduces that to 5 minutes of review.',
    },
    {
      icon: <Sparkles className="text-purple-500" size={24} />,
      tag: 'INTELLIGENCE',
      tagVariant: 'purple',
      title: 'Deep Expertise Analysis',
      description: "Our AI doesn't just look at keywords. It understands your career trajectory and technical depth.",
    },
    {
      icon: <Shield className="text-emerald-500" size={24} />,
      tag: 'QUALITY',
      tagVariant: 'emerald',
      title: 'Quality First',
      description: 'We filter out ghost jobs and low-quality listings before they even reach your dashboard.',
    },
  ];

  const stats = [
    { label: 'Sync Speed', value: 'Real-time', icon: <Zap size={16} />, tagVariant: 'orange' },
    { label: 'Hours Saved/User', value: '140 hrs', icon: <Clock size={16} />, tagVariant: 'primary' },
    { label: 'Match Precision', value: '99.2%', icon: <CheckCircle2 size={16} />, tagVariant: 'emerald' },
    { label: 'Daily Global Jobs', value: '50k+', icon: <Briefcase size={16} />, tagVariant: 'purple' },
  ];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-background">
      {/* Ambient Background Blobs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/15 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" />
      <div className="absolute top-40 -right-4 w-96 h-96 bg-purple-500/15 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }} />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* ===== HERO SECTION ===== */}
          <section className="pt-20 sm:pt-36 pb-16 text-center">
            <motion.div variants={itemVariants} className="mb-8">
              <span className="label-tag label-tag-primary" style={{ fontSize: '11px', letterSpacing: '0.15em', fontWeight: 700 }}>
                <Zap size={12} className="inline mr-1.5 -mt-0.5" />
                SAVE HUNDREDS OF HOURS
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight text-foreground mb-8 leading-[0.95]"
            >
              Searching sucks. <br />
              <span className="gradient-text">Jobora finds.</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed font-normal"
            >
              Stop wasting weeks on job boards. Our AI analyzes global feeds in milliseconds
              to match you with opportunities that actually matter.
            </motion.p>

            {/* CTAs */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <Button size="lg" className="h-14 px-10 text-base font-bold rounded-xl shadow-2xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all" asChild>
                <Link to="/signup" className="flex items-center gap-3">
                  Get Started for Free <MousePointer2 size={18} />
                </Link>
              </Button>
              <Button size="lg" variant="ghost" className="h-14 px-10 text-base font-bold rounded-xl hover:bg-muted transition-all" asChild>
                <Link to="/dashboard" className="flex items-center gap-2">
                  Browse Active Jobs <ChevronRight size={18} />
                </Link>
              </Button>
            </motion.div>
          </section>

          {/* ===== COMPANY TICKER ===== */}
          <motion.section variants={itemVariants} className="py-12 mb-16">
            <p className="text-center text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground mb-6">
              Jobs from companies you'll love
            </p>
            <div className="relative overflow-hidden">
              {/* Fade edges */}
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
              <div className="flex animate-marquee" style={{ width: 'max-content' }}>
                {[...companies, ...companies].map((c, i) => (
                  <span key={i} className={`label-tag label-tag-${c.variant} mx-1.5 whitespace-nowrap`}>
                    {c.name}
                  </span>
                ))}
              </div>
            </div>
          </motion.section>

          {/* ===== HOW IT WORKS ===== */}
          <motion.section variants={itemVariants} className="py-20 max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <span className="label-tag label-tag-purple mb-4" style={{ fontSize: '11px', letterSpacing: '0.12em', fontWeight: 700 }}>
                HOW IT WORKS
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-4">
                Three steps to your dream job
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  viewport={{ once: true }}
                  className="relative text-center group"
                >
                  {/* Connector line (except last) */}
                  {idx < steps.length - 1 && (
                    <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px bg-border" />
                  )}

                  <div className="w-16 h-16 mx-auto rounded-2xl bg-muted/80 border border-border flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-white group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
                    {step.icon}
                  </div>

                  <span className={`label-tag label-tag-${step.tagVariant}`}>
                    {step.tag}
                  </span>

                  <h3 className="text-lg font-bold text-foreground mt-3 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ===== COMPARISON SECTION ===== */}
          <motion.section
            variants={itemVariants}
            className="py-20 max-w-5xl mx-auto"
          >
            <div className="text-center mb-14">
              <span className="label-tag label-tag-red mb-4" style={{ fontSize: '11px', letterSpacing: '0.12em', fontWeight: 700 }}>
                WHY JOBORA
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-4">
                Stop wasting your most valuable asset.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Before */}
              <div className="bg-muted/40 p-8 rounded-2xl border border-dashed border-muted-foreground/15">
                <span className="label-tag label-tag-dark" style={{ fontSize: '11px', letterSpacing: '0.1em', fontWeight: 700 }}>
                  TRADITIONAL SEARCH
                </span>
                <ul className="space-y-4 text-left mt-6">
                  {[
                    'Spending 4 hours/day on LinkedIn',
                    'Filter through hundreds of irrelevant roles',
                    'Manual tracking in complex spreadsheets',
                    'Low response rate from cold applies',
                    'Massive mental fatigue',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground line-through opacity-60">
                      <X className="text-destructive mt-0.5 shrink-0" size={15} />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t border-muted-foreground/10 flex items-center justify-between">
                  <span className="label-tag label-tag-dark" style={{ fontSize: '10px' }}>ESTIMATED TIME</span>
                  <span className="text-lg font-bold text-destructive">25+ hrs / week</span>
                </div>
              </div>

              {/* After */}
              <div className="glass p-8 rounded-2xl border border-primary/15 bg-primary/[0.03] shadow-xl shadow-primary/5 relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
                <span className="label-tag label-tag-primary" style={{ fontSize: '11px', letterSpacing: '0.1em', fontWeight: 700 }}>
                  WITH JOBORA
                </span>
                <ul className="space-y-4 text-left mt-6">
                  {[
                    'AI works 24/7 while you sleep',
                    'Instant push of verified matches',
                    'Seamless dashboard organization',
                    'High-signal roles with direct apply',
                    'Focus on Interviewing, not Hunting',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-foreground">
                      <CheckCircle2 className="text-primary mt-0.5 shrink-0" size={15} />
                      <span className="text-sm font-semibold">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 pt-6 border-t border-primary/10 flex items-center justify-between">
                  <span className="label-tag label-tag-emerald" style={{ fontSize: '10px' }}>ESTIMATED TIME</span>
                  <span className="text-lg font-extrabold text-primary">5 mins / day</span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* ===== FEATURE GRID ===== */}
          <motion.section variants={itemVariants} className="py-20">
            <div className="text-center mb-14">
              <span className="label-tag label-tag-emerald mb-4" style={{ fontSize: '11px', letterSpacing: '0.12em', fontWeight: 700 }}>
                FEATURES
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-4">
                Built for the modern job seeker
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -8 }}
                  className="glass p-8 rounded-2xl border border-muted/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group relative"
                >
                  <div className="w-14 h-14 rounded-xl bg-muted/80 border flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white group-hover:border-primary/50 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <span className={`label-tag label-tag-${feature.tagVariant}`}>
                    {feature.tag}
                  </span>
                  <h3 className="text-xl font-bold mb-3 text-foreground mt-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* ===== STATS SECTION ===== */}
          <motion.section
            variants={itemVariants}
            className="py-20 border-t border-muted/50"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-8">
              {stats.map((stat, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <span className={`label-tag label-tag-${stat.tagVariant} mb-3`} style={{ fontSize: '10px', letterSpacing: '0.15em' }}>
                    {stat.icon}
                    <span className="ml-1">JOBORA INDEX</span>
                  </span>
                  <p className="text-4xl sm:text-5xl font-extrabold text-foreground mb-2">{stat.value}</p>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* ===== FINAL CTA ===== */}
          <motion.section variants={itemVariants} className="py-20 text-center">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-6">
                Ready to find your next role?
              </h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Join thousands of professionals who stopped wasting time and started getting matched.
              </p>
              <Button size="lg" className="h-14 px-12 text-base font-bold rounded-xl shadow-2xl shadow-primary/25 hover:scale-105 active:scale-95 transition-all" asChild>
                <Link to="/signup" className="flex items-center gap-3">
                  Start Free Now <ArrowRight size={18} />
                </Link>
              </Button>
            </div>
          </motion.section>

        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-10 border-t border-muted/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground tracking-widest font-semibold">
            © {new Date().getFullYear()} JOBORA. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>

      {/* Subtle Dot Grid Overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
          backgroundSize: '48px 48px',
        }}
      />
    </div>
  );
}
