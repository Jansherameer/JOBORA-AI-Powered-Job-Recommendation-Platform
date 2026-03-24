import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import FileUpload from '../components/FileUpload';
import { User, Sparkles, X, Plus, FileText, Loader2, Save, Award, TrendingUp, CheckCircle, AlertTriangle, Target, BarChart3, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

// ──── ATS Score Gauge Component ────
function ATSScoreGauge({ score, grade, size = 140 }) {
  const radius = (size - 16) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getColor = (s) => {
    if (s >= 80) return { stroke: '#10b981', bg: 'rgba(16, 185, 129, 0.08)', text: '#10b981' };
    if (s >= 60) return { stroke: '#3b82f6', bg: 'rgba(59, 130, 246, 0.08)', text: '#3b82f6' };
    if (s >= 40) return { stroke: '#f59e0b', bg: 'rgba(245, 158, 11, 0.08)', text: '#f59e0b' };
    return { stroke: '#ef4444', bg: 'rgba(239, 68, 68, 0.08)', text: '#ef4444' };
  };

  const colors = getColor(score);

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke="hsl(var(--color-muted) / 0.3)" strokeWidth="8"
        />
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none" stroke={colors.stroke} strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-extrabold" style={{ color: colors.text }}>{score}</span>
        <span className="text-xs font-bold text-muted-foreground mt-0.5">/ 100</span>
        <span
          className="label-tag mt-1"
          style={{
            fontSize: '10px', padding: '2px 8px', fontWeight: 700, letterSpacing: '0.1em',
            background: colors.bg, color: colors.text
          }}
        >
          {grade}
        </span>
      </div>
    </div>
  );
}

// ──── ATS Breakdown Bar Component ────
function BreakdownBar({ label, score, max, index }) {
  const pct = (score / max) * 100;
  const colors = ['primary', 'emerald', 'purple', 'orange', 'pink'];
  const colorMap = {
    primary: { bar: 'rgba(64, 154, 225, 0.9)', bg: 'rgba(64, 154, 225, 0.12)' },
    emerald: { bar: 'rgba(16, 185, 129, 0.9)', bg: 'rgba(16, 185, 129, 0.12)' },
    purple: { bar: 'rgba(139, 92, 246, 0.9)', bg: 'rgba(139, 92, 246, 0.12)' },
    orange: { bar: 'rgba(249, 115, 22, 0.9)', bg: 'rgba(249, 115, 22, 0.12)' },
    pink: { bar: 'rgba(236, 72, 153, 0.9)', bg: 'rgba(236, 72, 153, 0.12)' },
  };
  const color = colorMap[colors[index % colors.length]];

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-semibold text-foreground">{label}</span>
        <span className="text-xs font-bold text-muted-foreground">{score}/{max}</span>
      </div>
      <div className="h-2.5 rounded-full w-full" style={{ background: color.bg }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="h-full rounded-full"
          style={{ background: color.bar }}
        />
      </div>
    </div>
  );
}

