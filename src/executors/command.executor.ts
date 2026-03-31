import { spawn } from 'child_process';
import { CommandResponse } from '../types/pdf.types.js';
import { logger } from '../utils/logger.js';

/**
 * CommandExecutor handles execution of external CLI commands.
 *
 * Responsibilities:
 * - Safely execute system commands
 * - Capture stdout and stderr output
 * - Enforce execution timeouts
 * - Normalize results into a consistent response format
 *
 * Security:
 * - Uses `spawn` with `shell: false` to prevent command injection
 * - Arguments are passed as an array (not string concatenation)
 *
 * Notes:
 * - All commands are async and non-blocking
 * - Timeout protection prevents hanging processes
 * - Output is buffered in memory (consider streaming for very large outputs)
 */
export class CommandExecutor {
  /**
   * Executes a system command with arguments.
   *
   * @param command - CLI command to execute (e.g., 'qpdf', 'gs', 'zip')
   * @param args - Array of arguments passed to the command
   * @param timeout - Maximum execution time in milliseconds (default: 60s)
   * @returns Promise<CommandResponse>
   *
   * Behavior:
   * - Spawns a child process
   * - Collects stdout and stderr
   * - Resolves on completion, error, or timeout
   * - Never throws (always resolves with a result object)
   *
   * Failure Cases:
   * - Non-zero exit code → success: false
   * - Process error → success: false
   * - Timeout → process killed, success: false
   */
  async execute(
    command: string,
    args: string[],
    timeout = 60000
  ): Promise<CommandResponse> {
    return new Promise((resolve) => {
      logger.info(`Executing command: ${command} ${args.join(' ')}`);

      const child = spawn(command, args, {
        /**
         * Inherit environment variables from parent process.
         */
        env: { ...process.env },

        /**
         * Disable shell execution for security.
         * Prevents command injection vulnerabilities.
         */
        shell: false,
      });

      let stdout = '';
      let stderr = '';

      /**
       * Timeout handler to prevent hanging processes.
       */
      const timer = setTimeout(() => {
        child.kill();
        logger.error(`Command timed out: ${command}`);

        resolve({
          success: false,
          code: null,
          output: stdout,
          error: 'Execution timed out',
        });
      }, timeout);

      /**
       * Collect standard output (stdout).
       */
      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      /**
       * Collect error output (stderr).
       */
      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      /**
       * Handle process-level errors (e.g., command not found).
       */
      child.on('error', (err) => {
        clearTimeout(timer);
        logger.error(`Command error: ${err.message}`);

        resolve({
          success: false,
          code: null,
          output: stdout,
          error: err.message,
        });
      });

      /**
       * Handle process completion.
       */
      child.on('close', (code) => {
        clearTimeout(timer);

        const success = code === 0;

        if (!success) {
          logger.warn(`Command failed with code ${code}: ${stderr}`);
        }

        resolve({
          success,
          code,
          output: stdout,
          error: stderr,
        });
      });
    });
  }
}

/**
 * Singleton instance of CommandExecutor for application-wide usage.
 */
export const commandExecutor = new CommandExecutor();