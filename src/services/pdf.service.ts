import path from 'path';
import fs from 'fs/promises';
import { commandExecutor } from '../executors/command.executor.js';
import { logger } from '../utils/logger.js';
import { ProcessingResult } from '../types/pdf.types.js';

export class PdfService {
  async merge(jobId: string, inputPaths: string[], outputDir: string): Promise<ProcessingResult> {
    const filename = `merged_${jobId}.pdf`;
    const outputPath = path.join(outputDir, filename);

    // Using qpdf for merging
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
    // 1. Separate the PDF into multiple files
    const outputPattern = path.join(outputDir, 'page-%d.pdf');
    
    // Determine the page range if possible
    let firstPage = 1;
    let lastPage: number | undefined;

    if (pageRange && pageRange.includes('-')) {
      const parts = pageRange.split('-');
      firstPage = parseInt(parts[0]) || 1;
      if (parts[1] !== 'z') {
        lastPage = parseInt(parts[1]);
      }
    }

    const separateArgs = ['-f', firstPage.toString()];
    if (lastPage) {
      separateArgs.push('-l', lastPage.toString());
    }
    separateArgs.push(inputPath, outputPattern);

    const separateResult = await commandExecutor.execute('pdfseparate', separateArgs);

    if (!separateResult.success) {
      throw new Error(`Splitting failed: ${separateResult.error}`);
    }

    // 2. Zip the generated files
    const zipFilename = `split_${jobId}.zip`;
    const zipPath = path.join(outputDir, zipFilename);
    const filesInDir = await fs.readdir(outputDir);
    const pdfFiles = filesInDir
      .filter(f => f.startsWith('page-') && f.endsWith('.pdf'))
      .sort((a, b) => {
        const numA = parseInt(a.replace('page-', '').replace('.pdf', ''));
        const numB = parseInt(b.replace('page-', '').replace('.pdf', ''));
        return numA - numB;
      });

    if (pdfFiles.length === 0) {
      throw new Error('No pages were extracted');
    }

    const zipArgs = ['-j', zipPath, ...pdfFiles.map(f => path.join(outputDir, f))];
    const zipResult = await commandExecutor.execute('zip', zipArgs);

    if (!zipResult.success) {
      throw new Error(`Zipping failed: ${zipResult.error}`);
    }

    return {
      success: true,
      jobId,
      outputPath: zipPath,
      filename: zipFilename,
      message: 'PDF split and zipped successfully',
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
      '-dColorImageDownsampleType=/Bicubic',
      '-dColorImageResolution=72',
      '-dGrayImageDownsampleType=/Bicubic',
      '-dGrayImageResolution=72',
      '-dMonoImageDownsampleType=/Bicubic',
      '-dMonoImageResolution=72',
      `-sOutputFile=${outputPath}`,
      inputPath,
    ];

    const statsBefore = await fs.stat(inputPath);
    const result = await commandExecutor.execute('gs', args);

    if (!result.success) {
      throw new Error(`Compression failed: ${result.error}`);
    }

    const statsAfter = await fs.stat(outputPath);
    logger.info(`Compression [jobId=${jobId}]: ${statsBefore.size} -> ${statsAfter.size} bytes (${((statsBefore.size - statsAfter.size) / statsBefore.size * 100).toFixed(2)}% reduction)`);

    return {
      success: true,
      jobId,
      outputPath,
      filename,
      message: 'PDF compressed successfully',
    };
  }

  async pdfToImage(jobId: string, inputPath: string, outputDir: string): Promise<ProcessingResult> {
    const outputPrefix = path.join(outputDir, `page`); 
    
    // 1. Convert all pages to PNGs at a lower DPI to avoid exceeding ImageMagick limits
    const args = ['-png', '-r', '72', inputPath, outputPrefix];
    const result = await commandExecutor.execute('pdftoppm', args);

    if (!result.success) {
      throw new Error(`PDF to Image conversion failed: ${result.error}`);
    }

    // 2. Identify all generated images and sort them
    const filesInDir = await fs.readdir(outputDir);
    const images = filesInDir
      .filter(f => f.startsWith('page-') && f.endsWith('.png'))
      .sort((a, b) => {
        const numA = parseInt(a.replace('page-', '').replace('.png', ''));
        const numB = parseInt(b.replace('page-', '').replace('.png', ''));
        return numA - numB;
      });

    if (images.length === 0) {
      throw new Error('No images were generated');
    }

    // 3. Join images vertically using ImageMagick
    const joinedFilename = `joined_${jobId}.png`;
    const joinedPath = path.join(outputDir, joinedFilename);
    const convertArgs = [...images.map(img => path.join(outputDir, img)), '-append', joinedPath];
    
    const convertResult = await commandExecutor.execute('convert', convertArgs);

    if (!convertResult.success) {
      throw new Error(`Joining images failed: ${convertResult.error}`);
    }

    return {
      success: true,
      jobId,
      outputPath: joinedPath,
      filename: joinedFilename,
      message: 'PDF converted to a single joined image successfully',
    };
  }

  async imageToPdf(jobId: string, imagePaths: string[], outputDir: string): Promise<ProcessingResult> {
    const filename = `converted_${jobId}.pdf`;
    const outputPath = path.join(outputDir, filename);

    // Using ImageMagick to convert images to PDF
    const args = [...imagePaths, outputPath];
    const result = await commandExecutor.execute('convert', args);

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
