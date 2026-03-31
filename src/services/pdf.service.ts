import path from 'path';
import fs from 'fs/promises';
import { commandExecutor } from '../executors/command.executor.js';
import { logger } from '../utils/logger.js';
import { ProcessingResult } from '../types/pdf.types.js';

/**
 * PdfService handles all PDF-related processing operations.
 *
 * Responsibilities:
 * - Merge, split, compress PDFs
 * - Convert PDFs to images and vice versa
 * - Extract metadata (e.g., page count)
 *
 * Implementation Notes:
 * - Relies on external CLI tools:
 *   - qpdf (merge, page count)
 *   - pdfseparate (split)
 *   - zip (archiving)
 *   - Ghostscript (compression)
 *   - pdftoppm (PDF → image)
 *   - ImageMagick (image processing)
 *
 * Important:
 * - All operations are executed via commandExecutor (sandboxed execution layer)
 * - Errors are thrown for upstream handling (controller/middleware level)
 */
export class PdfService {
  /**
   * Merges multiple PDF files into a single document.
   *
   * @param jobId - Unique job identifier
   * @param inputPaths - Array of input PDF file paths
   * @param outputDir - Directory to store merged file
   * @returns ProcessingResult
   */
  async merge(
    jobId: string,
    inputPaths: string[],
    outputDir: string
  ): Promise<ProcessingResult> {
    if (!inputPaths || inputPaths.length < 2) {
      throw new Error('At least two PDF files are required for merging');
    }

    const filename = `merged_${jobId}.pdf`;
    const outputPath = path.join(outputDir, filename);

    // qpdf merge command
    const args = ['--empty', '--pages', ...inputPaths, '--', outputPath];
    const result = await commandExecutor.execute('qpdf', args, 120000);

    if (!result.success) {
      throw new Error(`Merge failed: ${result.error}`);
    }

    const stats = await fs.stat(outputPath).catch(() => null);
    if (!stats || stats.size === 0) {
      throw new Error('Merge resulted in an empty file');
    }

    return {
      success: true,
      jobId,
      outputPath,
      filename,
      message: 'PDFs merged successfully',
    };
  }

