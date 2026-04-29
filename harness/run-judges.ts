/**
 * Post-processing step. Reads the artifacts a run-cell produced and invokes
 * the claude CLI on the host (using the user's normal Claude.ai OAuth auth)
 * to run three judges + a summarizer. Writes judge outputs and summary.md
 * into the run directory.
 *
 * Usage:
 *   tsx harness/run-judges.ts --output-dir runs/video-js_run-0
 */
import { spawn } from 'node:child_process';
import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { once } from 'node:events';
import { config as loadEnv } from 'dotenv';

loadEnv();

const LIBRARY_LABEL: Record<string, string> = {
  'video-js': 'Video.js 10',
  'mux-player': 'Mux Player',
};

const LIBRARY_DOCS: Record<string, string> = {
  'video-js': 'https://videojs.org',
  'mux-player': 'https://www.mux.com/docs/guides/mux-player-web',
};

function parseArgs() {
  const args = process.argv.slice(2);
  const get = (flag: string) => {
    const i = args.indexOf(flag);
    return i >= 0 ? args[i + 1] : undefined;
  };
  const outputDir = get('--output-dir');
  if (!outputDir) {
    console.error('--output-dir is required');
    process.exit(2);
  }
  return { outputDir: resolve(outputDir) };
}

async function fileExists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch {
    return false;
  }
}

type JudgeUsage = {
  inputTokens: number;
  outputTokens: number;
  cacheCreationInputTokens: number;
  cacheReadInputTokens: number;
  totalCostUsd: number | null;
};

async function invokeClaude(opts: {
  prompt: string;
  outputPath: string;
  addDirs?: string[];
}): Promise<{ exitCode: number | null; usage: JudgeUsage | null }> {
  const model = process.env.AX_BENCH_JUDGE_MODEL ?? 'claude-opus-4-7[1m]';
  // Judges run on host with OAuth auth, so we can't use --bare (API-key only).
  // Instead, lock them down to read-only tools and disable skills + user MCPs
  // so a judge can't accidentally Slack/email/post on our behalf.
  // stream-json output lets us capture usage + cost from the terminal
  // `result` event without losing the judge's actual response.
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
    'Read,Glob,Grep,WebFetch,WebSearch',
  ];
  for (const dir of opts.addDirs ?? []) {
    args.push('--add-dir', dir);
  }

  const child = spawn('claude', args, { stdio: ['ignore', 'pipe', 'inherit'] });
  let buffer = '';
  let resultText = '';
  let usage: JudgeUsage | null = null;

  child.stdout.on('data', (chunk: Buffer) => {
    buffer += chunk.toString('utf8');
    let idx;
    while ((idx = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, idx).trim();
      buffer = buffer.slice(idx + 1);
      if (!line) continue;
      try {
        const evt = JSON.parse(line);
        if (evt.type === 'result') {
          if (typeof evt.result === 'string') resultText = evt.result;
          if (evt.usage) {
            const u = evt.usage;
            usage = {
              inputTokens: Number(u.input_tokens ?? 0),
              outputTokens: Number(u.output_tokens ?? 0),
              cacheCreationInputTokens: Number(u.cache_creation_input_tokens ?? 0),
              cacheReadInputTokens: Number(u.cache_read_input_tokens ?? 0),
              totalCostUsd:
                typeof evt.total_cost_usd === 'number' ? evt.total_cost_usd : null,
            };
          }
        }
      } catch {
        /* non-JSON line — ignore */
      }
    }
  });

  const [exitCode] = (await once(child, 'exit')) as [number | null];
  await writeFile(opts.outputPath, resultText);
  return { exitCode, usage };
}

async function loadJudgePrompt(name: string, replacements: Record<string, string>) {
  const repoRoot = resolve(import.meta.dirname, '..');
  const tplPath = join(repoRoot, 'harness', 'judges', `${name}.md`);
  let tpl = await readFile(tplPath, 'utf8');
  for (const [k, v] of Object.entries(replacements)) {
    tpl = tpl.replaceAll(`{{${k}}}`, v);
  }
  return tpl;
}

