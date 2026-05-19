# N=2 mock-1560 — bundled-docs PR proof — May 2026

A small follow-up to the WITH_DOCS thread ([N5-with-docs](../2026-05-N5-with-docs/),
[N3-with-docs-v2](../2026-05-N3-with-docs-v2/)), but a different question.
Those ablations asked "does *telling* Claude to fetch the docs site change
anything?" (No.) This one asks: **if the docs ship inside the npm
tarball, do agents discover and read them?**

Triggered by [videojs/v10#1560](https://github.com/videojs/v10/pull/1560),
a PR that packs the rendered markdown docs into both `@videojs/react`
and `@videojs/html` tarballs via a `prepack` script, plus a README
insert pointing at `node_modules/@videojs/<fw>/docs/` and `llms.txt`.
A co-maintainer asked for proof before merging. This run is that proof.

This doc is what we believe **right now**. Auto-synthesized cross-run
patterns are in [`findings.md`](./findings.md) (LLM-generated, verify
before quoting); the editorial framing here is hand-written.

---

## Headline: agents find the bundled docs surface

Single deterministic comparison, mock-1560 vs the closest no-docs baseline
(`findings/2026-05-N5/` — same harness, same prompts, no bundled docs):

|                                              | `WebFetch` calls | cells reading `@videojs/*/docs/` |
| -------------------------------------------- | ---------------: | -------------------------------: |
| **May N5 baseline** (no bundled docs, 5 cells) |                0 |                            0 / 5 |
| **N2 mock-1560** (bundled docs, 2 cells)     |                0 |                            2 / 2 |

Both populations make zero `WebFetch` calls — the docs site never enters
the picture either way, consistent with the WITH_DOCS v1/v2 finding that
`WebFetch` is structurally lossy and agents bypass it. The change is
local: with #1560's tarball, agents start consulting docs at all (21
distinct references across 2 cells), where the baseline had nothing
local to consult.

Two different discovery paths, one per cell:

- **`video-js_run-0`** directly `Read` four files inside the new docs
  tree: `llms.txt`, `how-to/installation.md`, `how-to/build-with-ai.md`,
  `concepts/presets.md`. 19 references to `@videojs/react/docs/` across
  the transcript.
- **`video-js_run-1`** ran `pnpm pack`-style tarball inspection
  (extracted to `/tmp/videojs-inspect/`), `Read` the new `README.md`,
  and followed the *"browse the bundled markdown at
  `node_modules/@videojs/react/docs/` (start with `llms.txt`)"* pointer
  the PR added. The README insert is load-bearing — it routes agents
  that wouldn't otherwise traverse `node_modules/@videojs/react/docs/`
  directly.

## What this run does not show

- **Pass-rate effect.** N=2 is too small to claim quality movement;
  baseline is 21/25 rung-passes (84%), mock is 7/10 (70%). The
  synthesis flags two confounds independent of #1560: rung 3 fails in
  both mock cells with `accentMatches: []` despite `run-1` visibly
  applying `#ff3e00` (assertion under-matching, not regression), and
  both cells hit a `createPopupGroup` missing-export bug in
  `@videojs/core@10.0.0-beta.23` that ate ~13 min of rung 1 per cell.
  Pass-rate at scale needs a bigger N against a non-beta release.
- **CD-workflow change.** #1560 also adds an explicit
  `pnpm build:site` step to `cd.yml`; this run mocked the tarball
  shape only, not the workflow.

## Public artifact

[Comment on videojs/v10#1560](https://github.com/videojs/v10/pull/1560#issuecomment-4490186714)
reporting the discoverability finding to the maintainer who asked for
proof.