  /**
   * Splits a PDF into individual pages and zips the result.
   *
   * @param jobId - Unique job identifier
   * @param inputPath - Input PDF file path
   * @param outputDir - Directory to store output
   * @param pageRange - Page range (e.g., "1-5", "2-z")
   * @returns ProcessingResult (ZIP file)
   *
   * Workflow:
   * 1. Extract pages using pdfseparate
   * 2. Sort generated files
   * 3. Archive them into a ZIP
   */
  async split(
    jobId: string,
    inputPath: string,
    outputDir: string,
    pageRange: string = '1-z'
  ): Promise<ProcessingResult> {
    const outputPattern = path.join(outputDir, 'page-%d.pdf');

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
    if (lastPage) separateArgs.push('-l', lastPage.toString());
    separateArgs.push(inputPath, outputPattern);

    const separateResult = await commandExecutor.execute(
      'pdfseparate',
      separateArgs,
      120000
    );

    if (!separateResult.success) {
      throw new Error(`Splitting failed: ${separateResult.error}`);
    }

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
    const zipResult = await commandExecutor.execute('zip', zipArgs, 120000);

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

  /**
   * Compresses a PDF using Ghostscript.
   *
   * @param jobId - Unique job identifier
   * @param inputPath - Input PDF file path
   * @param outputDir - Directory to store compressed file
   * @returns ProcessingResult
   *
   * Notes:
   * - Uses low-resolution settings (/screen) for aggressive compression
   * - Logs compression ratio for monitoring
   */
  async compress(
    jobId: string,
    inputPath: string,
    outputDir: string
  ): Promise<ProcessingResult> {
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
    const result = await commandExecutor.execute('gs', args, 180000); // Extended timeout

    if (!result.success) {
      throw new Error(`Compression failed: ${result.error}`);
    }

    const statsAfter = await fs.stat(outputPath).catch(() => null);
    if (!statsAfter || statsAfter.size === 0) {
      throw new Error('Compression resulted in an empty file');
    }

    logger.info(
      `Compression [jobId=${jobId}]: ${statsBefore.size} -> ${statsAfter.size} bytes (${(
        ((statsBefore.size - statsAfter.size) / statsBefore.size) *
        100
      ).toFixed(2)}% reduction)`
    );

    return {
      success: true,
      jobId,
      outputPath,
      filename,
      message: 'PDF compressed successfully',
    };
  }

  /**
   * Converts a PDF into images and joins them into a single image.
   *
   * @param jobId - Unique job identifier
   * @param inputPath - Input PDF file path
   * @param outputDir - Directory to store images
   * @param pageRange - Page range (e.g., "1-3", "1-z")
   * @returns ProcessingResult (single joined image)
   *
   * Workflow:
   * 1. Convert PDF pages → PNG (pdftoppm)
   * 2. Sort generated images
   * 3. Join images vertically (ImageMagick)
   */
  async pdfToImage(
    jobId: string,
    inputPath: string,
    outputDir: string,
    pageRange: string = '1-z'
  ): Promise<ProcessingResult> {
    const outputPrefix = path.join(outputDir, `page`);

    let firstPage = 1;
    let lastPage: number | undefined;

    if (pageRange && pageRange.includes('-')) {
      const parts = pageRange.split('-');
      firstPage = parseInt(parts[0]) || 1;
      if (parts[1] !== 'z') {
        lastPage = parseInt(parts[1]);
      }
    }

    const args = ['-png', '-r', '72', '-f', firstPage.toString()];
    if (lastPage) args.push('-l', lastPage.toString());
    args.push(inputPath, outputPrefix);

    const result = await commandExecutor.execute('pdftoppm', args, 180000);

    if (!result.success) {
      throw new Error(`PDF to Image conversion failed: ${result.error}`);
    }

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

    const joinedFilename = `joined_${jobId}.png`;
    const joinedPath = path.join(outputDir, joinedFilename);

    const convertArgs = [
      ...images.map(img => path.join(outputDir, img)),
      '-append',
      joinedPath,
    ];

    const convertResult = await commandExecutor.execute(
      'convert',
      convertArgs,
      180000
    );

    if (!convertResult.success) {
      throw new Error(`Joining images failed: ${convertResult.error}`);
    }

    const stats = await fs.stat(joinedPath).catch(() => null);
    if (!stats || stats.size === 0) {
      throw new Error('Image joining resulted in an empty file');
    }

    return {
      success: true,
      jobId,
      outputPath: joinedPath,
      filename: joinedFilename,
      message: 'PDF converted to a single joined image successfully',
    };
  }

  /**
   * Retrieves the total number of pages in a PDF.
   *
   * @param inputPath - Input PDF file path
   * @returns number - Page count
   */
  async getPageCount(inputPath: string): Promise<number> {
    const result = await commandExecutor.execute('qpdf', [
      '--show-npages',
      inputPath,
    ]);

    if (!result.success) {
      throw new Error(`Could not get page count: ${result.error}`);
    }

    return parseInt(result.output.trim());
  }

  /**
   * Converts multiple images into a single PDF.
   *
   * @param jobId - Unique job identifier
   * @param imagePaths - Array of image file paths
   * @param outputDir - Directory to store PDF
   * @returns ProcessingResult
   */
  async imageToPdf(
    jobId: string,
    imagePaths: string[],
    outputDir: string
  ): Promise<ProcessingResult> {
    if (!imagePaths || imagePaths.length === 0) {
      throw new Error('At least one image is required');
    }

    const filename = `converted_${jobId}.pdf`;
    const outputPath = path.join(outputDir, filename);

    const args = [...imagePaths, outputPath];
    const result = await commandExecutor.execute('convert', args, 180000);

    if (!result.success) {
      throw new Error(`Image to PDF failed: ${result.error}`);
    }

    const stats = await fs.stat(outputPath).catch(() => null);
    if (!stats || stats.size === 0) {
      throw new Error('Conversion resulted in an empty PDF');
    }

    return {
      success: true,
      jobId,
      outputPath,
      filename,
      message: 'Images converted to PDF successfully',
    };
  }

  /**
   * Converts a URL or local HTML file to PDF using LibreOffice.
   *
   * @param jobId - Unique job identifier
   * @param options - Object containing url or htmlFile path
   * @param outputDir - Directory to store PDF
   * @returns ProcessingResult
   */
  async htmlToPdf(
    jobId: string,
    options: { url?: string; htmlFile?: string },
    outputDir: string
  ): Promise<ProcessingResult> {
    const { url, htmlFile } = options;
    let inputPath = htmlFile;

    if (url) {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const html = await response.text();
        inputPath = path.join(outputDir, `content_${jobId}.html`);
        await fs.writeFile(inputPath, html);
      } catch (error: any) {
        throw new Error(`Failed to fetch URL: ${error.message}`);
      }
    }

    if (!inputPath) {
      throw new Error('No HTML source provided');
    }

    const filename = `converted_${jobId}.pdf`;
    const outputPath = path.join(outputDir, filename);

    // libreoffice --headless --convert-to pdf input.html --outdir output/
    const args = [
      '--headless',
      '--convert-to',
      'pdf',
      inputPath,
      '--outdir',
      outputDir,
    ];

    const result = await commandExecutor.execute('libreoffice', args, 180000);

    if (!result.success) {
      throw new Error(`HTML to PDF conversion failed: ${result.error}`);
    }

    // LibreOffice creates a file with the same name as the input (but .pdf extension)
    const baseName = path.basename(inputPath, path.extname(inputPath));
    const generatedPath = path.join(outputDir, `${baseName}.pdf`);

    // Rename to our standardized filename
    if (generatedPath !== outputPath) {
      try {
        await fs.rename(generatedPath, outputPath);
      } catch (err) {
        // Fallback: check if the file exists anyway
        const exists = await fs.access(generatedPath).then(() => true).catch(() => false);
        if (exists) await fs.rename(generatedPath, outputPath);
      }
    }

    const stats = await fs.stat(outputPath).catch(() => null);
    if (!stats || stats.size === 0) {
      throw new Error('HTML to PDF resulted in an empty file');
    }

    return {
      success: true,
      jobId,
      outputPath,
      filename,
      message: 'HTML converted to PDF successfully',
    };
  }

