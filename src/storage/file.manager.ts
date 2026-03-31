import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger.js';

export class FileManager {
  private readonly BASE_TEMP_DIR = '/tmp/pdflynx';

  constructor() {
    this.ensureBaseDir();
  }

  private async ensureBaseDir() {
    try {
      await fs.mkdir(this.BASE_TEMP_DIR, { recursive: true });
    } catch (err) {
      logger.error(`Error creating base temp directory: ${err}`);
    }
  }

  generateJobId(): string {
    return uuidv4();
  }

  getJobDir(jobId: string): string {
    return path.join(this.BASE_TEMP_DIR, jobId);
  }

  async setupJobDir(jobId: string): Promise<{ inputDir: string; outputDir: string }> {
    const jobDir = this.getJobDir(jobId);
    const inputDir = path.join(jobDir, 'input');
    const outputDir = path.join(jobDir, 'output');

    await fs.mkdir(inputDir, { recursive: true });
    await fs.mkdir(outputDir, { recursive: true });

    return { inputDir, outputDir };
  }

  async cleanupJobDir(jobId: string): Promise<void> {
    const jobDir = this.getJobDir(jobId);
    try {
      await fs.rm(jobDir, { recursive: true, force: true });
      logger.info(`Cleaned up job directory: ${jobDir}`);
    } catch (err) {
      logger.error(`Failed to cleanup job directory ${jobDir}: ${err}`);
    }
  }

  async saveFile(stream: NodeJS.ReadableStream, directory: string, filename: string): Promise<string> {
    const filePath = path.join(directory, filename);
    await fs.writeFile(filePath, ''); // Create empty file
    const writeStream = (await import('fs')).createWriteStream(filePath);
    
    return new Promise((resolve, reject) => {
      stream.pipe(writeStream);
      writeStream.on('finish', () => resolve(filePath));
      writeStream.on('error', (err) => reject(err));
    });
  }
}

export const fileManager = new FileManager();
