/**
 * Represents the result of a command-line or system operation.
 *
 * Commonly used when executing external processes (e.g., CLI tools, scripts).
 */
export interface CommandResponse {
  /**
   * Indicates whether the command executed successfully.
   */
  success: boolean;

  /**
   * Exit code returned by the command.
   * - null: Command did not complete or no code available
   * - 0: Success (conventionally)
   * - Non-zero: Error or failure
   */
  code: number | null;

  /**
   * Standard output (stdout) from the command.
   */
  output: string;

  /**
   * Standard error output (stderr) from the command.
   */
  error: string;
}

/**
 * Represents the result of a file processing operation.
 *
 * Used for tracking async jobs like PDF manipulation, conversions, etc.
 */
export interface ProcessingResult {
  /**
   * Indicates whether the processing task was successful.
   */
  success: boolean;

  /**
   * Unique identifier for the processing job.
   * Useful for tracking, logging, or client-side polling.
   */
  jobId: string;

  /**
   * Path where the processed output file is stored.
   */
  outputPath: string;

  /**
   * Final output filename (after processing).
   */
  filename: string;

  /**
   * Optional success or informational message.
   */
  message?: string;

  /**
   * Optional error message if processing failed.
   */
  error?: string;
}

/**
 * Metadata describing an uploaded or temporary file.
 *
 * Typically used during file upload handling and validation.
 */
export interface FileMetadata {
  /**
   * Original filename as provided by the user.
   */
  originalName: string;

  /**
   * Temporary file path on the server.
   * Used during processing before final storage.
   */
  tempPath: string;

  /**
   * MIME type of the file (e.g., 'application/pdf', 'image/png').
   */
  mimeType: string;

  /**
   * File size in bytes.
   */
  size: number;
}

/**
 * Enum representing supported PDF-related operations.
 *
 * Used to define the type of processing to perform.
 */
export enum PDFAction {
  /**
   * Merge multiple PDF files into a single document.
   */
  MERGE = 'merge',

  /**
   * Split a PDF into multiple smaller documents.
   */
  SPLIT = 'split',

  /**
   * Compress a PDF to reduce file size.
   */
  COMPRESS = 'compress',

  /**
   * Convert PDF pages into images.
   */
  PDF_TO_IMAGE = 'pdf-to-image',

  /**
   * Convert images into a single PDF document.
   */
  IMAGE_TO_PDF = 'image-to-pdf',

  /**
   * Convert an HTML URL or file into a PDF document.
   */
  HTML_TO_PDF = 'html-to-pdf',

  /**
   * Add password protection to a PDF file.
   */
  PROTECT_PDF = 'protect-pdf'
}