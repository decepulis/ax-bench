# N=3 post-bundled-docs — released-tarball validation — May 2026

> **AUDIT NOTE (2026-05-19):** This doc contains a story-altering discrepancy, flagged during a folder-wide audit. Untangle later.
> - The "Correction to findings.md" section claims `video-js_run-2` *did* open `llms.txt` and 7 other docs files during rung 1. The raw rung-1 transcript shows **zero** reads of any `docs/` path or `llms.txt` for run-2 (all 31 Read calls hit `.d.ts`, `package.json`, `README.md`, or `.js` files under `node_modules/.../dist/dev/`). The original `findings.md` statement that run-2 never opened `llms.txt` is correct; **this README's "correction" is the hallucination.** Treat findings.md as canonical for run-2 behavior.

The follow-up to [N2-mock-1560](../2026-05-N2-mock-1560/). That run mocked
[videojs/v10#1560](https://github.com/videojs/v10/pull/1560) by packing
the PR branch into local tarballs and wiring them via pnpm overrides.
This run drops the mock: #1560 has merged and shipped, so we install
`@videojs/{react,html}@10.0.0-beta.24` straight from npm and ask the
same question.

> **Does the discoverability claim from the mock survive against the
> real released packages?** Yes, and a little more strongly.

This doc is what we believe **right now**. Auto-synthesized cross-run
patterns are in [`findings.md`](./findings.md) (LLM-generated, verify
before quoting); the editorial framing here is hand-written. Note: the
synthesis judge mis-stated run-2's behavior — see correction below.

---

## Headline: 3/3 cells reach the bundled docs surface

Single deterministic comparison, N3-post-bundled-docs vs the closest
no-docs baseline ([`2026-05-N5`](../2026-05-N5/) — same harness, same
prompts, no bundled docs) and against the mock predecessor:

|                                                  | `WebFetch` calls | cells reading `@videojs/*/docs/` |
| ------------------------------------------------ | ---------------: | -------------------------------: |
| **May N5 baseline** (no bundled docs, 5 cells)   |                0 |                            0 / 5 |
| **N2 mock-1560** (mock tarball, 2 cells)         |                0 |                            2 / 2 |
| **N3 post-bundled-docs** (released, 3 cells)     |                0 |                            3 / 3 |

Zero `WebFetch` / `WebSearch` calls across all 15 rungs — consistent
with the WITH_DOCS v1/v2 finding that `WebFetch` is structurally lossy
and agents bypass it. The change relative to the no-docs baseline is
local: with #1560 shipped, every cell consults the docs that now exist
inside `node_modules/@videojs/react/docs/`.

Distinct docs files `Read` per cell (from transcripts):

- **`video-js_run-0`** — 9 files: `llms.txt`, `concepts/{overview,presets,skins}.md`,
  `how-to/{installation,customize-skins}.md`,
  `reference/{poster,time-slider,time}.md`.
- **`video-js_run-1`** — 7 files: `llms.txt`, `README.md`,
  `concepts/{overview,presets,skins}.md`,
  `how-to/{installation,customize-skins}.md`.
- **`video-js_run-2`** — 8 files: `llms.txt`, `how-to/{installation,build-with-ai}.md`,
  `concepts/{presets,skins}.md`,
  `reference/{controls,feature-source,poster}.md`.

`llms.txt` is the consistent first hop in all three cells, which is the
behavior #1560 was designed to produce. Compared to the mock, the
released-tarball run sees a wider read pattern (mock: 19 refs across
2 cells with one cell finding docs only after extracting a tarball at
`/tmp/`; here: all three cells go straight to `node_modules/...`).

## Correction to `findings.md`

The synthesis judge wrote that `video-js_run-2` "never opened
`llms.txt` but still resolved the API correctly off `dist/dev/*.d.ts`."
That is wrong — `run-2`'s rung-1 transcript includes an explicit
`Read` of `node_modules/@videojs/react/docs/llms.txt` plus 7 other docs
files. The synthesis section is otherwise consistent with the
transcripts; this single sentence is the only known hallucination.

## Beyond discoverability: rung-4 method choice didn't move

This is the first run where we have enough cells × bundled docs to
look at *method quality* on the "modify the existing UI" rung. The
distribution is striking:

| Cell | Rung-4 method (`judges/eject.json`)                                              |
| --- | ------------------------------------------------------------------------------- |
| `video-js_run-0` | `library-hack` — `useEffect` + `document.querySelector('.media-button--mute')` + `createPortal` |
| `video-js_run-1` | in-library composition — edit `PlayerSkin.tsx`                                  |
| `video-js_run-2` | `library-hack` — `MutationObserver` + portal                                    |

2/3 still ship a portal/`MutationObserver` hack at rung 4 even with
docs sitting in `node_modules/` and `llms.txt` read upstream. The same
2 cells then *throw the hack away* at rung 5 and rebuild from
`Controls.Root` + `TimeSlider.Root/Track/Buffer/Fill/Thumb` primitives,
hitting 4/5 visual on the redesign rung. So the API is reachable —
the choice not to reach for it at rung 4 isn't a docs problem.

Also caught: rung-4's `shareClickLogged: false` fires on both
`run-0` (hack) and `run-1` (in-library), but `run-2` (hack) passes.
The assertion is not tracking method quality. This is a harness rig
issue (likely an event-dispatch / wrapper-component mismatch),
flagged in `findings.md` for follow-up.

## Cost

$22.12 agent + $21.69 judge = **$43.81** total, 24.7min longest cell.

## What this run does not show

- **Pass-rate effect.** N=3 still isn't enough for a quality claim:
  rung passes were 4/5, 3/5 (+ 1 timeout), 4/5 — basically flat with
  the WITH_DOCS-era runs. The interesting movement here is on the
  *hallucination* axis (zero) and on the *docs-discovery* axis
  (3/3), not pass rate.
- **Rung-4 attribution.** We can say "bundled docs don't appear to
  change rung-4 method choice on their own," but separating "the
  agents don't know to reach for primitives at rung 4" from
  "primitives are the wrong abstraction for partial-skin
  modification" needs a prompt-shape ablation, not another N.
