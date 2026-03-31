export interface CommandResponse {
  success: boolean;
  code: number | null;
  output: string;
  error: string;
}

export interface ProcessingResult {
  success: boolean;
  jobId: string;
  outputPath: string;
  filename: string;
  message?: string;
  error?: string;
}

export interface FileMetadata {
  originalName: string;
  tempPath: string;
  mimeType: string;
  size: number;
}

export enum PDFAction {
  MERGE = 'merge',
  SPLIT = 'split',
  COMPRESS = 'compress',
  PDF_TO_IMAGE = 'pdf-to-image',
  IMAGE_TO_PDF = 'image-to-pdf'
}
