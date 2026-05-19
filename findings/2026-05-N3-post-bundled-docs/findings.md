# Synthesis — N3-post-bundled-docs

3 cells across 1 condition (video-js). Longest cell 24.7min; agent cost $22.1163, judge cost $21.6938, total $43.8101.

## Cell outcomes (deterministic)

Rung legend: ✓ pass · ✗ fail · TO timed out · — not run.

| Cell | Rung 1 | Rung 2 | Rung 3 | Rung 4 | Rung 5 | Halluc. | Eject | Visual |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | --- | :---: |
| video-js_run-0 | ✓ | ✓ | ✓ | ✗ | ✓ | 0 | — | — |
| video-js_run-1 | ✓ | ✓ | ✓ | ✗ | TO | 0 | — | — |
| video-js_run-2 | ✓ | ✓ | ✗ | ✓ | ✓ | 0 | — | — |

## Token / cost rollup (deterministic)

| Cell | Agent in | Agent out | Agent cost | Judge in | Judge out | Judge cost | Total cost |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| video-js_run-0 | 155 | 53843 | $7.5588 | 133 | 44623 | $6.0931 | $13.6519 |
| video-js_run-1 | 130 | 27268 | $5.9200 | 1368 | 35345 | $8.5315 | $14.4515 |
| video-js_run-2 | 178 | 53274 | $8.6375 | 137 | 41559 | $7.0692 | $15.7067 |

---

## Patterns across runs

> 🤖 LLM-generated. Verify before quoting.

**Bundled docs land cleanly; the failure surface moves from "wrong API" to everything else.** All three cells finished with zero hallucinations and no WebFetch/WebSearch calls in any rung (per `judges/hallucinations.json` and the transcripts). Runs 0 and 1 explicitly read `node_modules/@videojs/react/docs/llms.txt` early in rung 1 (`video-js_run-0/summary.md` notable moments, `video-js_run-1/summary.md` turn 55); run 2 never opened `llms.txt` but still resolved the API correctly off `dist/dev/*.d.ts`. The hallucination axis appears genuinely flat for Video.js 10 — whatever goes wrong from here, it isn't invented imports.

**Rung 4 is where method splits, and the harness can't tell good from bad.** Two of three cells (`video-js_run-0` and `video-js_run-2`) shipped a `library-hack`: `MutationObserver` or `useEffect` + `document.querySelector('.media-button--mute')` + `createPortal` into the default skin (`video-js_run-0/judges/eject.json`, `video-js_run-2/judges/eject.json`). Only `video-js_run-1` did the in-library composition by editing `PlayerSkin.tsx` (`video-js_run-1/judges/eject.json`). Yet `shareClickLogged: false` fired on both `video-js_run-0` (hack) and `video-js_run-1` (clean eject), while `video-js_run-2` (hack) passed — so the assertion outcome is not tracking method quality. Run-1's own in-session click logged `'shared'` (per its summary, turn 30) but the harness synthetic click didn't, suggesting an event-dispatch or wrapper-component issue in the assertion rig, not in Claude's code.

**Rung 5 is identical in shape across all three: throw away rung 4, rebuild from primitives.** Every cell discarded its rung-4 approach (whether portal-hack or PlayerSkin edit) and re-authored the UI from `Controls.Root` + `TimeSlider.Root/Track/Buffer/Fill/Thumb` + `Time.Group/Value` + named buttons (compare `video-js_run-0/workspace/src/App.tsx`, `video-js_run-1/workspace/src/Player.tsx`, `video-js_run-2/workspace/src/Player.tsx`). All three scored 4/5 on visual fidelity. The compositional layer is reliably reachable — but only when the task explicitly asks for a redesign. Two of three cells (`run-0`, `run-2`) had a primitive-composed layout in an earlier rung and *regressed back* to `<VideoSkin>` to do rung 4, which is the most counterintuitive trajectory in the run.

**Rung 3's styling check has an in-skin blind spot.** `video-js_run-2` failed rung 3 on `accentMatches: []` because it stayed inside `<VideoSkin>` and never found the `--media-color-primary` hook (`video-js_run-2/metrics.json` rung 3, `video-js_run-2/summary.md` editorial). The two cells that passed rung 3 either had a custom layout already (run-0) or wrote a separate `Player.css` setting `--media-color-primary` (run-1). The library couples styling shape to eject shape more tightly than the rung text implies.

## Suggested next changes

> 🤖 LLM-generated. Starting points, not commitments.

- **Diagnose the rung-4 share-click assertion mismatch.** *Why:* `shareClickLogged: false` fired across both eject strategies, including the cleanest in-library one (`video-js_run-1/judges/eject.json`); run-1's own in-session click logged correctly. The harness disagrees with reality in at least one cell. *How:* in `assertions/rung-4.ts`, capture the actual element the synthetic click resolves to (selector, bounding rect, computed `pointer-events`) and whether the click reached a React-attached handler vs. only a DOM listener; this will separate "Claude's portal handler is genuinely unreachable" from "the assertion dispatch doesn't reach React-tree handlers."

- **Make the rung-4 prompt nudge toward in-library composition before allowing hacks.** *Why:* 2 of 3 cells picked `library-hack` even though `Controls.Root` composition was demonstrably available and used by the same cell in rung 5 — and one of those (`video-js_run-0`) had *already built* a custom layout in rung 3 before throwing it away (`video-js_run-0/judges/eject.json` notes). This is a prompt-shape problem, not an API or docs problem. *How:* add a one-line hint to the rung-4 prompt that mirrors what landed in WITH_DOCS v2 — something like "prefer composing from the same primitives you'd use for a redesign before reaching for portal/MutationObserver."

- **Add a rung-3 accent-color hook to `llms.txt` or the rung-3 hint.** *Why:* `video-js_run-2` failed rung 3 with `accentMatches: []` (`video-js_run-2/metrics.json`) — it found the bar-background hook on `.media-controls` but never discovered `--media-color-primary` while operating inside `<VideoSkin>`. *How:* either surface "`--media-color-primary` is the accent surface for the default skin" near the top of `node_modules/@videojs/react/docs/llms.txt`, or surface the same in a styling-rung hint; the docs files exist (`docs/concepts/skins.md`) but aren't reliably reached on shallow runs.

- **Detect "stuck on aesthetics" before the rung-5 timeout.** *Why:* `video-js_run-1` timed out at 905s on rung 5 (`metrics.json` rung 5 `timedOut: true`) after correctly diagnosing a phantom dark band at turn 129 and then debugging it for another ~35 turns (per its summary). The visual passed anyway; the timeout was pure burn. *How:* tighten the rung-5 timeout (e.g., 600s) or have the harness post a soft warning after N turns without a file write, so the agent gets a signal that further investigation isn't paying.

- **Re-run with n≥5 to ground the eject distribution.** *Why:* 2/3 vs 1/3 on `library-hack` vs `in-library-primitive` is a thin sample for a result this load-bearing — and one of the three (`video-js_run-2`) didn't read `llms.txt` at all, which is its own confound. *How:* run five more video-js cells under the current N3 conditions before drawing conclusions about whether bundled docs change rung-4 method choice or only hallucinations.
Appended the two synthesis sections to `runs/N3-post-bundled-docs/findings.md`. Key cross-run signals captured: bundled-docs flatten the hallucination axis but don't reach rung-4 method choice (2/3 still hack), the shareClickLogged assertion disagrees with reality in at least one cell, and all three cells converge on the same primitive composition in rung 5. Five next-change suggestions, each grounded in a specific cell + judge file.
