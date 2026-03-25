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

// GET /api/recommend/cover-letter-guide/:jobId
router.get('/cover-letter-guide/:jobId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const jobIdParam = req.params.jobId as string;
    const jobId = parseInt(jobIdParam, 10);
    if (isNaN(jobId)) {
      res.status(400).json({ error: 'Invalid job ID' });
      return;
    }

    // Get User Skills
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { skills: true }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Get Job Details
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { title: true, company: true, requiredSkills: true }
    });

    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }

    const userSkills = (Array.isArray(user.skills) ? user.skills : []) as string[];
    const jobSkills = (Array.isArray(job.requiredSkills) ? job.requiredSkills : []) as string[];

    const matchedSkills = jobSkills.filter(js => 
      userSkills.some(us => us.toLowerCase() === js.toLowerCase())
    );
    const missingSkills = jobSkills.filter(js => 
      !userSkills.some(us => us.toLowerCase() === js.toLowerCase())
    );

    const prompt = `Act as an expert career coach and cover letter writer.
I am applying for the ${job.title} position at ${job.company}.
Please write a compelling, professional cover letter for me highlighting my strengths.

Here are my relevant skills that match the job requirements:
${matchedSkills.length > 0 ? matchedSkills.map(s => '- ' + s).join('\n') : '- I am a fast learner with transferable skills.'}

${missingSkills.length > 0 ? `Here are some job requirements I am currently working on. Please brilliantly frame my adaptability and eagerness to learn these skills:\n${missingSkills.slice(0, 5).map(s => '- ' + s).join('\n')}` : ''}

Keep the tone confident, concise, and focused on the value I can bring to ${job.company}.`;

    res.json({
      prompt,
      matchedSkills,
      missingSkills,
      jobDetails: {
        title: job.title,
        company: job.company
      }
    });

  } catch (error) {
    console.error('Cover letter guide error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/recommend/interview-prep/:jobId
router.get('/interview-prep/:jobId', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const jobIdParam = req.params.jobId as string;
    const jobId = parseInt(jobIdParam, 10);
    if (isNaN(jobId)) {
      res.status(400).json({ error: 'Invalid job ID' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { skills: true }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const job = await prisma.job.findUnique({
      where: { id: jobId },
      select: { title: true, company: true, requiredSkills: true }
    });

    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }

    const userSkills = (Array.isArray(user.skills) ? user.skills : []) as string[];
    const jobSkills = (Array.isArray(job.requiredSkills) ? job.requiredSkills : []) as string[];

    const missingSkills = jobSkills.filter(js => 
      !userSkills.some(us => us.toLowerCase() === js.toLowerCase())
    );

    const prompt = `Act as an expert Technical Recruiter and Hiring Manager for ${job.company}.
I am applying for the ${job.title} position and I want you to conduct a tough, realistic mock interview with me.

Here is the twist: I want you to FOCUS your questions heavily on my areas of weakness to help me prepare for the hardest part of the interview. 
Based on the job description, I am currently missing or weak in these required skills:
${missingSkills.length > 0 ? missingSkills.map(s => '- ' + s).join('\n') : '- (Actually, I have all the listed skills! Just grill me on advanced concepts for this role).'}

Please generate 5 tough interview questions. For each question:
1. Ask the question.
2. Provide a brief "Recruiter's Expectation" (what a good answer looks like).
3. Give me a strategy on how to pivot the question positively if I lack direct experience in it.

Keep it highly professional and actionable!`;

    res.json({
      prompt,
      missingSkills,
      jobDetails: {
        title: job.title,
        company: job.company
      }
    });

  } catch (error) {
    console.error('Interview prep error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/recommend/employer/find-candidates
router.post('/employer/find-candidates', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { query } = req.body;
    if (!query) {
      res.status(400).json({ error: 'Search query is required' });
      return;
    }

    if (req.userRole !== 'employer' && req.userRole !== 'admin') {
      res.status(403).json({ error: 'Employer or Admin access required' });
      return;
    }

    // 1. Generate embedding for Employer query
    const embedRes = await axios.post(`${AI_SERVICE_URL}/generate-embedding`, { text: query });
    const queryEmbedding = embedRes.data.embedding;

    // 2. Fetch active job seekers
    const users = await prisma.user.findMany({
      where: { role: 'user' }
    });

    // Filter users that actually have a parsed resume embedding
    const validUsers = users.filter(u => Array.isArray(u.embedding) && u.embedding.length > 0);

    if (validUsers.length === 0) {
      res.json({ candidates: [] });
      return;
    }

    // 3. Send to Python recommendation engine (disguising users as jobs)
    const candidateData = validUsers.map(u => ({ id: u.id, embedding: u.embedding }));

    const aiRes = await axios.post(`${AI_SERVICE_URL}/recommend`, {
      user_embedding: queryEmbedding,
      jobs: candidateData,
      top_n: 5
    });

    const recommendations = aiRes.data.recommendations || [];

    // 4. Hydrate candidates with full data and generate the outreach prompt
    const enhancedCandidates = recommendations.map((rec: any) => {
      const user = validUsers.find(u => u.id === rec.id);
      
      const missingPrompt = `Act as an expert technical recruiter hiring for this specific project or issue:
"${query}"

I found a candidate named ${user?.name} (Email: ${user?.email}).
Here is a summary of their exact tracked skills from their resume:
${(user?.skills as string[])?.join(', ')}

Please draft a highly personalized, compelling, and professional cold-outreach email to this candidate.
The email should pitch the project to them, explain briefly why their specific skills stood out to me as a mathematical match, and invite them to an introductory interview.`;

      return {
        id: user?.id,
        name: user?.name,
        email: user?.email,
        skills: user?.skills,
        matchScore: rec.score,
        outreachPrompt: missingPrompt
      };
    });

    res.json({ candidates: enhancedCandidates });

  } catch (error) {
    console.error('Employer candidate search error:', error);
    res.status(500).json({ error: 'Failed to search candidates' });
  }
});

export default router;
