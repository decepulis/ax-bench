```markdown
# Run: Video.js 10 / run-3

## Summary

Across five rungs and ~16m41s of wall time (`metrics.json` — `totalDurationMs: 1000646`), Claude built a Video.js 10 (beta-23) player using `@videojs/react` and `@videojs/html`. Three of five assertions passed (rungs 1, 3, 5); rungs 2 and 4 failed their structural checks despite Claude reporting completion. Total assistant turns: 198 (104 / 11 / 20 / 21 / 42 across rungs 1–5 per `transcripts/rung-*.jsonl`). The final rung-5 redesign scored 4/5 on visual fidelity (`judges/visual-fidelity.json`).

## Per-rung timeline

| Rung | Result | Turns | Notable |
|------|--------|-------|---------|
| 1. Install | PASS | 104 | API learned by reading `.d.ts` files in `node_modules` — first read at `rung-1 / turn 20` (`@videojs/react/README.md`), then a sweep of `dist/dev/**/*.d.ts`; zero WebFetch calls |
| 2. Config | FAIL | 11 | Poster set as a `poster=` prop on `<VideoSkin>` rather than via `<Poster>`; assertion reports `poster: null`, `previewImageVisible: false` (`metrics.json` rung 2). Claude rationalized at `rung-2 / turn 19`: *"visible on initial paint"* before autoplay starts |
| 3. Styling | PASS | 20 | Hit a CSS specificity wall — `rung-3 / turn 19`: *"my control-bar background was overridden by the videojs skin.css that loads after my index.css. I'll bump specificity"* |
| 4. Structural | FAIL | 21 | **Eject decision:** library-hack (`judges/eject.json`). At `rung-4 / turn 12`: *"I'll: (a) hide fullscreen with CSS, and (b) portal a Share button right after the mute button"*; implementation (`rung-4 / turn 17`) does `document.querySelector('.media-button--mute').after(span)` and `createPortal` into that slot. Assertion records `shareClickLogged: false` (`metrics.json` rung 4) |
| 5. Redesign | passed build / visual 4/5 | 42 | Rebuilt from primitives (`Controls.Root`, `TimeSlider.*`, `VolumeSlider.*`, `Time.Value`); 3 screenshot iterations at `rung-5 / turn 53, 58, 70` |

## Notable moments

- **No internet, all node_modules.** Across all five rungs, Claude made zero `WebFetch` and zero `WebSearch` calls. Every API decision was grounded in TypeScript declarations read directly from `node_modules/@videojs/**/*.d.ts` (`rung-1` reads start at `turn 20`; `rung-5` re-spelunks at `turns 7–26`). The hallucination judge cross-checked every claimed export and found zero fabrications (`judges/hallucinations.json`).
- **Verified the user's premise before installing.** At `rung-1 / turn 11`: *"The user's instructions claim `@videojs/html` and `@videojs/react` exist for Video.js 10. Let me verify"* — followed by `npm view` (`turn 12`) and `pnpm add` of `10.0.0-beta.23` (`turn 16`).
- **Rung 2's failure mode is a misread of the assertion intent.** The `<Poster>` component exists in the API and is used in the final `workspace/src/App.tsx:118`, but at rung 2 Claude attached `poster={POSTER}` to `<VideoSkin>` instead. The assertion reads `poster: null` because no `<video poster=...>` attribute is present (`metrics.json` rung 2).
- **Rung 4 chose a CSS+portal escape hatch over recomposition.** The library exposes `Controls.Root` and individual button primitives that would have allowed inserting Share inline; Claude instead hid the fullscreen button via `.media-button--fullscreen { display: none }` and React-portaled the Share button into a `<span>` injected via `mute.after(span)` (`rung-4 / turn 17`). The judge labels this `library-hack` (`judges/eject.json`).
- **Rung 5 made the leap rung 4 didn't.** Faced with a full redesign, Claude rebuilt the control bar from `@videojs/react` primitives — `Controls.Root`, `TimeSlider.{Root,Track,Buffer,Fill,Thumb}`, `VolumeSlider.*`, `MuteButton`, `PlayButton`, `SeekButton`, `Time.Value`, plus `Gesture` and `Hotkey` declarations (`workspace/src/App.tsx:126-205`). Only one visible revision cycle (`rung-5 / turn 61`: *"CC button is hidden because the stream has no caption tracks. I'll keep it visible (greyed) to match the reference"*).
- **Rung 2 took 57 seconds; rung 1 took ~6 minutes** (`metrics.json` rung durations: 358s / 57s / 107s / 166s / 311s). Rung 1 dominates the run because it bootstrapped the entire API model from scratch.

## Hallucinations: 0

`judges/hallucinations.json` reports `"total": 0`. Every export, compound part accessor, action name, CSS custom property, and data attribute Claude used was verified against the published `@videojs/react@10.0.0-beta.23` and `@videojs/core@10.0.0-beta.23` packages.

## Tool usage

Claude used **Chrome DevTools MCP** (not Playwright) for every browser interaction: `mcp__chrome-devtools__{new_page, navigate_page, evaluate_script, list_console_messages, take_screenshot, list_network_requests}`. Screenshot iterations: 1 in rung 1, 1 in rung 2, 1 in rung 3, 1 in rung 4, **3 in rung 5** (`turns 53, 58, 70`). **Zero `WebFetch` and zero `WebSearch` calls across all rungs** — Claude never consulted external docs or `llms.txt`. API discovery was entirely via `Read` against `node_modules` (23 reads in rung 1, 12 in rung 5) and `Bash` (`npm view`, `pnpm add`, `cat` of `.pnpm` paths).

---

## Editorial (opinionated)

> This section contains interpretive claims. Dismiss or keep as you see fit.

- **The TypeScript declarations *were* the documentation.** A pre-1.0 library with no Stack Overflow footprint, no blog posts, no `llms.txt` indexed yet — and Claude got zero hallucinations across 198 turns. The win here isn't Video.js's docs; it's that they shipped clean `.d.ts` files. For agents, "good types" beats "good README".
- **Rung 4 is the tell.** When the task was framed as "small change to existing chrome," Claude reached for `querySelector` + portal — the kind of escape hatch you only use when the framework feels foreign. When rung 5 forced a full rebuild, Claude composed the same chrome out of `Controls.Root` and friends without complaint. The library's primitives are reachable; under low-stakes time pressure, agents will still skip them.
- **The poster failure is more interesting than the share-button failure.** Rung 2 wasn't ejected — it just got the API contract subtly wrong (a prop name on the wrong component) and confidently shipped. The assertion catches it; a human reviewer of just the screenshot might not.
- **A blog-post-shaped sentence:** *"Claude built a working Video.js 10 player without ever leaving `node_modules` — and the only time it stumbled into a hack was the one rung where the right answer was 'recompose, don't patch.'"*
```
