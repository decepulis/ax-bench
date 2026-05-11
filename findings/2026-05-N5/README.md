# Follow-up N=5 — May 2026

Second N=5 run, after the April harness fixes landed (behavioral rung-2
assertion, pinned Chrome DevTools MCP, mandatory per-rung screenshots,
token tracking). Same two libraries, same five rungs, same Opus 4.7.

The thesis didn't change from April. What changed is **which assertions
were doing the work** — and several pass/fail numbers moved as a result.

This doc is what we believe **right now**. Auto-synthesized cross-run
patterns are in [`findings.md`](./findings.md) (LLM-generated, verify
before quoting); the editorial framing here is hand-written.

---

## Pass tally — and the April delta

|         | Rung 1<br>install | Rung 2<br>config | Rung 3<br>styling | Rung 4<br>structural | Rung 5<br>redesign | Halluc. |
| ------- | :---------------: | :--------------: | :---------------: | :------------------: | :----------------: | :-----: |
| **video-js**   | 5/5 (—) | 5/5 (▲) | 4/5 (▼) | **1/5 (▼▼)** | 5/5 build | 0,0,0,0,2 (▼) |
| **mux-player** | 5/5 (—) | 0/5 (—) | 1/5 (▼) | 5/5 (—) | 5/5 build | 0,0,0,1,0 (▼) |

`▲` better, `▼` worse, `—` unchanged vs April. The April baseline is in
`findings/2026-04-pilot-N5/README.md`.

**Cost:** $134.89 total ($78.91 agent + $55.98 judges). Longest cell 20.3 min.

---

## What the harness changes actually did

### Rung 4 video-js: 4/5 → 1/5 — the April pass rate was inflated

April's rung-4 assertion checked DOM presence: was the Share button
rendered? Was fullscreen hidden? Four of five April video-js cells
passed. With the new behavioral check (click the Share button, verify
`'shared'` logged), only `video-js_run-3` passes — see
`runs/video-js_run-3/summary.md` rung 4 (`shareClickLogged: true` in
`metrics.json`). Every other run rendered the button but wired the
handler wrong; April would have called those passes.

The eject verdict didn't move — still 10/10 `library-hack` — but at
least we now know that 4 of 5 of the "successful" video-js library
hacks were broken.

### Rung 4 mux-player: 5/5 — but suspect

All five mux-player cells still pass rung 4. The synthesis flagged
this in [`findings.md`](./findings.md): the new behavioral check is
**only on the video-js assertion**, not the mux-player one. Mux's
rung-4 passes are still DOM-only. Almost certainly we'd see the same
4-of-5-flunks-the-click that video-js showed if we wire the check
symmetrically. → **Next change.**

### Rung 2 mux-player: still 0/5 — but the failure shape changed

April: prop names didn't propagate as HTML attributes, so the
attribute-presence assertion failed. May: assertion is now behavioral
(`paused === false`, `muted === true`, a poster image actually rendered).
Still 0/5, for a different reason: Claude implements "preview image"
as `<MuxPlayer thumbnailTime={0}>` — which is the **hover-scrub thumbnail**,
not a pre-play poster — and `<MuxPlayer autoPlay>` doesn't trigger
playback in the way the assertion expects. See
`runs/mux-player_run-2/summary.md` rung 2.

So: April's failure was an artifact of the assertion shape. May's
failure is real product signal — the agent picked the wrong API for
the user's actual intent, and self-reported success. The behavioral
assertion did its job. → See findings.md suggestion #2.

### Hallucinations dropped on mux-player

April: 1, 5, 1, 1, 1 per cell. May: 0, 0, 0, 1, 0. The same fabrication
pattern (`--media-control-bar-background`) still appears — in
`mux-player_run-3` once, see `runs/mux-player_run-3/judges/hallucinations.json` —
but four runs avoided it entirely. Hard to say whether this is the
harness change, the seed variance, or both; **don't read this as a
trend on N=5**.

---

## New findings

### `mux-player_run-1` actually ejected at rung 5

