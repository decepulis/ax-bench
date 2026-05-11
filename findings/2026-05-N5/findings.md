# Synthesis — 2026-05-11T17-24-51Z

10 cells across 2 conditions (mux-player, video-js). Longest cell 20.3min; agent cost $78.9124, judge cost $53.9217, total $132.8341.

## Cell outcomes (deterministic)

Rung legend: ✓ pass · ✗ fail · TO timed out · — not run.

| Cell | Rung 1 | Rung 2 | Rung 3 | Rung 4 | Rung 5 | Halluc. | Eject | Visual |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | --- | :---: |
| mux-player_run-0 | ✓ | ✗ | ✓ | ✓ | ✓ | 0 | — | — |
| mux-player_run-1 | ✓ | ✗ | ✗ | ✓ | ✓ | 0 | — | — |
| mux-player_run-2 | ✓ | ✗ | ✗ | ✓ | ✓ | 0 | — | — |
| mux-player_run-3 | ✓ | ✗ | ✗ | ✓ | ✓ | 1 | — | — |
| mux-player_run-4 | ✓ | ✗ | ✗ | ✓ | ✓ | 0 | — | — |
| video-js_run-0 | ✓ | ✓ | ✗ | ✗ | ✓ | 0 | — | — |
| video-js_run-1 | ✓ | ✓ | ✓ | ✗ | ✓ | 0 | — | — |
| video-js_run-2 | ✓ | ✓ | ✓ | ✗ | ✓ | 0 | — | — |
| video-js_run-3 | ✓ | ✓ | ✓ | ✓ | ✓ | 0 | — | — |
| video-js_run-4 | ✓ | ✓ | ✓ | ✗ | ✓ | 2 | — | — |

## Token / cost rollup (deterministic)

| Cell | Agent in | Agent out | Agent cost | Judge in | Judge out | Judge cost | Total cost |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| mux-player_run-0 | 163 | 49960 | $5.8721 | 97 | 33602 | $3.7603 | $9.6324 |
| mux-player_run-1 | 147 | 40922 | $4.5011 | 104 | 37184 | $5.6325 | $10.1335 |
| mux-player_run-2 | 159 | 58123 | $6.2965 | 211 | 30960 | $4.1687 | $10.4652 |
| mux-player_run-3 | 119 | 53045 | $5.2492 | 153 | 39237 | $6.6233 | $11.8725 |
| mux-player_run-4 | 199 | 63923 | $6.4011 | 116 | 33114 | $5.3206 | $11.7218 |
| video-js_run-0 | 181 | 61226 | $9.7273 | 102 | 30384 | $4.6159 | $14.3432 |
| video-js_run-1 | 238 | 64501 | $11.9676 | 97 | 25374 | $5.3993 | $17.3669 |
| video-js_run-2 | 198 | 72357 | $10.3510 | 115 | 34217 | $5.9715 | $16.3225 |
| video-js_run-3 | 210 | 58861 | $10.6416 | 142 | 41451 | $7.3546 | $17.9962 |
| video-js_run-4 | 201 | 50567 | $7.9049 | 100 | 33590 | $5.0749 | $12.9798 |

---

## Patterns across runs

> 🤖 LLM-generated. Verify before quoting.

**Both libraries lose rung 4 the same way, but the shape of the hack differs.** 10/10 rung-4 implementations were classified `library-hack` and 10/10 had `prompted_to_eject: false`. The shape is condition-specific: every mux-player cell pierced `player.shadowRoot → media-theme.shadowRoot` and used `insertAdjacentElement`/`MutationObserver` to inject a `<button>` after `media-volume-range` (see all five `mux-player_run-*/judges/eject.json`); every video-js cell kept `<VideoSkin>` and did `document.querySelector('.media-button--mute')` + `createPortal` into a `display:contents` sibling. The eject judges' notes are nearly verbatim across cells in each condition — "Media Chrome was never installed" for mux-player, "the primitive path was readily available" for video-js. The rung-4 prompt does not lean either library toward an eject path, and neither library's discovery surface (types, README, runtime introspection) makes the eject obvious to the agent.

**Rung-4 vs. rung-5 splits cleanly by condition.** All 5 video-js cells abandoned the rung-4 portal hack in rung 5 and rebuilt with `Container` + `Controls.Root` + primitive buttons (`workspace/src/App.tsx` or `CustomVideoSkin.tsx`/`YouTubeSkin.tsx` in every video-js cell). Mux-player cells were more mixed: the rung-4 shadow-DOM hack typically got thrown away in rung 5, but the rung-3 fabricated `--media-control-bar-background` CSS variable persisted into the final rung-5 file in 4/5 cells (`workspace/src/App.tsx` or `index.css` in runs 1, 2, 3, 4). Video-js cells, in contrast, threw away their entire rung-1 through rung-4 scaffold and started rung 5 from primitives — the four-rung accumulator was dead weight.

