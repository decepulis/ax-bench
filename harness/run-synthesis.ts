/**
 * Cross-cell synthesis. Reads every cell directory under a run parent and
 * emits findings.md combining:
 *
 *  1. Deterministic header + tables computed from metrics.json and judge outputs
 *  2. Two LLM-written sections (patterns + suggested next changes), explicitly
 *     labeled as drafts
 *
 * Layout (per cell): pass tally / hallucination count / eject category / tokens / cost.
 *
 * Usage:
 *   tsx harness/run-synthesis.ts --run-dir pilot/2026-04-29T16-30-12Z
 */
import { spawn } from 'node:child_process';
import { mkdir, readFile, readdir, writeFile, access, appendFile } from 'node:fs/promises';
import { join, resolve, basename } from 'node:path';
import { once } from 'node:events';
import { config as loadEnv } from 'dotenv';

loadEnv();

type RungUsage = {
  inputTokens: number;
  outputTokens: number;
  cacheCreationInputTokens: number;
  cacheReadInputTokens: number;
  totalCostUsd: number | null;
};

type RungSummary = {
  rung: number;
  durationMs: number;
  assertion?: { pass?: boolean };
  usage: RungUsage | null;
  timedOut: boolean;
};

type CellMetrics = {
  library: string;
  runIndex: string;
  totalDurationMs: number;
  rungs: RungSummary[];
};

type EjectJudgement = {
  decision?: string;
  description?: string;
};

type HallucinationOutput = {
  total?: number;
  hallucinations?: unknown[];
};

type VisualOutput = {
  score?: number;
  skipped?: boolean;
};

type JudgeUsage = RungUsage;

type CellAggregate = {
  cellName: string;
  library: string;
  runIndex: string;
  totalDurationMs: number;
  rungPasses: (boolean | null)[];
  rungTimedOuts: boolean[];
  agentTokens: RungUsage;
  judgeTokens: JudgeUsage | null;
  hallucinations: number;
  ejectDecision: string;
  visualScore: number | string;
};

const ZERO_USAGE: RungUsage = {
  inputTokens: 0,
  outputTokens: 0,
  cacheCreationInputTokens: 0,
  cacheReadInputTokens: 0,
  totalCostUsd: null,
};

