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
    // 1. Separate the PDF into multiple files
    const outputPattern = path.join(outputDir, 'page-%d.pdf');
    
    // Determine the page range if possible (pdfseparate handles -f and -l)
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
    const pdfFiles = filesInDir.filter(f => f.startsWith('page-') && f.endsWith('.pdf'));

    if (pdfFiles.length === 0) {
      throw new Error('No pages were extracted');
    }

    // zip -j zipPath page-1.pdf page-2.pdf ...
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

    // More aggressive Ghostscript settings for compression
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
