import { app } from './app.js';
import { logger } from './utils/logger.js';

/**
 * Server configuration.
 *
 * Environment Variables:
 * - PORT: Port number for the server (default: 5000)
 * - HOST: Host address to bind (default: 0.0.0.0)
 *
 * Notes:
 * - 0.0.0.0 allows external access (required for containers, cloud, etc.)
 */
const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || '0.0.0.0';

/**
 * Starts the Fastify server.
 *
 * Responsibilities:
 * - Initialize and bind server to specified host/port
 * - Log startup information
 * - Handle startup failures gracefully
 *
 * Behavior:
 * - On success → logs server URL and API base path
 * - On failure → logs error and exits process
 */
const start = async () => {
  try {
    /**
     * Start listening for incoming requests.
     */
    await app.listen({ port: PORT, host: HOST });

    /**
     * Log server startup details.
     */
    logger.info(`🚀 PdfLynx backend running at http://${HOST}:${PORT}`);
    logger.info(`📝 API Base Path: /api/pdf`);

  } catch (err: any) {
    /**
     * Handle startup errors.
     * Common causes:
     * - Port already in use
     * - Permission issues
     * - Misconfigured environment
     */
    logger.error(`Failed to start server: ${err.message}`);

    /**
     * Exit process with failure code.
     */
    process.exit(1);
  }
};

/**
 * Bootstrap the application.
 */
start();