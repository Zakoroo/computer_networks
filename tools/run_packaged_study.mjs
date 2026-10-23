// Playwright owns this wrapper; it stops only the executable it launched.
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const executable = process.env.NETWORK_STUDY_EXECUTABLE;
if (!executable) throw new Error('NETWORK_STUDY_EXECUTABLE is required');
const directory = mkdtempSync(join(tmpdir(), 'network study browser '));
const stopFile = join(directory, 'stop');
const emptyPath = join(directory, 'empty-path');
mkdirSync(emptyPath);
const child = spawn(resolve(executable), ['--headless', '--no-browser', '--stop-file', stopFile], {
  cwd: directory,
  env: { ...Object.fromEntries(Object.entries(process.env).filter(([key]) => key.toLowerCase() !== 'path')), PATH: emptyPath },
  stdio: 'inherit',
});
let stopping = false;
function stop() {
  if (stopping) return;
  stopping = true;
  writeFileSync(stopFile, 'stop');
  setTimeout(() => child.kill('SIGKILL'), 10_000).unref();
}
process.on('SIGTERM', stop);
process.on('SIGINT', stop);
child.on('error', error => { console.error(error.message); process.exitCode = 1; });
child.on('close', (code, signal) => {
  rmSync(directory, { recursive: true, force: true });
  process.exit(code ?? (signal ? 1 : 0));
});
