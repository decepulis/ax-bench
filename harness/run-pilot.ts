/**
 * Pilot runner: spawns two run-cell containers in parallel (Video.js + Mux Player),
 * each walking through the full 5-rung journey. After both complete, runs judges
 * on each and writes per-run summaries. Output lands in pilot/.
 *
 * Usage:
 *   tsx harness/run-pilot.ts
 */
import { resolve } from 'node:path';
import { mkdir } from 'node:fs/promises';
import { config as loadEnv } from 'dotenv';
import { runCell } from './run-cell.ts';
import { runJudges } from './run-judges.ts';

loadEnv();

async function main() {
  const repoRoot = resolve(import.meta.dirname, '..');
  const pilotDir = resolve(repoRoot, 'pilot');
  await mkdir(pilotDir, { recursive: true });

  const cells = [
    { condition: 'video-js' as const, runIndex: '0', outputDir: resolve(pilotDir, 'video-js_run-0') },
    { condition: 'mux-player' as const, runIndex: '0', outputDir: resolve(pilotDir, 'mux-player_run-0') },
  ];

  console.log('[pilot] starting 2 cells in parallel');
  const cellResults = await Promise.allSettled(cells.map((c) => runCell(c)));

  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i]!;
    const result = cellResults[i]!;
    if (result.status === 'fulfilled') {
      console.log(`[pilot] ${cell.condition}: cell exit=${result.value}`);
    } else {
      console.error(`[pilot] ${cell.condition}: cell failed`, result.reason);
    }
  }

  console.log('[pilot] running judges on each cell (parallel)');
  await Promise.all(
    cells.map((cell) =>
      runJudges(cell.outputDir).catch((err) => {
        console.error(`[pilot] judges failed for ${cell.condition}:`, err);
      })
    )
  );

  console.log('[pilot] done.');
  console.log(`Read: ${resolve(pilotDir, 'video-js_run-0/summary.md')}`);
  console.log(`      ${resolve(pilotDir, 'mux-player_run-0/summary.md')}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
