# Synthesis — N2-mock-1560

2 cells across 1 condition (video-js). Longest cell 23.6min; agent cost $26.6313, judge cost $10.0761, total $36.7073.

## Cell outcomes (deterministic)

Rung legend: ✓ pass · ✗ fail · TO timed out · — not run.

| Cell | Rung 1 | Rung 2 | Rung 3 | Rung 4 | Rung 5 | Halluc. | Eject | Visual |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | --- | :---: |
| video-js_run-0 | ✓ | ✓ | ✗ | ✗ | ✓ | 0 | — | — |
| video-js_run-1 | ✓ | ✓ | ✗ | ✓ | ✓ | 0 | — | — |

## Token / cost rollup (deterministic)

| Cell | Agent in | Agent out | Agent cost | Judge in | Judge out | Judge cost | Total cost |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| video-js_run-0 | 230 | 69486 | $13.1906 | 132 | 40520 | $6.2218 | $19.4124 |
| video-js_run-1 | 246 | 76119 | $13.4407 | 79 | 25042 | $3.8542 | $17.2949 |

---

## Patterns across runs

> 🤖 LLM-generated. Verify before quoting.

**Both cells hit the same beta-bug and shipped the same workaround.** Both run-0 and run-1 discovered that `createPopupGroup` (and adjacent `*Core` symbols) is imported by `@videojs/react` but not exported by the vendored `@videojs/core@10.0.0-beta.23` build, and both authored a Vite plugin shim into `workspace/vite.config.ts` rather than patching `node_modules`. Rung 1 dominated wall time in both cases (~12.5 min / run-0, ~13.8 min / run-1, per `*/metrics.json`).

**Rung 3 failed in both cells with the same `accentMatches: []` symptom but with different underlying behavior.** run-0 plausibly never put `#ff3e00` on a probe-visible selector (`run-0/summary.md` flags this candidate); run-1 *did* apply `#ff3e00` to the progress fill and to button hover states (`run-1/workspace/src/App.tsx:147-207`, corroborated by `run-1/summary.md` editorial). A consistent fail across two cells where at least one visibly satisfies the spirit of the assertion suggests the assertion is under-matching, not the agent missing the color.

**The cells diverged sharply on how much library surface they kept past rung 1.** run-0 stuck with `@videojs/react` primitives through rung 5 — `PlayButton`, `MuteButton`, `Controls.Root`, `TimeSlider.Root/Track/Buffer/Fill/Thumb`, `Time.Value`, `CaptionsButton`, `FullscreenButton` are all still present in `run-0/workspace/src/App.tsx:99-146`. run-1 abandoned the library UI entirely after rung 1 — its rung-5 control bar is fully hand-rolled JSX driving a bare `HlsVideo` via `videoRef` + `useState` for paused/muted/currentTime/duration (`run-1/workspace/src/App.tsx:83-207`). Both landed visual fidelity 4/5 with the same missing-features set (no chapter markers, no title overlay).

**Hallucinations correlated with library-surface usage, not raw skill.** run-0's `judges/hallucinations.json` lists two invented `data-*` attribute names targeting library elements (`data-controls-visible` on `Controls.Root`, `data-captions-active` on `CaptionsButton`) — both following a "data-{feature}-{state}" template extrapolated from real attrs like `data-paused`/`data-muted`. run-1's `judges/hallucinations.json` lists none, and its `notes` field explains why: the run had almost no library API surface left to make claims against. The hallucination *rate per library-API opportunity* is likely much closer than the raw counts suggest.

**Both cells reached for plain `<button>` over the documented `useButton` hook in rung 4, but only one of them passed the click probe.** Both eject judges marked `in-library-primitive` (`*/judges/eject.json`); the `useButton` hook indexed at `node_modules/@videojs/react/docs/llms.txt:66` (read in rung 1 of both cells) went unused in both. run-0's plain `<button>` was inserted *inside* `Controls.Root` and failed (`shareClickLogged: false`); run-1's plain `<button>` was inserted into its already-custom control bar and passed. Same idiom, different parent DOM, opposite outcome — pointing at the probe rather than the implementation.

