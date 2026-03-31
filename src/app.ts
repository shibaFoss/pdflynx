import Fastify from 'fastify';
import multipart from '@fastify/multipart';
import cors from '@fastify/cors';
import pdfRoutes from './routes/pdf.routes.js';
import { logger } from './utils/logger.js';

const app = Fastify({
  logger: false, // Use our custom pino logger
});

// Configure Multipart
app.register(multipart, {
  limits: {
    fieldNameSize: 100,
    fieldSize: 100,
    fields: 10,
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 10,
  },
});

// Configure CORS
app.register(cors, {
  origin: true,
});

// Register Routes
app.register(pdfRoutes, { prefix: '/api/pdf' });

// Global Error Handler
app.setErrorHandler((error: any, request, reply) => {
  logger.error(error);
  reply.status(error.statusCode || 500).send({
    success: false,
    message: error.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  });
});

export { app };