First clean ejection across 20 cells total (April 0/10 + May 1/10).
At rung 5, `mux-player_run-1` ran `pnpm add media-chrome @mux/mux-video-react`,
discarded `<MuxPlayer>`, and rebuilt with `MediaController` + `MuxVideo`
+ media-chrome React components — see
`runs/mux-player_run-1/code/App.tsx` and the rung-5 row of
`runs/mux-player_run-1/summary.md`.

Important caveat: the eject judge still scored this cell `library-hack`,
because **the eject judge runs on rung 4 only** — and at rung 4 this
cell did shadow-DOM piercing like everyone else. The architecture
communicated "you can eject" to Claude *eventually*, but not at the
moment the structural rung pushed for it. That's the same shape as
April: when pushed hard enough (rung 5, "redesign from scratch"), the
agent will eject; when pushed less hard (rung 4, "hide one thing,
add one thing"), it hacks. Single cell isn't a finding by itself,
but it's the first existence proof that the mux path is reachable.

### Rung 3 mux-player collapsed: 3/5 → 1/5

April had 3 of 5 passing — May has only `mux-player_run-0`. The
fabricated `--media-control-bar-background` was the main culprit (4
April cells used it; in May it appears once but cascades through
verification because Claude `getComputedStyle`'d the variable, got
back its own input, and self-declared success — see
`runs/mux-player_run-1/summary.md` rung 3 "Rung 3 hallucinated CSS
variable was self-verified as 'applied.'"). This is the **self-test
that confirms the bug** failure mode — worth its own paragraph in
the writeup.

### Zero docs-fetches, again

Same as April: zero `WebFetch` / `WebSearch` calls across 10 cells.
The earlier finding holds. Pin in the talk.

---

## Suggested next changes

The synthesis suggested four (verbatim list in [`findings.md`](./findings.md)).
Pulling the two that should land before any further runs:

1. **Wire the behavioral click-check into mux-player rung-4.**
   Currently asymmetric — video-js gets the strict check, mux-player
   doesn't. The 5/5 mux pass rate is almost certainly fake. → **required**.
2. **Decide rung-2 mux-player intent.** `thumbnailTime` vs poster is
   either (a) "Claude picked the wrong API and the assertion correctly
   caught it" or (b) "the prompt is ambiguous and the assertion should
   accept either." See finding above. → **required before the writeup
   uses the 0/5 number**.

### Discussed and parked

- **Add an "eject-prompted" condition** (a third arm where rung 4
  includes a one-liner pointing at the eject hatch). Tests whether the
  hint flips the verdict. Interesting but not blocking — and adds 5+
  cells of cost per run.
- **Auto-retry / rate-limit handling in `run-judges.ts`.** The judges
  silently wrote rate-limit error strings into 4 cells during this run
  (we hand-fixed them); the synthesis flagged it as suggestion #4. The
  cells themselves now bail correctly via exit code 3 (added between
  April and May, see `harness/run-cell-inner.ts`), but the judges don't.
  → Probably small; do it before the next run.

---

## Pointers

- Per-cell evidence: `runs/{condition}_run-{n}/`
  - `summary.md` — neutral writeup + editorial section
  - `metrics.json` — pass/fail, turns, tool calls, duration, token + cost
  - `judges/` — hallucinations, eject (rung 4 only), visual fidelity (rung 5)
  - `assertions/` — Playwright JSON per rung
  - `screenshots/` — per-rung `rung-{N}-final.png`
  - `code/` — final `App.tsx`, CSS, `package.json`, any extra component
    files (e.g. `YouTubeSkin.tsx`). Lockfile, `node_modules`, `dist`,
    transcripts not committed.
- Auto-synthesis: [`findings.md`](./findings.md) — LLM-generated cross-run
  patterns + suggested changes. Treat as a first pass, verify the file
  citations before quoting.
- Harness as it ran: see `git log` immediately before this commit; the
  relevant changes since April are `feat(harness): N=5 pilot follow-ups`
  and `feat(harness): timeout signal, type-surface judging, labeled
  outputs, synthesis`.
