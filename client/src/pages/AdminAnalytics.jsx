import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../lib/api';
import { Shield, BarChart3, Users, Briefcase, GitPullRequest, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

export default function AdminAnalytics() {
  const { toast } = useToast();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await api.get('/profile/admin/analytics');
      setData(res.data);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.error || "Failed to load analytics data."
      });
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
  };

  if (loading) {
    return (
      <div className="bg-muted/30 min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading analytics dashboard...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-muted/30 min-h-[calc(100vh-4rem)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <motion.div variants={containerVariants} initial="hidden" animate="visible">

          {/* Header */}
          <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div>
              <div className="mb-3">
                <span className="label-tag label-tag-purple" style={{ fontSize: '11px', letterSpacing: '0.12em', fontWeight: 700 }}>
                  <Shield size={11} className="inline mr-1 -mt-0.5" />
                  ADMIN PANEL
                </span>
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
                <BarChart3 size={32} className="text-primary" />
                Platform Analytics
              </h1>
              <p className="text-muted-foreground mt-1">Overview of system health, user growth, and top skills.</p>
            </div>
          </motion.div>

          {/* Summary Stats */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card className="border-none shadow-sm h-full">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full mb-4">
                  <Users size={28} />
                </div>
                <div className="text-4xl font-extrabold text-foreground mb-1">{data.overview.totalUsers}</div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Total Users</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm h-full">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full mb-4">
                  <Briefcase size={28} />
                </div>
                <div className="text-4xl font-extrabold text-foreground mb-1">{data.overview.totalJobs}</div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Total Jobs</p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm h-full">
              <CardContent className="p-6 flex flex-col items-center justify-center text-center">
                <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full mb-4">
                  <GitPullRequest size={28} />
                </div>
                <div className="text-4xl font-extrabold text-foreground mb-1">{data.overview.totalRecommendations}</div>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Matches Generated</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:h-[450px]">
            {/* User Growth Line Chart */}
            <motion.div variants={itemVariants} className="h-full">
              <Card className="border-none shadow-sm h-full flex flex-col">
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>New registrations over the last 30 days</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 min-h-[300px]">
                  {data.userGrowth && data.userGrowth.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={data.userGrowth} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="date" tick={{fontSize: 12}} tickFormatter={(val) => val.split('-').slice(1).join('/')} />
                        <YAxis tick={{fontSize: 12}} allowDecimals={false} />
                        <Tooltip />
                        <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No recent signups.</div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Skills Bar Chart */}
            <motion.div variants={itemVariants} className="h-full">
              <Card className="border-none shadow-sm h-full flex flex-col">
                <CardHeader>
                  <CardTitle>Top Extracted Skills</CardTitle>
                  <CardDescription>Most frequent skills detected in resumes</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 min-h-[300px]">
                  {data.topSkills && data.topSkills.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart layout="vertical" data={data.topSkills} margin={{ top: 10, right: 30, left: 40, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={false} />
                        <XAxis type="number" tick={{fontSize: 12}} allowDecimals={false} />
                        <YAxis dataKey="name" type="category" tick={{fontSize: 12}} width={100} />
                        <Tooltip cursor={{fill: 'var(--muted)', opacity: 0.4}} />
                        <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No skills found yet.</div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
