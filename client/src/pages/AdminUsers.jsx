import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../lib/api';
import { Shield, Users, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

export default function AdminUsers() {
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/profile/admin/users');
      setUsers(res.data.users);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err.response?.data?.error || "Failed to load user list."
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
                <Users size={32} className="text-primary" />
                Registered Users
              </h1>
              <p className="text-muted-foreground mt-1">Overview of everyone who has created an account on the platform</p>
            </div>
          </motion.div>

          {/* Users List */}
          <div className="space-y-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-background/50 rounded-2xl border border-dashed">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground font-medium animate-pulse">Loading users database...</p>
              </div>
            ) : users.length === 0 ? (
              <Card className="text-center p-12 bg-background/50 border-dashed">
                <p className="text-muted-foreground font-medium">No users found.</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {users.map((u) => (
                  <motion.div key={u.id} variants={itemVariants}>
                    <Card className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden">
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${u.role === 'admin' ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                              {u.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <h3 className="text-lg font-bold group-hover:text-primary transition-colors flex items-center gap-2">
                                {u.name}
                                {u.role === 'admin' && (
                                  <span className="label-tag label-tag-red" style={{ fontSize: '10px' }}>ADMIN</span>
                                )}
                              </h3>
                              <p className="text-sm text-muted-foreground font-medium">{u.email}</p>
                            </div>
                          </div>
                          
                          <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/40">
                                {u.isVerified ? (
                                    <><CheckCircle2 size={16} className="text-emerald-500" /> <span className="text-emerald-600 dark:text-emerald-400">Verified</span></>
                                ) : (
                                    <><XCircle size={16} className="text-orange-500" /> <span className="text-orange-600 dark:text-orange-400">Unverified</span></>
                                )}
                            </div>
                            <div className="text-muted-foreground bg-background px-3 py-1.5 rounded-md border">
                                Joined: {new Date(u.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

        </motion.div>
      </div>
    </div>
  );
}
