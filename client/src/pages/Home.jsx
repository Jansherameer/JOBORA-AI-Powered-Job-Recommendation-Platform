import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, Globe, Briefcase, ArrowRight, Clock, Target, BarChart3, Star, MousePointer2, Shield, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
  };

  const features = [
    {
      icon: <Clock className="text-primary" size={24} />,
      title: "Eliminate the Time Sink",
      description: "Traditional searching takes 20+ hours a week. Jobora reduces that to 5 minutes of review.",
    },
    {
      icon: <Sparkles className="text-purple-500" size={24} />,
      title: "Deep Expertise Analysis",
      description: "Our AI doesn't just look at keywords. It understands your career trajectory and technical depth.",
    },
    {
      icon: <Shield className="text-emerald-500" size={24} />,
      title: "Quality First",
      description: "We filter out ghost jobs and low-quality listings before they even reach your dashboard.",
    },
];

  return (
    <div className="relative min-h-[calc(100vh-4rem)] overflow-hidden bg-background">
      {/* Dynamic Background */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute top-40 -right-4 w-96 h-96 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '4s' }} />

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-40">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="text-center"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-8">
            <Zap size={14} className="fill-primary" />
            Save hundreds of hours
          </motion.div>
          
          {/* Main Headline */}
          <motion.h1 
            variants={itemVariants}
            className="text-6xl sm:text-8xl font-black tracking-tight text-foreground mb-8 leading-[0.95]"
          >
            Searching sucks. <br />
            <span className="gradient-text">Jobora finds.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p 
            variants={itemVariants}
            className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto mb-14 leading-relaxed font-medium"
          >
            Stop wasting weeks on job boards. Our AI analyzes global feeds in milliseconds 
             to match you with opportunities that actually matter.
          </motion.p>

          {/* CTAs */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-32">
            <Button size="lg" className="h-14 px-10 text-lg font-bold rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all" asChild>
              <Link to="/signup" className="flex items-center gap-3">
                Get Started for Free <MousePointer2 size={20} />
              </Link>
            </Button>
            <Button size="lg" variant="ghost" className="h-14 px-10 text-lg font-bold rounded-2xl hover:bg-muted transition-all" asChild>
              <Link to="/dashboard" className="flex items-center gap-2">
                Browse Active Jobs
              </Link>
            </Button>
          </motion.div>

          {/* Comparison Section */}
          <motion.div 
            variants={itemVariants}
            className="mt-40 mb-32 max-w-5xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-black mb-12">Stop wasting your most valuable asset.</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Before */}
               <div className="bg-muted/50 p-8 rounded-[2rem] border border-dashed border-muted-foreground/20">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6">Traditional Search</p>
                  <ul className="space-y-4 text-left">
                     {[
                        "Spending 4 hours/day on LinkedIn",
                        "Filter through hundreds of irrelevant roles",
                        "Manual tracking in complex spreadsheets",
                        "Low response rate from cold applies",
                        "Massive mental fatigue"
                     ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-muted-foreground line-through opacity-60">
                           <X className="text-destructive mt-1 shrink-0" size={16} />
                           <span className="text-sm font-medium">{item}</span>
                        </li>
                     ))}
                  </ul>
                  <div className="mt-8 pt-6 border-t border-muted-foreground/10 flex items-center justify-between">
                     <span className="text-xs font-bold text-muted-foreground uppercase">Estimated Time</span>
                     <span className="text-lg font-bold text-destructive">25+ hrs / week</span>
                  </div>
               </div>

               {/* After */}
               <div className="glass p-8 rounded-[2rem] border-primary/20 bg-primary/5 shadow-2xl shadow-primary/5 relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-6">With Jobora</p>
                  <ul className="space-y-4 text-left">
                     {[
                        "AI works 24/7 while you sleep",
                        "Instant push of verified matches",
                        "Seamless dashboard organization",
                        "High-signal roles with direct apply",
                        "Focus on Interviewing, not Hunting"
                     ].map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-foreground font-bold">
                           <CheckCircle2 className="text-primary mt-1 shrink-0" size={16} />
                           <span className="text-sm">{item}</span>
                        </li>
                     ))}
                  </ul>
                  <div className="mt-8 pt-6 border-t border-primary/10 flex items-center justify-between">
                     <span className="text-xs font-bold text-primary uppercase">Estimated Time</span>
                     <span className="text-lg font-black text-primary">5 mins / day</span>
                  </div>
               </div>
            </div>
          </motion.div>

          {/* Feature Grid */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left"
          >
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -10 }}
                className="glass p-10 rounded-[2.5rem] border-muted/50 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group relative"
              >
                <div className="w-14 h-14 rounded-2xl bg-background border shadow-sm flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-medium opacity-80">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Social Proof / Stats Area */}
          <motion.div 
            variants={itemVariants}
            className="mt-40 pt-20 border-t border-muted/50"
          >
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-8">
              {[
                { label: "Sync Speed", count: "Real-time", icon: <Zap size={16} /> },
                { label: "Hours Saved/User", count: "140 hrs", icon: <Clock size={16} /> },
                { label: "Match Precision", count: "99.2%", icon: <CheckCircle2 size={16} /> },
                { label: "Daily Global Jobs", count: "50k+", icon: <Briefcase size={16} /> },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center">
                   <div className="flex items-center gap-2 text-primary mb-2">
                      {stat.icon}
                      <span className="text-xs font-black uppercase tracking-widest opacity-60">Jobora Index</span>
                   </div>
                  <p className="text-4xl sm:text-5xl font-black text-foreground mb-2">{stat.count}</p>
                  <p className="text-[10px] sm:text-xs font-bold text-muted-foreground uppercase tracking-[0.25em]">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-muted/50 mt-20">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-medium text-muted-foreground tracking-widest">
            © {new Date().getFullYear()} JOBORA. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>

      {/* Grid Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)', backgroundSize: '48px 48px' }} />
    </div>
  );
}
