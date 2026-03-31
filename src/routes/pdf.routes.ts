import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { pdfController } from '../controllers/pdf.controller.js';

/**
 * Registers all PDF-related routes with the Fastify instance.
 *
 * Responsibilities:
 * - Define API endpoints for PDF operations
 * - Delegate request handling to the pdfController
 *
 * Route Structure:
 * - POST /merge           → Merge multiple PDFs
 * - POST /split           → Split a PDF into multiple pages (ZIP output)
 * - POST /compress        → Compress a PDF
 * - POST /pdf-to-image    → Convert PDF to image(s)
 * - POST /image-to-pdf    → Convert images to a PDF
 * - POST /pages           → Get total page count of a PDF
 *
 * Notes:
 * - All routes use POST due to file uploads / payload complexity
 * - Controllers handle validation, processing, and response formatting
 * - This file should remain thin (no business logic)
 *
 * @param fastify - Fastify server instance
 * @param options - Plugin configuration options (currently unused)
 */
export default async function pdfRoutes(
  fastify: FastifyInstance,
  options: FastifyPluginOptions
) {
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
   * Retrieve the number of pages in a PDF.
   */
  fastify.post('/pages', (req, rep) =>
    pdfController.getPageCount(req, rep)
  );
}