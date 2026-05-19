# Synthesis — N3-with-docs-v2

> **AUDIT NOTE (2026-05-19):** Minor count discrepancy flagged during a folder-wide audit. Untangle later.
> - The hallucinations summary says "All **3** hallucinations are CSS attributes, data-* selectors, or var(--…) references." Raw `judges/hallucinations.json` across all 6 runs shows only **2** hallucinations (mux-player-with-docs_run-0 + video-js-with-docs_run-2). The qualitative characterization still holds for the 2 that exist.

6 cells across 2 conditions (mux-player, video-js). Longest cell 24.8min; agent cost $45.2366, judge cost $36.3333, total $81.5699.

## Cell outcomes (deterministic)

Rung legend: ✓ pass · ✗ fail · TO timed out · — not run.

| Cell | Rung 1 | Rung 2 | Rung 3 | Rung 4 | Rung 5 | Halluc. | Eject | Visual |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | --- | :---: |
| mux-player-with-docs_run-0 | ✓ | ✗ | ✓ | ✓ | ✓ | 0 | — | — |
| mux-player-with-docs_run-1 | ✓ | ✗ | ✓ | ✓ | ✓ | 0 | — | — |
| mux-player-with-docs_run-2 | ✓ | ✗ | ✓ | ✓ | ✓ | 0 | — | — |
| video-js-with-docs_run-0 | ✓ | ✓ | ✓ | ✗ | ✓ | 0 | — | — |
| video-js-with-docs_run-1 | ✓ | ✓ | ✓ | ✓ | ✓ | 0 | — | — |
| video-js-with-docs_run-2 | ✓ | ✓ | ✓ | ✗ | ✓ | 1 | — | — |

## Token / cost rollup (deterministic)

| Cell | Agent in | Agent out | Agent cost | Judge in | Judge out | Judge cost | Total cost |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| mux-player-with-docs_run-0 | 277 | 40083 | $4.4217 | 89 | 34933 | $4.4026 | $8.8243 |
| mux-player-with-docs_run-1 | 626 | 44378 | $7.1737 | 79 | 21593 | $4.3927 | $11.5664 |
| mux-player-with-docs_run-2 | 583 | 46031 | $6.8695 | 90 | 28366 | $8.3783 | $15.2479 |
| video-js-with-docs_run-0 | 401 | 83574 | $11.7126 | 178 | 51029 | $10.5888 | $22.3014 |
| video-js-with-docs_run-1 | 214 | 44885 | $6.2844 | 101 | 28993 | $3.8920 | $10.1764 |
| video-js-with-docs_run-2 | 298 | 54733 | $8.7746 | 91 | 25679 | $4.6789 | $13.4536 |

---

## Patterns across runs

> 🤖 LLM-generated. Verify before quoting.

**6/6 cells were classified `library-hack` at rung 4**, and `prompted_to_eject` reads `false` in every cell's `judges/eject.json` — both libraries pushed the agent toward patching rather than ejecting. What diverges sharply is what happens *next*: all 3 Video.js cells threw away their rung-4 portal-into-`VideoSkin` hack and rebuilt the UI from `@videojs/react` primitives in rung 5 (`video-js-with-docs_run-1/workspace/src/App.tsx` has no `VideoSkin` import; `run-2` discarded `skin.css`; `run-0` produced a ~260-line `YTSkin`). Mux Player cells were inconsistent: `mux-player-with-docs_run-0/workspace/src/App.tsx:50` carried the rung-4 `volumeRange.insertAdjacentElement` shadow-DOM hack *forward* into rung 5; `run-2` pivoted to a hand-authored `<template id="theme-youtube">` (`workspace/index.html:9`); `run-1` kept its rung-4 hack mostly intact. Visual fidelity tracks the divergence — 1/5, 1/5, 4/5 (Mux) vs 4/5, 4/5, 4/5 (Video.js).

**Hallucinations cluster narrowly on CSS attributes and variables — never on imports or component names.** All 3 across the run are in this band: `mux-player-with-docs_run-0/judges/hallucinations.json` flags a fake `--media-fullscreen-button` shipped after a probe explicitly said it had no effect; `video-js-with-docs_run-0` invented `data-playing`/`data-paused` on `<video>` for a poster-hide rule; `video-js-with-docs_run-2` invented `data-hidden` on `Poster` for the same purpose (real attr is `data-visible`). Both video-js cases are the same shape — "I know the framework uses `data-*` state attrs; I guessed wrong which element carries them." Zero hallucinated imports or component names anywhere — the agent's package-introspection step (`pnpm view`, reading `dist/types/`) is doing real work, but it stops at the JS API surface.

