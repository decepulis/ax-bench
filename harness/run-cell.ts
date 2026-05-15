/**
 * Host-side wrapper: spawns one Docker container running run-cell-inner.ts
 * for a single condition/run combination. Output lands in runs/{condition}_run-{index}/.
 *
 * Usage:
 *   tsx harness/run-cell.ts --condition video-js --run-index 0
 *   tsx harness/run-cell.ts --condition mux-player --run-index 0 --output-dir pilot/...
 */
import { spawn } from 'node:child_process';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { once } from 'node:events';
import { config as loadEnv } from 'dotenv';

loadEnv();

// "*-with-docs" variants pass the same library to the container but flip
// WITH_DOCS=1, which appends a soft "See: <docs URL>" hint to every rung.
// Output dirs still use the full label so baseline and with-docs cells
// don't collide.
type Condition =
  | 'video-js'
  | 'mux-player'
  | 'video-js-with-docs'
  | 'mux-player-with-docs';
const CONDITIONS: readonly Condition[] = [
  'video-js',
  'mux-player',
  'video-js-with-docs',
  'mux-player-with-docs',
];

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (flag: string) => {
    const i = args.indexOf(flag);
    return i >= 0 ? args[i + 1] : undefined;
  };
  const condition = get('--condition') as Condition | undefined;
  const runIndex = get('--run-index') ?? '0';
  const outputDir = get('--output-dir');
  const imageTag = get('--image') ?? 'ax-bench:latest';
  if (!condition || !CONDITIONS.includes(condition)) {
    console.error(`--condition must be one of: ${CONDITIONS.join(', ')}`);
    process.exit(2);
  }
  return { condition, runIndex, outputDir, imageTag };
}

export async function runCell(opts: {
  condition: Condition;
  runIndex: string;
  outputDir?: string;
  imageTag?: string;
}): Promise<number> {
  const { condition, runIndex } = opts;
  const imageTag = opts.imageTag ?? 'ax-bench:latest';
  const repoRoot = resolve(import.meta.dirname, '..');
  const outputDir = resolve(
    opts.outputDir ?? resolve(repoRoot, 'runs', `${condition}_run-${runIndex}`)
  );

  await mkdir(outputDir, { recursive: true });

  const token = process.env.CLAUDE_CODE_OAUTH_TOKEN;
  if (!token) {
    console.error('CLAUDE_CODE_OAUTH_TOKEN missing from env (.env).');
    return 2;
  }

  const withDocs = condition.endsWith('-with-docs');
  const library = withDocs ? condition.replace(/-with-docs$/, '') : condition;

  const dockerArgs = [
    'run',
    '--rm',
    '--name',
    `ax-bench-${condition}-${runIndex}-${Date.now()}`,
    '-e',
    `CLAUDE_CODE_OAUTH_TOKEN=${token}`,
    '-e',
    `LIBRARY=${library}`,
    '-e',
    `WITH_DOCS=${withDocs ? '1' : '0'}`,
    '-e',
    `RUN_INDEX=${runIndex}`,
    '-e',
    `AX_BENCH_MODEL=${process.env.AX_BENCH_MODEL ?? 'claude-opus-4-7[1m]'}`,
    '-v',
    `${resolve(repoRoot, 'harness')}:/harness:ro`,
    '-v',
    `${outputDir}:/output`,
    imageTag,
    '/harness/run-cell-inner.ts',
  ];

  const redacted = dockerArgs.map((a) =>
    a.startsWith('CLAUDE_CODE_OAUTH_TOKEN=') ? 'CLAUDE_CODE_OAUTH_TOKEN=***REDACTED***' : a
  );
  console.log(`[run-cell] docker ${redacted.join(' ')}`);
  const child = spawn('docker', dockerArgs, { stdio: 'inherit' });
  const [exitCode] = (await once(child, 'exit')) as [number | null];
  return exitCode ?? 0;
}

// CLI entrypoint
if (import.meta.url === `file://${process.argv[1]}`) {
  const opts = parseArgs();
  runCell(opts).then((code) => process.exit(code));
}
