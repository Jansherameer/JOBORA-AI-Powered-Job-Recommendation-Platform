import cron from 'node-cron';
import { RSSService } from './rssService';

export function initScheduler() {
  console.log('Initializing background schedulers...');

  // Run RSS sync every day at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('Running daily RSS sync...');
    await RSSService.fetchAndSyncJobs();
  });

  // Run cleanup every day at 1:00 AM
  cron.schedule('0 1 * * *', async () => {
    console.log('Running daily expired job cleanup...');
    await RSSService.cleanupExpiredJobs();
  });

  // Initial run on startup (optional, let's do it for demonstration)
  // RSSService.fetchAndSyncJobs();
}