## Suggested next changes

> 🤖 LLM-generated. Starting points, not commitments.

- **Tighten or replace the rung-3 accent-color assertion.** *Why:* both cells failed `assertions/rung-3.json` with `accentMatches: []`, and run-1's code visibly applies `#ff3e00` to progress fill and button hover (`run-1/workspace/src/App.tsx:147-207`). *How:* `assertions/rung-3.ts` is most likely walking `getComputedStyle` on resting-state elements only; extend it to read declared `:hover`/`:focus`/`::before`/`::after` rules and CSS custom-property declarations, or accept the color anywhere in the cascade of player-descendant elements rather than only current computed style.

- **Diagnose why the rung-4 click probe disagreed across cells.** *Why:* both cells used the same idiom (plain `<button onClick={() => console.log('shared')}>` next to a mute control), eject-classified identically as `in-library-primitive`, but only run-1's click registered. The most likely culprit is `Controls.Root`'s user-active/focus management swallowing or restamping the synthetic click in run-0. *How:* in `assertions/rung-4.ts`, switch from a single click strategy to a try-multiple-strategies probe (synthetic React click, native `dispatchEvent`, `element.click()`) and log which strategy succeeded — so future ablations can attribute failures to library interception vs. wiring.

- **Land the `createPopupGroup` shim in `harness/template/` itself, or vendor a patched tarball.** *Why:* both cells spent ~13 min and the bulk of rung-1 turns (run-0 ~150 / 308 events, run-1 ~196 turns) on the same missing-export diagnosis. That's bench noise that dominates cost and obscures rung-1's intended signal (initial install discovery). *How:* either commit a `vite.config.ts` shim plugin to `harness/template/` with a comment pointing at the upstream bug, or replace `harness/template/vendor/videojs-react-10.0.0-beta.23.tgz` with a re-packed tarball that exports the missing symbols. Either way, document the patch so we don't credit "agent resilience" to a problem we papered over.

- **Add a `used_library_button_hook` signal to the eject judge.** *Why:* both cells skipped `useButton` despite reading it in `llms.txt`, and the eject judge currently labels both `in-library-primitive`, hiding the sub-pattern of "ignored the library's lowest-level hook in favor of raw HTML". *How:* extend `judges/eject.*` prompt + schema to emit a `used_library_button_hook: boolean` (or, more generally, `used_documented_hook` with the hook name) alongside `decision`, so the next ablation can quantify hook-uptake instead of inferring it from transcript reads.

- **Test whether shortening core's state data-attrs would close the hallucination class.** *Why:* run-0's two hallucinations are isomorphic — invented `data-controls-visible` and `data-captions-active` where v10 actually uses bare `data-visible` and `data-active`. The agent generalized from real attrs (`data-paused`, `data-muted`) toward a longer "data-{feature}-{state}" template. *How:* a non-bench follow-up for the v10 team — either rename the affected attrs to the longer disambiguated form (so the template-fill heuristic is correct), or add an explicit "data attribute reference" section to `node_modules/@videojs/react/docs/llms.txt` enumerating actual names so the template heuristic has ground truth nearby.
Appended `## Patterns across runs` (5 paragraphs) and `## Suggested next changes` (5 bullets) to `runs/N2-mock-1560/findings.md`. Key cross-cell observations: both runs hit and shimmed the same `createPopupGroup` beta bug; rung-3 failed in both with `accentMatches: []` despite run-1 visibly applying the color (likely a broken assertion); the two cells diverged on whether to keep the library UI surface, which in turn drove the hallucination delta; both skipped `useButton` for raw `<button>` but only run-1's click probe registered. Suggestions target the rung-3 assertion, rung-4 click probe, pre-shimming the beta in `harness/template/`, an eject-judge hook-usage signal, and a v10 data-attr naming follow-up.
