# ax-bench

An illustrative experiment comparing how AI coding agents work with **composable-primitive** vs **monolithic** frontend libraries. Paired with a blog post on AX (agent experience).

## What this is

Claude Code builds a Vite + React app twice — once with Video.js 10 (composable primitives), once with Mux Player (monolith with Media Chrome as escape hatch) — walking through a five-rung customization journey: install → config → style → structural customization → full redesign. We capture transcripts, assertions, and summaries, then look for differential signals.

This is not a research paper. It's an illustrative test designed to produce story-forward data for a blog post and talks. N=1 per condition as a pilot; scale to N=5 per condition if the pilot validates the harness.

## Prerequisites

- **Docker** (OrbStack recommended on macOS: `brew install orbstack`)
- **Node 20+** and **pnpm 9+** on the host
- **Claude Code CLI** installed on the host (`npm install -g @anthropic-ai/claude-code`)
- **A Claude.ai Pro/Max/Team subscription** — billing flows through your account via a long-lived OAuth token
- **A YouTube reference screenshot** at `harness/assets/youtube-reference.png` (see `harness/assets/README.md`)

## One-time setup

```bash
# 1. Generate a long-lived OAuth token (interactive; opens a browser)
claude setup-token

# 2. Copy the token into .env
cp .env.example .env
# edit .env and paste the token into CLAUDE_CODE_OAUTH_TOKEN

# 3. Install host deps (for the orchestrator + judges)
pnpm install

# 4. Build the Docker image (run from repo root — the Dockerfile copies
#    harness/template/package.json to pre-bake workspace deps into the image)
docker build -t ax-bench:latest -f harness/docker/Dockerfile .

# 5. Drop a YouTube reference screenshot into harness/assets/youtube-reference.png
#    See harness/assets/README.md for guidance.
```

## Running the pilot

```bash
pnpm pilot
```

Spawns two Docker containers in parallel — one Video.js run, one Mux Player run — each walking through all five rungs. After both finish, runs judges + summarizer on each. Output lands in `pilot/`.

## Running a single cell

```bash
pnpm run-cell -- --condition video-js --run-index 0
# or
pnpm run-cell -- --condition mux-player --run-index 0
```

Output lands in `runs/{condition}_run-{index}/`. Judges are NOT run — invoke separately:

```bash
tsx harness/run-judges.ts --output-dir runs/video-js_run-0
```

## Reading results

Each run produces:

- `summary.md` — neutral per-run report with per-rung timeline, notable moments, hallucination list. Plus an opinionated editorial section at the bottom.
- `transcripts/rung-{N}.jsonl` — raw stream-json transcripts per rung
- `workspace/` — final state of Claude's working directory (App.tsx, any CSS, package.json diff)
- `screenshots/rung-{N}-final.png` — rendered result per rung
- `assertions/rung-{N}.json` — Playwright pass/fail per rung
- `judges/hallucinations.json`, `judges/eject.json`, `judges/visual-fidelity.json`
- `metrics.json` — structured metrics (pass/fail, turns, tool calls, duration)

Start with `summary.md`. Dig into transcripts when the summary leaves questions.

## Design

See [DESIGN.md](./DESIGN.md) for the decision log from the initial grill-me session.

## Cost expectations

Rough guess: ~$20–60 per full 5-rung run on Opus 4.7 1M, including judge calls. Pilot (2 runs) ~$40–120. Full N=5 per condition (10 runs) ~$200–600. Billed to your Claude.ai subscription via the long-lived token.

## Known limitations

- Single framework (Vite + React). Results don't necessarily generalize to Next.js, Remix, SvelteKit, vanilla HTML.
- Single model (Opus 4.7). Sonnet/Haiku would likely show different gradients.
- Judge model drift — the summarizer and hallucination judge are themselves LLMs; their rubrics aren't battle-tested.
- No human baseline. We're not comparing AI performance against a human engineer's.
- N=5 is a story-forward sample size, not a statistically significant one.
- Video.js 10 is post-training-cutoff for Opus 4.7. Mux Player is in training data. That asymmetry is *part* of the AX story, not a methodological flaw.

## Repo layout

```
ax-bench/
├── README.md                  # you are here
├── DESIGN.md                  # decision log
├── package.json               # host-side tooling (tsx, playwright, zod)
├── .env.example               # secrets template
├── harness/
│   ├── tasks/                 # five rung prompts (markdown)
│   ├── assertions/            # Playwright specs for rungs 1-5
│   ├── template/              # Vite+React+TS scaffold + mcp.json
│   ├── assets/                # YouTube reference image (you provide)
│   ├── docker/Dockerfile      # container image
│   ├── judges/                # four judge prompts
│   ├── run-cell-inner.ts      # runs inside the container
│   ├── run-cell.ts            # host-side docker-run wrapper
│   ├── run-judges.ts          # post-processing: judges + summarizer
│   └── run-pilot.ts           # spawns 2-cell pilot in parallel
├── pilot/                     # generated on pilot run
└── runs/                      # generated on single-cell runs
```
