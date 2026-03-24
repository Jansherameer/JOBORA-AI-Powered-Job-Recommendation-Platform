/**
 * Email Service
 * Handles sending verification and password-reset emails via nodemailer.
 * Uses Ethereal (fake SMTP) in development and real SMTP in production.
 */
import nodemailer from 'nodemailer';

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Create reusable transporter
let transporter: nodemailer.Transporter;

async function getTransporter(): Promise<nodemailer.Transporter> {
  if (transporter) return transporter;

  // Check if real SMTP credentials are provided
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  } else {
    // Use Ethereal for development (catches emails without sending)
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log('📧 Using Ethereal test email. Preview at: https://ethereal.email');
    console.log(`   User: ${testAccount.user}`);
  }

  return transporter;
}

export async function sendVerificationEmail(email: string, name: string, token: string): Promise<string | null> {
  const transport = await getTransporter();
  const verifyUrl = `${CLIENT_URL}/verify-email?token=${token}`;

  const info = await transport.sendMail({
    from: '"Jobora" <noreply@jobora.dev>',
    to: email,
    subject: 'Verify Your Jobora Account',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 40px 20px;">
        <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a1a2e; font-size: 28px; margin: 0;">Jobora</h1>
            <p style="color: #64748b; margin-top: 4px;">AI-Powered Job Matching</p>
          </div>
          <h2 style="color: #1a1a2e; font-size: 20px;">Welcome, ${name}! 👋</h2>
          <p style="color: #475569; font-size: 15px; line-height: 1.6;">
            Thanks for signing up. Please verify your email address to activate your account and start receiving AI-powered job recommendations.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyUrl}" style="background: #4361ee; color: white; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #94a3b8; font-size: 13px; text-align: center;">
            Or copy this link: <br/>
            <a href="${verifyUrl}" style="color: #4361ee; word-break: break-all;">${verifyUrl}</a>
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">
            If you didn't create a Jobora account, you can safely ignore this email.
          </p>
        </div>
      </div>
    `,
  });

  // Return preview URL for Ethereal (dev only)
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`📧 Verification email preview: ${previewUrl}`);
  }
  return previewUrl ? previewUrl.toString() : null;
}

export async function sendPasswordResetEmail(email: string, name: string, token: string): Promise<string | null> {
  const transport = await getTransporter();
  const resetUrl = `${CLIENT_URL}/reset-password?token=${token}`;

  const info = await transport.sendMail({
    from: '"Jobora" <noreply@jobora.dev>',
    to: email,
    subject: 'Reset Your Jobora Password',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 40px 20px;">
        <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1a1a2e; font-size: 28px; margin: 0;">Jobora</h1>
            <p style="color: #64748b; margin-top: 4px;">Password Reset</p>
          </div>
          <h2 style="color: #1a1a2e; font-size: 20px;">Hi ${name},</h2>
          <p style="color: #475569; font-size: 15px; line-height: 1.6;">
            We received a request to reset your password. Click the button below to create a new password. This link expires in <strong>1 hour</strong>.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background: #ef4444; color: white; text-decoration: none; padding: 14px 36px; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #94a3b8; font-size: 13px; text-align: center;">
            Or copy this link: <br/>
            <a href="${resetUrl}" style="color: #ef4444; word-break: break-all;">${resetUrl}</a>
          </p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
          <p style="color: #94a3b8; font-size: 12px; text-align: center;">
            If you didn't request a password reset, just ignore this email. Your password won't be changed.
          </p>
        </div>
      </div>
    `,
  });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`📧 Password reset email preview: ${previewUrl}`);
  }
  return previewUrl ? previewUrl.toString() : null;
}
