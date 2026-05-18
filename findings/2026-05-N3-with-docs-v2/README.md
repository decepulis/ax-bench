# With-docs N=3, v2 hint — May 2026

Follow-up to [`findings/2026-05-N5-with-docs/`](../2026-05-N5-with-docs/),
flipping the docs hint from a trailing soft footer to an **imperative
pre-task line** at the top of every rung:

```
> Before writing any code, fetch <docs URL>. It is the authoritative
> reference for this library at the version you have installed.
```

Same two conditions (`video-js-with-docs`, `mux-player-with-docs`), N=3
instead of N=5. The point of this run was a narrow A/B: *given an
explicit instruction to fetch, does Claude do it — and does that change
output quality?*

This doc is what we believe **right now**. Auto-synthesized cross-run
patterns are in [`findings.md`](./findings.md) (LLM-generated, verify
before quoting); the editorial framing here is hand-written.

---

## Headline: the hint works, but the oracle didn't move

`WebFetch` use went from inert to ubiquitous overnight:

|        | total `WebFetch` calls | cells with ≥1 fetch |
| ------ | ---------------------: | ------------------: |
| **May v1** (soft footer, N=10) | 2  | 1 / 10 |
| **N3 v2** (imperative, N=6)    | **81** | **6 / 6** |

Mux cells fetched 15-26 times each; Video.js cells 5-6 times each.
Big enough that we can confidently say the v2 phrasing changes
behavior. The hint is no longer operationally inert.

**But the cross-run pattern synthesis (`findings.md`) catches the part
that didn't move.** Every cell starts each rung with the prompted
`WebFetch` and then **bypasses the docs page for `node_modules`-as-
ground-truth** — same as v1. The fetch became a ritual; the load-bearing
read still happens against installed `.d.ts` and source files. Visible
symptom: Mux rung-4 cells racked up 404s on guessed GitHub URLs
(`REAMDE.md`, wrong `themes/gerwig.html` path in
`mux-player-with-docs_run-0`) after the docs page didn't cover the
right altitude.

So the hint changed *behavior* (WebFetch fires) without changing
*epistemics* (what Claude trusts as authoritative). That is itself a
finding worth keeping — the next escalation lands cleanly.

→ See "Next iteration" below.

---

## Pass tally — and the May v1 delta

|         | Rung 1<br>install | Rung 2<br>config | Rung 3<br>styling | Rung 4<br>structural | Rung 5<br>redesign | Halluc. |
| ------- | :---------------: | :--------------: | :---------------: | :------------------: | :----------------: | :-----: |
| **video-js-with-docs**   | 3/3 (—) | 3/3 (—) | 3/3 (▲) | 1/3 (—) | 3/3 build | 0,0,1 |
| **mux-player-with-docs** | 3/3 (—) | 0/3 (—) | 3/3 (▲) | 3/3 (▲) | 3/3 build | 1,0,0 |

`▲` better, `▼` worse, `—` unchanged vs the May v1 baseline at
[`findings/2026-05-N5-with-docs/`](../2026-05-N5-with-docs/README.md).
"unchanged" is at the pass-rate level — three small samples can't tell
us much beyond noise on the marginal rungs.

The biggest mover is **rung 3** (styling): 2/5 → 3/3 on both libs. This
is the rung where the v1 cells most often hallucinated CSS variables
(`--media-control-bar-background`, `--media-fullscreen-button`), and
where actually fetching docs *could* help. Three cells is too few to
call this signal vs. noise, but it points the same direction the
mechanism predicts. Worth replicating at N=5.

**Cost:** $81.57 total ($45.24 agent + $36.33 judges) for 6 cells.
Per-cell cost ($13.60) ≈ identical to May v1 ($13.45/cell). The
WebFetch round-trips aren't free, but they're noise next to per-rung
agent inference.

---

## What we expected vs. what happened

We expected the imperative phrasing to drive WebFetch usage above
zero, and — *if* fetched docs actually informed code — to see fewer
hallucinations and tighter rung-3 styling work.

Instead:

- **WebFetch usage exploded.** 81 calls / 6 cells vs 2 calls / 10
  cells. Every cell fetched; mux cells fetched repeatedly per rung.
  The hint *works* as a tool-call lever.
- **Rung 3 pass rate moved up on both libraries** (2/5 → 3/3, both
  libs). N=3 is too small to call, but the direction matches what
  the mechanism would predict.
- **Hallucinations didn't disappear, just narrowed.** All 3 halluc.
  this run are CSS attrs / `data-*` selectors / `var(--…)` references.
  Zero imports, zero component names, zero method names. The v1 run
  had the same shape on the hallucinations it caught — fetching the
  docs page didn't move the needle on the kind of hallucinations these
  libraries produce.
- **Docs were ritually fetched then bypassed.** Per the synthesis, the
  authoritative read every cell ended up doing was on installed
  `node_modules/<lib>/**/*.d.ts` (Video.js) or the bundled gerwig
  theme source (Mux). The marketing-docs page that we asked for was
  the wrong altitude — too narrative, not enough surface area on the
  questions the agent actually has.
