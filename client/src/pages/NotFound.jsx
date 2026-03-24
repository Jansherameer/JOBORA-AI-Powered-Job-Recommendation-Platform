import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Search, Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-muted/30 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute top-10 -left-32 w-96 h-96 bg-primary/8 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
      <div className="absolute bottom-10 -right-32 w-96 h-96 bg-purple-500/8 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '3s' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-emerald-500/5 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-center relative z-10 max-w-lg"
      >
        {/* Giant 404 */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6"
        >
          <h1 className="text-[10rem] font-extrabold leading-none tracking-tighter bg-gradient-to-br from-primary via-purple-500 to-emerald-400 bg-clip-text text-transparent select-none">
            404
          </h1>
        </motion.div>

        {/* Label tags */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center gap-2 mb-6"
        >
          <span className="label-tag label-tag-red" style={{ fontSize: '11px', letterSpacing: '0.12em', fontWeight: 700 }}>
            PAGE NOT FOUND
          </span>
          <span className="label-tag label-tag-dark" style={{ fontSize: '11px', letterSpacing: '0.12em', fontWeight: 700 }}>
            ERROR
          </span>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Lost in the job search?
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track.
          </p>
        </motion.div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link to="/">
            <Button size="lg" className="gap-2 font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all px-8">
              <Home size={18} />
              Back to Home
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button size="lg" variant="outline" className="gap-2 font-bold hover:scale-105 active:scale-95 transition-all px-8">
              <Compass size={18} />
              Go to Dashboard
            </Button>
          </Link>
        </motion.div>

        {/* Fun links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-10 flex justify-center gap-4"
        >
          <Link to="/profile" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
            <Search size={14} />
            Update Profile
          </Link>
          <span className="text-muted-foreground/30">|</span>
          <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5">
            <ArrowLeft size={14} />
            Homepage
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