  /**
   * Protects a PDF with a password using qpdf.
   *
   * @param jobId - Unique job identifier
   * @param inputPath - Input PDF file path
   * @param password - Password to set
   * @param outputDir - Directory to store protected PDF
   * @returns ProcessingResult
   */
  async protect(
    jobId: string,
    inputPath: string,
    password: string,
    outputDir: string
  ): Promise<ProcessingResult> {
    const filename = `protected_${jobId}.pdf`;
    const outputPath = path.join(outputDir, filename);

    // qpdf --encrypt user-pw owner-pw 256 -- input.pdf output.pdf
    const args = [
      '--encrypt',
      password,
      password, // Using same password for owner for simplicity
      '256',
      '--',
      inputPath,
      outputPath,
    ];

    const result = await commandExecutor.execute('qpdf', args, 60000);

    if (!result.success) {
      throw new Error(`Protection failed: ${result.error}`);
    }

    const stats = await fs.stat(outputPath).catch(() => null);
    if (!stats || stats.size === 0) {
      throw new Error('Protection resulted in an empty file');
    }

    return {
      success: true,
      jobId,
      outputPath,
      filename,
      message: 'PDF protected successfully',
    };
  }

  /**
   * Removes password protection from a PDF using qpdf.
   *
   * @param jobId - Unique job identifier
   * @param inputPath - Input PDF file path
   * @param password - Password to unlock
   * @param outputDir - Directory to store unlocked PDF
   * @returns ProcessingResult
   */
  async unlock(
    jobId: string,
    inputPath: string,
    password: string,
    outputDir: string
  ): Promise<ProcessingResult> {
    const filename = `unlocked_${jobId}.pdf`;
    const outputPath = path.join(outputDir, filename);

    // qpdf --password=... --decrypt input output
    const args: string[] = [];
    if (password) {
      args.push(`--password=${password}`);
    }
    args.push('--decrypt', '--', inputPath, outputPath);

    const result = await commandExecutor.execute('qpdf', args, 60000);

    if (!result.success) {
      throw new Error(`Unlock failed: ${result.error}`);
    }

    const stats = await fs.stat(outputPath).catch(() => null);
    if (!stats || stats.size === 0) {
      throw new Error('Unlock resulted in an empty file');
    }

    return {
      success: true,
      jobId,
      outputPath,
      filename,
      message: 'PDF unlocked successfully',
    };
  }

