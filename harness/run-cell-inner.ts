/**
 * Runs INSIDE the Docker container. Executes one cumulative 5-rung agent
 * session and captures all artifacts.
 *
 * Contract:
 *   Inputs  (env):  LIBRARY, RUN_INDEX, AX_BENCH_MODEL, CLAUDE_CODE_OAUTH_TOKEN
 *   Inputs  (fs):   /harness  (read-only bind from host)
 *   Outputs (fs):   /output   (bind-mounted — everything lands here)
 *
 * Expects a fresh container each run. Does not clean up after itself.
 */
import { spawn, type ChildProcess, type ChildProcessWithoutNullStreams } from 'node:child_process';
import { createWriteStream } from 'node:fs';
import { mkdir, readFile, readdir, writeFile, cp } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import { once } from 'node:events';

type Condition = 'video-js' | 'mux-player';

const LIBRARY_LABEL: Record<Condition, string> = {
  'video-js': 'Video.js 10',
  'mux-player': 'Mux Player',
};

// Docs URL injected into rung-1 to patch over training-cutoff asymmetry —
// see DESIGN.md § "Harness patches after pilot".
const LIBRARY_DOCS: Record<Condition, string> = {
  'video-js': 'https://videojs.org',
  'mux-player': 'https://www.mux.com/docs/guides/mux-player-web',
};

// Per-library install hint. Heavy-handed and asymmetric on purpose: pilot
// data showed Claude silently downgrading to Video.js 8 ("v10 doesn't
// exist") when left to discover packages from npm alone, even with the
// docs URL in the prompt. We can't afford that drift mid-experiment, so
// both libraries get a one-line "this is the published package" hint —
// mux's is harmless reinforcement, video-js's is load-bearing. Tracked as
// a blog-post footnote and a future-fix item (npm meta-package or CLI
// discoverability for v10).
const LIBRARY_NOTE: Record<Condition, string> = {
  'video-js':
    'Video.js 10 *does* exist — install via the scoped packages `@videojs/html` and `@videojs/react`. Do not fall back to `video.js@8` if `video.js@^10` is missing on npm.',
  'mux-player':
    'Mux Player is published as `@mux/mux-player-react` for React.',
};

const LIBRARY = (process.env.LIBRARY ?? '') as Condition;
const RUN_INDEX = process.env.RUN_INDEX ?? '0';
const MODEL = process.env.AX_BENCH_MODEL ?? 'claude-opus-4-7[1m]';
const WORKSPACE = '/home/pwuser/workspace';
const WORKSPACE_CACHE = '/home/pwuser/workspace-cache';
const HARNESS = '/harness';
const OUTPUT = '/output';
const TASKS = join(HARNESS, 'tasks');
const ASSERTIONS = join(HARNESS, 'assertions');
const TEMPLATE = join(HARNESS, 'template');
const ASSETS = join(HARNESS, 'assets');

if (!['video-js', 'mux-player'].includes(LIBRARY)) {
  console.error(`LIBRARY env var must be 'video-js' or 'mux-player'. Got: ${LIBRARY}`);
  process.exit(2);
}

if (!process.env.CLAUDE_CODE_OAUTH_TOKEN) {
  console.error('CLAUDE_CODE_OAUTH_TOKEN env var is required.');
  process.exit(2);
}

const libraryLabel = LIBRARY_LABEL[LIBRARY];
const libraryDocsUrl = LIBRARY_DOCS[LIBRARY];
const libraryNote = LIBRARY_NOTE[LIBRARY];

async function log(line: string) {
  const stamp = new Date().toISOString();
  console.log(`[${stamp}] ${line}`);
}

async function run(cmd: string, args: string[], opts: { cwd?: string } = {}) {
  const child = spawn(cmd, args, { cwd: opts.cwd, stdio: 'inherit' });
  const [code] = (await once(child, 'exit')) as [number | null];
  if (code !== 0) {
    throw new Error(`${cmd} ${args.join(' ')} exited with code ${code}`);
  }
}

