import path from 'path';
import fs from 'fs/promises';
import { commandExecutor } from '../executors/command.executor.js';
import { logger } from '../utils/logger.js';
import { ProcessingResult } from '../types/pdf.types.js';

export class PdfService {
  async merge(jobId: string, inputPaths: string[], outputDir: string): Promise<ProcessingResult> {
    const filename = `merged_${jobId}.pdf`;
    const outputPath = path.join(outputDir, filename);

    // qpdf --empty --pages file1.pdf file2.pdf -- output.pdf
    const args = ['--empty', '--pages', ...inputPaths, '--', outputPath];
    const result = await commandExecutor.execute('qpdf', args);

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

    // qpdf input.pdf --pages . 1-5 -- output.pdf
    // '.' refers to the input file itself
    const args = [inputPath, '--pages', '.', pageRange, '--', outputPath];
    const result = await commandExecutor.execute('qpdf', args);

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

    // gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/screen -dNOPAUSE -dQUIET -dBATCH -sOutputFile=compressed.pdf input.pdf
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
    const outputPrefix = path.join(outputDir, `image_${jobId}`);
    
    // pdftoppm -png -r 150 input.pdf output_prefix
    const args = ['-png', '-r', '150', inputPath, outputPrefix];
    const result = await commandExecutor.execute('pdftoppm', args);

    if (!result.success) {
      throw new Error(`PDF to Image failed: ${result.error}`);
    }

    // pdftoppm generates files with suffix like -1.png, -2.png, etc.
    // For MVP, we'll return the first one or a zip if we had multiple (we'll just return the first for now).
    const files = await fs.readdir(outputDir);
    const firstImage = files.find(f => f.startsWith(`image_${jobId}-1`)) || files[0];
    const outputPath = path.join(outputDir, firstImage);

    return {
      success: true,
      jobId,
      outputPath,
      filename: firstImage,
      message: 'PDF converted to image successfully',
    };
  }

  async imageToPdf(jobId: string, imagePaths: string[], outputDir: string): Promise<ProcessingResult> {
    const filename = `converted_${jobId}.pdf`;
    const outputPath = path.join(outputDir, filename);

    // magick image1.jpg image2.png output.pdf
    // Or for older versions 'convert'
    const command = 'convert'; // Safer default if 'magick' isn't on PATH as is
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
