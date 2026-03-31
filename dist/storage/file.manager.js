import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../utils/logger.js';
/**
 * FileManager handles all filesystem-related operations for processing jobs.
 *
 * Responsibilities:
 * - Create and manage temporary working directories
 * - Generate unique job IDs
 * - Handle file storage (input/output)
 * - Clean up resources after processing
 *
 * Directory Structure:
 * /tmp/pdflynx/
 *   └── {jobId}/
 *        ├── input/
 *        └── output/
 *
 * Notes:
 * - Uses OS temp directory for performance and isolation
 * - Each job is sandboxed in its own directory
 * - Cleanup is important to prevent disk bloat
 */
export class FileManager {
    /**
     * Base directory for all temporary job files.
     */
    BASE_TEMP_DIR = '/tmp/pdflynx';
    /**
     * Initializes the FileManager and ensures base directory exists.
     */
    constructor() {
        this.ensureBaseDir();
    }
    /**
     * Ensures the base temporary directory exists.
     *
     * Behavior:
     * - Creates directory recursively if it doesn't exist
     * - Logs error if creation fails
     */
    async ensureBaseDir() {
        try {
            await fs.mkdir(this.BASE_TEMP_DIR, { recursive: true });
        }
        catch (err) {
            logger.error(`Error creating base temp directory: ${err}`);
        }
    }
    /**
     * Generates a unique job ID.
     *
     * @returns string - UUID v4 identifier
     *
     * Usage:
     * - Used to isolate file operations per job
     * - Acts as a reference for tracking processing tasks
     */
    generateJobId() {
        return uuidv4();
    }
    /**
     * Returns the full path to a job's directory.
     *
     * @param jobId - Unique job identifier
     * @returns string - Absolute path to job directory
     */
    getJobDir(jobId) {
        return path.join(this.BASE_TEMP_DIR, jobId);
    }
    /**
     * Creates input and output directories for a job.
     *
     * @param jobId - Unique job identifier
     * @returns Object containing inputDir and outputDir paths
     *
     * Behavior:
     * - Creates isolated directories for processing
     * - Ensures both directories exist before returning
     */
    async setupJobDir(jobId) {
        const jobDir = this.getJobDir(jobId);
        const inputDir = path.join(jobDir, 'input');
        const outputDir = path.join(jobDir, 'output');
        await fs.mkdir(inputDir, { recursive: true });
        await fs.mkdir(outputDir, { recursive: true });
        return { inputDir, outputDir };
    }
    /**
     * Cleans up (deletes) a job directory and all its contents.
     *
     * @param jobId - Unique job identifier
     *
     * Behavior:
     * - Recursively deletes job folder
     * - Uses force to avoid errors if directory doesn't exist
     * - Logs success or failure
     */
    async cleanupJobDir(jobId) {
        const jobDir = this.getJobDir(jobId);
        try {
            await fs.rm(jobDir, { recursive: true, force: true });
            logger.info(`Cleaned up job directory: ${jobDir}`);
        }
        catch (err) {
            logger.error(`Failed to cleanup job directory ${jobDir}: ${err}`);
        }
    }
    /**
     * Saves a file from a readable stream to disk.
     *
     * @param stream - Incoming file stream (e.g., from HTTP upload)
     * @param directory - Target directory path
     * @param filename - Desired filename
     * @returns Promise<string> - Full path to saved file
     *
     * Behavior:
     * - Creates file at specified location
     * - Pipes incoming stream into a writable stream
     * - Resolves when writing is complete
     * - Rejects on stream/write errors
     *
     * Notes:
     * - Overwrites file if it already exists
     * - Ensure filename is sanitized before calling this method
     */
    async saveFile(stream, directory, filename) {
        const filePath = path.join(directory, filename);
        const { createWriteStream } = await import('fs');
        const { pipeline } = await import('stream/promises');
        const writeStream = createWriteStream(filePath);
        try {
            await pipeline(stream, writeStream);
            return filePath;
        }
        catch (err) {
            logger.error(`Failed to save file ${filename}: ${err.message}`);
            throw err;
        }
    }
}
/**
 * Singleton instance of FileManager for application-wide usage.
 */
export const fileManager = new FileManager();
