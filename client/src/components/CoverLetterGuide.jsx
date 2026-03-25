import { useState } from 'react';
import api from '../lib/api';
import { Button } from './ui/button';
import { Sparkles, Loader2, Copy, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function CoverLetterGuide({ jobId }) {
  const [loading, setLoading] = useState(false);
  const [guideData, setGuideData] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const fetchGuide = async () => {
    if (guideData) {
      setExpanded(!expanded);
      return;
    }
    
    setLoading(true);
    setExpanded(true);
    try {
      const res = await api.get(`/recommend/cover-letter-guide/${jobId}`);
      setGuideData(res.data);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.error || "Failed to generate guide."
      });
      setExpanded(false);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!guideData?.prompt) return;
    navigator.clipboard.writeText(guideData.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Copied!",
      description: "Prompt copied to clipboard. Ready to paste into ChatGPT."
    });
  };

  return (
    <div className="mt-4 w-full border-t border-muted pt-4">
      <Button 
        variant="secondary" 
        onClick={fetchGuide} 
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 font-semibold bg-gradient-to-r hover:from-primary/20 hover:to-purple-500/20 text-foreground transition-all"
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin text-primary" />
        ) : (
          <Sparkles size={16} className="text-primary" />
        )}
        AI Cover Letter Guide
        {!loading && (expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
      </Button>

      {expanded && (
        <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {loading ? (
             <div className="p-6 text-center text-sm text-muted-foreground flex flex-col items-center">
                <Loader2 size={24} className="animate-spin text-primary mb-2" />
                Analyzing your profile against job requirements...
             </div>
          ) : guideData ? (
            <div className="space-y-4">
              <div className="bg-muted/40 rounded-lg p-4 border relative">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm flex items-center gap-1.5 text-foreground">
                    <Sparkles size={14} className="text-primary" />
                    Custom LLM Prompt
                  </h4>
                  <Button size="sm" variant="ghost" className="h-8 px-2" onClick={copyToClipboard}>
                    {copied ? <CheckCircle2 size={14} className="text-emerald-500 mr-1" /> : <Copy size={14} className="mr-1" />}
                    {copied ? 'Copied' : 'Copy Prompt'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Paste this into ChatGPT, Claude, or Gemini to generate a tailored cover letter.
                </p>
                <div className="bg-background rounded border p-3 text-xs font-mono text-muted-foreground whitespace-pre-wrap max-h-48 overflow-y-auto w-full break-words">
                  {guideData.prompt}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
                  <h5 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mb-2 uppercase tracking-wide">
                    Your Strengths to Highlight
                  </h5>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {guideData.matchedSkills.length > 0 
                      ? guideData.matchedSkills.map(s => <li key={s} className="flex items-start gap-1"><CheckCircle2 size={12} className="text-emerald-500 mt-0.5 shrink-0" /> {s}</li>)
                      : <li>Focus on your fast learning ability and soft skills.</li>
                    }
                  </ul>
                </div>
                <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-3">
                  <h5 className="text-xs font-bold text-orange-600 dark:text-orange-400 mb-2 uppercase tracking-wide">
                    Gaps to Frame Positively
                  </h5>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {guideData.missingSkills.length > 0 
                      ? guideData.missingSkills.slice(0, 5).map(s => <li key={s} className="flex items-start gap-1"><span className="text-orange-500 mt-0 shrink-0">•</span> {s}</li>)
                      : <li>You have all the required skills listed!</li>
                    }
                  </ul>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
