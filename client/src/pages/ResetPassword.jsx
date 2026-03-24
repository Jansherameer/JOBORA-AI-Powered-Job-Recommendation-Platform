import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api';
import { Lock, Loader2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { toast } = useToast();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Passwords Don't Match",
        description: "Please make sure both passwords are identical.",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Password Too Short",
        description: "Password must be at least 6 characters.",
      });
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/reset-password', { token, password });
      setSuccess(true);
      toast({
        title: "Password Reset",
        description: "Your password has been changed successfully.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Reset Failed",
        description: err.response?.data?.error || 'Token may be invalid or expired.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-muted/30">
        <Card className="border-none shadow-2xl bg-background/90 max-w-md w-full text-center">
          <CardContent className="py-10">
            <p className="text-muted-foreground mb-4">No reset token found. Please use the link from your email.</p>
            <Link to="/forgot-password">
              <Button variant="outline">Request New Reset Link</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-muted/30 relative overflow-hidden">
      <div className="absolute top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
      <div className="absolute bottom-20 -right-20 w-72 h-72 bg-emerald-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-none shadow-2xl bg-background/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(64, 154, 225, 0.1)' }}>
                {success ? <ShieldCheck size={32} className="text-emerald-500" /> : <Lock size={32} className="text-primary" />}
              </div>
            </div>
            <div className="flex justify-center mb-2">
              <span className={`label-tag ${success ? 'label-tag-emerald' : 'label-tag-primary'}`} style={{ fontSize: '11px', letterSpacing: '0.12em', fontWeight: 700 }}>
                {success ? 'PASSWORD CHANGED' : 'SECURE RESET'}
              </span>
            </div>
            <CardTitle className="text-2xl font-extrabold">
              {success ? 'Password Updated!' : 'Set New Password'}
            </CardTitle>
            <CardDescription className="text-base">
              {success
                ? 'Your password has been reset successfully.'
                : 'Choose a strong password for your Jobora account.'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!success ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">New Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 bg-muted/30 border-none shadow-none focus-visible:ring-1"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Confirm Password</label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-3 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 bg-muted/30 border-none shadow-none focus-visible:ring-1"
                      required
                      minLength={6}
                    />
                  </div>
                </div>
                <Button type="submit" className="w-full h-11 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Resetting...
                    </>
                  ) : (
                    'Reset Password'
                  )}
                </Button>
              </form>
            ) : (
              <Link to="/login">
                <Button className="w-full h-11 gap-2 font-bold shadow-lg hover:scale-105 active:scale-95 transition-all">
                  Continue to Sign In <ArrowRight size={16} />
                </Button>
              </Link>
            )}
          </CardContent>
          <CardFooter>
            <div className="text-center text-sm text-muted-foreground w-full">
              <Link to="/login" className="font-semibold text-primary hover:underline underline-offset-4 transition-colors">
                Back to Sign In
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
