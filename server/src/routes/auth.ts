import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { generateToken } from '../middleware/auth';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/email';
import { broadcastActivity } from '../services/activityStream';

const router = Router();
const prisma = new PrismaClient();

// Helper: generate a secure random token
function generateSecureToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// ──── POST /api/auth/signup ────
router.post('/signup', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ error: 'Name, email, and password are required.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters.' });
      return;
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(409).json({ error: 'Email already registered.' });
      return;
    }

    // Hash password & generate verification token
    const hashedPassword = await bcrypt.hash(password, 12);
    const verifyToken = generateSecureToken();

    // Create user
    const user = await prisma.user.create({
      data: { name, email, hashedPassword, verifyToken, isVerified: false },
      select: { id: true, name: true, email: true, role: true, isVerified: true, createdAt: true }
    });

    // Send verification email
    let emailPreview: string | null = null;
    try {
      emailPreview = await sendVerificationEmail(email, name, verifyToken);
    } catch (emailErr) {
      console.error('Failed to send verification email:', emailErr);
    }

    const token = generateToken(user.id, user.role);

    broadcastActivity(`New user signed up: ${user.name}`, 'signup');

    res.status(201).json({
      message: 'Account created. Please check your email to verify your account.',
      user,
      token,
      emailPreview // Only present when using Ethereal in dev
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ──── GET /api/auth/verify-email?token=xxx ────
router.get('/verify-email', async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      res.status(400).json({ error: 'Verification token is required.' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { verifyToken: token } });
    if (!user) {
      res.status(400).json({ error: 'Invalid or expired verification token.' });
      return;
    }

    if (user.isVerified) {
      res.json({ message: 'Email already verified.', alreadyVerified: true });
      return;
    }

    // Mark as verified and clear token
    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verifyToken: null }
    });

    res.json({ message: 'Email verified successfully! You can now log in.', verified: true });
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ──── POST /api/auth/resend-verification ────
router.post('/resend-verification', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Email is required.' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal whether email exists
      res.json({ message: 'If the email is registered, a verification link has been sent.' });
      return;
    }

    if (user.isVerified) {
      res.json({ message: 'Email is already verified.' });
      return;
    }

    const verifyToken = generateSecureToken();
    await prisma.user.update({
      where: { id: user.id },
      data: { verifyToken }
    });

    let emailPreview: string | null = null;
    try {
      emailPreview = await sendVerificationEmail(email, user.name, verifyToken);
    } catch (emailErr) {
      console.error('Failed to resend verification:', emailErr);
    }

    res.json({
      message: 'If the email is registered, a verification link has been sent.',
      emailPreview
    });
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ──── POST /api/auth/forgot-password ────
router.post('/forgot-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Email is required.' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal whether email exists (security)
      res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
      return;
    }

    // Generate reset token with 1-hour expiry
    const resetToken = generateSecureToken();
    const resetTokenExp = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken, resetTokenExp }
    });

    let emailPreview: string | null = null;
    try {
      emailPreview = await sendPasswordResetEmail(email, user.name, resetToken);
    } catch (emailErr) {
      console.error('Failed to send reset email:', emailErr);
    }

    res.json({
      message: 'If an account with that email exists, a reset link has been sent.',
      emailPreview
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ──── POST /api/auth/reset-password ────
router.post('/reset-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      res.status(400).json({ error: 'Reset token and new password are required.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters.' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { resetToken: token } });
    if (!user) {
      res.status(400).json({ error: 'Invalid or expired reset token.' });
      return;
    }

    // Check token expiry
    if (!user.resetTokenExp || new Date() > user.resetTokenExp) {
      // Clear expired token
      await prisma.user.update({
        where: { id: user.id },
        data: { resetToken: null, resetTokenExp: null }
      });
      res.status(400).json({ error: 'Reset token has expired. Please request a new one.' });
      return;
    }

    // Hash new password and clear reset token
    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { id: user.id },
      data: { hashedPassword, resetToken: null, resetTokenExp: null }
    });

    res.json({ message: 'Password reset successfully! You can now log in with your new password.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ──── POST /api/auth/login ────
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Email and password are required.' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.hashedPassword);
    if (!isValidPassword) {
      res.status(401).json({ error: 'Invalid email or password.' });
      return;
    }

    // Check if account is verified
    if (!user.isVerified) {
      res.status(403).json({
        error: 'Please verify your email before logging in.',
        needsVerification: true,
        email: user.email
      });
      return;
    }

    const token = generateToken(user.id, user.role);

    res.json({
      message: 'Login successful.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified
      },
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ──── GET /api/auth/me ────
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
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
        isVerified: true,
        createdAt: true
      }
    });

    if (!user) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    res.json({ user });
  } catch (error) {
    console.error('Auth me error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

export default router;
