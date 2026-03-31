import pino from 'pino';

/**
 * Global application logger instance.
 *
 * Uses Pino for high-performance structured logging.
 * In development, logs are formatted using `pino-pretty` for readability.
 *
 * Configuration:
 * - level: Controlled via LOG_LEVEL env variable (default: 'info')
 * - transport: Pretty-print logs with colors and readable timestamps
 *
 * Environment Variables:
 * - LOG_LEVEL: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace'
 *
 * Notes:
 * - Avoid using `pino-pretty` in production for performance reasons.
 * - Logs exclude `pid` and `hostname` to reduce noise.
 */
export const logger = pino({

  /**
   * Log level threshold.
   * Only logs at this level and above will be output.
   */
  level: process.env.LOG_LEVEL || 'info',

  /**
   * Transport configuration for log formatting.
   * Uses `pino-pretty` to make logs human-readable in development.
   */
  transport: {
    target: 'pino-pretty',
    options: {
      /**
       * Enable colored output for better readability.
       */
      colorize: true,

      /**
       * Format timestamp as HH:MM:ss with timezone offset.
       */
      translateTime: 'HH:MM:ss Z',

      /**
       * Exclude less useful fields from logs.
       */
      ignore: 'pid,hostname',
    },
  },
});