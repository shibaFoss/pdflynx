import { app } from './app.js';
import { logger } from './utils/logger.js';
/**
 * Server configuration.
 *
 * Environment Variables:
 * - PORT: Port number for the server (default: 5000)
 * - HOST: Host address to bind (default: 0.0.0.0)
 */
const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || '0.0.0.0';
/**
 * Starts the Fastify server.
 */
const start = async () => {
    try {
        await app.listen({ port: PORT, host: HOST });
        const address = app.server.address();
        const url = typeof address === 'string' ? address : `http://${address?.address}:${address?.port}`;
        logger.info(`🚀 PdfLynx backend running at ${url}`);
        logger.info(`📝 API Base Path: /api/pdf`);
    }
    catch (err) {
        logger.error(`Failed to start server: ${err.message}`);
        process.exit(1);
    }
};
/**
 * Graceful shutdown handling.
 * Ensures active connections and resources are cleanly terminated.
 */
const signals = ['SIGINT', 'SIGTERM'];
for (const signal of signals) {
    process.on(signal, async () => {
        logger.info(`Received ${signal}, shutting down gracefully...`);
        try {
            await app.close();
            logger.info('Server closed successfully');
            process.exit(0);
        }
        catch (err) {
            logger.error(`Error during shutdown: ${err.message}`);
            process.exit(1);
        }
    });
}
/**
 * Bootstrap the application.
 */
start();
