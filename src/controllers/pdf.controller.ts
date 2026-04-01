import { FastifyRequest, FastifyReply } from 'fastify';
import { createReadStream } from 'fs';
import { fileManager } from '../storage/file.manager.js';
import { pdfService } from '../services/pdf.service.js';
import { jobService } from '../services/job.service.js';
import { validator } from '../utils/validator.js';
import { logger } from '../utils/logger.js';

export class PdfController {
  private readonly MAX_FILES = 10;

  private async parseMultipart(
    request: FastifyRequest,
    inputDir: string
  ): Promise<{ filePaths: string[]; fields: Record<string, string> }> {
    const filePaths: string[] = [];
    const fields: Record<string, string> = {};
    const parts = request.parts();

    for await (const part of parts) {
      if (part.type === 'file') {
        const sanitizedFilename = validator.sanitizeFilename(part.filename);
        const filePath = await fileManager.saveFile(part.file, inputDir, sanitizedFilename);
        filePaths.push(filePath);
      } else if (part.type === 'field') {
        fields[part.fieldname] = part.value as string;
      }
    }
    return { filePaths, fields };
  }

  /**
   * Status check endpoint for polling.
   */
  async getStatus(request: FastifyRequest, reply: FastifyReply) {
    const { jobId } = request.params as { jobId: string };
    const status = jobService.getJobStatus(jobId);
    
    if (!status) {
      return reply.code(404).send({ success: false, message: 'Job not found' });
    }
    
    return reply.send({ success: true, ...status });
  }

  /**
   * Final download endpoint.
   */
  async downloadResult(request: FastifyRequest, reply: FastifyReply) {
    const { jobId } = request.params as { jobId: string };
    const job = jobService.getJobStatus(jobId);

    if (!job || job.status !== 'completed' || !job.result) {
      return reply.code(400).send({ success: false, message: 'Job result not ready' });
    }

    const { outputPath, filename } = job.result;
    const stream = createReadStream(outputPath);

    // Clean up when download finished
    reply.raw.on('finish', () => {
       fileManager.cleanupJobDir(jobId);
       jobService.deleteJob(jobId);
    });

    return reply
      .header('Content-Disposition', `attachment; filename="${filename}"`)
      .header('Content-Type', this.getMimeType(filename))
      .send(stream);
  }

  /**
   * Generic handler to convert a standard action into a background job.
   */
  private async initiateJob(
    request: FastifyRequest, 
    reply: FastifyReply, 
    processor: (jobId: string, filePaths: string[], fields: Record<string, string>, outputDir: string) => Promise<any>
  ) {
    const jobId = fileManager.generateJobId();
    const { inputDir, outputDir } = await fileManager.setupJobDir(jobId);
    
    try {
      const { filePaths, fields } = await this.parseMultipart(request, inputDir);
      
      // 1. Create the job entry
      jobService.createJob(jobId);
      
      // 2. Start processing in background (DO NOT await)
      jobService.runJob(jobId, () => processor(jobId, filePaths, fields, outputDir))
        .catch(err => logger.error(`Background Job Failure [${jobId}]: ${err.message}`));

      // 3. Return Job ID to the frontend instantly
      return reply.send({ 
        success: true, 
        jobId, 
        message: 'Request added to the engine queue.' 
      });

    } catch (error: any) {
      fileManager.cleanupJobDir(jobId);
      logger.error(`Job Initiation error: ${error.message}`);
      return reply.code(400).send({ success: false, error: error.message });
    }
  }

  async processMerge(request: FastifyRequest, reply: FastifyReply) {
    return this.initiateJob(request, reply, async (id, paths, _, out) => {
      if (paths.length < 2) throw new Error('At least two PDF files required');
      return pdfService.merge(id, paths, out);
    });
  }

  async processSplit(request: FastifyRequest, reply: FastifyReply) {
    return this.initiateJob(request, reply, async (id, paths, fields, out) => {
      const pageRange = fields['range'] || '1-z';
      return pdfService.split(id, paths[0], out, pageRange);
    });
  }

  async processCompress(request: FastifyRequest, reply: FastifyReply) {
    return this.initiateJob(request, reply, async (id, paths, _, out) => {
      return pdfService.compress(id, paths[0], out);
    });
  }

  async processPdfToImage(request: FastifyRequest, reply: FastifyReply) {
    return this.initiateJob(request, reply, async (id, paths, fields, out) => {
      const pageRange = fields['range'] || '1-z';
      return pdfService.pdfToImage(id, paths[0], out, pageRange);
    });
  }

  async processImageToPdf(request: FastifyRequest, reply: FastifyReply) {
    return this.initiateJob(request, reply, async (id, paths, _, out) => {
      return pdfService.imageToPdf(id, paths, out);
    });
  }

  async processHtmlToPdf(request: FastifyRequest, reply: FastifyReply) {
    return this.initiateJob(request, reply, async (id, paths, fields, out) => {
      const url = fields['url'];
      const htmlFile = paths.length > 0 ? paths[0] : undefined;
      return pdfService.htmlToPdf(id, { url, htmlFile }, out);
    });
  }

  async processProtect(request: FastifyRequest, reply: FastifyReply) {
    return this.initiateJob(request, reply, async (id, paths, fields, out) => {
      const password = fields['password'];
      if (!password) throw new Error('Password is required');
      return pdfService.protect(id, paths[0], password, out);
    });
  }

  async processUnlock(request: FastifyRequest, reply: FastifyReply) {
    return this.initiateJob(request, reply, async (id, paths, fields, out) => {
      const password = fields['password'] || '';
      return pdfService.unlock(id, paths[0], password, out);
    });
  }

  async processRotate(request: FastifyRequest, reply: FastifyReply) {
    return this.initiateJob(request, reply, async (id, paths, fields, out) => {
      const angle = fields['angle'] || '90';
      const pageRange = fields['pageRange'] || '1-z';
      return pdfService.rotate(id, paths[0], angle, out, pageRange);
    });
  }

  async getPageCount(request: FastifyRequest, reply: FastifyReply) {
    // Page count remains sync/fast as it doesn't use the job engine
    const jobId = fileManager.generateJobId();
    const { inputDir } = await fileManager.setupJobDir(jobId);
    try {
      const { filePaths } = await this.parseMultipart(request, inputDir);
      const count = await pdfService.getPageCount(filePaths[0]);
      fileManager.cleanupJobDir(jobId);
      return reply.send({ success: true, count });
    } catch (err: any) {
      fileManager.cleanupJobDir(jobId);
      return reply.code(400).send({ success: false, error: err.message });
    }
  }

  private getMimeType(filename: string): string {
    const ext = filename.toLowerCase().split('.').pop();
    switch (ext) {
      case 'pdf': return 'application/pdf';
      case 'png': return 'image/png';
      case 'jpg':
      case 'jpeg': return 'image/jpeg';
      case 'zip': return 'application/zip';
      default: return 'application/octet-stream';
    }
  }
}

export const pdfController = new PdfController();