- **Eject behavior didn't change.** 6/6 cells classified
  `library-hack` at rung 4, same as v1. `prompted_to_eject: false`
  for every cell. Notably, several cells *named* the eject path
  in-thread before rejecting it on cost grounds (`video-js-with-docs_run-1`
  rung-4 turns 5-10; `mux-player-with-docs_run-2` rung 4) — see
  synthesis suggestion #4 about surfacing "considered eject, declined"
  as a separate signal.
- **Visual fidelity diverged by library:** Video.js 4/5, 4/5, 4/5 vs
  Mux 1/5, 1/5, 4/5. The two low Mux scores are partly a harness bug
  (rung-5 screenshot caught the auto-hide-controls state). Same shape
  as v1.

---

## Why the docs page was still the wrong oracle

Two compounding factors:

1. **Page altitude.** `mux.com/docs/guides/mux-player-web` and
   `videojs.org` are narrative onboarding docs, not API references.
   They cover *what the libraries are for*, less so *what the props
   are*. The agent's questions at rung 3+ are pointy:
   *"which CSS variable colors the control bar background?"* — and
   `node_modules/<pkg>/dist/themes/<theme>.mjs` answers that
   directly. The docs page often doesn't.
2. **Cost asymmetry, again.** Even with the imperative hint, once
   the ritual fetch is done, Claude's next reach for "let me check"
   is still the cheap local grep. The hint elevated the *first*
   action of each rung; it didn't change the per-decision tradeoff
   inside the rung.

The 404 trail in Mux rung-4 cells is the canonical case: docs page
didn't cover Media Chrome internals → Claude guessed GitHub paths
(`REAMDE.md`, `themes/gerwig.html`) → 404 → fell back to
`node_modules/@mux/mux-player/dist/themes/gerwig/index.mjs` and got
the right answer there. The docs were a detour, not a shortcut.

---

## Next iteration

Two options on the table, both informed by the docs-as-ritual finding:

1. **Re-aim the hint at the right altitude.** Swap the URL from the
   marketing-docs page to either:
   - the package's `llms.txt` if shipped, or
   - an explicit pointer to `node_modules/<pkg>/dist/types/` and the
     theme source (for Mux, `dist/themes/gerwig/`).

   This matches what every cell ends up reading anyway. Cheap to
   implement; only slightly less honest than "fetch the docs URL" as
   a developer-realistic primer.

2. **Inline-inject a curated docs excerpt** so the docs land in
   context regardless of any tool call. Eliminates the round-trip
   cost question entirely. More work; more editorializing of what
   docs *should* be.

Probably worth doing (1) first as a cheap A/B, then (2) only if (1)
is still inert on the structural/redesign rungs. Either way, the v2
finding ("WebFetch can be reliably triggered") unlocks the
narrower question for the next iteration: *what content shape, at
what altitude, actually changes output quality?*

---

## Other findings (from the synthesis)

The synthesis raised five suggestions ([`findings.md`](./findings.md));
the load-bearing ones independent of the docs question are reproduced
from the May findings (still open):

1. **Mux rung-2 assertion is a harness bug (not Claude).** Same shape
   as May baseline and v1: `previewImageVisible: false` because the
   walker uses `querySelectorAll('img')` on light-DOM ancestors of
   `<video>`, and Mux Player renders the thumbnail inside its shadow
   DOM (`harness/assertions/rung-2.ts:41-56`). Same fix flagged in
   May. The 0/3 on Mux rung 2 in this run is not a Claude failure.
2. **Rung-5 visual-fidelity screenshot can catch auto-hidden controls
   state.** Two Mux cells scored 1/5 here for a reason that's about
   *when* we screenshot, not what Claude built. The synthesis suggests
   pausing the player + forcing `data-visible` on controls before the
   final capture. Adds rung-5 to the shadow-DOM bug class flagged in
   the previous read.
3. **`considered_eject_but_declined` would be a more interesting
   signal than the current `library-hack` verdict.** Several v2 cells
   *named* the eject path in-thread before rejecting it on cost — but
   `eject.json` only sees final code, so they look identical to cells
   that never considered ejecting. Adding a transcript-scan boolean
   would expose where the architecture's "eject pressure" is actually
   showing up.

---

## Pointers

- Per-cell evidence: `runs/{condition}_run-{n}/`
  - `summary.md` — neutral writeup + editorial section
  - `metrics.json` — pass/fail, turns, tool calls, duration, token + cost
  - `judges/` — hallucinations, eject (rung 4 only), visual fidelity
    (rung 5), usage
  - `assertions/` — Playwright JSON per rung
  - `screenshots/` — per-rung `rung-{N}-final.png`
  - `code/` — final `App.tsx`, CSS, `package.json`, any extra
    component files (e.g. `Skin.tsx`, `player.css`) and a custom
    `index.html` if Claude edited it (e.g. `mux-player-with-docs_run-2`'s
    `<template id="theme-youtube">`). Lockfile, `node_modules`,
    `dist`, transcripts not committed.
- Auto-synthesis: [`findings.md`](./findings.md) — LLM-generated
  cross-run patterns + suggested changes. Treat as a first pass,
  verify file citations before quoting.
- Harness as it ran: see `git log` immediately before this commit.
  Hint mechanism is the v2 imperative pre-task line.
