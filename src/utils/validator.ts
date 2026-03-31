import { logger } from './logger.js';

export class Validator {
  private readonly ALLOWED_EXTENSIONS = ['.pdf', '.jpg', '.jpeg', '.png'];
  private readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

  validateFileType(filename: string, mimeType: string): boolean {
    const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'));
    const isAllowed = this.ALLOWED_EXTENSIONS.includes(ext) || 
                     mimeType === 'application/pdf' || 
                     mimeType.startsWith('image/');
    
    if (!isAllowed) {
      logger.warn(`Invalid file type: ${filename} (${mimeType})`);
    }
    return isAllowed;
  }

  validateFileSize(size: number): boolean {
    const isWithinLimit = size <= this.MAX_FILE_SIZE;
    if (!isWithinLimit) {
      logger.warn(`File size too large: ${size} bytes (Limit: ${this.MAX_FILE_SIZE})`);
    }
    return isWithinLimit;
  }

  sanitizeFilename(filename: string): string {
    // Basic sanitization to prevent path traversal
    return filename.replace(/[^a-zA-Z0-9.\-_]/g, '_');
  }
}

export const validator = new Validator();
