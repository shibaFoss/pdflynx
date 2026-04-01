import pLimit from 'p-limit';
import { logger } from '../utils/logger.js';

export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface Job {
  id: string;
  status: JobStatus;
  progress: number;
  result?: {
    outputPath: string;
    filename: string;
  };
  error?: string;
  createdAt: number;
}

/**
 * JobService manages the asynchronous processing queue.
 * It prevents the server from crashing by limiting concurrent heavy tasks.
 */
class JobService {
  private jobs = new Map<string, Job>();
  
  // Limit to 2 concurrent heavy PDF processes to keep the server responsive.
  private limit = pLimit(2);
  
  // Track the order of queued jobs to calculate "position in line"
  private queue: string[] = [];

  /**
   * Register a new job in the system.
   */
  createJob(jobId: string): Job {
    const job: Job = {
      id: jobId,
      status: 'queued',
      progress: 0,
      createdAt: Date.now(),
    };
    this.jobs.set(jobId, job);
    this.queue.push(jobId);
    
    logger.info(`📝 Job created: ${jobId}. Total in queue: ${this.queue.length}`);
    return job;
  }

  /**
   * Execute a task within the concurrency limit.
   */
  async runJob(jobId: string, task: () => Promise<any>) {
    const job = this.jobs.get(jobId);
    if (!job) return;

    return this.limit(async () => {
      try {
        // Update status to processing
        job.status = 'processing';
        job.progress = 10;
        // Remove from the pending queue as it's now active
        this.queue = this.queue.filter(id => id !== jobId);
        
        logger.info(`⚙️ Processing job: ${jobId}`);
        
        const result = await task();
        
        job.status = 'completed';
        job.progress = 100;
        job.result = result;
        
        logger.info(`✅ Job completed: ${jobId}`);
      } catch (err: any) {
        job.status = 'failed';
        job.error = err.message;
        logger.error(`❌ Job failed [${jobId}]: ${err.message}`);
      }
    });
  }

  /**
   * Get the current status and position of a job.
   */
  getJobStatus(jobId: string) {
    const job = this.jobs.get(jobId);
    if (!job) return null;

    // Calculate position if still queued
    let position = -1;
    if (job.status === 'queued') {
      position = this.queue.indexOf(jobId) + 1;
    }

    return {
      ...job,
      position,
      queueLength: this.queue.length,
    };
  }

  /**
   * Remove a job from memory (after download or failure).
   */
  deleteJob(jobId: string) {
    this.jobs.delete(jobId);
    this.queue = this.queue.filter(id => id !== jobId);
  }

  /**
   * Cleanup old jobs that were never downloaded (e.g. older than 1 hour).
   */
  cleanupOldJobs() {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    
    for (const [id, job] of this.jobs.entries()) {
      if (now - job.createdAt > oneHour) {
        this.jobs.delete(id);
        logger.info(`🧹 Cleaned up expired job: ${id}`);
      }
    }
  }
}

export const jobService = new JobService();

// Run cleanup every 15 minutes
setInterval(() => jobService.cleanupOldJobs(), 15 * 60 * 1000);
