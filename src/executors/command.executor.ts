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
      let isCompleted = false;
      const MAX_BUFFER = 50 * 1024 * 1024; // 50MB max buffer protection

      const complete = (
        success: boolean,
        code: number | null,
        out: string,
        err: string
      ) => {
        if (isCompleted) return;
        isCompleted = true;
        clearTimeout(timer);

        if (!success && err !== 'Execution timed out' && err !== 'Buffer limit exceeded') {
          logger.warn(`Command failed ${code !== null ? `with code ${code}` : ''}: ${err}`);
        }

        resolve({ success, code, output: out, error: err });
      };

      /**
       * Timeout handler to prevent hanging processes.
       */
      const timer = setTimeout(() => {
        if (isCompleted) return;
        child.kill('SIGKILL');
        logger.error(`Command timed out: ${command}`);
        complete(false, null, stdout, 'Execution timed out');
      }, timeout);

      const checkBufferLimit = () => {
        if (stdout.length + stderr.length > MAX_BUFFER) {
          child.kill('SIGKILL');
          logger.error(`Command output exceeded max buffer: ${command}`);
          complete(false, null, '', 'Buffer limit exceeded');
        }
      };

      /**
       * Collect standard output (stdout) and enforce buffer limits.
       */
      child.stdout.on('data', (data) => {
        stdout += data.toString();
        checkBufferLimit();
      });

      /**
       * Collect error output (stderr) and enforce buffer limits.
       */
      child.stderr.on('data', (data) => {
        stderr += data.toString();
        checkBufferLimit();
      });

      /**
       * Handle process-level errors (e.g., command not found).
       */
      child.on('error', (err) => {
        logger.error(`Command error: ${err.message}`);
        complete(false, null, stdout, err.message);
      });

      /**
       * Handle process completion.
       */
      child.on('close', (code) => {
        complete(code === 0, code, stdout, stderr);
      });
    });
  }
}

/**
 * Singleton instance of CommandExecutor for application-wide usage.
 */
export const commandExecutor = new CommandExecutor();