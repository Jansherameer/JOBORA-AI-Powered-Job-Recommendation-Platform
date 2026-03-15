import Parser from 'rss-parser';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

// Configure parser with custom fields for Jobicy
const parser = new Parser({
  customFields: {
    item: [
      ['job_listing:company', 'company'],
      ['job_listing:job_location', 'jobLocation'],
      ['job_listing:job_type', 'jobType'],
    ],
  }
});

export class RSSService {
  private static RSS_FEED_URL = process.env.RSS_FEED_URL || 'https://jobicy.com/feed/job_feed';

  static async fetchAndSyncJobs() {
    console.log(`Starting RSS job sync from: ${this.RSS_FEED_URL}`);
    try {
      const feed = await parser.parseURL(this.RSS_FEED_URL);
      console.log(`Fetched ${feed.items.length} jobs from RSS.`);

      let newCount = 0;
      for (const item of feed.items) {
        const externalId = item.guid || item.link;
        if (!externalId) continue;

        // Check if job already exists
        const existingJob = await prisma.job.findUnique({
          where: { externalId }
        });

        if (existingJob) continue;

        // Map categories to a string
        const category = Array.isArray(item.categories) ? item.categories[0] : (item as any).categories?.[0] || 'Remote';
        
        // Clean description (remove HTML if necessary, but we'll keep it for rich display)
        const description = (item as any)['content:encoded'] || item.content || item.contentSnippet || '';

        // Create new job
        const job = await prisma.job.create({
          data: {
            title: item.title || 'Untitled Role',
            company: (item as any).company || (item as any).author || 'Jobicy Partner',
            description,
            location: (item as any).jobLocation || 'Remote',
            category: category || 'Software Engineering',
            experienceLevel: 'Mid-Level', // Default
            requiredSkills: [],
            externalId,
            applyLink: item.link,
            deadline: item.isoDate ? new Date(new Date(item.isoDate).getTime() + 30 * 24 * 60 * 60 * 1000) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          }
        });

        newCount++;

        // Process AI metadata (Skills & Embedding)
        try {
          const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
          
          // 1. Extract Skills
          const skillsRes = await axios.post(`${AI_SERVICE_URL}/extract-skills`, {
            text: `${job.title}. ${job.description}`
          });
          const extractedSkills = skillsRes.data.flat_skills || [];

          // 2. Generate Embedding
          // Match the logic in jobs.ts for consistency
          const skillsText = extractedSkills.join(', ');
          const textForEmbedding = `${job.title}. ${job.description}. Required skills: ${skillsText}`;
          
          const embedRes = await axios.post(`${AI_SERVICE_URL}/generate-embedding`, {
            text: textForEmbedding
          });
          
          // 3. Update Job
          await prisma.job.update({
            where: { id: job.id },
            data: {
              requiredSkills: extractedSkills,
              embedding: embedRes.data.embedding
            }
          });

        } catch (aiError) {
          console.error(`AI processing failed for job ${job.id}:`, aiError);
        }
      }

      console.log(`RSS job sync completed. Added ${newCount} new jobs.`);
      return newCount;
    } catch (error) {
      console.error('Error during RSS job sync:', error);
      throw error;
    }
  }

  static async cleanupExpiredJobs() {
    console.log('Starting cleanup of expired jobs...');
    try {
      const now = new Date();
      const result = await prisma.job.deleteMany({
        where: {
          deadline: {
            lt: now
          }
        }
      });
      console.log(`Deleted ${result.count} expired jobs.`);
      return result.count;
    } catch (error) {
      console.error('Error during job cleanup:', error);
      throw error;
    }
  }
}
