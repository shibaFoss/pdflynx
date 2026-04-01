import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { pdfController } from '../controllers/pdf.controller.js';
import { verifyInternalKey } from '../middleware/auth.middleware.js';

/**
 * Registers all PDF-related routes with the Fastify instance.
 * All routes are protected by the verifyInternalKey middleware.
 *
 * @param fastify - Fastify server instance
 * @param options - Plugin configuration options
 */
export default async function pdfRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
  /**
   * Register the authentication middleware globally for this plugin.
   * This ensures every request to /api/pdf/* has a valid X-Internal-Key.
   */
  fastify.addHook('preHandler', verifyInternalKey);

  /**
   * Merge multiple PDF files into a single document.
   */
  fastify.post('/merge', (req, rep) =>
    pdfController.processMerge(req, rep)
  );

  /**
   * Split a PDF into individual pages and return as ZIP.
   */
  fastify.post('/split', (req, rep) =>
    pdfController.processSplit(req, rep)
  );

  /**
   * Compress a PDF to reduce file size.
   */
  fastify.post('/compress', (req, rep) =>
    pdfController.processCompress(req, rep)
  );

  /**
   * Convert a PDF into image(s).
   */
  fastify.post('/pdf-to-image', (req, rep) =>
    pdfController.processPdfToImage(req, rep)
  );

  /**
   * Convert one or more images into a PDF document.
   */
  fastify.post('/image-to-pdf', (req, rep) =>
    pdfController.processImageToPdf(req, rep)
  );

  /**
   * Convert an HTML URL or file into a PDF document.
   */
  fastify.post('/html-to-pdf', (req, rep) =>
    pdfController.processHtmlToPdf(req, rep)
  );

  /**
   * Add password protection to a PDF.
   */
  fastify.post('/protect', (req, rep) =>
    pdfController.processProtect(req, rep)
  );

  /**
   * Remove password protection from a PDF.
   */
  fastify.post('/unlock', (req, rep) =>
    pdfController.processUnlock(req, rep)
  );

  /**
   * Rotate pages in a PDF.
   */
  fastify.post('/rotate', (req, rep) =>
    pdfController.processRotate(req, rep)
  );

  /**
   * Retrieve the status of a background job.
   */
  fastify.get('/status/:jobId', (req, rep) => 
    pdfController.getStatus(req, rep)
  );

  /**
   * Download the finished result of a background job.
   */
  fastify.get('/download/:jobId', (req, rep) => 
    pdfController.downloadResult(req, rep)
  );

  /**
   * Retrieve the number of pages in a PDF.
   */
  fastify.post('/pages', (req, rep) =>
    pdfController.getPageCount(req, rep)
  );
}