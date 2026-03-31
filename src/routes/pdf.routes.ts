import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { pdfController } from '../controllers/pdf.controller.js';

export default async function pdfRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {
  fastify.post('/merge', (req, rep) => pdfController.processMerge(req, rep));
  fastify.post('/split', (req, rep) => pdfController.processSplit(req, rep));
  fastify.post('/compress', (req, rep) => pdfController.processCompress(req, rep));
  fastify.post('/pdf-to-image', (req, rep) => pdfController.processPdfToImage(req, rep));
  fastify.post('/image-to-pdf', (req, rep) => pdfController.processImageToPdf(req, rep));
  fastify.post('/pages', (req, rep) => pdfController.getPageCount(req, rep));
}
