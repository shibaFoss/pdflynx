import Fastify from 'fastify';
import multipart from '@fastify/multipart';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import pdfRoutes from './routes/pdf.routes.js';
import { logger } from './utils/logger.js';
/**
 * Main Fastify application instance.
 */
const app = Fastify({
    /**
     * Use Pino logger in production, disable in dev to use custom structured output
     */
    logger: process.env.NODE_ENV === 'production' ? logger : false,
    /**
     * Request timeout protection against hanging connections
     */
    connectionTimeout: 120000,
});
/**
 * Multipart plugin configuration.
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
 * Restrict to CORS_ORIGIN in production for security.
 */
app.register(cors, {
    origin: process.env.NODE_ENV === 'production' ? process.env.CORS_ORIGIN || false : true,
});
/**
 * Basic rate limiting to prevent abuse.
 */
app.register(rateLimit, {
    max: 100, // maximum 100 requests per minute
    timeWindow: '1 minute',
});
/**
 * Register PDF-related routes.
 */
app.register(pdfRoutes, {
    prefix: '/api/pdf',
});
/**
 * Global error handler.
 */
app.setErrorHandler((error, request, reply) => {
    logger.error(error);
    reply.status(error.statusCode || 500).send({
        success: false,
        message: error.message || 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
});
export { app };
