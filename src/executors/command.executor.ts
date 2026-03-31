import { spawn } from 'child_process';
import { CommandResponse } from '../types/pdf.types.js';
import { logger } from '../utils/logger.js';

export class CommandExecutor {
  async execute(command: string, args: string[], timeout = 60000): Promise<CommandResponse> {
    return new Promise((resolve) => {
      logger.info(`Executing command: ${command} ${args.join(' ')}`);

      const child = spawn(command, args, {
        env: { ...process.env },
        shell: false, // Prevent command injection by not using shell
      });

      let stdout = '';
      let stderr = '';

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

      child.stdout.on('data', (data) => {
        stdout += data.toString();
      });

      child.stderr.on('data', (data) => {
        stderr += data.toString();
      });

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

export const commandExecutor = new CommandExecutor();
