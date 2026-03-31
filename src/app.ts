import Fastify from 'fastify';
import multipart from '@fastify/multipart';
import cors from '@fastify/cors';
import pdfRoutes from './routes/pdf.routes.js';
import { logger } from './utils/logger.js';

/**
 * Main Fastify application instance.
 *
 * Responsibilities:
 * - Initialize server
 * - Register plugins (multipart, CORS)
 * - Register routes
 * - Configure global error handling
 *
 * Notes:
 * - Built with modular architecture (routes, controllers, services)
 * - Uses custom logger instead of Fastify's built-in logger
 */
const app = Fastify({
  /**
   * Disable Fastify's internal logger.
   * We use a custom Pino logger instead for better control.
   */
  logger: false,
});

/**
 * Multipart plugin configuration.
 *
 * Handles file uploads with size and count limits to prevent abuse.
 *
 * Limits:
 * - fieldNameSize: Max length of field names
 * - fieldSize: Max size of non-file fields
 * - fields: Max number of non-file fields
 * - fileSize: Max file size (50MB)
 * - files: Max number of files per request
 *
 * Security:
 * - Prevents large payload attacks
 * - Controls resource usage
 */
app.register(multipart, {
  limits: {
    fieldNameSize: 100,
    fieldSize: 100,
    fields: 10,
    fileSize: 50 * 1024 * 1024, // 50MB
    files: 10,
  },
});

/**
 * CORS configuration.
 *
 * Allows cross-origin requests from any origin.
 *
 * Notes:
 * - Suitable for public APIs
 * - For production, consider restricting origins
 */
app.register(cors, {
  origin: true,
});

/**
 * Register PDF-related routes.
 *
 * Base path:
 * /api/pdf/*
 */
app.register(pdfRoutes, {
  prefix: '/api/pdf',
});

/**
 * Global error handler.
 *
 * Responsibilities:
 * - Catch all unhandled errors
 * - Log errors using custom logger
 * - Send consistent error response format
 *
 * Behavior:
 * - Returns HTTP status code if available
 * - Defaults to 500 (Internal Server Error)
 * - Includes stack trace only in development mode
 */
app.setErrorHandler((error: any, request, reply) => {
  logger.error(error);

  reply.status(error.statusCode || 500).send({
    success: false,
    message: error.message || 'Internal Server Error',

    /**
     * Include stack trace only in development.
     * Prevents leaking sensitive information in production.
     */
    error:
      process.env.NODE_ENV === 'development'
        ? error.stack
        : undefined,
  });
});

/**
 * Export the configured Fastify app.
 *
 * Used by:
 * - Server bootstrap file (e.g., server.ts)
 * - Testing environments
 */
export { app };