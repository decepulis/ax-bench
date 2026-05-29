# N=3 Opus 4.8 — agent-model upgrade — May 2026

Follow-up to [N3-post-bundled-docs](../2026-05-N3-post-bundled-docs/), holding
the harness setup constant (N=3, released `@videojs/{react,html}@10.0.0-beta.24`,
`@mux/mux-player-react`) and swapping only the agent model from
`claude-opus-4-7` → `claude-opus-4-8`. Judges stayed on 4.7 to keep
hallucination / eject / visual verdicts comparable to the six prior runs.
Both models run at default `effort=high` — we run with default dials to
simulate naive users who won't tune them.

> **Question:** Does upgrading the agent change rung-4 method choice, the
> docs-discovery pattern, or the hallucination shape?
> **Answer:** Video.js method choice moves cleanly — 1/3 → **3/3
> in-library-primitive**. Mux Player method choice doesn't move — still
> **3/3 library-hack**, same shadow-piercing pattern as every prior run.

This doc is what we believe **right now**. Auto-synthesized cross-run
patterns are in [`findings.md`](./findings.md) (LLM-generated, verify
before quoting); the editorial framing here is hand-written.

---

## Headline: the eject column moved, but only on video-js

The pass column hides the story (rung-4 has a known harness-flake on the
`shareClickLogged` assertion — see below). The story lives in the eject
judge:

| Cell | Rung-4 method (`judges/eject.json`)                                                       | Verdict |
| --- | --- | --- |
| `video-js_run-0` | Read `docs/how-to/customize-skins.md`, paste skin source, drop `FullscreenButton`, add `Button` primitive next to `VolumePopover` | **in-library-primitive** |
| `video-js_run-1` | Same — eject the skin, compose `Button` + `Tooltip.Root` as `VolumePopover` sibling | **in-library-primitive** |
| `video-js_run-2` | Same — eject the skin, place `Button` in the right `media-button-group`            | **in-library-primitive** |
| `mux-player_run-0` | `findBottomControlBar()` shadow-walk + imperative `media-chrome-button` after `media-volume-range` | library-hack |
| `mux-player_run-1` | Recursive `findInShadow()` + raw `<button>` sibling of `media-volume-range` + `MutationObserver` re-inject | library-hack |
| `mux-player_run-2` | Recursive `deepQuery()` + `insertAdjacentElement('afterend')` to inject `<button>` | library-hack |

For comparison, N3-post-bundled-docs (same setup, 4.7) was **1/3
in-library-primitive, 2/3 library-hack on video-js** — and across all
16 prior video-js cells at 4.7, only that one chose the in-library
path. On mux-player, every prior cell scored library-hack: 5/5 May N5,
5/5 N5-with-docs, 3/3 N3-with-docs-v2 — **13/13 mux-player cells across
prior runs**. At 4.8, video-js flipped to 3/3 in-library-primitive
(3 of 3 cells reading `customize-skins.md` and ejecting the skin),
while mux-player held at 3/3 library-hack — same shadow-piercing
pattern as every prior 4.7 mux cell. The model got better; the library
shape decides whether better matters.

---

## Pass tally — and the deltas

|              | Rung 1<br>install | Rung 2<br>config | Rung 3<br>styling | Rung 4<br>structural | Rung 5<br>redesign | Halluc. |
| ------------ | :---------------: | :--------------: | :---------------: | :------------------: | :----------------: | :-----: |
| **video-js**   | 3/3 (—) | 3/3 (—) | 3/3 (—) | 0/3 (▼)\* | 3/3 (—) | 0,0,0 (—) |
| **mux-player** | 3/3 (—) | 0/3 (—) | 3/3 (▲)\*\* | 2/3 (—) | 3/3 build | 0,1,0 (—) |

