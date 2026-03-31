import { FastifyRequest, FastifyReply } from 'fastify';
import { createReadStream } from 'fs';
import { fileManager } from '../storage/file.manager.js';
import { pdfService } from '../services/pdf.service.js';
import { validator } from '../utils/validator.js';
import { logger } from '../utils/logger.js';

/**
 * PdfController handles all incoming HTTP requests for PDF operations.
 *
 * Responsibilities:
 * - Parse multipart/form-data requests
 * - Validate and sanitize uploaded files
 * - Delegate processing to PdfService
 * - Stream processed files back to client
 * - Handle errors and cleanup resources
 *
 * Lifecycle per request:
 * 1. Generate jobId
 * 2. Create temp directories (input/output)
 * 3. Save uploaded files
 * 4. Call service layer
 * 5. Stream result
 * 6. Cleanup temp files
 *
 * Notes:
 * - Uses streaming for efficient file handling
 * - Cleanup is deferred until response is finished
 * - All methods follow a similar pattern for consistency
 */
export class PdfController {
  private readonly MAX_FILES = 10;

  /**
   * Reusable multipart parser and validator with early rejection.
   */
  private async parseMultipart(
    request: FastifyRequest,
    inputDir: string
  ): Promise<{ filePaths: string[]; fields: Record<string, string> }> {
    const filePaths: string[] = [];
    const fields: Record<string, string> = {};

    const parts = request.parts();

    for await (const part of parts) {
      if (part.type === 'file') {
        if (filePaths.length >= this.MAX_FILES) {
          throw new Error(`Maximum of ${this.MAX_FILES} files allowed.`);
        }

        const sanitizedFilename = validator.sanitizeFilename(part.filename);
        if (!validator.validateFileType(sanitizedFilename, part.mimetype)) {
          throw new Error(`Unsupported file type: ${part.filename}`);
        }

        // Fastify automatically throws FST_REQ_FILE_TOO_LARGE based on app.ts limits.
        const filePath = await fileManager.saveFile(part.file, inputDir, sanitizedFilename);
        filePaths.push(filePath);

      } else if (part.type === 'field') {
        fields[part.fieldname] = part.value as string;
      }
    }

    return { filePaths, fields };
  }

  /**
   * Attaches robust cleanup handlers to ensure temporary resources are freed
   * when requests complete successfully or abort prematurely.
   */
  private setupCleanup(reply: FastifyReply, jobId: string) {
    const cleanup = () => fileManager.cleanupJobDir(jobId);
    reply.raw.on('finish', cleanup);
    reply.raw.on('close', cleanup);
  }

  async processMerge(request: FastifyRequest, reply: FastifyReply) {
    const jobId = fileManager.generateJobId();
    const { inputDir, outputDir } = await fileManager.setupJobDir(jobId);
    this.setupCleanup(reply, jobId);

    try {
      const { filePaths } = await this.parseMultipart(request, inputDir);

      if (filePaths.length < 2) {
        return reply.code(400).send({ success: false, message: 'At least two PDF files required' });
      }

      const result = await pdfService.merge(jobId, filePaths, outputDir);
      return this.sendProcessedFile(reply, result);
    } catch (error: any) {
      logger.error(`Merge error [jobId=${jobId}]: ${error.message}`);
      return this.sendError(reply, error.message);
    }
  }

  async processSplit(request: FastifyRequest, reply: FastifyReply) {
    const jobId = fileManager.generateJobId();
    const { inputDir, outputDir } = await fileManager.setupJobDir(jobId);
    this.setupCleanup(reply, jobId);

    try {
      const { filePaths, fields } = await this.parseMultipart(request, inputDir);

      if (filePaths.length === 0) {
        return reply.code(400).send({ success: false, message: 'PDF file required' });
      }

      const pageRange = fields['range'] || '1-z';
      const result = await pdfService.split(jobId, filePaths[0], outputDir, pageRange);
      return this.sendProcessedFile(reply, result);
    } catch (error: any) {
      logger.error(`Split error [jobId=${jobId}]: ${error.message}`);
      return this.sendError(reply, error.message);
    }
  }

