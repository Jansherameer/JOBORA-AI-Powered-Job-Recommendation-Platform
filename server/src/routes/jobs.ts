import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, authMiddleware, adminMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// GET /api/jobs — List jobs with optional filters
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, experienceLevel, location, search, page = '1', limit = '20' } = req.query;

    const where: any = {};
    if (category) where.category = category as string;
    if (experienceLevel) where.experienceLevel = experienceLevel as string;
    if (location) where.location = { contains: location as string, mode: 'insensitive' };
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } },
        { company: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const pageNum = parseInt(page as string, 10) || 1;
    const pageSize = parseInt(limit as string, 10) || 20;

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        select: {
          id: true,
          title: true,
          company: true,
          description: true,
          location: true,
          category: true,
          experienceLevel: true,
          requiredSkills: true,
          applyLink: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        skip: (pageNum - 1) * pageSize,
        take: pageSize
      }),
      prisma.job.count({ where })
    ]);

    res.json({
      jobs,
      pagination: {
        page: pageNum,
        limit: pageSize,
        total,
        pages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    console.error('Jobs list error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/jobs/filters — Get available filter options
router.get('/filters', async (_req: Request, res: Response): Promise<void> => {
  try {
    const [categories, levels, locations] = await Promise.all([
      prisma.job.findMany({ distinct: ['category'], select: { category: true } }),
      prisma.job.findMany({ distinct: ['experienceLevel'], select: { experienceLevel: true } }),
      prisma.job.findMany({ distinct: ['location'], select: { location: true } })
    ]);

    res.json({
      categories: categories.map(c => c.category),
      experienceLevels: levels.map(l => l.experienceLevel),
      locations: locations.map(l => l.location)
    });
  } catch (error) {
    console.error('Filters error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/jobs/:id — Single job detail
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id as string, 10);
    const job = await prisma.job.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        company: true,
        description: true,
        location: true,
        category: true,
        experienceLevel: true,
        requiredSkills: true,
        applyLink: true,
        createdAt: true
      }
    });

    if (!job) {
      res.status(404).json({ error: 'Job not found.' });
      return;
    }

    res.json({ job });
  } catch (error) {
    console.error('Job detail error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/admin/jobs — Admin: create job
router.post(
  '/admin',
  authMiddleware,
  adminMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { title, company, description, location, category, experienceLevel, requiredSkills } = req.body;

      if (!title || !company || !description) {
        res.status(400).json({ error: 'Title, company, and description are required.' });
        return;
      }

      // Generate embedding for the job
      let embedding: number[] = [];
      try {
        const axios = (await import('axios')).default;
        const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
        const skillsText = Array.isArray(requiredSkills) ? requiredSkills.join(', ') : '';
        const textForEmbedding = `${title}. ${description}. Required skills: ${skillsText}`;

        const response = await axios.post(`${AI_SERVICE_URL}/generate-embedding`, {
          text: textForEmbedding
        });
        embedding = response.data.embedding;
      } catch (aiError) {
        console.error('AI service error:', aiError);
      }

      const job = await prisma.job.create({
        data: {
          title,
          company,
          description,
          location: location || 'Remote',
          category: category || 'General',
          experienceLevel: experienceLevel || 'Mid-Level',
          requiredSkills: requiredSkills || [],
          embedding
        }
      });

      res.status(201).json({ message: 'Job created.', job });
    } catch (error) {
      console.error('Create job error:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
);

// DELETE /api/jobs/admin/:id — Admin: delete job
router.delete(
  '/admin/:id',
  authMiddleware,
  adminMiddleware,
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const id = parseInt(req.params.id as string, 10);
      await prisma.job.delete({ where: { id } });
      res.json({ message: 'Job deleted.' });
    } catch (error) {
      console.error('Delete job error:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
);

// POST /api/jobs/admin/sync — Admin: manual sync premium jobs
router.post(
  '/admin/sync',
  authMiddleware,
  adminMiddleware,
  async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { RSSService } = await import('../services/rssService');
      const count = await RSSService.fetchAndSyncJobs();
      res.json({ message: `Successfully synced ${count} new premium jobs.` });
    } catch (error) {
      console.error('Manual sync error:', error);
      res.status(500).json({ error: 'Internal server error during sync.' });
    }
  }
);

export default router;