  /**
   * Transforms PDF pages (Rotate or Flip) using qpdf or ImageMagick.
   *
   * @param jobId - Unique job identifier
   * @param inputPath - Input PDF file path
   * @param transformation - Transformation to apply (90, 180, 270, flipH, flipV)
   * @param outputDir - Directory to store transformed PDF
   * @param pageRange - Page range for flipping (e.g., '1-2', '5-5', '1-z')
   * @returns ProcessingResult
   */
  async rotate(
    jobId: string,
    inputPath: string,
    transformation: string,
    outputDir: string,
    pageRange: string = '1-z'
  ): Promise<ProcessingResult> {
    const filename = `transformed_${jobId}.pdf`;
    const outputPath = path.join(outputDir, filename);

    if (['90', '180', '270'].includes(transformation)) {
      // Rotation using qpdf (Current logic as requested)
      const args = [inputPath, `--rotate=${transformation}:1-z`, outputPath];
      const result = await commandExecutor.execute('qpdf', args, 60000);
      if (!result.success) throw new Error(`Rotation failed: ${result.error}`);
    } else if (transformation === 'flipH' || transformation === 'flipV') {
      // Flip using Image-based approach as requested
      const pagePrefix = path.join(outputDir, 'page');
      
      // 1. Convert specific pages to images
      let firstPage = 1;
      let lastPage: number | undefined;

      if (pageRange && pageRange.includes('-')) {
        const parts = pageRange.split('-');
        firstPage = parseInt(parts[0]) || 1;
        if (parts[1] !== 'z') {
          lastPage = parseInt(parts[1]);
        }
      } else if (pageRange && !isNaN(parseInt(pageRange))) {
        firstPage = parseInt(pageRange);
        lastPage = firstPage;
      }

      const ppmArgs = ['-png', '-r', '300', '-f', firstPage.toString()];
      if (lastPage) ppmArgs.push('-l', lastPage.toString());
      ppmArgs.push(inputPath, pagePrefix);

      const ppmResult = await commandExecutor.execute('pdftoppm', ppmArgs, 180000);
      if (!ppmResult.success) throw new Error(`PDF to Image failed: ${ppmResult.error}`);

      // 2. Identify generated image files
      const files = await fs.readdir(outputDir);
      const images = files
        .filter(f => f.startsWith('page-') && f.endsWith('.png'))
        .sort((a, b) => {
          const numA = parseInt(a.match(/page-(\d+)\.png/)?.[1] || '0');
          const numB = parseInt(b.match(/page-(\d+)\.png/)?.[1] || '0');
          return numA - numB;
        });

      if (images.length === 0) throw new Error('No pages were extracted for flipping');

      // 3. Flip the images
      const mogrifyArg = transformation === 'flipH' ? '-flop' : '-flip';
      const mogrifyArgs = [mogrifyArg, ...images.map(img => path.join(outputDir, img))];
      const mogrifyResult = await commandExecutor.execute('mogrify', mogrifyArgs, 180000);
      if (!mogrifyResult.success) throw new Error(`Image flipping failed: ${mogrifyResult.error}`);

      // 4. Convert images back to PDF
      const convertArgs = [...images.map(img => path.join(outputDir, img)), outputPath];
      const convertResult = await commandExecutor.execute('convert', convertArgs, 180000);
      if (!convertResult.success) throw new Error(`Re-encoding to PDF failed: ${convertResult.error}`);
    } else {
      throw new Error(`Unsupported transformation: ${transformation}`);
    }

    const stats = await fs.stat(outputPath).catch(() => null);
    if (!stats || stats.size === 0) {
      throw new Error('Transformation resulted in an empty file');
    }

    return {
      success: true,
      jobId,
      outputPath,
      filename,
      message: 'PDF page transformation applied successfully',
    };
  }
}

/**
 * Singleton instance of PdfService for application-wide usage.
 */
export const pdfService = new PdfService();