**Hallucination clustering is dramatic and library-specific.** 4 of 5 mux-player cells fabricated `--media-control-bar-background` (the only mux-player cell that didn't, run-0, instead invented the adjacent `--media-time-buffered-color`). The real names are `--media-control-background` and `--media-time-range-buffered-color`; the fabricated forms are plausible-by-naming-pattern shortenings. Video-js produced zero hallucinations in 4 of 5 cells; the one that did (run-4) fabricated `<Gesture event=...>` and `<Time.Value type="currentTime">` in rung 5 only — both silently tolerated at runtime, neither flagged by `tsc` because `Gesture.type` widens to `string` and `Time.Value` falls through. The clear takeaway: mux-player's CSS-variable naming convention invites confident extrapolation; video-js's `.d.ts` surface is tight enough to catch most prop-level errors at build time but loose enough on Gesture/Time to let two slip past.

**Verification shape predicts assertion-shape disagreements.** Across both conditions, every cell verified work via `evaluate_script` reading inline styles, computed properties, or React-element state — never by exercising the feature end-to-end. The two clearest disagreements: (a) all 5 mux-player cells failed rung 2 because `previewImageVisible: false` despite Claude confirming autoplay/loop via DOM probes (the prompt's "preview image" was interpreted as `thumbnailTime` in 5/5 cells); (b) 3/5 video-js rung-4 cells failed on `shareClickLogged: false` despite the button being visible — the synthetic click did not survive the portal/MutationObserver path, and no cell pressed its own button before declaring done.

## Suggested next changes

> 🤖 LLM-generated. Starting points, not commitments.

- **Add a known-bad-CSS-variable pre-flight for mux-player.** *Why:* `--media-control-bar-background` was invented in 4/5 mux-player cells and persists into final code in all 4 (it never has an effect — the rung-3 assertion catches the visible failure, but it sits in the codebase indistinguishable from a real variable). *How:* extend `judges/hallucinations.json` or add a `harness/lint.ts` pass that greps the final workspace for the top-N media-chrome CSS variable look-alikes and surfaces them in the per-cell summary; alternatively, ship a `llms.txt` or workspace-level CLAUDE.md hint listing real variable names.

- **Tighten the rung-2 "preview image" assertion or rewrite the prompt.** *Why:* 5/5 mux-player cells interpreted "preview image before play" as `thumbnailTime={0}` (a hover-scrub feature), set `autoPlay` alongside, and self-reported success. The assertion fails on `previewImageVisible: false` and `autoplay: false` (attribute, not property). *How:* either change the prompt to use the word "poster" explicitly, or change `assertions/rung-2.ts` to also accept `videoElement.autoplay === true` (property) alongside the attribute check, and to clarify what counts as a preview image. The current check is ambiguous in a way the harness shouldn't be.

- **Add a click-exercise step to the rung-4 assertion.** *Why:* 3/5 video-js cells had a visible Share button with the right `aria-label` and right position, but `shareClickLogged: false` because the synthetic click missed the React handler delegated through `createPortal`/`MutationObserver`. Claude verified existence, not click. *How:* in `assertions/rung-4.ts`, after the visibility check, dispatch a real `MouseEvent('click')` (or use `chrome-devtools.click`) on the button and assert the console message — and ensure the prompt instructs the agent to do the same self-check before declaring done.

- **Prompt-level eject nudge at rung 4 for both libraries.** *Why:* 10/10 cells were classified `library-hack` with `prompted_to_eject: false`. Eject judges across both conditions note that Claude recognized the architectural dead-end (no slots, sealed skin) but reached for DOM mutation rather than installing the lower layer. This is the cross-cutting finding of the run. *How:* add a one-line cue in the rung-4 prompt template — e.g., "if the library doesn't expose a slot, you may install or compose with its underlying primitive layer" — and re-run to see whether the eject judge flips on a meaningful fraction of cells. Without the cue, the benchmark is measuring the agent's default conservatism, not the library's ergonomics.

- **Capture pre-rung-5 workspace state and add a "rung-5 reuse" metric.** *Why:* 5/5 video-js cells discarded the rung-1 through rung-4 scaffold in rung 5; mux-player cells were more incremental but carried hallucinated CSS forward. The current report can't tell you whether rung 5 *built on* the prior rungs or *replaced* them — that's a load-bearing fact for the migration story. *How:* in `harness/run-cell-inner.ts`, snapshot `workspace/src/` before rung 5 begins, then diff against post-rung-5 state to compute a churn percentage; surface in the per-cell table.

- **Track CSS-specificity rounds as a tax metric for video-js.** *Why:* 4/5 video-js cells lost at least one CSS-specificity battle to the late-loading skin stylesheet and burned a turn diagnosing and fixing it (run-0 rung-3, run-2 rungs 3 & 4, run-3 rung-3, run-4 rungs 3 & 4). It's a real per-rung cost specific to one condition. *How:* in `harness/run-cell-inner.ts` post-processing, count `Edit` operations on `index.css`/`*.css` that follow an `evaluate_script` reading computed styles within the same rung; surface as a "specificity rounds" column. Flag it to the library author as an ergonomics finding.
Synthesis appended to `findings.md`. Three patterns: identical-shape rung-4 hacks within each condition (shadow-DOM piercing for mux, portal-into-DOM for video-js), library-specific hallucination clustering (mux's `--media-control-bar-background` in 4/5, video-js zero in 4/5), and rung-4→rung-5 reuse splitting cleanly by condition. Six suggested changes target the highest-signal cross-cell findings: a CSS-variable lint pass, a rung-2 assertion/prompt fix, a rung-4 click-exercise step, an eject nudge, a rung-5 reuse metric, and a CSS-specificity-rounds tax counter.
