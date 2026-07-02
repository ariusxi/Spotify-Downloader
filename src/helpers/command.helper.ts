import { spawn } from 'child_process';

import { withTimeout } from './timeout.helper';

const DEFAULT_TIMEOUT = 10_000_000;

export const executeCommand = async (module: string, args: string[], debug = false, timeout = DEFAULT_TIMEOUT): Promise<void> => {
  const command = new Promise<string>((resolve, reject) => {
    try {
      const process = spawn(module, args);

      if (debug) {
        process.stdout.on('data', (data) => console.log(data.toString()));
        process.stderr.on('data', (data) => console.error(data.toString()));
      }

      process.on('close', (code) => {
        if (code === 0) return resolve(module);
        reject();
      });
    } catch (error) {
      reject();
    }
  });

  await withTimeout<string>(command, timeout, () => {
    console.warn('Timeout atingindo, cancelando download');
  });
};
