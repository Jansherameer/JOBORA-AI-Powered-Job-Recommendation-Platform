import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ShieldAlert, RefreshCcw, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Unauthorized() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-muted/30 relative overflow-hidden">
      {/* Ambient background */}
      <div className="absolute top-20 -right-20 w-72 h-72 bg-red-500/8 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
      <div className="absolute bottom-20 -left-20 w-72 h-72 bg-orange-500/8 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="text-center relative z-10 max-w-lg"
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.1, type: 'spring', stiffness: 200 }}
          className="flex justify-center mb-6"
        >
          <div className="w-24 h-24 rounded-3xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
            <ShieldAlert size={48} className="text-red-500" />
          </div>
        </motion.div>

        {/* Label tags */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex justify-center gap-2 mb-4"
        >
          <span className="label-tag label-tag-red" style={{ fontSize: '11px', letterSpacing: '0.12em', fontWeight: 700 }}>
            403 FORBIDDEN
          </span>
          <span className="label-tag label-tag-orange" style={{ fontSize: '11px', letterSpacing: '0.12em', fontWeight: 700 }}>
            ACCESS DENIED
          </span>
        </motion.div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-foreground mb-3">
            Restricted Area
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-md mx-auto">
            You don't have the required permissions to access this page. 
            This area is reserved for administrators only.
          </p>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <Link to="/dashboard">
            <Button size="lg" className="gap-2 font-bold shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all px-8">
              <ArrowLeft size={18} />
              Back to Dashboard
            </Button>
          </Link>
          <Link to="/">
            <Button size="lg" variant="outline" className="gap-2 font-bold hover:scale-105 active:scale-95 transition-all px-8">
              <Home size={18} />
              Go Home
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
