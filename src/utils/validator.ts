import { logger } from './logger.js';

/**
 * Validator class for handling file validation and sanitization.
 *
 * Responsibilities:
 * - Validate file type based on extension and MIME type
 * - Enforce maximum file size limits
 * - Sanitize filenames to prevent security issues (e.g., path traversal)
 *
 * Notes:
 * - This is a basic validation layer and should be combined with server-side checks.
 * - Logging is used to track invalid attempts for monitoring/debugging.
 */
export class Validator {
  /**
   * strict mapping of extensions to allowed MIME types.
   */
  private readonly MIME_MAP: Record<string, string[]> = {
    '.pdf': ['application/pdf'],
    '.jpg': ['image/jpeg', 'image/jpg'],
    '.jpeg': ['image/jpeg', 'image/jpg'],
    '.png': ['image/png'],
  };

  /**
   * Maximum allowed file size in bytes (50 MB).
   */
  private readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  /**
   * Validates file type using both file extension and MIME type.
   *
   * @param filename - Name of the uploaded file
   * @param mimeType - MIME type of the file (e.g., 'application/pdf', 'image/png')
   * @returns boolean - True if file type is allowed, otherwise false
   */
  validateFileType(filename: string, mimeType: string): boolean {
    const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    const allowedMimes = this.MIME_MAP[ext];

    const isAllowed = allowedMimes ? allowedMimes.includes(mimeType) : false;

    if (!isAllowed) {
      logger.warn(`Invalid file type: ${filename} (${mimeType})`);
    }

    return isAllowed;
  }

  /**
   * Validates file size against the defined maximum limit.
   *
   * @param size - File size in bytes
   * @returns boolean - True if within allowed limit, otherwise false
   *
   * Behavior:
   * - Compares file size with MAX_FILE_SIZE
   * - Logs a warning if file exceeds the limit
   */
  validateFileSize(size: number): boolean {
    const isWithinLimit = size <= this.MAX_FILE_SIZE;

    if (!isWithinLimit) {
      logger.warn(
        `File size too large: ${size} bytes (Limit: ${this.MAX_FILE_SIZE})`
      );
    }

    return isWithinLimit;
  }

  /**
   * Sanitizes a filename to prevent security vulnerabilities.
   *
   * @param filename - Original filename
   * @returns string - Sanitized filename
   *
   * Behavior:
   * - Replaces all unsafe characters with underscores (_)
   * - Allows only: letters, numbers, dots (.), hyphens (-), and underscores (_)
   *
   * Security:
   * - Helps prevent path traversal attacks (e.g., "../../etc/passwd")
   * - Ensures safe file handling across different systems
   */
  sanitizeFilename(filename: string): string {
    // Basic sanitization to prevent path traversal
    return filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  }
}

/**
 * Singleton instance of Validator for application-wide usage.
 */
export const validator = new Validator();