import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../lib/api';
import { Mail, ArrowLeft, Loader2, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const { toast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await api.post('/auth/forgot-password', { email });
      setSent(true);
      if (res.data.emailPreview) {
        setPreviewUrl(res.data.emailPreview);
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.error || 'Something went wrong.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 bg-muted/30 relative overflow-hidden">
      <div className="absolute top-20 -right-20 w-72 h-72 bg-primary/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" />
      <div className="absolute bottom-20 -left-20 w-72 h-72 bg-orange-500/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border-none shadow-2xl bg-background/90 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: sent ? 'rgba(16, 185, 129, 0.1)' : 'rgba(64, 154, 225, 0.1)' }}>
                {sent ? <CheckCircle size={32} className="text-emerald-500" /> : <Mail size={32} className="text-primary" />}
              </div>
            </div>
            <div className="flex justify-center mb-2">
              <span className={`label-tag ${sent ? 'label-tag-emerald' : 'label-tag-orange'}`} style={{ fontSize: '11px', letterSpacing: '0.12em', fontWeight: 700 }}>
                {sent ? 'EMAIL SENT' : 'PASSWORD RECOVERY'}
              </span>
            </div>
            <CardTitle className="text-2xl font-extrabold">
              {sent ? 'Check Your Email' : 'Forgot Password?'}
            </CardTitle>
            <CardDescription className="text-base">
              {sent
                ? 'We sent a password reset link to your email. It expires in 1 hour.'
                : "Enter your email and we'll send you a link to reset your password."
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-foreground">Email Address</label>
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
                <Button type="submit" className="w-full h-11 font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} className="mr-2" />
                      Send Reset Link
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                {previewUrl && (
                  <div className="p-3 rounded-xl bg-primary/5 border border-primary/20 text-center">
                    <p className="text-xs text-muted-foreground mb-2">Development mode — preview email:</p>
                    <a href={previewUrl} target="_blank" rel="noreferrer" className="text-sm font-semibold text-primary hover:underline break-all">
                      Open Email Preview ↗
                    </a>
                  </div>
                )}
                <Button
                  variant="outline"
                  className="w-full font-bold"
                  onClick={() => { setSent(false); setEmail(''); setPreviewUrl(null); }}
                >
                  Didn't receive it? Try again
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <div className="text-center text-sm text-muted-foreground w-full">
              <Link to="/login" className="font-semibold text-primary hover:underline underline-offset-4 transition-colors inline-flex items-center gap-1">
                <ArrowLeft size={14} />
                Back to Sign In
              </Link>
            </div>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
