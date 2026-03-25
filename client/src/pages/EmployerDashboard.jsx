import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, Search, Sparkles, Loader2, Mail, CheckCircle2, User, Send, Users, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import api from '../lib/api';

export default function EmployerDashboard() {
  const [query, setQuery] = useState('');
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setCandidates([]);
    
    try {
      const res = await api.post('/recommend/employer/find-candidates', { query });
      setCandidates(res.data.candidates || []);
      
      if (res.data.candidates?.length === 0) {
        toast({ title: "No candidates found", description: "Try broadening your search query." });
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Search Failed",
        description: err.response?.data?.error || "Failed to search candidates."
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied!", description: "Outreach prompt copied to clipboard." });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-muted/30 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header & Search */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-background rounded-2xl shadow-xl overflow-hidden border"
        >
          <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full filter blur-3xl opacity-50 translate-x-1/2 -translate-y-1/2" />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold mb-4 border border-emerald-500/30 tracking-wide">
                <Sparkles size={14} /> REVERSE PITCHING
              </span>
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
                Find Your Perfect Engineer
              </h1>
              <p className="text-slate-300 max-w-2xl text-sm md:text-base">
                Describe your project, framework requirements, or the specific problem you are trying to solve. 
                Our AI will mathematically scan candidate resumes to find the exact talent you need.
              </p>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative">
                <Textarea
                  placeholder="Example: I need a senior frontend developer who is an expert in React.js, TailwindCSS, and Framer Motion for complex animations..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="min-h-[120px] text-base resize-none p-4 pr-12 focus-visible:ring-emerald-500 bg-muted/30 border-muted"
                />
                <Button 
                  type="submit" 
                  size="icon"
                  className="absolute bottom-4 right-4 h-10 w-10 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-500/30 transition-transform active:scale-95"
                  disabled={loading || !query.trim()}
                >
                  {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Search className="h-5 w-5" />}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="py-12 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
            <p className="text-muted-foreground font-medium animate-pulse text-sm">
              Vectorizing query and computing cosine similarity against resumes...
            </p>
          </div>
        )}

        {/* Results */}
        {!loading && candidates.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
                <Users size={24} className="text-primary" />
                Top Matches Found
              </h2>
              <span className="text-sm text-muted-foreground font-medium bg-muted px-3 py-1 rounded-full">
                {candidates.length} candidates
              </span>
            </div>

            <div className="grid gap-4">
              <AnimatePresence>
                {candidates.map((candidate, idx) => (
                  <motion.div
                    key={candidate.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-md transition-shadow border-muted/60">
                      <CardContent className="p-0 sm:flex items-stretch">
                        
                        {/* Match Score Strip */}
                        <div className="bg-emerald-500/10 sm:w-32 flex sm:flex-col items-center justify-center p-4 border-b sm:border-b-0 sm:border-r border-emerald-500/20">
                          <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">
                            {candidate.matchScore.toFixed(0)}%
                          </div>
                          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600/70 dark:text-emerald-400/70 mt-1">
                            Match
                          </div>
                        </div>

                        {/* Details */}
                        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                                {candidate.name}
                              </h3>
                              <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-1">
                                <Mail size={14} /> {candidate.email}
                              </p>
                            </div>
                            <Button 
                              onClick={() => setSelectedPrompt(candidate)}
                              variant="outline"
                              className="shrink-0 bg-primary/5 hover:bg-primary/10 border-primary/20 text-primary"
                            >
                              <Send size={16} className="mr-2" />
                              Draft Email
                            </Button>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {candidate.skills?.slice(0, 8).map(skill => (
                              <span key={skill} className="px-2.5 py-1 bg-muted rounded-md text-[11px] font-medium text-muted-foreground border">
                                {skill}
                              </span>
                            ))}
                            {candidate.skills?.length > 8 && (
                              <span className="px-2.5 py-1 bg-muted/50 rounded-md text-[11px] font-medium text-muted-foreground border">
                                +{candidate.skills.length - 8} more
                              </span>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </div>

      {/* Outreach Prompt Modal */}
      <Dialog open={!!selectedPrompt} onOpenChange={(open) => !open && setSelectedPrompt(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="text-emerald-500" size={20} />
              AI Outreach Generator
            </DialogTitle>
            <DialogDescription>
              Copy and paste this engineered prompt into ChatGPT to generate a highly personalized, irresistible cold outreach email for {selectedPrompt?.name}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 relative">
            <div className="bg-muted rounded-md p-4 max-h-[300px] overflow-y-auto text-sm font-mono whitespace-pre-wrap border border-emerald-500/20 shadow-inner">
              {selectedPrompt?.outreachPrompt}
            </div>
          </div>

          <DialogFooter className="mt-6 flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={() => setSelectedPrompt(null)}>
              Close
            </Button>
            <Button 
              onClick={() => copyToClipboard(selectedPrompt?.outreachPrompt)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {copied ? <CheckCircle2 size={16} className="mr-2" /> : <Copy size={16} className="mr-2" />}
              {copied ? 'Copied to Clipboard' : 'Copy Prompt'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