async function waitForUrl(url: string, timeoutMs: number) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await fetch(url);
      if (res.ok || res.status === 304) return;
    } catch {
      /* ignore */
    }
    await sleep(500);
  }
  throw new Error(`timed out waiting for ${url}`);
}

async function findTaskFile(rung: number): Promise<string> {
  const files = await readdir(TASKS);
  const match = files.find((f) => f.startsWith(`rung-${rung}-`));
  if (!match) throw new Error(`no task file for rung ${rung}`);
  return join(TASKS, match);
}

async function loadPrompt(rung: number): Promise<string> {
  const path = await findTaskFile(rung);
  const raw = await readFile(path, 'utf8');
  return raw
    .replaceAll('{{LIBRARY_NAME}}', libraryLabel)
    .replaceAll('{{LIBRARY_DOCS_URL}}', libraryDocsUrl)
    .replaceAll('{{LIBRARY_NOTE}}', libraryNote);
}

type RungSummary = {
  rung: number;
  promptPreview: string;
  claudeExitCode: number | null;
  durationMs: number;
  sessionIdFirstSeen: string | null;
  assertion: unknown;
  screenshotPath: string | null;
};

const RUNG_TIMEOUT_MS = 15 * 60 * 1000;

async function invokeClaude(opts: {
  prompt: string;
  resumeSessionId: string | null;
  transcriptPath: string;
}): Promise<{ exitCode: number | null; firstSessionId: string | null; timedOut: boolean }> {
  const args: string[] = [
    '-p',
    opts.prompt,
    '--model',
    MODEL,
    '--mcp-config',
    join(WORKSPACE, 'mcp.json'),
    '--strict-mcp-config',
    '--permission-mode',
    'bypassPermissions',
    '--output-format',
    'stream-json',
    '--verbose',
  ];
  if (opts.resumeSessionId) args.push('--resume', opts.resumeSessionId);

  // stdin: 'ignore' — claude -p never needs stdin; leaving it open as a pipe
  // causes claude to hang after emitting its final result, waiting for EOF.
  const child = spawn('claude', args, {
    cwd: WORKSPACE,
    env: process.env,
    stdio: ['ignore', 'pipe', 'pipe'],
  }) as unknown as ChildProcessWithoutNullStreams;

  const sink = createWriteStream(opts.transcriptPath);
  let firstSessionId: string | null = null;
  let buffer = '';

  child.stdout.on('data', (chunk: Buffer) => {
    sink.write(chunk);
    buffer += chunk.toString('utf8');
    let idx;
    while ((idx = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, idx).trim();
      buffer = buffer.slice(idx + 1);
      if (!line) continue;
      try {
        const evt = JSON.parse(line);
        if (!firstSessionId && typeof evt.session_id === 'string') {
          firstSessionId = evt.session_id;
        }
      } catch {
        /* non-JSON line — ignore */
      }
    }
  });

  child.stderr.on('data', (chunk: Buffer) => {
    process.stderr.write(chunk);
  });

  // Safety net: Claude's Bash tool can hang indefinitely on long-running
  // commands (e.g., `pnpm dev`). Kill the whole process tree if a rung
  // exceeds the budget so a bad rung can't lock up the cell for hours.
  let timedOut = false;
  const killer = setTimeout(() => {
    timedOut = true;
    log(`rung exceeded ${RUNG_TIMEOUT_MS / 60_000}min budget — SIGKILL`).catch(() => {});
    child.kill('SIGKILL');
  }, RUNG_TIMEOUT_MS);

  const [exitCode] = (await once(child, 'exit')) as [number | null];
  clearTimeout(killer);
  sink.end();
  return { exitCode, firstSessionId, timedOut };
}