**Rung 2 failed 3/3 on Mux Player and 0/3 on Video.js with the same failure shape.** All three Mux cells set `autoPlay`/`thumbnailTime` props on `<MuxPlayer>` and observed the video actually playing, but the assertion harness read `autoplay: false` / `poster: null` from the host element (`mux-player-with-docs_run-{0,1,2}/metrics.json` rung 2). The three Video.js cells passed the analogous check in a single edit. The pattern points at a harness/component-API mismatch on Mux (React props don't reflect to the attributes the assertion reads through the shadow boundary), not at agent behavior — Claude was not the variable that changed across runs.

**Docs were fetched ritually in both conditions, then bypassed in favor of `node_modules`.** Every rung in every cell starts with the prompted WebFetch, but the actual ground-truth reads happen against installed sources: `mux-player-with-docs_run-1` rung 4 greps `node_modules/@mux/mux-player/dist/themes/gerwig/index.mjs` for shadow layout, and every Video.js rung-1 cell reads `dist/dev/*.d.ts` before writing code. The Mux cells additionally racked up 404s on guessed GitHub URLs in rung 4 (e.g., `REAMDE.md` and the wrong `themes/gerwig.html` path in `mux-player-with-docs_run-0`) — visible symptom of "the docs got me started, then I had to guess." Video.js cells had a tighter 404 footprint because they pivoted to `dist/dev/*.d.ts` earlier.

## Suggested next changes

> 🤖 LLM-generated. Starting points, not commitments.

- **Investigate the Mux rung-2 assertion as a probable harness bug.** *Why:* 3/3 Mux cells failed rung 2 with identical shape — React prop set, video playing, but the assertion read `autoplay: false` / `poster: null` (`mux-player-with-docs_run-*/metrics.json` rung 2). Video.js passed the analogous check 3/3, so the variable is the library/assertion pair, not the agent. *How:* in `assertions/rung-2.ts`, read the inner shadow `<video>` element's runtime properties (`paused`, `currentSrc`, computed poster) rather than `getAttribute` on the host; or document the deviation so this stops counting as an agent failure.

- **Tighten the rung-5 visual-fidelity capture so autoplaying state isn't graded.** *Why:* `mux-player-with-docs_run-0` and `_run-1` both scored 1/5 because the harness screenshot caught the auto-hidden-controls state on autoplay — `judges/visual-fidelity.json` for `run-0` records the judge seeing "only a spinner over a letterboxed video." `run-2` scored 4/5 because its static custom-theme template rendered chrome regardless of playing state. *How:* before the rung-5 screenshot, pause the player and force `data-visible` on controls (Claude already does this for its own verification screenshots inside the transcript), then capture; alternatively grade a non-autoplaying frame.

- **Extend the hallucination judge to specifically enumerate `data-*` selectors and `var(--…)` references.** *Why:* 3/3 hallucinations across the run were in exactly this band, and one (`mux-player-with-docs_run-0` rung 4) shipped to disk *after* a runtime probe in the same turn said it had no effect. *How:* in the judge prompt, walk every CSS attribute selector and custom property used in `workspace/src/**/*.css` and grep the installed package source for them; flag any with no match. This is targeted at the only failure band we've actually seen and is cheap to add.

- **Surface "considered eject, chose hack" as a separate eject-judge signal.** *Why:* in `video-js-with-docs_run-1` (`rung-4 / turn 5–10`), `video-js-with-docs_run-2` (`rung-4 / turn ~7`), and `mux-player-with-docs_run-2` (rung 4), Claude *named* the right path in-thread before rejecting it on cost grounds — but `eject.json` today only sees final code, so all six cells look identical. *How:* add a `considered_eject_but_declined` boolean (and a quoted-rationale field) to `judges/eject.json`, populated from a transcript scan of rung-4 for explicit weigh-and-reject language. That's a different and more interesting signal than "is `media-chrome` in `package.json`."

- **Point the "with-docs" pre-task hint at the installed type surface, not the marketing docs page.** *Why:* across 6 cells, the WebFetch to `mux.com/docs/guides/mux-player-web` or `https://videojs.org` is fetched ritually then bypassed for `node_modules` reads. The 404 trail in Mux rung-4 cells is the visible cost of the docs page not covering the right altitude. *How:* swap the URL in the pre-task hint for an inline pointer to `node_modules/<pkg>/dist/types/` (or an `llms.txt` if the library ships one). This matches where the agent ends up anyway and would have saved most of the rung-4 wall time in Mux cells.

Appended `## Patterns across runs` and `## Suggested next changes` to `runs/N3-with-docs-v2/findings.md`. The patterns section calls out four cross-cell signals (uniform `library-hack` verdict but divergent rung-5 carry-over between conditions; hallucinations clustered narrowly on CSS attrs/vars; the Mux-only rung-2 assertion failure mode; docs-as-ritual vs `node_modules`-as-ground-truth). The five next-changes bullets each cite a specific judge/metric file.
