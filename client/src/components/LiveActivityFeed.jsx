import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, UserPlus, FileText, CheckCircle2, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

export default function LiveActivityFeed() {
  const [activities, setActivities] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Use EventSource for Server-Sent Events
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
    const eventSource = new EventSource(`${baseURL}/profile/admin/live-activity?token=${token}`);

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.type === 'history') {
          setActivities(parsed.data);
        } else if (parsed.type === 'new_event') {
          setActivities((prev) => [parsed.data, ...prev].slice(0, 50));
        }
      } catch (err) {
        console.error('Failed to parse SSE data:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.error('EventSource failed:', err);
      setIsConnected(false);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case 'signup': return <UserPlus size={14} className="text-emerald-500" />;
      case 'profile_update': return <FileText size={14} className="text-blue-500" />;
      case 'job_match': return <CheckCircle2 size={14} className="text-purple-500" />;
      default: return <Zap size={14} className="text-orange-500" />;
    }
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <Card className="border-none shadow-sm flex flex-col h-[400px]">
      <CardHeader className="pb-3 border-b flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Activity size={18} className="text-primary" />
            Live Platform Activity
          </CardTitle>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            {isConnected && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
            <span className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
          </span>
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
            {isConnected ? 'Live' : 'Disconnected'}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-0 overflow-hidden flex-1 relative bg-gradient-to-b from-background to-muted/20">
        <div className="absolute inset-0 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {activities.length === 0 && isConnected ? (
            <div className="h-full flex items-center justify-center text-muted-foreground text-sm font-medium">
              Waiting for activity...
            </div>
          ) : (
            <AnimatePresence initial={false}>
              {activities.map((act) => (
                <motion.div
                  key={act.id}
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, type: 'spring', stiffness: 200 }}
                  className="flex items-start gap-3 p-3 bg-background rounded-xl border border-muted/50 shadow-sm"
                >
                  <div className="mt-0.5 p-2 bg-muted/50 rounded-full">
                    {getIcon(act.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{act.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{formatTime(act.timestamp)}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
          <div ref={endOfMessagesRef} />
        </div>
      </CardContent>
    </Card>
  );
}
