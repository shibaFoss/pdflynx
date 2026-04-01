import { FastifyReply, FastifyRequest } from 'fastify';
import { logger } from '../utils/logger.js';

/**
 * Middleware to verify that the request is coming from the trusted frontend.
 * It checks for a secret 'X-Internal-Key' header.
 */
export const verifyInternalKey = async (request: FastifyRequest, reply: FastifyReply) => {
  const secretKey = process.env.INTERNAL_API_KEY;

  if (!secretKey) {
    logger.error('INTERNAL_API_KEY not set in environment variables!');
    return reply.status(500).send({
      success: false,
      message: 'Server configuration error',
    });
  }

  const providedKey = request.headers['x-internal-key'];

  if (providedKey !== secretKey) {
    logger.warn(`Unauthorized access attempt from IP: ${request.ip}`);
    return reply.status(401).send({
      success: false,
      message: 'Unauthorized: Access restricted to internal app only.',
    });
  }
};