export async function runJudges(outputDir: string) {
  const metricsPath = join(outputDir, 'metrics.json');
  const metrics = JSON.parse(await readFile(metricsPath, 'utf8')) as {
    library: string;
    runIndex: string;
  };
  const libraryLabel = LIBRARY_LABEL[metrics.library] ?? metrics.library;
  const libraryDocs = LIBRARY_DOCS[metrics.library] ?? '';

  const judgesDir = join(outputDir, 'judges');
  await mkdir(judgesDir, { recursive: true });

  const baseReplacements = {
    LIBRARY_LABEL: libraryLabel,
    LIBRARY_DOCS_URL: libraryDocs,
    OUTPUT_DIR: outputDir,
    RUN_INDEX: metrics.runIndex,
  };

  // The three fact-finding judges (hallucinations, eject, visual-fidelity)
  // are independent and run in parallel. The summarizer reads their outputs
  // and runs after they all finish.
  const refImage = resolve(import.meta.dirname, '..', 'harness', 'assets', 'youtube-reference.png');
  const candImage = join(outputDir, 'screenshots', 'rung-5-final.png');
  const hasRef = await fileExists(refImage);
  const hasCand = await fileExists(candImage);

  console.log(`[judges] ${metrics.library}: hallucinations + eject + visual-fidelity (parallel)`);

  const hallucinationsTask = (async () => {
    const prompt = await loadJudgePrompt('hallucination-judge', baseReplacements);
    return invokeClaude({
      prompt,
      outputPath: join(judgesDir, 'hallucinations.json'),
      addDirs: [outputDir],
    });
  })();

  const ejectTask = (async () => {
    const prompt = await loadJudgePrompt('eject-judge', baseReplacements);
    return invokeClaude({
      prompt,
      outputPath: join(judgesDir, 'eject.json'),
      addDirs: [outputDir],
    });
  })();

  const visualTask = (async () => {
    if (!hasRef || !hasCand) {
      console.log(
        `[judges] ${metrics.library}: skipping visual-fidelity (ref=${hasRef}, candidate=${hasCand})`
      );
      await writeFile(
        join(judgesDir, 'visual-fidelity.json'),
        JSON.stringify({ skipped: true, reason: 'missing reference or candidate image' }, null, 2)
      );
      return { exitCode: 0, usage: null };
    }
    const prompt = await loadJudgePrompt('visual-fidelity-judge', {
      ...baseReplacements,
      REFERENCE_PATH: refImage,
      CANDIDATE_PATH: candImage,
    });
    return invokeClaude({
      prompt,
      outputPath: join(judgesDir, 'visual-fidelity.json'),
      addDirs: [outputDir, resolve(import.meta.dirname, '..', 'harness', 'assets')],
    });
  })();

  const [hallucinationsResult, ejectResult, visualResult] = await Promise.all([
    hallucinationsTask,
    ejectTask,
    visualTask,
  ]);

  console.log(`[judges] ${metrics.library}: summarizer`);
  const sPrompt = await loadJudgePrompt('summarizer', baseReplacements);
  const summarizerResult = await invokeClaude({
    prompt: sPrompt,
    outputPath: join(outputDir, 'summary.md'),
    addDirs: [outputDir],
  });

  // Aggregate token usage so cost-per-cell rolls up cleanly.
  const usagePerJudge = {
    hallucinations: hallucinationsResult.usage,
    eject: ejectResult.usage,
    visualFidelity: visualResult.usage,
    summarizer: summarizerResult.usage,
  };
  type Totals = {
    inputTokens: number;
    outputTokens: number;
    cacheCreationInputTokens: number;
    cacheReadInputTokens: number;
    totalCostUsd: number | null;
  };
  const totals: Totals = Object.values(usagePerJudge).reduce<Totals>(
    (acc, u) => {
      if (!u) return acc;
      acc.inputTokens += u.inputTokens;
      acc.outputTokens += u.outputTokens;
      acc.cacheCreationInputTokens += u.cacheCreationInputTokens;
      acc.cacheReadInputTokens += u.cacheReadInputTokens;
      if (u.totalCostUsd != null) acc.totalCostUsd = (acc.totalCostUsd ?? 0) + u.totalCostUsd;
      return acc;
    },
    {
      inputTokens: 0,
      outputTokens: 0,
      cacheCreationInputTokens: 0,
      cacheReadInputTokens: 0,
      totalCostUsd: null,
    }
  );
  await writeFile(
    join(judgesDir, 'usage.json'),
    JSON.stringify({ perJudge: usagePerJudge, totals }, null, 2)
  );
  console.log(
    `[judges] ${metrics.library}: cost ${totals.totalCostUsd != null ? `$${totals.totalCostUsd.toFixed(4)}` : '?'} (in=${totals.inputTokens} out=${totals.outputTokens})`
  );

  console.log(`[judges] ${metrics.library}: done. Summary at ${join(outputDir, 'summary.md')}`);
}

// CLI entrypoint
if (import.meta.url === `file://${process.argv[1]}`) {
  const { outputDir } = parseArgs();
  runJudges(outputDir).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
