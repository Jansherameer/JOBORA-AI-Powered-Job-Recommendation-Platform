import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api';
import { CheckCircle, XCircle, Loader2, Mail, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState('verifying'); // verifying | success | already | error
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token found. Please check your email for the correct link.');
      return;
    }

    const verify = async () => {
      try {
        const res = await api.get(`/auth/verify-email?token=${token}`);
        if (res.data.alreadyVerified) {
          setStatus('already');
          setMessage('Your email is already verified.');
        } else {
          setStatus('success');
          setMessage(res.data.message);
        }
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Verification failed. The token may be invalid or expired.');
      }
    };
    verify();
  }, [token]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-muted/30 relative overflow-hidden">
      <div className="absolute top-20 -left-20 w-72 h-72 bg-emerald-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
      <div className="absolute bottom-20 -right-20 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-none shadow-2xl bg-background/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            {status === 'verifying' && (
              <>
                <div className="flex justify-center mb-4">
                  <Loader2 size={48} className="text-primary animate-spin" />
                </div>
                <CardTitle className="text-2xl font-extrabold">Verifying Email...</CardTitle>
                <CardDescription>Please wait while we verify your account.</CardDescription>
              </>
            )}
            {status === 'success' && (
              <>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle size={36} className="text-emerald-500" />
                  </div>
                </div>
                <div className="flex justify-center mb-2">
                  <span className="label-tag label-tag-emerald" style={{ fontSize: '11px', letterSpacing: '0.12em', fontWeight: 700 }}>
                    VERIFIED
                  </span>
                </div>
                <CardTitle className="text-2xl font-extrabold">Email Verified!</CardTitle>
                <CardDescription>{message}</CardDescription>
              </>
            )}
            {status === 'already' && (
              <>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                    <Mail size={36} className="text-blue-500" />
                  </div>
                </div>
                <div className="flex justify-center mb-2">
                  <span className="label-tag label-tag-primary" style={{ fontSize: '11px', letterSpacing: '0.12em', fontWeight: 700 }}>
                    ALREADY VERIFIED
                  </span>
                </div>
                <CardTitle className="text-2xl font-extrabold">Already Verified</CardTitle>
                <CardDescription>{message}</CardDescription>
              </>
            )}
            {status === 'error' && (
              <>
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
                    <XCircle size={36} className="text-red-500" />
                  </div>
                </div>
                <div className="flex justify-center mb-2">
                  <span className="label-tag label-tag-red" style={{ fontSize: '11px', letterSpacing: '0.12em', fontWeight: 700 }}>
                    FAILED
                  </span>
                </div>
                <CardTitle className="text-2xl font-extrabold">Verification Failed</CardTitle>
                <CardDescription>{message}</CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent className="text-center">
            {(status === 'success' || status === 'already') && (
              <Link to="/login">
                <Button className="gap-2 font-bold shadow-lg hover:scale-105 active:scale-95 transition-all">
                  Continue to Sign In <ArrowRight size={16} />
                </Button>
              </Link>
            )}
            {status === 'error' && (
              <Link to="/signup">
                <Button variant="outline" className="gap-2 font-bold hover:scale-105 active:scale-95 transition-all">
                  Back to Sign Up
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
