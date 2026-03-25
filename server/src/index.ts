import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import jobRoutes from './routes/jobs';
import recommendRoutes from './routes/recommend';
import { initScheduler } from './services/scheduler';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.resolve('./uploads')));

// Rate Limiting
const generalLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,   // 1 minute
  max: 100,                    // 100 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests. Please try again in a minute.' }
});

const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,   // 1 minute
  max: 5,                     // 5 auth attempts per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please wait 1 minute before trying again.' }
});

// Apply rate limiters
app.use('/api', generalLimiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);
app.use('/api/auth/forgot-password', authLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/recommend', recommendRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'job-platform-api', timestamp: new Date().toISOString() });
});

// Global error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Something went wrong.' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📋 API docs: http://localhost:${PORT}/api/health`);
  initScheduler();
});

export default app;