function parseArgs() {
  const args = process.argv.slice(2);
  const i = args.indexOf('--run-dir');
  const runDir = i >= 0 ? args[i + 1] : undefined;
  if (!runDir) {
    console.error('--run-dir is required');
    process.exit(2);
  }
  return { runDir: resolve(runDir) };
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

async function readJsonOrNull<T>(path: string): Promise<T | null> {
  try {
    const raw = await readFile(path, 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

function sumUsage(a: RungUsage, b: RungUsage | null): RungUsage {
  if (!b) return a;
  return {
    inputTokens: a.inputTokens + b.inputTokens,
    outputTokens: a.outputTokens + b.outputTokens,
    cacheCreationInputTokens: a.cacheCreationInputTokens + b.cacheCreationInputTokens,
    cacheReadInputTokens: a.cacheReadInputTokens + b.cacheReadInputTokens,
    totalCostUsd:
      b.totalCostUsd != null ? (a.totalCostUsd ?? 0) + b.totalCostUsd : a.totalCostUsd,
  };
}

function fmtCost(c: number | null | undefined): string {
  return c != null ? `$${c.toFixed(4)}` : '—';
}

function fmtMinutes(ms: number): string {
  return `${(ms / 60_000).toFixed(1)}min`;
}

async function aggregateCell(cellDir: string): Promise<CellAggregate | null> {
  const metricsPath = join(cellDir, 'metrics.json');
  if (!(await fileExists(metricsPath))) return null;
  const metrics = await readJsonOrNull<CellMetrics>(metricsPath);
  if (!metrics) return null;

  const rungPasses: (boolean | null)[] = [];
  const rungTimedOuts: boolean[] = [];
  let agentTokens = { ...ZERO_USAGE };
  for (let r = 1; r <= 5; r++) {
    const rung = metrics.rungs.find((x) => x.rung === r);
    if (!rung) {
      rungPasses.push(null);
      rungTimedOuts.push(false);
      continue;
    }
    rungPasses.push(rung.assertion?.pass ?? null);
    rungTimedOuts.push(Boolean(rung.timedOut));
    agentTokens = sumUsage(agentTokens, rung.usage);
  }

  const judgeUsage = await readJsonOrNull<{ totals: JudgeUsage }>(
    join(cellDir, 'judges', 'usage.json')
  );
  const eject = await readJsonOrNull<EjectJudgement>(join(cellDir, 'judges', 'eject.json'));
  const hall = await readJsonOrNull<HallucinationOutput>(
    join(cellDir, 'judges', 'hallucinations.json')
  );
  const visual = await readJsonOrNull<VisualOutput>(
    join(cellDir, 'judges', 'visual-fidelity.json')
  );

  return {
    cellName: basename(cellDir),
    library: metrics.library,
    runIndex: metrics.runIndex,
    totalDurationMs: metrics.totalDurationMs,
    rungPasses,
    rungTimedOuts,
    agentTokens,
    judgeTokens: judgeUsage?.totals ?? null,
    hallucinations:
      typeof hall?.total === 'number'
        ? hall.total
        : Array.isArray(hall?.hallucinations)
        ? hall!.hallucinations!.length
        : 0,
    ejectDecision: eject?.decision ?? '—',
    visualScore: visual?.skipped ? '—' : visual?.score ?? '—',
  };
}

function renderHeader(cells: CellAggregate[], label: string): string {
  const wallMs = cells.reduce((m, c) => Math.max(m, c.totalDurationMs), 0);
  const totalAgentCost = cells.reduce(
    (sum, c) => sum + (c.agentTokens.totalCostUsd ?? 0),
    0
  );
  const totalJudgeCost = cells.reduce(
    (sum, c) => sum + (c.judgeTokens?.totalCostUsd ?? 0),
    0
  );
  const total = totalAgentCost + totalJudgeCost;
  const conditions = Array.from(new Set(cells.map((c) => c.library))).sort();
  return [
    `# Synthesis — ${label}`,
    '',
    `${cells.length} cells across ${conditions.length} condition${
      conditions.length === 1 ? '' : 's'
    } (${conditions.join(', ')}). Longest cell ${fmtMinutes(wallMs)}; agent cost ${fmtCost(
      totalAgentCost
    )}, judge cost ${fmtCost(totalJudgeCost)}, total ${fmtCost(total)}.`,
    '',
  ].join('\n');
}

function renderOutcomesTable(cells: CellAggregate[]): string {
  const head = '| Cell | Rung 1 | Rung 2 | Rung 3 | Rung 4 | Rung 5 | Halluc. | Eject | Visual |';
  const sep = '| --- | :---: | :---: | :---: | :---: | :---: | :---: | --- | :---: |';
  const rows = cells.map((c) => {
    const rungCells = c.rungPasses.map((p, i) => {
      if (c.rungTimedOuts[i]) return 'TO';
      if (p === true) return '✓';
      if (p === false) return '✗';
      return '—';
    });
    return `| ${c.cellName} | ${rungCells.join(' | ')} | ${c.hallucinations} | ${c.ejectDecision} | ${c.visualScore} |`;
  });
  return [
    '## Cell outcomes (deterministic)',
    '',
    'Rung legend: ✓ pass · ✗ fail · TO timed out · — not run.',
    '',
    head,
    sep,
    ...rows,
    '',
  ].join('\n');
}

function renderTokensTable(cells: CellAggregate[]): string {
  const head =
    '| Cell | Agent in | Agent out | Agent cost | Judge in | Judge out | Judge cost | Total cost |';
  const sep = '| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |';
  const rows = cells.map((c) => {
    const a = c.agentTokens;
    const j = c.judgeTokens;
    const total = (a.totalCostUsd ?? 0) + (j?.totalCostUsd ?? 0);
    return `| ${c.cellName} | ${a.inputTokens} | ${a.outputTokens} | ${fmtCost(
      a.totalCostUsd
    )} | ${j?.inputTokens ?? '—'} | ${j?.outputTokens ?? '—'} | ${fmtCost(
      j?.totalCostUsd ?? null
    )} | ${fmtCost(total)} |`;
  });
  return ['## Token / cost rollup (deterministic)', '', head, sep, ...rows, ''].join('\n');
}

async function invokeSynthesisJudge(opts: {
  prompt: string;
  runDir: string;
}): Promise<{ exitCode: number | null; output: string }> {
  const model = process.env.AX_BENCH_JUDGE_MODEL ?? 'claude-opus-4-7[1m]';
  const args = [
    '-p',
    opts.prompt,
    '--model',
    model,
    '--permission-mode',
    'bypassPermissions',
    '--output-format',
    'stream-json',
    '--verbose',
    '--disable-slash-commands',
    '--mcp-config',
    '{"mcpServers":{}}',
    '--strict-mcp-config',
    '--allowedTools',
    'Read,Glob,Grep',
    '--add-dir',
    opts.runDir,
  ];
  const child = spawn('claude', args, { stdio: ['ignore', 'pipe', 'inherit'] });
  let buffer = '';
  let resultText = '';
  child.stdout.on('data', (chunk: Buffer) => {
    buffer += chunk.toString('utf8');
    let idx;
    while ((idx = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, idx).trim();
      buffer = buffer.slice(idx + 1);
      if (!line) continue;
      try {
        const evt = JSON.parse(line);
        if (evt.type === 'result' && typeof evt.result === 'string') {
          resultText = evt.result;
        }
      } catch {
        /* ignore */
      }
    }
  });
  const [exitCode] = (await once(child, 'exit')) as [number | null];
  return { exitCode, output: resultText };
}

export async function runSynthesis(runDir: string): Promise<void> {
  const label = basename(runDir);
  console.log(`[synthesis] reading cells under ${runDir}`);

  const entries = await readdir(runDir, { withFileTypes: true });
  const cellDirs = entries
    .filter((e) => e.isDirectory())
    .map((e) => join(runDir, e.name))
    .sort();

  const cells: CellAggregate[] = [];
  for (const dir of cellDirs) {
    const agg = await aggregateCell(dir);
    if (agg) cells.push(agg);
  }
  if (cells.length === 0) {
    console.log('[synthesis] no cells with metrics.json — skipping');
    return;
  }

  const findingsPath = join(runDir, 'findings.md');
  await mkdir(runDir, { recursive: true });
  const deterministic = [
    renderHeader(cells, label),
    renderOutcomesTable(cells),
    renderTokensTable(cells),
    '---',
    '',
  ].join('\n');
  await writeFile(findingsPath, deterministic);
  console.log(`[synthesis] wrote deterministic header → ${findingsPath}`);

  // Invoke the synthesis judge with the run dir as context.
  const repoRoot = resolve(import.meta.dirname, '..');
  const promptPath = join(repoRoot, 'harness', 'judges', 'synthesis-judge.md');
  let prompt = await readFile(promptPath, 'utf8');
  prompt = prompt
    .replaceAll('{{FINDINGS_PATH}}', findingsPath)
    .replaceAll('{{RUN_DIR}}', runDir);

  console.log('[synthesis] invoking synthesis judge');
  const { exitCode, output } = await invokeSynthesisJudge({ prompt, runDir });
  if (exitCode !== 0) {
    console.error(`[synthesis] judge exited with code ${exitCode}`);
  }
  if (output.trim().length === 0) {
    await appendFile(findingsPath, '\n_(synthesis judge produced no output)_\n');
    return;
  }
  await appendFile(findingsPath, output.endsWith('\n') ? output : `${output}\n`);
  console.log(`[synthesis] done → ${findingsPath}`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const { runDir } = parseArgs();
  runSynthesis(runDir).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