async function runAssertion(rung: number, screenshotPath: string): Promise<unknown> {
  // Rung 5 uses the rung-5.ts script with a screenshot argument.
  // Rungs 1-4 invoke their matching script and parse JSON from stdout.
  const scriptPath = join(ASSERTIONS, `rung-${rung}.ts`);
  const args = rung === 5 ? [scriptPath, screenshotPath] : [scriptPath];
  const child = spawn('tsx', args, { stdio: ['ignore', 'pipe', 'inherit'] });
  let stdout = '';
  child.stdout.on('data', (c: Buffer) => (stdout += c.toString('utf8')));
  const [code] = (await once(child, 'exit')) as [number | null];
  try {
    return { ...(JSON.parse(stdout) as Record<string, unknown>), exitCode: code };
  } catch {
    return { pass: false, raw: stdout, exitCode: code, parseError: true };
  }
}

async function screenshot(path: string) {
  await mkdir(resolve(path, '..'), { recursive: true });
  // Best-effort capture — always tries to screenshot, doesn't require any
  // specific element on the page. Captures both stdout and stderr so
  // failures (page won't load, browser launch fails) are surfaced.
  const child = spawn('tsx', [join(ASSERTIONS, 'screenshot.ts'), path], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let stderr = '';
  let stdout = '';
  child.stdout.on('data', (c: Buffer) => {
    stdout += c.toString('utf8');
  });
  child.stderr.on('data', (c: Buffer) => {
    stderr += c.toString('utf8');
  });
  const [code] = (await once(child, 'exit')) as [number | null];
  if (code !== 0) {
    const err = (stderr || stdout).slice(0, 400).replaceAll('\n', ' ');
    await log(`screenshot failed (exit=${code}): ${err}`);
  }
}

/**
 * Supervises the Vite dev server. Auto-respawns on unexpected exit, since
 * Claude's bash commands sometimes kill it (pkill, competing pnpm, etc.).
 * Exposes ensureUp() for per-rung health checks.
 */
class DevServerSupervisor {
  private process: ChildProcess | null = null;
  private shuttingDown = false;
  private respawnCount = 0;

  start(): void {
    if (this.process || this.shuttingDown) return;
    const dev = spawn('pnpm', ['dev'], {
      cwd: WORKSPACE,
      stdio: ['ignore', 'inherit', 'inherit'],
    });
    this.process = dev;
    dev.on('exit', (code, signal) => {
      this.process = null;
      if (this.shuttingDown) return;
      this.respawnCount += 1;
      log(
        `dev server exited (code=${code} signal=${signal}); respawn #${this.respawnCount} in 2s`
      ).catch(() => {});
      setTimeout(() => this.start(), 2000);
    });
  }

  async ensureUp(timeoutMs = 30_000): Promise<boolean> {
    if (!this.process) this.start();
    try {
      await waitForUrl('http://localhost:5173', timeoutMs);
      return true;
    } catch {
      return false;
    }
  }

  stop(): void {
    this.shuttingDown = true;
    this.process?.kill('SIGTERM');
    this.process = null;
  }

  get respawns(): number {
    return this.respawnCount;
  }
}

async function main() {
  const startedAt = Date.now();

  await log(`cell start: library=${LIBRARY} run=${RUN_INDEX} model=${MODEL}`);

  // 1. Prepare workspace
  // The Dockerfile pre-baked /home/pwuser/workspace-cache with the template's
  // node_modules + lockfile, so we seed from there instead of running a cold
  // pnpm install. Then layer the latest /harness/template source on top
  // (read-only bind mount, may be newer than the image).
  await mkdir(WORKSPACE, { recursive: true });
  await cp(WORKSPACE_CACHE, WORKSPACE, { recursive: true });
  await cp(TEMPLATE, WORKSPACE, { recursive: true, force: true });
  // Drop the YouTube reference image into the workspace so rung 5 prompt
  // (`./assets/youtube-reference.png`) resolves for Claude.
  await mkdir(join(WORKSPACE, 'assets'), { recursive: true });
  await cp(ASSETS, join(WORKSPACE, 'assets'), { recursive: true });

  await mkdir(join(OUTPUT, 'transcripts'), { recursive: true });
  await mkdir(join(OUTPUT, 'assertions'), { recursive: true });
  await mkdir(join(OUTPUT, 'screenshots'), { recursive: true });

  // 2. Resync deps. Near-instant when the cache is in step with the template;
  // catches drift if package.json was edited after the image was built.
  await log('resyncing deps (offline-first)');
  await run('pnpm', ['install', '--prefer-offline', '--reporter', 'silent'], { cwd: WORKSPACE });

  // 3. Start dev server in background, supervised
  await log('starting dev server');
  const dev = new DevServerSupervisor();
  dev.start();

  try {
    const up = await dev.ensureUp(30_000);
    if (!up) throw new Error('dev server did not come up within 30s');
    await log('dev server up');
  } catch (e) {
    dev.stop();
    throw e;
  }

  // 4. Drip-feed rungs
  let sessionId: string | null = null;
  const perRung: RungSummary[] = [];

  for (let rung = 1; rung <= 5; rung++) {
    const t0 = Date.now();
    const prompt = await loadPrompt(rung);
    const transcriptPath = join(OUTPUT, 'transcripts', `rung-${rung}.jsonl`);

    // Health-check before feeding the prompt. Claude's last rung may have
    // killed the dev server; the supervisor respawns, but we want to be
    // sure it's actually serving before we invoke the next turn.
    const upBefore = await dev.ensureUp(30_000);
    await log(
      `rung ${rung} begin (session=${sessionId ?? 'new'}, devServer=${upBefore ? 'up' : 'DOWN'}, respawns=${dev.respawns})`
    );

    const { exitCode, firstSessionId, timedOut } = await invokeClaude({
      prompt,
      resumeSessionId: sessionId,
      transcriptPath,
    });
    if (!sessionId && firstSessionId) sessionId = firstSessionId;
    if (timedOut) await log(`rung ${rung} timed out`);

    // Let Vite HMR settle, then make sure the server survived this rung
    // before screenshot + assertion attempt to talk to it.
    await sleep(2_000);
    await dev.ensureUp(15_000);

    // Capture screenshot of the rendered result.
    const screenshotPath = join(OUTPUT, 'screenshots', `rung-${rung}-final.png`);
    await screenshot(screenshotPath);

    // Run assertion. Rung 5 has no strict pass/fail; the script just confirms
    // the page didn't break and captures the screenshot.
    const assertion = await runAssertion(rung, screenshotPath);
    await writeFile(
      join(OUTPUT, 'assertions', `rung-${rung}.json`),
      JSON.stringify(assertion, null, 2)
    );

    perRung.push({
      rung,
      promptPreview: prompt.slice(0, 200),
      claudeExitCode: exitCode,
      durationMs: Date.now() - t0,
      sessionIdFirstSeen: firstSessionId,
      assertion,
      screenshotPath,
    });

    await log(
      `rung ${rung} done in ${((Date.now() - t0) / 1000).toFixed(1)}s (exit=${exitCode}, pass=${(assertion as { pass?: boolean }).pass ?? '?'})`
    );
  }

  // 5. Snapshot workspace final state
  await log('snapshotting workspace');
  await cp(WORKSPACE, join(OUTPUT, 'workspace'), {
    recursive: true,
    filter: (src) => !src.includes('node_modules') && !src.includes('.git'),
  });

  // 6. Stop dev server
  dev.stop();

  // 7. Write cell-level metrics
  const finishedAt = Date.now();
  const metrics = {
    library: LIBRARY,
    runIndex: RUN_INDEX,
    model: MODEL,
    sessionId,
    startedAt: new Date(startedAt).toISOString(),
    finishedAt: new Date(finishedAt).toISOString(),
    totalDurationMs: finishedAt - startedAt,
    rungs: perRung,
  };
  await writeFile(join(OUTPUT, 'metrics.json'), JSON.stringify(metrics, null, 2));

  await log(`cell done in ${((finishedAt - startedAt) / 1000 / 60).toFixed(1)} min`);
}

main().catch((err) => {
  console.error('cell failed:', err);
  process.exit(1);
});