// ──── ATS Score Card Component ────
function ATSScoreCard({ report }) {
  if (!report) return null;

  const { score, grade, breakdown, tips, strengths, stats } = report;
  const breakdownEntries = Object.values(breakdown);

  const priorityTagMap = { high: 'red', medium: 'orange', low: 'cyan' };
  const categoryIconMap = {
    section: '📄', skills: '⚡', language: '✍️', impact: '📊', content: '📝', contact: '📧', formatting: '🎨'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="border-none shadow-lg overflow-hidden">
        {/* Gradient header bar */}
        <div className="h-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500" />

        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="label-tag label-tag-primary" style={{ fontSize: '11px', letterSpacing: '0.12em', fontWeight: 700 }}>
              <BarChart3 size={11} className="inline mr-1 -mt-0.5" />
              ATS ANALYSIS
            </span>
          </div>
          <CardTitle className="text-xl font-extrabold">Resume ATS Score</CardTitle>
          <CardDescription>How well your resume performs with Applicant Tracking Systems</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Score + Breakdown row */}
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="flex flex-col items-center gap-3">
              <ATSScoreGauge score={score} grade={grade} />
              <div className="flex gap-2 flex-wrap justify-center">
                <span className="label-tag label-tag-dark" style={{ fontSize: '10px' }}>
                  {stats.wordCount} WORDS
                </span>
                <span className="label-tag label-tag-primary" style={{ fontSize: '10px' }}>
                  {stats.skillCount} SKILLS
                </span>
                <span className="label-tag label-tag-purple" style={{ fontSize: '10px' }}>
                  {stats.actionVerbCount} VERBS
                </span>
              </div>
            </div>

            <div className="flex-1 w-full space-y-3">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Target size={14} className="text-primary" />
                Score Breakdown
              </h4>
              {breakdownEntries.map((item, idx) => (
                <BreakdownBar
                  key={item.label}
                  label={item.label}
                  score={item.score}
                  max={item.max}
                  index={idx}
                />
              ))}
            </div>
          </div>

          {/* Strengths */}
          {strengths.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                <CheckCircle size={14} className="text-emerald-500" />
                Strengths
              </h4>
              <div className="space-y-2">
                {strengths.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                    <span className="label-tag label-tag-emerald shrink-0 mt-0.5" style={{ fontSize: '10px', padding: '2px 6px' }}>
                      ✓
                    </span>
                    <span className="text-sm text-foreground/80">{s}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          {tips.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-500" />
                Improvement Tips
                <span className="label-tag label-tag-orange" style={{ fontSize: '10px' }}>
                  {tips.length} SUGGESTIONS
                </span>
              </h4>
              <div className="space-y-2">
                {tips.map((tip, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30 border border-muted hover:border-primary/20 transition-all">
                    <span className="text-lg shrink-0">{categoryIconMap[tip.category] || '💡'}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`label-tag label-tag-${priorityTagMap[tip.priority] || 'dark'}`} style={{ fontSize: '9px', padding: '1px 5px', fontWeight: 700, letterSpacing: '0.1em' }}>
                          {tip.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/80">{tip.tip}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}


// ──── Main Profile Component ────
export default function Profile() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState(user?.name || '');
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState(null);
  const [atsReport, setAtsReport] = useState(null);

  useEffect(() => {
    if (user?.skills) {
      setSkills(Array.isArray(user.skills) ? user.skills : []);
    }
  }, [user]);

  const handleUploadResume = async () => {
    if (!resumeFile) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);
      const res = await api.post('/profile/upload-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      const extracted = res.data.extractedSkills || [];
      setSkills(extracted);
      setExtractedSkills(res.data.skillCategories);
      setAtsReport(res.data.atsReport);
      updateUser({ ...user, skills: extracted, resumePath: res.data.user.resumePath });
      toast({
        title: "Resume Processed",
        description: `Successfully extracted ${extracted.length} skills and generated ATS report.`,
      });
      setResumeFile(null);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.error || 'Failed to upload resume.',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await api.put('/profile', { name, skills });
      updateUser(res.data.user);
      toast({
        title: "Profile Updated",
        description: "Your information has been saved successfully.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.error || 'Failed to update profile.',
      });
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    const skill = newSkill.trim().toLowerCase();
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setNewSkill('');
      toast({
        title: "Skill Added",
        description: `Added "${skill}" to your expertise.`,
      });
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
    toast({
      title: "Skill Removed",
      description: `Removed "${skillToRemove}" from your profile.`,
    });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  const skillTagVariants = ['primary', 'emerald', 'purple', 'orange', 'pink', 'cyan', 'red', 'dark'];
  const getSkillVariant = (index) => skillTagVariants[index % skillTagVariants.length];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
  };

  return (
    <div className="bg-muted/30 min-h-[calc(100vh-4rem)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">

          {/* Header */}
          <motion.div variants={itemVariants} className="mb-8">
            <div className="mb-3">
              <span className="label-tag label-tag-purple" style={{ fontSize: '11px', letterSpacing: '0.12em', fontWeight: 700 }}>
                PROFILE
              </span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Your Profile</h1>
            <p className="text-muted-foreground mt-1">Manage your resume, skills, and personal information</p>
          </motion.div>

          <div className="space-y-6">
            {/* Personal Info */}
            <motion.div variants={itemVariants}>
              <Card className="border-none shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <User size={20} className="text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Personal Information</CardTitle>
                      <CardDescription>Basic details about you</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground">Full Name</label>
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="John Doe"
                        className="bg-muted/30 border-none shadow-none focus-visible:ring-1"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground">Email Address</label>
                      <Input
                        type="email"
                        value={user?.email || ''}
                        disabled
                        className="bg-muted/50 border-none shadow-none cursor-not-allowed opacity-70"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Resume Upload */}
            <motion.div variants={itemVariants}>
              <Card className="border-none shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                      <FileText size={20} className="text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">Resume</CardTitle>
                      <CardDescription>
                        {user?.resumePath
                          ? <span>Last uploaded: <span className="label-tag label-tag-dark" style={{ fontSize: '10px', padding: '2px 6px' }}>{user.resumePath}</span></span>
                          : 'Upload your resume to auto-extract skills and get an ATS score'}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FileUpload
                    file={resumeFile}
                    onFileSelect={setResumeFile}
                    onClear={() => setResumeFile(null)}
                    uploading={uploading}
                  />

                  {resumeFile && (
                    <Button
                      onClick={handleUploadResume}
                      disabled={uploading}
                      className="w-full sm:w-auto shadow-md"
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing Resume...
                        </>
                      ) : (
                        <>
                          <Zap size={16} className="mr-2" />
                          Extract Skills & ATS Score
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* ★ ATS Score Card — appears after upload */}
            {atsReport && (
              <motion.div variants={itemVariants}>
                <ATSScoreCard report={atsReport} />
              </motion.div>
            )}

            {/* Extracted Skills Categories */}
            {extractedSkills && Object.keys(extractedSkills).length > 0 && (
              <motion.div variants={itemVariants}>
                <Card className="border-none shadow-sm bg-primary/[0.03] border border-primary/10">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles size={18} className="text-primary" />
                      Smart Skill Detection
                    </CardTitle>
                    <CardDescription>AI categorized the following skills from your resume</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(extractedSkills).map(([category, categorySkills], catIdx) => {
                        const catVariant = skillTagVariants[catIdx % skillTagVariants.length];
                        return (
                          <div key={category} className="bg-background/60 p-4 rounded-xl border border-primary/10">
                            <span className={`label-tag label-tag-${catVariant} mb-3 inline-block`} style={{ fontSize: '10px', letterSpacing: '0.1em', fontWeight: 700 }}>
                              {category.replace(/_/g, ' ').toUpperCase()}
                            </span>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {categorySkills.map((skill) => (
                                <span key={skill} className={`label-tag label-tag-${catVariant}`} style={{ fontSize: '12px' }}>
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Manual Skills */}
            <motion.div variants={itemVariants}>
              <Card className="border-none shadow-sm hover:shadow-md transition-all">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <Award size={20} className="text-emerald-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Skills & Expertise</CardTitle>
                        <span className="label-tag label-tag-emerald" style={{ fontSize: '11px', fontWeight: 700 }}>
                          {skills.length} SKILLS
                        </span>
                      </div>
                      <CardDescription>Add or remove skills to refine matches</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="e.g. React, Python, Cloud Architecture"
                      className="bg-muted/30 border-none shadow-none focus-visible:ring-1"
                    />
                    <Button onClick={addSkill} disabled={!newSkill.trim()} variant="secondary">
                      <Plus size={18} className="mr-1" />
                      Add
                    </Button>
                  </div>

                  {skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill, idx) => (
                        <span
                          key={skill}
                          className={`label-tag label-tag-${getSkillVariant(idx)} group`}
                          style={{ cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          {skill}
                          <button
                            onClick={() => removeSkill(skill)}
                            className="opacity-50 hover:opacity-100 transition-opacity"
                            style={{ lineHeight: 1 }}
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-muted/20 rounded-xl border border-dashed">
                      <p className="text-sm text-muted-foreground">
                        No skills defined yet. Use the input above or upload a resume.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Save button */}
            <motion.div variants={itemVariants} className="flex justify-end pt-4">
              <Button
                size="lg"
                onClick={handleSaveProfile}
                disabled={saving}
                className="px-10 font-bold shadow-lg hover:scale-105 active:scale-95 transition-all"
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2" />
                    Update Profile & Recommendations
                  </>
                )}
              </Button>
            </motion.div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
