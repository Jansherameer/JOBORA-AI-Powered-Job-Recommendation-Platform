import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// GET /api/recommend — Get job recommendations for the authenticated user
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const topN = parseInt(req.query.limit as string, 10) || 10;

    // Get user with embedding
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, embedding: true, skills: true }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    if (!user.embedding || user.embedding.length === 0) {
      res.status(400).json({
        error: 'No resume or skills found. Upload a resume or add skills to get recommendations.',
        code: 'NO_EMBEDDING'
      });
      return;
    }

    // Get all jobs with embeddings
    const jobs = await prisma.job.findMany({
      where: {
        embedding: { isEmpty: false }
      },
      select: {
        id: true,
        title: true,
        company: true,
        description: true,
        location: true,
        category: true,
        experienceLevel: true,
        requiredSkills: true,
        embedding: true
      }
    });

    if (jobs.length === 0) {
      res.json({ recommendations: [], message: 'No jobs available yet.' });
      return;
    }

    // Call AI service for ranking
    try {
      const aiResponse = await axios.post(`${AI_SERVICE_URL}/recommend`, {
        user_embedding: user.embedding,
        jobs: jobs.map(j => ({ id: j.id, embedding: j.embedding })),
        top_n: topN
      });

      const rankings = aiResponse.data.recommendations;

      // Build response with full job data
      const recommendations = rankings.map((r: { id: number; score: number }) => {
        const job = jobs.find(j => j.id === r.id);
        if (!job) return null;

        // Compute skill overlap
        const userSkills = (Array.isArray(user.skills) ? user.skills : []) as string[];
        const jobSkills = (Array.isArray(job.requiredSkills) ? job.requiredSkills : []) as string[];
        const matchedSkills = userSkills.filter(s =>
          jobSkills.some(js => js.toLowerCase() === s.toLowerCase())
        );

        return {
          job: {
            id: job.id,
            title: job.title,
            company: job.company,
            description: job.description,
            location: job.location,
            category: job.category,
            experienceLevel: job.experienceLevel,
            requiredSkills: job.requiredSkills
          },
          matchScore: r.score,
          matchedSkills,
          totalUserSkills: userSkills.length,
          totalJobSkills: jobSkills.length
        };
      }).filter(Boolean);

      // Store recommendations in DB for analytics
      try {
        await prisma.recommendation.deleteMany({ where: { userId: user.id } });
        if (recommendations.length > 0) {
          await prisma.recommendation.createMany({
            data: recommendations.map((r: any) => ({
              userId: user.id,
              jobId: r.job.id,
              score: r.matchScore
            }))
          });
        }
      } catch (dbError) {
        console.error('Error storing recommendations:', dbError);
      }

      res.json({ recommendations });
    } catch (aiError) {
      console.error('AI service error:', aiError);
      res.status(503).json({ error: 'AI service unavailable. Please try again later.' });
    }
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
