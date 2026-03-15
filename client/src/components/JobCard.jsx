import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Building2, ChevronRight, ExternalLink, Briefcase } from 'lucide-react';
import MatchCircle from './MatchCircle';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from './ui/dialog';
import { Button } from './ui/button';

export default function JobCard({ job, matchScore, matchedSkills = [], index = 0 }) {
  const [open, setOpen] = useState(false);

  const categoryColors = {
    'Software Engineering': 'bg-blue-100 text-blue-700 border-blue-200',
    'Data Science': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'DevOps': 'bg-orange-100 text-orange-700 border-orange-200',
    'Design': 'bg-pink-100 text-pink-700 border-pink-200',
    'Product Management': 'bg-violet-100 text-violet-700 border-violet-200',
    'Security': 'bg-red-100 text-red-700 border-red-200',
  };

  // Helper to strip HTML for card preview
  const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const badgeColor = categoryColors[job.category] || 'bg-muted text-muted-foreground border-border';
  const skills = Array.isArray(job.requiredSkills) ? job.requiredSkills : [];
  
  // Use professional applyLink if available, otherwise search fallback
  const applyUrl = job.applyLink || `https://www.google.com/search?q=${encodeURIComponent(job.title + " " + job.company + " careers")}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Card className="group hover:shadow-md transition-all border-muted/50 overflow-hidden cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className={`font-medium ${badgeColor}`}>
                      {job.category}
                    </Badge>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground">
                      {job.experienceLevel}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors truncate">
                    {job.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Building2 size={14} className="text-muted-foreground/70" />
                      {job.company}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-muted-foreground/70" />
                      {job.location}
                    </span>
                  </div>

                  <p className="mt-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                    {stripHtml(job.description)}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {skills.slice(0, 5).map((skill) => {
                      const isMatched = matchedSkills.some(ms => ms.toLowerCase() === skill.toLowerCase());
                      return (
                        <Badge 
                          key={skill} 
                          variant={isMatched ? "default" : "secondary"}
                          className={`text-[10px] px-2 py-0 ${isMatched ? "bg-green-600 hover:bg-green-700" : "bg-secondary/50"}`}
                        >
                          {skill}
                        </Badge>
                      );
                    })}
                    {skills.length > 5 && (
                      <Badge variant="secondary" className="text-[10px] px-2 py-0">
                        +{skills.length - 5}
                      </Badge>
                    )}
                  </div>
                </div>

                {matchScore !== undefined && (
                  <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
                    <MatchCircle score={matchScore} size={56} />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">match</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-muted/50 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {matchedSkills.length > 0 ? (
                    <>
                      <div className="flex -space-x-1">
                        {[...Array(Math.min(3, matchedSkills.length))].map((_, i) => (
                           <div key={i} className="w-5 h-5 rounded-full bg-green-100 border-2 border-background flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-green-600" />
                           </div>
                        ))}
                      </div>
                      <span className="text-xs font-semibold text-green-700">
                        {matchedSkills.length} key skills matched
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-muted-foreground">View details to apply</span>
                  )}
                </div>
                <ChevronRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>

        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className={`font-medium ${badgeColor}`}>
                {job.category}
              </Badge>
              <Badge variant="secondary" className="bg-muted text-muted-foreground">
                {job.experienceLevel}
              </Badge>
            </div>
            <DialogTitle className="text-2xl font-extrabold">{job.title}</DialogTitle>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-muted-foreground font-medium">
              <div className="flex items-center gap-1.5 text-primary">
                <Building2 size={16} />
                {job.company}
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin size={16} />
                {job.location}
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {matchScore !== undefined && (
              <div className="bg-primary/5 rounded-2xl p-4 border border-primary/10 flex items-center gap-4">
                <MatchCircle score={matchScore} size={64} />
                <div>
                  <h4 className="font-bold text-foreground">AI Match Confidence</h4>
                  <p className="text-sm text-muted-foreground">
                    You have a <span className="text-primary font-bold">{Math.round(matchScore)}%</span> compatibility score for this position based on your profile skills.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h4 className="font-bold text-foreground flex items-center gap-2">
                <Briefcase size={18} className="text-primary" />
                Job Description
              </h4>
              <div 
                className="text-sm text-muted-foreground leading-relaxed prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-foreground">Required Skills</h4>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => {
                  const isMatched = matchedSkills.some(ms => ms.toLowerCase() === skill.toLowerCase());
                  return (
                    <Badge 
                      key={skill} 
                      variant={isMatched ? "default" : "secondary"}
                      className={`px-3 py-1 ${isMatched ? "bg-green-600 hover:bg-green-700" : "bg-muted"}`}
                    >
                      {skill}
                      {isMatched && <span className="ml-1.5">✓</span>}
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-3 pt-6 border-t">
            <Button 
                variant="outline" 
                onClick={() => setOpen(false)}
                className="font-bold sm:w-auto w-full"
            >
              Close
            </Button>
            <Button 
                asChild 
                className="font-bold sm:w-auto w-full shadow-lg"
            >
              <a href={applyUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                Apply for this Position
                <ExternalLink size={16} />
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