`▲` better, `▼` worse, `—` unchanged. Video.js baseline is
N3-post-bundled-docs (4.7). Mux Player has no apples-to-apples 4.7
baseline at this harness shape — comparing to May N5 (5/5, 0/5, 1/5,
5/5, 5/5; no bundled docs but mux-player doesn't ship them either).

\* **The 0/3 video-js rung-4 column is harness flake, not a regression.**
The `shareClickLogged` assertion fails on all three video-js cells even
though Claude's own in-browser `evaluate_script` probe logged `shared`
on every click. Same shape as N3-post-bundled-docs rung 4 (caught
there too). The eject judge — which reads transcripts, not the
assertion — correctly classifies all three as `in-library-primitive`.
See `findings.md` "Patterns" #2 for the cross-library evidence.

\*\* **Rung 3 mux-player jumped from 1/5 → 3/3.** The May baseline's
collapse was driven by the fabricated `--media-control-bar-background`
CSS variable cascading through self-verification (4 of 5 May cells used
it). In this run all 3 cells dumped the player's shadow-DOM stylesheet
via `evaluate_script`, read `--media-accent-color` directly, and used
it. N=3 is too small to call this a 4.8 effect vs noise, but the
*mechanism* changed: shadow-DOM forensic probing replaced "guess the
variable name."

---

## What this run also shows

### Documentation discovery split by tarball shape, not by agent

All 3 video-js cells found `node_modules/@videojs/react/docs/llms.txt`
within the first 20-80 turns of rung 1 and treated it as the
authoritative reference thereafter — same shape as N3-post-bundled-docs.
All 3 mux-player cells issued zero docs reads, substituting shadow-DOM
probes (`getComputedStyle` on internal elements, sheet enumeration,
`getPropertyValue` queries). Mux Player doesn't ship a `docs/` tree in
its npm tarball, so this is the structural difference, not a model
behavior. → See findings.md suggestion #3.

### Hallucinations stayed near zero — 1/6 cells, 1 hallucination

The only flagged case is `mux-player_run-1` rung 5: `.yt-player::part(poster)`
on `<MediaController>`. `::part()` doesn't pierce the nested shadow root
of `<media-poster-image>`, and the part the slot actually exposes is
`layer poster-layer`, not `poster`. Real-feeling mistake, similar shape
to the `--media-control-bar-background` slips in May N5 — wrong name
that "felt right" for the part Claude was trying to style. Every other
mid-run slip (`--media-control-bar-background` once in `mux-player_run-2`,
`slot="icon"` on `MediaChromeButton` in run-1) was caught by the agent's
own probing and removed before commit.

### The rung-4 → rung-5 pivot is canonical now

All 3 mux-player cells named the eject-to-media-chrome path in rung 4
("Mux Player's default theme has no slot for inserting buttons there"
in run-0's eject judge; same shape in run-1 and run-2), chose shadow
piercing anyway at rung 4, then *ejected on the next rung*. The final
`workspace/src/App.tsx` for all three mux cells reflects rung-5
media-chrome composition, not rung-4 final state. The eject judge
correctly reads the rung-4 transcript, but anyone browsing the
committed code expecting to see what rung 4 produced will see the
later overwrite. Same shape as `mux-player_run-1` from May N5 — first
clean eject at rung 5, "considered eject, declined" at rung 4. With
4.8 this is consistent (3/3) rather than the outlier it was at 4.7.

---

## Cost

$25.83 agent + $43.19 judge = **$69.03** total, 24.4 min longest cell.

Per-library: video-js cells $13.31 / $14.92 / $10.11; mux-player cells
$11.73 / $11.02 / $7.95. Video-js cells were slightly more expensive
than mux-player here — driven by the eject path itself: reading
`docs/how-to/customize-skins.md`, the bundled type definitions, and
writing more code per rung. Same pricing tier as 4.7 ($5/$25 per MTok),
so spend per cell tracks token count, not rate. Video-js at 4.8
($38.33 for 3 cells) is marginally *cheaper* than the matching 4.7 run
(N3-post-bundled-docs: $43.81 for 3 cells) — counterintuitive given
the deeper in-library work; likely fewer "guess-then-check" cycles
once the docs anchor is found.

---

## What this run does not show

- **Whether the eject-column flip is a 4.8 effect at scale.** N=3 is
  too small. 4.7 was 1/3 → 4.8 is 3/3 on the same setup, which is
  suggestive (every video-js cell at 4.8 chose primitives; only one of
  three at 4.7 did) — but a 4-cell follow-up at N=5 against both runs
  would tighten it. Default effort, same dials as before.
- **Whether Mux Player would move with a docs-shape change.** All 3
  mux cells reached the same eject path *one rung late*. If the docs
  surfaced "add a control bar button" as the canonical method (per
  findings.md suggestion #4 in this run, mirrors the v10 #1560 pattern
  for the videojs/v10 packages), would they reach for it at rung 4?
  Needs a docs ablation against mux, not another N.
- **Whether the rung-4 share-click harness flake masks anything.** 4
  of 6 cells passed Claude's own probe and failed the assertion. The
  eject judge reads transcripts and is unaffected, but the rung-4
  PASS column should not be quoted as method-quality signal in *any*
  prior run either — flagged in N3-post-bundled-docs, holds here. →
  Worth fixing before any further runs that lean on rung 4.

---

## Pointers

- Per-cell evidence: `{condition}_run-{n}/`
  - `summary.md` — neutral writeup + editorial section
  - `metrics.json` — pass/fail, turns, tool calls, duration, token + cost
  - `judges/` — hallucinations, eject (rung 4 only), visual fidelity
    (rung 5), usage. **The eject judge reads the rung-4 transcript;**
    **the committed `code/` reflects rung-5 final state for any cell that**
    **pivoted between rungs** (all 3 mux-player cells in this run, plus
    `video-js_run-1` which rewrote the rung-3 layout at rung 4).
  - `assertions/` — Playwright JSON per rung
  - `screenshots/` — per-rung `rung-{N}-final.png`
  - `code/` — final source files. Lockfile, `node_modules`, `dist`,
    transcripts, captured types not committed.
- Auto-synthesis: [`findings.md`](./findings.md) — LLM-generated
  cross-run patterns + suggested changes. Treat as a first pass,
  verify file citations before quoting.
- Harness as it ran: `AX_BENCH_MODEL=claude-opus-4-8[1m] pnpm full
  --label 2026-05-N3-opus-4-8 --n 3`. Judges held at default
  `claude-opus-4-7[1m]` via `AX_BENCH_JUDGE_MODEL` unset.
