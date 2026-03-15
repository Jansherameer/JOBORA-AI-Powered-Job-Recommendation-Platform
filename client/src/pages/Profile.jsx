import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import FileUpload from '../components/FileUpload';
import { User, Sparkles, X, Plus, FileText, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

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
      updateUser({ ...user, skills: extracted, resumePath: res.data.user.resumePath });
      toast({
        title: "Resume Processed",
        description: `Successfully extracted ${extracted.length} skills from your resume.`,
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

  return (
    <div className="bg-muted/30 min-h-[calc(100vh-4rem)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Your Profile</h1>
          <p className="text-muted-foreground mt-1 font-medium">Manage your resume, skills, and personal information</p>
        </motion.div>

        <div className="space-y-6">
          {/* Personal Info */}
          <Card className="border-none shadow-sm">
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

          {/* Resume Upload */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <FileText size={20} className="text-indigo-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Resume</CardTitle>
                  <CardDescription>
                    {user?.resumePath ? `Last uploaded: ${user.resumePath}` : 'Upload your resume to auto-extract skills'}
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
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles size={16} className="mr-2" />
                      Extract Skills from Resume
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Extracted Skills Categories */}
          {extractedSkills && Object.keys(extractedSkills).length > 0 && (
            <Card className="border-none shadow-sm bg-primary/5 border border-primary/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                   <Sparkles size={18} className="text-primary" />
                   Smart Skill Detection
                </CardTitle>
                <CardDescription>AI categorized the following skills from your resume</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(extractedSkills).map(([category, categorySkills]) => (
                    <div key={category} className="bg-background/60 p-4 rounded-xl border border-primary/10">
                      <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-3">
                        {category.replace(/_/g, ' ')}
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {categorySkills.map(skill => (
                          <Badge key={skill} variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                             {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Manual Skills */}
          <Card className="border-none shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
                  <Sparkles size={20} className="text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Skills & Expertise</CardTitle>
                    <Badge variant="outline" className="font-bold">{skills.length} skills</Badge>
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
                  {skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="px-3 py-1 gap-1 text-sm font-medium bg-secondary/50 group"
                    >
                      {skill}
                      <button
                        onClick={() => removeSkill(skill)}
                        className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </Badge>
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

          {/* Save button */}
          <div className="flex justify-end pt-4">
            <Button
              size="lg"
              onClick={handleSaveProfile}
              disabled={saving}
              className="px-10 font-bold shadow-lg"
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
          </div>
        </div>
      </div>
    </div>
  );
}
