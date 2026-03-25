import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Building2, ChevronRight, ExternalLink, Briefcase } from 'lucide-react';
import MatchCircle from './MatchCircle';
import { Card, CardContent } from './ui/card';
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
import CoverLetterGuide from './CoverLetterGuide';
import MockInterviewGuide from './MockInterviewGuide';

export default function JobCard({ job, matchScore, matchedSkills = [], index = 0 }) {
  const [open, setOpen] = useState(false);

  const categoryTagMap = {
    'Software Engineering': 'primary',
    'Data Science': 'emerald',
    'DevOps': 'orange',
    'Design': 'pink',
    'Product Management': 'purple',
    'Security': 'red',
  };

  // Helper to strip HTML for card preview
  const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const catVariant = categoryTagMap[job.category] || 'dark';
  const skills = Array.isArray(job.requiredSkills) ? job.requiredSkills : [];
  
  // Use professional applyLink if available, otherwise search fallback
  const applyUrl = job.applyLink || `https://www.google.com/search?q=${encodeURIComponent(job.title + " " + job.company + " careers")}`;

  // Assign rotating tag colors to skills
  const skillTagVariants = ['primary', 'emerald', 'purple', 'orange', 'pink', 'cyan', 'dark'];
  const getSkillVariant = (idx) => skillTagVariants[idx % skillTagVariants.length];

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
                    <span className={`label-tag label-tag-${catVariant}`}>
                      {job.category}
                    </span>
                    <span className="label-tag label-tag-dark" style={{ fontSize: '10px' }}>
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
                    {skills.slice(0, 5).map((skill, sIdx) => {
                      const isMatched = matchedSkills.some(ms => ms.toLowerCase() === skill.toLowerCase());
                      return (
                        <span
                          key={skill}
                          className={`label-tag ${isMatched ? 'label-tag-emerald' : `label-tag-${getSkillVariant(sIdx)}`}`}
                          style={{ fontSize: '11px', padding: '3px 6px' }}
                        >
                          {isMatched && '✓ '}{skill}
                        </span>
                      );
                    })}
                    {skills.length > 5 && (
                      <span className="label-tag label-tag-dark" style={{ fontSize: '11px', padding: '3px 6px' }}>
                        +{skills.length - 5}
                      </span>
                    )}
                  </div>
                </div>

                {matchScore !== undefined && (
                  <div className="flex flex-col items-center gap-1 shrink-0 pt-1">
                    <MatchCircle score={matchScore} size={56} />
                    <span className="label-tag label-tag-primary" style={{ fontSize: '9px', padding: '1px 4px', letterSpacing: '0.08em' }}>
                      MATCH
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-muted/50 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  {matchedSkills.length > 0 ? (
                    <>
                      <div className="flex -space-x-1">
                        {[...Array(Math.min(3, matchedSkills.length))].map((_, i) => (
                           <div key={i} className="w-5 h-5 rounded-full bg-emerald-50 border-2 border-background flex items-center justify-center">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                           </div>
                        ))}
                      </div>
                      <span className="label-tag label-tag-emerald" style={{ fontSize: '11px', padding: '2px 6px' }}>
                        {matchedSkills.length} KEY SKILLS MATCHED
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
              <span className={`label-tag label-tag-${catVariant}`}>
                {job.category}
              </span>
              <span className="label-tag label-tag-dark">
                {job.experienceLevel}
              </span>
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
              <div className="bg-primary/[0.03] rounded-2xl p-4 border border-primary/10 flex items-center gap-4">
                <MatchCircle score={matchScore} size={64} />
                <div>
                  <h4 className="font-bold text-foreground">AI Match Confidence</h4>
                  <p className="text-sm text-muted-foreground">
                    You have a <span className="label-tag label-tag-primary" style={{ fontSize: '12px', padding: '2px 6px' }}>{Math.round(matchScore)}%</span> compatibility score for this position.
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
                {skills.map((skill, sIdx) => {
                  const isMatched = matchedSkills.some(ms => ms.toLowerCase() === skill.toLowerCase());
                  return (
                    <span
                      key={skill}
                      className={`label-tag ${isMatched ? 'label-tag-emerald' : `label-tag-${getSkillVariant(sIdx)}`}`}
                      style={{ fontSize: '12px' }}
                    >
                      {skill}
                      {isMatched && <span className="ml-1">✓</span>}
                    </span>
                  );
                })}
              </div>
            </div>
            
            <CoverLetterGuide jobId={job.id} />
            <MockInterviewGuide jobId={job.id} />
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
                className="font-bold sm:w-auto w-full shadow-lg hover:scale-105 active:scale-95 transition-all"
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
