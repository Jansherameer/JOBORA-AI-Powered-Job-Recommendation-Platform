import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// Configure multer for resume uploads
const uploadDir = path.resolve(process.env.UPLOAD_DIR || './uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `resume-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['.pdf', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOCX files are allowed.'));
    }
  }
});

// GET /api/profile
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        skills: true,
        resumePath: true,
        createdAt: true,
        updatedAt: true
      }
    });
    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }
    res.json({ user });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// PUT /api/profile
router.put('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, skills } = req.body;
    const updateData: any = {};

    if (name) updateData.name = name;

    if (skills && Array.isArray(skills)) {
      updateData.skills = skills;

      // Generate embedding from skills text
      try {
        const skillsText = skills.join(', ');
        const embeddingResponse = await axios.post(`${AI_SERVICE_URL}/generate-embedding`, {
          text: skillsText
        });
        updateData.embedding = embeddingResponse.data.embedding;
      } catch (aiError) {
        console.error('AI service error (embedding):', aiError);
        // Continue without updating embedding
      }
    }

    const user = await prisma.user.update({
      where: { id: req.userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        skills: true,
        resumePath: true,
        updatedAt: true
      }
    });

    res.json({ message: 'Profile updated.', user });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// POST /api/profile/upload-resume
router.post(
  '/upload-resume',
  authMiddleware,
  upload.single('resume'),
  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded.' });
        return;
      }

      const filePath = req.file.path;
      const fileName = req.file.filename;

      // Send to AI service for parsing
      const FormData = (await import('form-data')).default;
      const formData = new FormData();
      formData.append('file', fs.createReadStream(filePath), {
        filename: req.file.originalname,
        contentType: req.file.mimetype
      });

      let parsedData: any = null;
      try {
        const aiResponse = await axios.post(
          `${AI_SERVICE_URL}/parse-resume`,
          formData,
          { headers: formData.getHeaders() }
        );
        parsedData = aiResponse.data;
      } catch (aiError) {
        console.error('AI service error (parse):', aiError);
        // Continue even if AI service is down
      }

      // ATS Analysis
      let atsReport: any = null;
      try {
        const atsFormData = new FormData();
        atsFormData.append('file', fs.createReadStream(filePath), {
          filename: req.file.originalname,
          contentType: req.file.mimetype
        });
        const atsResponse = await axios.post(
          `${AI_SERVICE_URL}/analyze-resume`,
          atsFormData,
          { headers: atsFormData.getHeaders() }
        );
        atsReport = atsResponse.data;
      } catch (atsError) {
        console.error('AI service error (ATS analysis):', atsError);
        // Continue even if ATS analysis fails
      }

      // Update user record
      const updateData: any = {
        resumePath: fileName
      };

      if (parsedData) {
        updateData.resumeText = parsedData.text;
        updateData.skills = parsedData.flat_skills;
        updateData.embedding = parsedData.embedding;
      }

      const user = await prisma.user.update({
        where: { id: req.userId },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          skills: true,
          resumePath: true
        }
      });

      res.json({
        message: 'Resume uploaded and processed.',
        user,
        extractedSkills: parsedData?.flat_skills || [],
        skillCategories: parsedData?.skills || {},
        atsReport
      });
    } catch (error) {
      console.error('Resume upload error:', error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
);

// GET /api/profile/admin/users
router.get('/admin/users', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const requestUser = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!requestUser || requestUser.role !== 'admin') {
      res.status(403).json({ error: 'Forbidden. Admin access required.' });
      return;
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ users });
  } catch (error) {
    console.error('Admin fetch users error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// GET /api/profile/admin/analytics
router.get('/admin/analytics', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const requestUser = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!requestUser || requestUser.role !== 'admin') {
      res.status(403).json({ error: 'Forbidden. Admin access required.' });
      return;
    }

    // 1. Overview Stats
    const totalUsers = await prisma.user.count();
    const totalJobs = await prisma.job.count();
    const totalRecommendations = await prisma.recommendation.count();

    // 2. User Growth (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentUsers = await prisma.user.findMany({
      where: { createdAt: { gte: thirtyDaysAgo } },
      select: { createdAt: true },
      orderBy: { createdAt: 'asc' }
    });

    // Group by date (YYYY-MM-DD)
    const growthMap: Record<string, number> = {};
    recentUsers.forEach(u => {
      const dateStr = u.createdAt.toISOString().split('T')[0];
      growthMap[dateStr] = (growthMap[dateStr] || 0) + 1;
    });

    // Convert to array format for Recharts
    const userGrowth = Object.entries(growthMap).map(([date, count]) => ({
      date,
      count
    }));

    // 3. Top Skills
    const usersWithSkills = await prisma.user.findMany({
      select: { skills: true }
    });

    const skillCounts: Record<string, number> = {};
    usersWithSkills.forEach(u => {
      const skills = u.skills as string[];
      if (Array.isArray(skills)) {
        skills.forEach(skill => {
          // Normalize skill name (lowercase, trim)
          const normalized = skill.trim().toLowerCase();
          if (normalized) {
            skillCounts[normalized] = (skillCounts[normalized] || 0) + 1;
          }
        });
      }
    });

    const topSkills = Object.entries(skillCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
        count
      }));

    res.json({
      overview: { totalUsers, totalJobs, totalRecommendations },
      userGrowth,
      topSkills
    });
  } catch (error) {
    console.error('Admin analytics error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
