import Parser from 'rss-parser';
import { PrismaClient } from '@prisma/client';
import axios from 'axios';

const prisma = new PrismaClient();

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
  static async fetchAndSyncJobs() {
    console.log('Starting premium job sync from multiple sources...');
    let allJobs: any[] = [];
    
    // 1. Fetch Remotive API (Software Dev jobs)
    try {
      const remotiveRes = await axios.get('https://remotive.com/api/remote-jobs?category=software-dev&limit=15');
      if (remotiveRes.data && remotiveRes.data.jobs) {
        const jobs = remotiveRes.data.jobs.slice(0, 15).map((job: any) => ({
          title: job.title || 'Software Engineer',
          company: job.company_name || 'Tech Company',
          description: job.description || 'Remote Software Engineering Role',
          location: job.candidate_required_location || 'Remote',
          category: 'Software Engineering',
          externalId: `remotive-${job.id}`,
          applyLink: job.url,
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        }));
        allJobs = [...allJobs, ...jobs];
        console.log(`Fetched ${jobs.length} jobs from Remotive API.`);
      }
    } catch (err) {
      console.error('Failed to fetch from Remotive API:', err);
    }

    // 2. Fetch WeWorkRemotely RSS
    try {
      const wwrFeed = await parser.parseURL('https://weworkremotely.com/categories/remote-back-end-programming-jobs.rss');
      const wwrJobs = wwrFeed.items.slice(0, 15).map((item: any) => ({
        // WWR title format is usually "Company: Job Title"
        title: item.title?.includes(': ') ? item.title.split(': ')[1] : item.title || 'Backend Engineer',
        company: item.title?.includes(': ') ? item.title.split(': ')[0] : 'WWR Partner',
        description: item.content || item.contentSnippet || '',
        location: 'Remote',
        category: 'Software Engineering',
        externalId: item.guid || item.link,
        applyLink: item.link,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }));
      allJobs = [...allJobs, ...wwrJobs];
      console.log(`Fetched ${wwrJobs.length} jobs from WeWorkRemotely RSS.`);
    } catch (err) {
      console.error('Failed to fetch from WeWorkRemotely RSS:', err);
    }
    
    // 3. Fetch Jobicy RSS (Original Source)
    try {
      const jobicyUrl = process.env.RSS_FEED_URL || 'https://jobicy.com/feed/job_feed';
      const jobicyFeed = await parser.parseURL(jobicyUrl);
      const jobicyJobs = jobicyFeed.items.slice(0, 15).map((item: any) => {
        const category = Array.isArray(item.categories) ? item.categories[0] : item.categories?.[0] || 'Remote';
        return {
          title: item.title || 'Untitled Role',
          company: item.company || item.author || 'Jobicy Partner',
          description: item['content:encoded'] || item.content || item.contentSnippet || '',
          location: item.jobLocation || 'Remote',
          category: category,
          externalId: item.guid || item.link,
          applyLink: item.link,
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        };
      });
      allJobs = [...allJobs, ...jobicyJobs];
      console.log(`Fetched ${jobicyJobs.length} jobs from Jobicy RSS.`);
    } catch (err) {
      console.error('Failed to fetch from Jobicy RSS:', err);
    }

    console.log(`Aggregated ${allJobs.length} potential jobs. Syncing to database...`);
    let newCount = 0;

    for (const jobData of allJobs) {
      if (!jobData.externalId || !jobData.title) continue;

      const existingJob = await prisma.job.findUnique({
        where: { externalId: jobData.externalId }
      });

      if (existingJob) continue;

      const job = await prisma.job.create({
        data: {
          title: jobData.title,
          company: jobData.company,
          description: jobData.description,
          location: jobData.location,
          category: jobData.category,
          experienceLevel: 'Mid-Level',
          requiredSkills: [],
          externalId: jobData.externalId,
          applyLink: jobData.applyLink,
          deadline: jobData.deadline
        }
      });
      newCount++;

      // Process AI Metadata (Skills & Embedding)
      try {
        const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
        
        // Use regex skill extractor in Python
        const skillsRes = await axios.post(`${AI_SERVICE_URL}/extract-skills`, {
          // Truncate description slightly for performance if it's massive HTML
          text: `${job.title}. ${job.description.slice(0, 2000)}` 
        });
        const extractedSkills = skillsRes.data.flat_skills || [];

        const skillsText = extractedSkills.join(', ');
        const textForEmbedding = `${job.title}. Required skills: ${skillsText}`;
        
        const embedRes = await axios.post(`${AI_SERVICE_URL}/generate-embedding`, {
          text: textForEmbedding
        });
        
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

    console.log(`Sync complete! Added ${newCount} new premium jobs.`);
    return newCount;
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
