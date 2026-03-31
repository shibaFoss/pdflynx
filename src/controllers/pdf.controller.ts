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

  /**
   * Handles PDF merge requests.
   *
   * պահանջ:
   * - At least 2 PDF files required
   *
   * Flow:
   * - Validate files
   * - Save to input directory
   * - Call pdfService.merge
   * - Return merged PDF
   */
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

          const filePath = await fileManager.saveFile(
            part.file,
            inputDir,
            sanitizedFilename
          );

          inputPaths.push(filePath);
        }
      }

      if (inputPaths.length < 2) {
        return reply
          .code(400)
          .send({ success: false, message: 'At least two PDF files required' });
      }

      const result = await pdfService.merge(jobId, inputPaths, outputDir);
      return this.sendProcessedFile(reply, result);

    } catch (error: any) {
      logger.error(`Merge error [jobId=${jobId}]: ${error.message}`);
      return this.sendError(reply, error.message);

    } finally {
      /**
       * Cleanup after response is fully sent.
       */
      reply.raw.on('finish', () =>
        fileManager.cleanupJobDir(jobId)
      );
    }
  }

  /**
   * Handles PDF split requests.
   *
   * Input:
   * - Single PDF file
   * - Optional page range (e.g., "1-5", "2-z")
   *
   * Output:
   * - ZIP file containing split pages
   */
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

          inputPath = await fileManager.saveFile(
            part.file,
            inputDir,
            sanitizedFilename
          );

        } else if (part.type === 'field' && part.fieldname === 'range') {
          pageRange = (part.value as string) || '1-z';
        }
      }

      if (!inputPath) {
        return reply
          .code(400)
          .send({ success: false, message: 'PDF file required' });
      }

      const result = await pdfService.split(
        jobId,
        inputPath,
        outputDir,
        pageRange
      );

      return this.sendProcessedFile(reply, result);

    } catch (error: any) {
      logger.error(`Split error [jobId=${jobId}]: ${error.message}`);
      return this.sendError(reply, error.message);

    } finally {
      reply.raw.on('finish', () =>
        fileManager.cleanupJobDir(jobId)
      );
    }
  }

  /**
   * Handles PDF compression requests.
   *
   * Input:
   * - Single PDF file
   *
   * Output:
   * - Compressed PDF
   */
  async processCompress(request: FastifyRequest, reply: FastifyReply) {
    const jobId = fileManager.generateJobId();
    const { inputDir, outputDir } = await fileManager.setupJobDir(jobId);

    let inputPath = '';

    try {
      const parts = request.parts();

      for await (const part of parts) {
        if (part.type === 'file') {
          const sanitizedFilename = validator.sanitizeFilename(part.filename);

          inputPath = await fileManager.saveFile(
            part.file,
            inputDir,
            sanitizedFilename
          );
        }
      }

      if (!inputPath) {
        return reply
          .code(400)
          .send({ success: false, message: 'PDF file required' });
      }

      const result = await pdfService.compress(jobId, inputPath, outputDir);
      return this.sendProcessedFile(reply, result);

    } catch (error: any) {
      logger.error(`Compress error [jobId=${jobId}]: ${error.message}`);
      return this.sendError(reply, error.message);

    } finally {
      reply.raw.on('finish', () =>
        fileManager.cleanupJobDir(jobId)
      );
    }
  }

  /**
   * Handles PDF → Image conversion.
   *
   * Input:
   * - PDF file
   * - Optional page range
   *
   * Output:
   * - Single joined image (PNG)
   */
  async processPdfToImage(request: FastifyRequest, reply: FastifyReply) {
    const jobId = fileManager.generateJobId();
    const { inputDir, outputDir } = await fileManager.setupJobDir(jobId);

    let inputPath = '';
    let pageRange = '1-z';

    try {
      const parts = request.parts();

      for await (const part of parts) {
        if (part.type === 'file') {
          const sanitizedFilename = validator.sanitizeFilename(part.filename);

          inputPath = await fileManager.saveFile(
            part.file,
            inputDir,
            sanitizedFilename
          );

        } else if (part.type === 'field' && part.fieldname === 'range') {
          pageRange = (part.value as string) || '1-z';
        }
      }

      if (!inputPath) {
        return reply
          .code(400)
          .send({ success: false, message: 'PDF file required' });
      }

      const result = await pdfService.pdfToImage(
        jobId,
        inputPath,
        outputDir,
        pageRange
      );

      return this.sendProcessedFile(reply, result);

    } catch (error: any) {
      logger.error(`PDF to Image error [jobId=${jobId}]: ${error.message}`);
      return this.sendError(reply, error.message);

    } finally {
      reply.raw.on('finish', () =>
        fileManager.cleanupJobDir(jobId)
      );
    }
  }

  /**
   * Retrieves page count of a PDF.
   *
   * Output:
   * - JSON response with page count
   */
  async getPageCount(request: FastifyRequest, reply: FastifyReply) {
    const jobId = fileManager.generateJobId();
    const { inputDir } = await fileManager.setupJobDir(jobId);

    let inputPath = '';

    try {
      const parts = request.parts();

      for await (const part of parts) {
        if (part.type === 'file') {
          const sanitizedFilename = validator.sanitizeFilename(part.filename);

          inputPath = await fileManager.saveFile(
            part.file,
            inputDir,
            sanitizedFilename
          );
        }
      }

      if (!inputPath) {
        return reply
          .code(400)
          .send({ success: false, message: 'PDF file required' });
      }

      const count = await pdfService.getPageCount(inputPath);

      return reply.send({
        success: true,
        count,
      });

    } catch (error: any) {
      logger.error(`Page count error [jobId=${jobId}]: ${error.message}`);
      return this.sendError(reply, error.message);

    } finally {
      fileManager.cleanupJobDir(jobId);
    }
  }

  /**
   * Handles Image → PDF conversion.
   *
   * Input:
   * - One or more images
   *
   * Output:
   * - Single PDF file
   */
  async processImageToPdf(request: FastifyRequest, reply: FastifyReply) {
    const jobId = fileManager.generateJobId();
    const { inputDir, outputDir } = await fileManager.setupJobDir(jobId);

    const inputPaths: string[] = [];

    try {
      const parts = request.parts();

      for await (const part of parts) {
        if (part.type === 'file') {
          const sanitizedFilename = validator.sanitizeFilename(part.filename);

          const filePath = await fileManager.saveFile(
            part.file,
            inputDir,
            sanitizedFilename
          );

          inputPaths.push(filePath);
        }
      }

      if (inputPaths.length === 0) {
        return reply
          .code(400)
          .send({ success: false, message: 'At least one image required' });
      }

      const result = await pdfService.imageToPdf(
        jobId,
        inputPaths,
        outputDir
      );

      return this.sendProcessedFile(reply, result);

    } catch (error: any) {
      logger.error(`Image to PDF error [jobId=${jobId}]: ${error.message}`);
      return this.sendError(reply, error.message);

    } finally {
      reply.raw.on('finish', () =>
        fileManager.cleanupJobDir(jobId)
      );
    }
  }

  /**
   * Streams processed file to client.
   *
   * @param reply - Fastify reply instance
   * @param result - Processing result object
   *
   * Behavior:
   * - Sets appropriate headers
   * - Streams file instead of loading into memory
   */
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

  /**
   * Sends standardized error response.
   */
  private sendError(reply: FastifyReply, message: string) {
    return reply.code(500).send({
      success: false,
      message: 'Processing failed',
      error: message,
    });
  }

  /**
   * Determines MIME type based on file extension.
   *
   * @param filename - Output filename
   * @returns string - MIME type
   */
  private getMimeType(filename: string): string {
    const ext = filename.toLowerCase().split('.').pop();

    switch (ext) {
      case 'pdf':
        return 'application/pdf';
      case 'png':
        return 'image/png';
      case 'jpg':
      case 'jpeg':
        return 'image/jpeg';
      case 'zip':
        return 'application/zip';
      default:
        return 'application/octet-stream';
    }
  }
}

/**
 * Singleton instance of PdfController.
 */
export const pdfController = new PdfController();