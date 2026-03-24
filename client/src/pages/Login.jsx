import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader2, Briefcase, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      toast({
        title: "Welcome Back",
        description: "Successfully signed in to your account.",
      });
      navigate('/dashboard');
    } catch (err) {
      const data = err.response?.data;
      if (data?.needsVerification) {
        setNeedsVerification(true);
        setUnverifiedEmail(data.email || email);
        toast({
          variant: "destructive",
          title: "Email Not Verified",
          description: "Please check your email for the verification link.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Sign In Failed",
          description: data?.error || 'Invalid credentials or connection error.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-muted/30 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-20 -left-20 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" />
      <div className="absolute bottom-20 -right-20 w-72 h-72 bg-purple-500/10 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-pulse" style={{ animationDelay: '2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-none shadow-2xl bg-background/90 backdrop-blur-sm">
          <CardHeader className="space-y-1 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/25 rotate-3 hover:rotate-0 transition-transform duration-300">
                <Briefcase size={32} className="text-primary-foreground" />
              </div>
            </div>
            <CardTitle className="text-3xl font-extrabold tracking-tight">Jobora</CardTitle>
            <CardDescription className="text-base">
              Find your next role in minutes, not weeks.
            </CardDescription>
            <div className="flex justify-center pt-2">
              <span className="label-tag label-tag-primary" style={{ fontSize: '10px', letterSpacing: '0.12em', fontWeight: 700 }}>
                <Zap size={10} className="inline mr-1 -mt-0.5" />
                AI-POWERED MATCHING
              </span>
            </div>
          </CardHeader>
          <CardContent className="grid gap-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-muted/30 border-none shadow-none focus-visible:ring-1"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-foreground">Password</label>
                  <Link to="/forgot-password" className="text-xs font-semibold text-primary hover:underline underline-offset-4 transition-colors">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 bg-muted/30 border-none shadow-none focus-visible:ring-1"
                    required
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-11 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>

              {needsVerification && (
                <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-center">
                  <p className="text-sm text-orange-700 mb-2">Your email is not verified yet.</p>
                  <button
                    type="button"
                    onClick={async () => {
                      try {
                        const res = await (await import('../lib/api')).default.post('/auth/resend-verification', { email: unverifiedEmail });
                        toast({ title: 'Verification Sent', description: 'Check your email for the verification link.' });
                      } catch (e) {
                        toast({ variant: 'destructive', title: 'Error', description: 'Could not send verification email.' });
                      }
                    }}
                    className="text-sm font-semibold text-primary hover:underline"
                  >
                    Resend verification email
                  </button>
                </div>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link to="/signup" className="font-semibold text-primary hover:underline underline-offset-4 transition-colors">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
