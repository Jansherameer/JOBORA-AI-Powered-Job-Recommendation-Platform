import { useState } from 'react';
import api from '../lib/api';
import { Button } from './ui/button';
import { Presentation, Loader2, Copy, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function MockInterviewGuide({ jobId }) {
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
      const res = await api.get(`/recommend/interview-prep/${jobId}`);
      setGuideData(res.data);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.error || "Failed to generate interview guide."
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
      description: "Prompt copied to clipboard. Paste it into ChatGPT to start your mock interview!"
    });
  };

  return (
    <div className="mt-3 w-full border-t border-muted/30 pt-3">
      <Button 
        variant="secondary" 
        onClick={fetchGuide} 
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 font-semibold bg-gradient-to-r hover:from-blue-500/20 hover:to-indigo-500/20 text-foreground transition-all"
      >
        {loading ? (
          <Loader2 size={16} className="animate-spin text-blue-500" />
        ) : (
          <Presentation size={16} className="text-blue-500" />
        )}
        AI Mock Interview Prep
        {!loading && (expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />)}
      </Button>

      {expanded && (
        <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {loading ? (
             <div className="p-6 text-center text-sm text-muted-foreground flex flex-col items-center">
                <Loader2 size={24} className="animate-spin text-blue-500 mb-2" />
                Generating tough technical questions based on your skill gaps...
             </div>
          ) : guideData ? (
            <div className="space-y-4">
              <div className="bg-muted/40 rounded-lg p-4 border relative">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold text-sm flex items-center gap-1.5 text-foreground">
                    <Presentation size={14} className="text-blue-500" />
                    Mock Interviewer Prompt
                  </h4>
                  <Button size="sm" variant="ghost" className="h-8 px-2" onClick={copyToClipboard}>
                    {copied ? <CheckCircle2 size={14} className="text-emerald-500 mr-1" /> : <Copy size={14} className="mr-1" />}
                    {copied ? 'Copied' : 'Copy Prompt'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Paste this into ChatGPT to simulate a highly technical interview tailored to your exact weaknesses.
                </p>
                <div className="bg-background rounded border p-3 text-xs font-mono text-muted-foreground whitespace-pre-wrap max-h-48 overflow-y-auto w-full break-words border-blue-500/20 shadow-inner">
                  {guideData.prompt}
                </div>
              </div>

              <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-3">
                <h5 className="text-xs font-bold text-blue-600 dark:text-blue-400 mb-2 uppercase tracking-wide">
                  Your Interview Danger Zones
                </h5>
                <p className="text-xs text-muted-foreground mb-2">
                  The AI will focus on grilling you about these missing requirements. Be prepared to pivot:
                </p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  {guideData.missingSkills.length > 0 
                    ? guideData.missingSkills.slice(0, 5).map(s => <li key={s} className="flex items-start gap-1"><span className="text-blue-500 mt-0 shrink-0">•</span> {s}</li>)
                    : <li>You check every box! Expect advanced architecture questions instead.</li>
                  }
                </ul>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
