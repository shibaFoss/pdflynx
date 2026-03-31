import { app } from './app.js';
import { logger } from './utils/logger.js';

const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || '0.0.0.0';

const start = async () => {
  try {
    await app.listen({ port: PORT, host: HOST });
    logger.info(`🚀 PdfLynx backend running at http://${HOST}:${PORT}`);
    logger.info(`📝 API Base Path: /api/pdf`);
  } catch (err: any) {
    logger.error(`Failed to start server: ${err.message}`);
    process.exit(1);
  }
};

start();
