import { FastifyRequest, FastifyReply } from 'fastify';
import { createReadStream } from 'fs';
import { fileManager } from '../storage/file.manager.js';
import { pdfService } from '../services/pdf.service.js';
import { validator } from '../utils/validator.js';
import { logger } from '../utils/logger.js';

export class PdfController {
  async processMerge(request: FastifyRequest, reply: FastifyReply) {
    const jobId = fileManager.generateJobId();
    const { inputDir, outputDir } = await fileManager.setupJobDir(jobId);
    const inputPaths: string[] = [];

    try {
      const parts = request.parts();
      for await (const part of parts) {
        if (part.type === 'file') {
          const sanitizedFilename = validator.sanitizeFilename(part.filename);
          if (!validator.validateFileType(sanitizedFilename, part.mimetype)) continue;

          const filePath = await fileManager.saveFile(part.file, inputDir, sanitizedFilename);
          inputPaths.push(filePath);
        }
      }

      if (inputPaths.length < 2) {
        return reply.code(400).send({ success: false, message: 'At least two PDF files required' });
      }

      const result = await pdfService.merge(jobId, inputPaths, outputDir);
      return this.sendProcessedFile(reply, result);
    } catch (error: any) {
      logger.error(`Merge error [jobId=${jobId}]: ${error.message}`);
      return this.sendError(reply, error.message);
    } finally {
      reply.raw.on('finish', () => fileManager.cleanupJobDir(jobId));
    }
  }

  async processSplit(request: FastifyRequest, reply: FastifyReply) {
    const jobId = fileManager.generateJobId();
    const { inputDir, outputDir } = await fileManager.setupJobDir(jobId);
    let inputPath = '';
    let pageRange = '1-z';

    try {
      const parts = request.parts();
      for await (const part of parts) {
        if (part.type === 'file') {
          const sanitizedFilename = validator.sanitizeFilename(part.filename);
          if (!validator.validateFileType(sanitizedFilename, part.mimetype)) continue;

          inputPath = await fileManager.saveFile(part.file, inputDir, sanitizedFilename);
        } else if (part.type === 'field' && part.fieldname === 'range') {
          pageRange = (part.value as string) || '1-z';
        }
      }

      if (!inputPath) {
        return reply.code(400).send({ success: false, message: 'PDF file required' });
      }

      const result = await pdfService.split(jobId, inputPath, outputDir, pageRange);
      return this.sendProcessedFile(reply, result);
    } catch (error: any) {
      logger.error(`Split error [jobId=${jobId}]: ${error.message}`);
      return this.sendError(reply, error.message);
    } finally {
      reply.raw.on('finish', () => fileManager.cleanupJobDir(jobId));
    }
  }

  async processCompress(request: FastifyRequest, reply: FastifyReply) {
    const jobId = fileManager.generateJobId();
    const { inputDir, outputDir } = await fileManager.setupJobDir(jobId);
    let inputPath = '';

    try {
      const parts = request.parts();
      for await (const part of parts) {
        if (part.type === 'file') {
          const sanitizedFilename = validator.sanitizeFilename(part.filename);
          inputPath = await fileManager.saveFile(part.file, inputDir, sanitizedFilename);
        }
      }

      if (!inputPath) return reply.code(400).send({ success: false, message: 'PDF file required' });

      const result = await pdfService.compress(jobId, inputPath, outputDir);
      return this.sendProcessedFile(reply, result);
    } catch (error: any) {
      logger.error(`Compress error [jobId=${jobId}]: ${error.message}`);
      return this.sendError(reply, error.message);
    } finally {
      reply.raw.on('finish', () => fileManager.cleanupJobDir(jobId));
    }
  }

  async processPdfToImage(request: FastifyRequest, reply: FastifyReply) {
    const jobId = fileManager.generateJobId();
    const { inputDir, outputDir } = await fileManager.setupJobDir(jobId);
    let inputPath = '';

    try {
      const parts = request.parts();
      for await (const part of parts) {
        if (part.type === 'file') {
          const sanitizedFilename = validator.sanitizeFilename(part.filename);
          inputPath = await fileManager.saveFile(part.file, inputDir, sanitizedFilename);
        }
      }

      if (!inputPath) return reply.code(400).send({ success: false, message: 'PDF file required' });

      const result = await pdfService.pdfToImage(jobId, inputPath, outputDir);
      return this.sendProcessedFile(reply, result);
    } catch (error: any) {
      logger.error(`PDF to Image error [jobId=${jobId}]: ${error.message}`);
      return this.sendError(reply, error.message);
    } finally {
      reply.raw.on('finish', () => fileManager.cleanupJobDir(jobId));
    }
  }

  async processImageToPdf(request: FastifyRequest, reply: FastifyReply) {
    const jobId = fileManager.generateJobId();
    const { inputDir, outputDir } = await fileManager.setupJobDir(jobId);
    const inputPaths: string[] = [];

    try {
      const parts = request.parts();
      for await (const part of parts) {
        if (part.type === 'file') {
          const sanitizedFilename = validator.sanitizeFilename(part.filename);
          const filePath = await fileManager.saveFile(part.file, inputDir, sanitizedFilename);
          inputPaths.push(filePath);
        }
      }

      if (inputPaths.length === 0) {
        return reply.code(400).send({ success: false, message: 'At least one image required' });
      }

      const result = await pdfService.imageToPdf(jobId, inputPaths, outputDir);
      return this.sendProcessedFile(reply, result);
    } catch (error: any) {
      logger.error(`Image to PDF error [jobId=${jobId}]: ${error.message}`);
      return this.sendError(reply, error.message);
    } finally {
      reply.raw.on('finish', () => fileManager.cleanupJobDir(jobId));
    }
  }

  private sendProcessedFile(reply: FastifyReply, result: any) {
    const stream = createReadStream(result.outputPath);
    return reply
      .header('Content-Disposition', `attachment; filename="${result.filename}"`)
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
