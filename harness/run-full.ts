/**
 * Full runner: N runs × C conditions = N×C cells. Defaults to N=5, 2
 * conditions = 10 cells. Override with `--n` and/or `--conditions`.
 *
 * Cells run in parallel batches capped at 5 (not all-at-once, not pairs of 2):
 *
 * - All cells in parallel risks Claude API rate limits and stresses the laptop
 *   (one Docker container + ~2 MCP subprocesses per cell). Token spend on a
 *   bad build would also be unrecoverable — every cell fires before any signal.
 * - Batches of 2 (pilot pattern) is safe but very slow on N=5 (~100min wall).
 * - Batches of 5 halve wall time vs the pilot pattern while giving us a
 *   checkpoint between batches: if batch 1 surfaces a regression, we haven't
 *   burned the back half of the run.
 *
 * Cells are split into ceil(total / 5) batches sized as evenly as possible —
 * so 6 cells run as 3+3, not 5+1 — and the interleaved cell order keeps each
 * batch balanced across conditions so library-specific issues surface in
 * batch 1, not just batch 2.
 *
 * Output lands in runs/<label>/.
 *
 * Usage:
 *   tsx harness/run-full.ts                                         # default label = ISO timestamp
 *   tsx harness/run-full.ts --label N5                              # human-friendly label
 *   tsx harness/run-full.ts --output-dir runs/2026-05-11T17-24-51Z  # reuse an existing dir
 *   tsx harness/run-full.ts --output-dir <dir> \                    # re-run only specific cells
 *     --cells video-js:3,video-js:4,mux-player:2
 *   tsx harness/run-full.ts --label N5-with-docs \                  # run only the with-docs arms
 *     --conditions video-js-with-docs,mux-player-with-docs
 *   tsx harness/run-full.ts --label N3 --n 3                         # override default N=5
 *
 * Cells that exit with code 3 (api-error halt — rate-limit, overload) abort
 * the whole run: no subsequent batches, no judges, no synthesis. See
 * run-cell-inner.ts for the detection logic. Re-running just the dead cells
 * after usage resets is the --cells path.
 */
import { resolve } from 'node:path';
import { mkdir } from 'node:fs/promises';
import { config as loadEnv } from 'dotenv';
import { runCell } from './run-cell.ts';
import { runJudges } from './run-judges.ts';
import { runSynthesis } from './run-synthesis.ts';

loadEnv();

function parseFlag(name: string): string | undefined {
  const args = process.argv.slice(2);
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : undefined;
}

function parseLabel(): string {
  return parseFlag('--label') ?? new Date().toISOString().replace(/:/g, '-').replace(/\.\d+Z$/, 'Z');
}

const N = parseN();

function parseN(): number {
  const raw = parseFlag('--n');
  if (!raw) return 5;
  const n = Number(raw);
  if (!Number.isInteger(n) || n < 1) {
    throw new Error(`bad --n value "${raw}" — must be a positive integer`);
  }
  return n;
}
// All known conditions. `--conditions` filters this list per-run; the
// default selection is the two baseline conditions so existing invocations
// are unchanged. "-with-docs" variants flip WITH_DOCS=1 in the container,
// which appends a soft docs hint to every rung — see run-cell.ts.
const CONDITIONS = [
  'video-js',
  'mux-player',
  'video-js-with-docs',
  'mux-player-with-docs',
] as const;
type Condition = (typeof CONDITIONS)[number];
const DEFAULT_CONDITIONS: readonly Condition[] = ['video-js', 'mux-player'];

type Cell = { condition: Condition; runIndex: string; outputDir: string };

function parseConditions(): readonly Condition[] {
  const raw = parseFlag('--conditions');
  if (!raw) return DEFAULT_CONDITIONS;
  const list = raw.split(',').map((s) => s.trim()).filter(Boolean);
  for (const c of list) {
    if (!(CONDITIONS as readonly string[]).includes(c)) {
      throw new Error(
        `bad --conditions entry "${c}" — must be one of ${CONDITIONS.join(', ')}`
      );
    }
  }
  return list as Condition[];
}

/**
 * Distribute cells into ceil(total/maxBatchSize) batches sized as evenly as
 * possible, preserving order. For 10 cells, maxBatchSize 5 → [5, 5]. For 6
 * cells, maxBatchSize 5 → [3, 3] (not [5, 1]). Combined with interleaved cell
 * order this keeps each batch balanced across conditions.
 */
