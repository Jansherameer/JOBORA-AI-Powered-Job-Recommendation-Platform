import { Response } from 'express';

export type ActivityType = 'signup' | 'profile_update' | 'job_match' | 'system';

export interface ActivityEvent {
  id: string;
  message: string;
  type: ActivityType;
  timestamp: string;
  metadata?: any;
}

// Stores connected admin clients
let clients: Response[] = [];

// Stores the last 50 activities to hydrate newly connected clients
let recentActivities: ActivityEvent[] = [];

export const addClient = (res: Response) => {
  clients.push(res);
  
  // Send recent history to the newly connected client
  res.write(`data: ${JSON.stringify({ type: 'history', data: recentActivities })}\n\n`);

  // Remove client when connection closes
  res.on('close', () => {
    clients = clients.filter(client => client !== res);
  });
};

export const broadcastActivity = (message: string, type: ActivityType) => {
  const event: ActivityEvent = {
    id: Math.random().toString(36).substring(2, 10),
    message,
    type,
    timestamp: new Date().toISOString()
  };

  // Maintain short history window
  recentActivities.unshift(event);
  if (recentActivities.length > 50) {
    recentActivities.pop();
  }

  // Send to all connected admins
  const dataString = `data: ${JSON.stringify({ type: 'new_event', data: event })}\n\n`;
  clients.forEach(client => {
    try {
      client.write(dataString);
    } catch (err) {
      console.error('SSE broadcast error:', err);
    }
  });
};