  async processCompress(request: FastifyRequest, reply: FastifyReply) {
    const jobId = fileManager.generateJobId();
    const { inputDir, outputDir } = await fileManager.setupJobDir(jobId);
    this.setupCleanup(reply, jobId);

    try {
      const { filePaths } = await this.parseMultipart(request, inputDir);

      if (filePaths.length === 0) {
        return reply.code(400).send({ success: false, message: 'PDF file required' });
      }

      const result = await pdfService.compress(jobId, filePaths[0], outputDir);
      return this.sendProcessedFile(reply, result);
    } catch (error: any) {
      logger.error(`Compress error [jobId=${jobId}]: ${error.message}`);
      return this.sendError(reply, error.message);
    }
  }

  async processPdfToImage(request: FastifyRequest, reply: FastifyReply) {
    const jobId = fileManager.generateJobId();
    const { inputDir, outputDir } = await fileManager.setupJobDir(jobId);
    this.setupCleanup(reply, jobId);

    try {
      const { filePaths, fields } = await this.parseMultipart(request, inputDir);

      if (filePaths.length === 0) {
        return reply.code(400).send({ success: false, message: 'PDF file required' });
      }

      const pageRange = fields['range'] || '1-z';
      const result = await pdfService.pdfToImage(jobId, filePaths[0], outputDir, pageRange);
      return this.sendProcessedFile(reply, result);
    } catch (error: any) {
      logger.error(`PDF to Image error [jobId=${jobId}]: ${error.message}`);
      return this.sendError(reply, error.message);
    }
  }

  async getPageCount(request: FastifyRequest, reply: FastifyReply) {
    const jobId = fileManager.generateJobId();
    const { inputDir } = await fileManager.setupJobDir(jobId);
    this.setupCleanup(reply, jobId);

    try {
      const { filePaths } = await this.parseMultipart(request, inputDir);

      if (filePaths.length === 0) {
        return reply.code(400).send({ success: false, message: 'PDF file required' });
      }

      const count = await pdfService.getPageCount(filePaths[0]);
      return reply.send({ success: true, count });
    } catch (error: any) {
      logger.error(`Page count error [jobId=${jobId}]: ${error.message}`);
      return this.sendError(reply, error.message);
    }
  }

  async processImageToPdf(request: FastifyRequest, reply: FastifyReply) {
    const jobId = fileManager.generateJobId();
    const { inputDir, outputDir } = await fileManager.setupJobDir(jobId);
    this.setupCleanup(reply, jobId);

    try {
      const { filePaths } = await this.parseMultipart(request, inputDir);

      if (filePaths.length === 0) {
        return reply.code(400).send({ success: false, message: 'At least one image required' });
      }

      const result = await pdfService.imageToPdf(jobId, filePaths, outputDir);
      return this.sendProcessedFile(reply, result);
    } catch (error: any) {
      logger.error(`Image to PDF error [jobId=${jobId}]: ${error.message}`);
      return this.sendError(reply, error.message);
    }
  }

  async processHtmlToPdf(request: FastifyRequest, reply: FastifyReply) {
    const jobId = fileManager.generateJobId();
    const { inputDir, outputDir } = await fileManager.setupJobDir(jobId);
    this.setupCleanup(reply, jobId);

    try {
      const { fields, filePaths } = await this.parseMultipart(request, inputDir);

      const url = fields['url'];
      const htmlFile = filePaths.length > 0 ? filePaths[0] : undefined;

      if (!url && !htmlFile) {
        throw new Error('URL or HTML file required');
      }

      const result = await pdfService.htmlToPdf(jobId, { url, htmlFile }, outputDir);
      return this.sendProcessedFile(reply, result);
    } catch (error: any) {
      logger.error(`HTML to PDF error [jobId=${jobId}]: ${error.message}`);
      return this.sendError(reply, error.message);
    }
  }

  private sendProcessedFile(reply: FastifyReply, result: any) {
    const stream = createReadStream(result.outputPath);

    return reply
      .header(
        'Content-Disposition',
        `attachment; filename="${result.filename}"`
      )
      .header('Content-Type', this.getMimeType(result.filename))
      .send(stream);
  }

  private sendError(reply: FastifyReply, message: string) {
    return reply.code(500).send({
      success: false,
      message: 'Processing failed',
      error: message,
    });
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