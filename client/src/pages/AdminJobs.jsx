import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../lib/api';
import { Shield, Plus, Trash2, Briefcase, Loader2, Search, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

const CATEGORIES = [
  'Software Engineering', 'Data Science', 'DevOps',
  'Design', 'Product Management', 'Security'
];

const EXPERIENCE_LEVELS = ['Entry-Level', 'Mid-Level', 'Senior'];

export default function AdminJobs() {
  const { toast } = useToast();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '', company: '', description: '', location: '',
    category: 'Software Engineering', experienceLevel: 'Mid-Level',
    skillsInput: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await api.get('/jobs?limit=100');
      setJobs(res.data.jobs);
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load job listings."
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const requiredSkills = form.skillsInput
        .split(',')
        .map(s => s.trim().toLowerCase())
        .filter(Boolean);

      await api.post('/jobs/admin', {
        title: form.title,
        company: form.company,
        description: form.description,
        location: form.location || 'Remote',
        category: form.category,
        experienceLevel: form.experienceLevel,
        requiredSkills
      });

      toast({
        title: "Job Created",
        description: `Successfully posted "${form.title}" at ${form.company}.`,
      });
      setForm({
        title: '', company: '', description: '', location: '',
        category: 'Software Engineering', experienceLevel: 'Mid-Level',
        skillsInput: ''
      });
      setShowForm(false);
      fetchJobs();
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.error || 'Failed to create job posting.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/jobs/admin/${id}`);
      setJobs(jobs.filter(j => j.id !== id));
      toast({
        title: "Job Deleted",
        description: "The job listing has been permanently removed.",
      });
    } catch {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete job posting."
      });
    }
  };

  return (
    <div className="bg-muted/30 min-h-[calc(100vh-4rem)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Shield size={24} className="text-primary" />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Admin Command Center</h1>
              </div>
              <p className="text-muted-foreground mt-1 font-medium italic">Maintaining the professional opportunities marketplace</p>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="shadow-lg h-11 px-6 font-bold"
              variant={showForm ? "outline" : "default"}
            >
              {showForm ? (
                <>Cancel Operation</>
              ) : (
                <>
                  <Plus size={18} className="mr-2" />
                  Post New Opportunity
                </>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Add Job Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden mb-10"
            >
              <Card className="border-none shadow-xl border-t-4 border-t-primary">
                <CardHeader>
                  <CardTitle>Post New Job Opportunity</CardTitle>
                  <CardDescription>Enter details for the professional marketplace</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground">Job Title</label>
                        <Input
                          placeholder="Senior Software Engineer"
                          value={form.title}
                          onChange={e => setForm({ ...form, title: e.target.value })}
                          className="bg-muted/30 border-none shadow-none"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground">Company</label>
                        <Input
                          placeholder="Tech Corp"
                          value={form.company}
                          onChange={e => setForm({ ...form, company: e.target.value })}
                          className="bg-muted/30 border-none shadow-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground">Description</label>
                      <textarea
                        className="flex min-h-[120px] w-full rounded-md border-none bg-muted/30 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Detailed job description and requirements..."
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground">Location</label>
                        <Input
                          placeholder="Remote / City"
                          value={form.location}
                          onChange={e => setForm({ ...form, location: e.target.value })}
                          className="bg-muted/30 border-none shadow-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground">Category</label>
                        <select
                          className="flex h-10 w-full rounded-md border-none bg-muted/30 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          value={form.category}
                          onChange={e => setForm({ ...form, category: e.target.value })}
                        >
                          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-foreground">Level</label>
                        <select
                          className="flex h-10 w-full rounded-md border-none bg-muted/30 px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          value={form.experienceLevel}
                          onChange={e => setForm({ ...form, experienceLevel: e.target.value })}
                        >
                          {EXPERIENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-foreground flex items-center gap-2">
                        Required Skills (comma separated)
                        <Badge variant="secondary" className="text-[10px]">AI Matching Tags</Badge>
                      </label>
                      <Input
                        placeholder="React, Node.js, AWS..."
                        value={form.skillsInput}
                        onChange={e => setForm({ ...form, skillsInput: e.target.value })}
                        className="bg-muted/30 border-none shadow-none"
                        required
                      />
                    </div>

                    <div className="flex justify-end pt-4">
                      <Button type="submit" disabled={submitting} className="min-w-[200px] h-11 font-bold shadow-lg">
                        {submitting ? (
                          <>
                            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                            Processing Submission...
                          </>
                        ) : (
                          <>Publish Opportunity</>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Existing Jobs */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Briefcase size={20} className="text-primary" />
              Active Postings
              <Badge variant="outline" className="ml-2 bg-background">{jobs.length}</Badge>
            </h2>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-background/50 rounded-2xl border border-dashed">
              <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
              <p className="text-muted-foreground font-medium animate-pulse">Synchronizing database...</p>
            </div>
          ) : jobs.length === 0 ? (
            <Card className="text-center p-12 bg-background/50 border-dashed">
              <p className="text-muted-foreground font-medium">No active opportunities found. Start by posting one above.</p>
            </Card>
          ) : (
            <div className="grid gap-4">
              {jobs.map((job) => (
                <Card key={job.id} className="border-none shadow-sm hover:shadow-md transition-shadow group overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x border-muted">
                      <div className="p-6 flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge className="bg-primary/10 text-primary border-none hover:bg-primary/20">{job.category}</Badge>
                          <Badge variant="outline" className="text-[10px] uppercase tracking-tighter">{job.experienceLevel}</Badge>
                        </div>
                        <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{job.title}</h3>
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground font-medium">
                          <div className="flex items-center gap-1.5">
                            <Search size={14} className="text-primary/70" />
                            {job.company}
                          </div>
                          <div className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-primary/70" />
                            {job.location}
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-muted/20 md:w-64 flex flex-col justify-center gap-2">

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="w-full gap-2 shadow-sm font-bold"
                            >
                              <Trash2 size={14} />
                              Delete
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Confirm Deletion</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to permanently remove this job listing from the platform? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="gap-2 sm:gap-0">
                              <DialogClose asChild>
                                <Button variant="outline">
                                  Cancel
                                </Button>
                              </DialogClose>
                              <Button variant="destructive" onClick={() => handleDelete(job.id)}>
                                Delete Permanently
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