function splitIntoBatches<T>(items: readonly T[], maxBatchSize: number): T[][] {
  if (items.length === 0) return [];
  const batchCount = Math.ceil(items.length / maxBatchSize);
  const batches: T[][] = [];
  for (let i = 0; i < batchCount; i++) {
    const start = Math.floor((i * items.length) / batchCount);
    const end = Math.floor(((i + 1) * items.length) / batchCount);
    batches.push(items.slice(start, end));
  }
  return batches;
}

function buildCells(rootDir: string, conditions: readonly Condition[]): Cell[] {
  // Interleave by run index so batches stay balanced across conditions.
  const cells: Cell[] = [];
  for (let i = 0; i < N; i++) {
    for (const condition of conditions) {
      cells.push({
        condition,
        runIndex: String(i),
        outputDir: resolve(rootDir, `${condition}_run-${i}`),
      });
    }
  }
  return cells;
}

/**
 * Parse --cells "video-js:3,video-js:4,mux-player:2". Returns a Set of
 * "condition:runIndex" strings; an empty/undefined value means run all cells.
 */
function parseCellFilter(): Set<string> | null {
  const raw = parseFlag('--cells');
  if (!raw) return null;
  const out = new Set<string>();
  for (const part of raw.split(',').map((s) => s.trim()).filter(Boolean)) {
    const [cond, idx] = part.split(':');
    if (!cond || !idx || !(CONDITIONS as readonly string[]).includes(cond)) {
      throw new Error(`bad --cells entry "${part}" — expected "<condition>:<runIndex>"`);
    }
    out.add(`${cond}:${idx}`);
  }
  return out;
}

async function runBatch(batchIndex: number, cells: Cell[]): Promise<{ apiHalt: boolean }> {
  console.log(`[full] batch ${batchIndex + 1}: starting ${cells.length} cells in parallel`);
  for (const c of cells) console.log(`[full]   - ${c.condition}_run-${c.runIndex}`);

  const cellResults = await Promise.allSettled(cells.map((c) => runCell(c)));

  let apiHalt = false;
  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i]!;
    const result = cellResults[i]!;
    const id = `${cell.condition}_run-${cell.runIndex}`;
    if (result.status === 'fulfilled') {
      console.log(`[full] ${id}: cell exit=${result.value}`);
      // Exit code 3 from run-cell-inner.ts = api error halt (rate-limit, etc).
      if (result.value === 3) apiHalt = true;
    } else {
      console.error(`[full] ${id}: cell failed`, result.reason);
    }
  }

  if (apiHalt) {
    console.error(
      `[full] batch ${batchIndex + 1}: api-error halt detected — skipping judges + remaining batches`
    );
    return { apiHalt: true };
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
  return { apiHalt: false };
}

async function main() {
  const repoRoot = resolve(import.meta.dirname, '..');
  const outputDirFlag = parseFlag('--output-dir');
  const runsDir = outputDirFlag
    ? resolve(repoRoot, outputDirFlag)
    : resolve(repoRoot, 'runs', parseLabel());
  await mkdir(runsDir, { recursive: true });
  console.log(`[full] output dir: ${runsDir}${outputDirFlag ? ' (reused)' : ''}`);

  const conditions = parseConditions();
  console.log(`[full] conditions: ${conditions.join(', ')}`);
  const cellFilter = parseCellFilter();
  let cells = buildCells(runsDir, conditions);
  if (cellFilter) {
    const before = cells.length;
    cells = cells.filter((c) => cellFilter.has(`${c.condition}:${c.runIndex}`));
    console.log(
      `[full] cell filter: keeping ${cells.length} of ${before} cells (${[...cellFilter].join(', ')})`
    );
    if (cells.length === 0) {
      console.error('[full] no cells match --cells filter');
      process.exit(2);
    }
  }

  const batches = splitIntoBatches(cells, 5);

  let aborted = false;
  for (let i = 0; i < batches.length; i++) {
    const { apiHalt } = await runBatch(i, batches[i]!);
    if (apiHalt) {
      aborted = true;
      break;
    }
  }

  if (aborted) {
    console.error(
      '[full] aborted — re-run the dead cells after usage resets:\n' +
        `      pnpm full -- --output-dir ${runsDir} --cells <list>`
    );
    process.exit(3);
  }

  console.log('[full] running synthesis');
  await runSynthesis(runsDir).catch((err) => {
    console.error('[full] synthesis failed:', err);
  });

  console.log('[full] all batches done.');
  console.log(`Read: ${resolve(runsDir, 'findings.md')}`);
  // List every expected cell summary, not just the filtered ones — useful
  // when reading a stitched-together re-run alongside the original.
  for (const cell of buildCells(runsDir, conditions)) {
    console.log(`      ${resolve(cell.outputDir, 'summary.md')}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
