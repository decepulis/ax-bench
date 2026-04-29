/**
 * Full N=5 runner: 5 runs × 2 conditions = 10 cells.
 *
 * Cells run in 2 batches of 5 in parallel (not all 10 at once, not pairs of 2):
 *
 * - All 10 in parallel risks Claude API rate limits and stresses the laptop
 *   (10 Docker containers + 20 MCP subprocesses). Token spend on a bad
 *   build would also be unrecoverable — every cell fires before any signal.
 * - Batches of 2 (pilot pattern × 5) is safe but ~100min wall time.
 * - Batches of 5 halves wall time vs the pilot pattern (~40min total) while
 *   giving us a checkpoint between batches: if batch 1 surfaces a regression,
 *   we haven't burned the back half of the run.
 *
 * Each batch is a balanced 3/2 split of the two conditions so library-specific
 * issues show up in the first batch, not just the second.
 *
 * Output lands in runs/<label>/.
 *
 * Usage:
 *   tsx harness/run-full.ts                # label defaults to ISO timestamp
 *   tsx harness/run-full.ts --label N5     # human-friendly label
 */
import { resolve } from 'node:path';
import { mkdir } from 'node:fs/promises';
import { config as loadEnv } from 'dotenv';
import { runCell } from './run-cell.ts';
import { runJudges } from './run-judges.ts';
import { runSynthesis } from './run-synthesis.ts';

loadEnv();

function parseLabel(): string {
  const args = process.argv.slice(2);
  const i = args.indexOf('--label');
  if (i >= 0 && args[i + 1]) return args[i + 1]!;
  return new Date().toISOString().replace(/:/g, '-').replace(/\.\d+Z$/, 'Z');
}

const N = 5;
const CONDITIONS = ['video-js', 'mux-player'] as const;
type Condition = (typeof CONDITIONS)[number];

type Cell = { condition: Condition; runIndex: string; outputDir: string };

function buildCells(rootDir: string): Cell[] {
  // Interleave by run index so batches stay balanced across conditions.
  const cells: Cell[] = [];
  for (let i = 0; i < N; i++) {
    for (const condition of CONDITIONS) {
      cells.push({
        condition,
        runIndex: String(i),
        outputDir: resolve(rootDir, `${condition}_run-${i}`),
      });
    }
  }
  return cells;
}

async function runBatch(batchIndex: number, cells: Cell[]) {
  console.log(`[full] batch ${batchIndex + 1}: starting ${cells.length} cells in parallel`);
  for (const c of cells) console.log(`[full]   - ${c.condition}_run-${c.runIndex}`);

  const cellResults = await Promise.allSettled(cells.map((c) => runCell(c)));

  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i]!;
    const result = cellResults[i]!;
    const id = `${cell.condition}_run-${cell.runIndex}`;
    if (result.status === 'fulfilled') {
      console.log(`[full] ${id}: cell exit=${result.value}`);
    } else {
      console.error(`[full] ${id}: cell failed`, result.reason);
    }
  }

  console.log(`[full] batch ${batchIndex + 1}: running judges (parallel per cell)`);
  await Promise.all(
    cells.map((cell) =>
      runJudges(cell.outputDir).catch((err) => {
        console.error(`[full] judges failed for ${cell.condition}_run-${cell.runIndex}:`, err);
      })
    )
  );
  console.log(`[full] batch ${batchIndex + 1}: done`);
}

async function main() {
  const repoRoot = resolve(import.meta.dirname, '..');
  const label = parseLabel();
  const runsDir = resolve(repoRoot, 'runs', label);
  await mkdir(runsDir, { recursive: true });
  console.log(`[full] output dir: ${runsDir}`);

  const cells = buildCells(runsDir);
  const batchSize = 5;
  const batches: Cell[][] = [];
  for (let i = 0; i < cells.length; i += batchSize) {
    batches.push(cells.slice(i, i + batchSize));
  }

  for (let i = 0; i < batches.length; i++) {
    await runBatch(i, batches[i]!);
  }

  console.log('[full] running synthesis');
  await runSynthesis(runsDir).catch((err) => {
    console.error('[full] synthesis failed:', err);
  });

  console.log('[full] all batches done.');
  console.log(`Read: ${resolve(runsDir, 'findings.md')}`);
  for (const cell of cells) {
    console.log(`      ${resolve(cell.outputDir, 'summary.md')}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
