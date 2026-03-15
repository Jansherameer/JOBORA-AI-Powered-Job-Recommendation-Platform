import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import JobCard from '../components/JobCard';
import { Search, Sparkles, Briefcase, TrendingUp, RefreshCw, Layers, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [totalJobs, setTotalJobs] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [allJobs, setAllJobs] = useState([]);
  const [filters, setFilters] = useState({ categories: [], experienceLevels: [], locations: [] });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [recLoading, setRecLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [jobsRes, filtersRes] = await Promise.all([
        api.get('/jobs?limit=50'),
        api.get('/jobs/filters')
      ]);
      setAllJobs(jobsRes.data.jobs);
      setTotalJobs(jobsRes.data.pagination.total);
      setFilters(filtersRes.data);

      try {
        const recRes = await api.get('/recommend?limit=15');
        setRecommendations(recRes.data.recommendations || []);
      } catch (recErr) {
        if (recErr.response?.data?.code === 'NO_EMBEDDING') {
          setRecommendations([]);
        }
      }
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load dashboard data."
      });
    } finally {
      setLoading(false);
    }
  };

  const refreshRecommendations = async () => {
    setRecLoading(true);
    try {
      const recRes = await api.get('/recommend?limit=15');
      setRecommendations(recRes.data.recommendations || []);
      toast({
        title: "Matches Updated",
        description: "Your job recommendations have been refreshed based on your latest profile.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Could not refresh recommendations at this time."
      });
    } finally {
      setRecLoading(false);
    }
  };

  const filteredJobs = allJobs.filter(job => {
    if (selectedCategory && job.category !== selectedCategory) return false;
    if (selectedLevel && job.experienceLevel !== selectedLevel) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q) ||
        job.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const userSkills = Array.isArray(user?.skills) ? user.skills : [];
  const hasSkills = userSkills.length > 0;

  // Progress Bar Logic
  const skillStrength = Math.min(100, (userSkills.length / 20) * 100);
  const matchPotential = recommendations.length > 0 ? Math.min(100, (recommendations.length / 10) * 100) : 0;
  const marketSize = totalJobs > 0 ? 100 : 0;

  return (
    <div className="bg-muted/30 min-h-[calc(100vh-4rem)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-8 gap-4">
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              Welcome back, <span className="text-primary">{user?.name}</span>
            </h1>
            <p className="text-muted-foreground mt-1 font-medium">
              {hasSkills
                ? `Personalized opportunities based on your skills`
                : 'Complete your profile to unlock AI recommendations'}
            </p>
          </motion.div>
          {hasSkills && (
            <Button
              variant="outline"
              size="sm"
              onClick={refreshRecommendations}
              disabled={recLoading}
              className="bg-background shadow-sm"
            >
              <RefreshCw size={14} className={`mr-2 ${recLoading ? 'animate-spin' : ''}`} />
              Update Matches
            </Button>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <Card className="border-none shadow-sm overflow-hidden group">
            <CardContent className="p-0">
              <div className="flex items-center p-5">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mr-4 group-hover:bg-primary/20 transition-colors">
                  <Layers size={22} className="text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{userSkills.length}</p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Expertise Areas</p>
                </div>
              </div>
              <div className="h-1 bg-primary/20 w-full">
                <div 
                  className="h-full bg-primary transition-all duration-1000" 
                  style={{ width: `${skillStrength}%` }} 
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm overflow-hidden group">
            <CardContent className="p-0">
              <div className="flex items-center p-5">
                <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center mr-4 group-hover:bg-green-200 transition-colors">
                  <TrendingUp size={22} className="text-green-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{recommendations.length}</p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Smart Matches</p>
                </div>
              </div>
              <div className="h-1 bg-green-100 w-full">
                <div 
                  className="h-full bg-green-600 transition-all duration-1000" 
                  style={{ width: `${matchPotential}%` }} 
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm overflow-hidden group sm:col-span-2 lg:col-span-1">
            <CardContent className="p-0">
              <div className="flex items-center p-5">
                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center mr-4 group-hover:bg-secondary/80 transition-colors">
                  <Briefcase size={22} className="text-secondary-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalJobs}</p>
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Open Positions</p>
                </div>
              </div>
              <div className="h-1 bg-secondary w-full">
                <div 
                  className="h-full bg-secondary-foreground/20 transition-all duration-1000" 
                  style={{ width: `${marketSize}%` }} 
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="recommended" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-muted/50 p-1 border">
              <TabsTrigger value="recommended" className="gap-2 rounded-md">
                <Sparkles size={14} />
                Recommended
              </TabsTrigger>
              <TabsTrigger value="all" className="gap-2 rounded-md">
                <LayoutGrid size={14} />
                Marketplace
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="recommended" className="mt-0 outline-none">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <RefreshCw className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground animate-pulse">Analyzing matches...</p>
              </div>
            ) : !hasSkills ? (
              <Card className="border-dashed bg-background/50 text-center p-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/5 flex items-center justify-center">
                  <Sparkles size={32} className="text-primary/40" />
                </div>
                <CardTitle className="mb-2">Find Your Prime Match</CardTitle>
                <p className="text-muted-foreground max-w-sm mx-auto mb-6">
                  We need to know your strengths to find the perfect role for you. Add skills or upload a resume.
                </p>
                <Button asChild>
                  <a href="/profile">Enhance Your Profile</a>
                </Button>
              </Card>
            ) : recommendations.length === 0 ? (
              <Card className="text-center p-12">
                <p className="text-muted-foreground">No matches found right now. Check back soon!</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {recommendations.map((rec, i) => (
                  <JobCard
                    key={rec.job.id}
                    job={rec.job}
                    matchScore={rec.matchScore}
                    matchedSkills={rec.matchedSkills}
                    index={i}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="all" className="mt-0 outline-none space-y-6">
            <Card className="border-none shadow-sm">
              <CardContent className="p-4 flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[240px]">
                  <Search size={16} className="absolute left-3 top-3 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Search roles, companies, or keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-muted/30 border-none shadow-none focus-visible:ring-1"
                  />
                </div>
                <div className="flex gap-2">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">All Categories</option>
                    {filters.categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">All Levels</option>
                    {filters.experienceLevels.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
              </CardContent>
            </Card>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <RefreshCw className="h-8 w-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading market data...</p>
              </div>
            ) : filteredJobs.length === 0 ? (
              <Card className="text-center p-12">
                <p className="text-muted-foreground">No jobs match your search criteria.</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredJobs.map((job, i) => (
                  <JobCard key={job.id} job={job} index={i} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
