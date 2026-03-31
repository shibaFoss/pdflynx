import path from 'path';
import fs from 'fs/promises';
import { commandExecutor } from '../executors/command.executor.js';
import { logger } from '../utils/logger.js';
import { ProcessingResult } from '../types/pdf.types.js';

export class PdfService {
  async merge(jobId: string, inputPaths: string[], outputDir: string): Promise<ProcessingResult> {
    const filename = `merged_${jobId}.pdf`;
    const outputPath = path.join(outputDir, filename);

    // Using gs instead of pdfunite or qpdf for better handling of encrypted/complex files
    const args = [
      '-dNOPAUSE',
      '-sDEVICE=pdfwrite',
      `-sOUTPUTFILE=${outputPath}`,
      '-dBATCH',
      '-dQUIET',
      ...inputPaths,
    ];
    
    const result = await commandExecutor.execute('gs', args);

    if (!result.success) {
      throw new Error(`Merge failed: ${result.error}`);
    }

    return {
      success: true,
      jobId,
      outputPath,
      filename,
      message: 'PDFs merged successfully',
    };
  }

  async split(jobId: string, inputPath: string, outputDir: string, pageRange: string = '1-z'): Promise<ProcessingResult> {
    const filename = `split_${jobId}.pdf`;
    const outputPath = path.join(outputDir, filename);

    // Using gs for simple page ranges
    let firstPage = 1;
    let lastPage: number | string = '9999';

    if (pageRange && pageRange.includes('-')) {
      const parts = pageRange.split('-');
      firstPage = parseInt(parts[0]) || 1;
      if (parts[1] !== 'z') {
        lastPage = parseInt(parts[1]) || 9999;
      }
    }

    const args = [
      '-sDEVICE=pdfwrite',
      '-dNOPAUSE',
      '-dBATCH',
      '-dSAFER',
      `-dFirstPage=${firstPage}`,
      `-dLastPage=${lastPage}`,
      `-sOutputFile=${outputPath}`,
      inputPath,
    ];
    
    const result = await commandExecutor.execute('gs', args);

    if (!result.success) {
      throw new Error(`Split failed: ${result.error}`);
    }

    return {
      success: true,
      jobId,
      outputPath,
      filename,
      message: 'PDF split successfully',
    };
  }

  async compress(jobId: string, inputPath: string, outputDir: string): Promise<ProcessingResult> {
    const filename = `compressed_${jobId}.pdf`;
    const outputPath = path.join(outputDir, filename);

    const args = [
      '-sDEVICE=pdfwrite',
      '-dCompatibilityLevel=1.4',
      '-dPDFSETTINGS=/screen',
      '-dNOPAUSE',
      '-dQUIET',
      '-dBATCH',
      `-sOutputFile=${outputPath}`,
      inputPath,
    ];
    const result = await commandExecutor.execute('gs', args);

    if (!result.success) {
      throw new Error(`Compression failed: ${result.error}`);
    }

    return {
      success: true,
      jobId,
      outputPath,
      filename,
      message: 'PDF compressed successfully',
    };
  }

  async pdfToImage(jobId: string, inputPath: string, outputDir: string): Promise<ProcessingResult> {
    const outputPrefix = path.join(outputDir, `image`); 
    
    const args = ['-png', '-singlefile', '-r', '150', inputPath, outputPrefix];
    const result = await commandExecutor.execute('pdftoppm', args);

    if (!result.success) {
      throw new Error(`PDF to Image failed: ${result.error}`);
    }

    const firstImage = 'image.png';
    const outputPath = path.join(outputDir, firstImage);

    return {
      success: true,
      jobId,
      outputPath,
      filename: `image_${jobId}.png`,
      message: 'PDF converted to image successfully',
    };
  }

  async imageToPdf(jobId: string, imagePaths: string[], outputDir: string): Promise<ProcessingResult> {
    const filename = `converted_${jobId}.pdf`;
    const outputPath = path.join(outputDir, filename);

    const command = 'convert'; 
    const args = [...imagePaths, outputPath];
    const result = await commandExecutor.execute(command, args);

    if (!result.success) {
      throw new Error(`Image to PDF failed: ${result.error}`);
    }

    return {
      success: true,
      jobId,
      outputPath,
      filename,
      message: 'Images converted to PDF successfully',
    };
  }
}

export const pdfService = new PdfService();
