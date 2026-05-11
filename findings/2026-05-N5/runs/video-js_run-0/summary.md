```markdown
# Run: Video.js 10 / run-0

## Summary

Claude built a Video.js 10 (`@videojs/react@10.0.0-beta.23`) player across all five rungs in 17m29s of wall time, completing 23 assistant text turns and 131 tool calls without ever timing out (`metrics.json`). The harness's programmatic assertions marked rungs 1, 2, and 5 as PASS and rungs 3 and 4 as FAIL; Claude's own in-browser verification reported success on all five. The rung-4 implementation was categorized as a `library-hack` by the eject judge, and the rung-5 redesign earned a 4/5 visual-fidelity score. Zero hallucinations were flagged.

## Per-rung timeline

| Rung | Result | Turns | Notable |
|------|--------|-------|---------|
| 1. Install | PASS | 6 | After `npm view @videojs/html @videojs/react`, Claude read 21+ `.d.ts` files before writing a single line of `App.tsx` (`rung-1 / turn 1`: "Both packages exist. Let me explore the API to understand how to use them"). 4m51s. |
| 2. Config | PASS | 1 | One-shot single `Edit` adding `autoPlay`, `muted`, `loop`, and Mux thumbnail `poster` URL (`rung-2 / turn 1`). 51s. |
| 3. Styling | FAIL | 4 | First attempt overridden by skin CSS specificity; Claude diagnosed and reordered the CSS import in `main.tsx` (`rung-3 / turn 2`: "The lib rules tie my specificity but load later"). Self-verified `#ff3e00` and `rgba(0,0,0,0.5)` via computed styles, but the harness's `accentMatches` array came back empty (`metrics.json`). |
| 4. Structural | FAIL | 5 | **Eject decision:** `library-hack` (`judges/eject.json`). Claude opened with "I need to look at the primitives so I can compose custom controls (the `VideoSkin` is a sealed preset with no slot for injecting buttons)" (`rung-4 / turn 1`), then chose a `useEffect` + `querySelector('.media-button--mute')` + `createPortal` injection instead (`rung-4 / turn 2`). Harness's synthetic click did not trigger the React handler (`shareClickLogged: false`) even though Claude's own `evaluate_script` saw `'shared'` in console. |
| 5. Redesign | passed build / visual 4/5 | 7 | Claude discarded the `VideoSkin` preset and composed `Controls.Root` / `TimeSlider` / `PlayButton` / `MuteButton` / `CaptionsButton` / `PiPButton` / `FullscreenButton` directly from `@videojs/react` primitives (`workspace/src/App.tsx:73-131`). One mid-rung correction kept the CC button rendered after discovering it auto-hid without caption tracks (`rung-5 / turn 5`). 6m48s. |

## Notable moments

- **Heavy `.d.ts` archaeology before any code:** rung-1 contains 28 `Read` calls and 21 `Bash` calls, the vast majority pointed at `node_modules/@videojs/react/dist/dev/**/*.d.ts` and the pnpm-hoisted `@videojs/core` types, before the first `Write` (`rung-1`, tool log). No README was read end-to-end; Claude went directly to typings.
- **CSS-specificity self-correction in rung-3:** first edit didn't take; Claude observed the override losing to the library's later-loaded stylesheet and moved the skin CSS import into `main.tsx` to flip the cascade order (`rung-3 / turn 2`, `workspace/src/main.tsx`).
- **The acknowledge-then-hack pattern in rung-4:** Claude explicitly identified the composable-primitive path ("`VideoSkin` is a sealed preset", `rung-4 / turn 1`) and read `controls/index.parts.d.ts` and `mute-button.d.ts` — then deliberately chose the portal-injection workaround "to avoid re-implementing the entire skin" (`rung-4 / turn 2`, `judges/eject.json`).
- **Same primitives, different verdict, one rung later:** in rung-5 Claude did restructure with `Controls.Root` and individual button primitives — the exact path it had declined in rung-4 (`workspace/src/App.tsx:73-131`).
- **Visual-fidelity decision on captions:** when the CC button auto-hid for lack of tracks, Claude added a CSS override to force it visible rather than removing it, citing the YouTube reference (`rung-5 / turn 5`).
- **Hand-authored SVG iconography:** Claude wrote 11 inline SVG path strings for play/pause/volume/settings/CC/mini-player/PiP/fullscreen rather than pulling an icon library (`workspace/src/App.tsx:36-53`).

## Hallucinations: 0

`judges/hallucinations.json` — all imports, component prop usage, CSS custom properties (`--media-slider-fill`, etc.) and data attributes (`data-visible`, `data-paused`, `data-availability="unsupported"`) were verified against the installed `.d.ts` and CSS-var definitions. A transient earlier-rung mismatch (`data-availability="unavailable"`) was self-corrected via runtime testing.

## Tool usage

Chrome DevTools MCP only — Playwright MCP was not used (and `CLAUDE.md` in the workspace explicitly steers toward Chrome DevTools). No `WebFetch` and no `WebSearch` calls in any rung; Claude relied entirely on `npm view`, local `.d.ts`/CSS reads, and live browser introspection. Screenshot counts per rung: 6 / 2 / 3 / 2 / 3 (rungs 1–5). `evaluate_script` was the workhorse for state verification — called 6, 2, 4, 4, and 4 times across rungs 1–5.

---

## Editorial (opinionated)

> This section contains interpretive claims. Dismiss or keep as you see fit.

- **Video.js 10's `.d.ts` surface is so navigable that Claude treated it like documentation.** No README, no web search, no llms.txt — the typings *were* the manual. That's an unusual outcome and quietly flattering to the package: most libraries' agent experience starts with a doc-fetch detour.
- **The rung-4 hack is the most interesting failure in this run.** Claude *knew* the composable-primitive path existed, said so out loud, then bolted DOM-piercing onto a sealed preset anyway — and one rung later proved it could have done the right thing the first time. Whatever cost model decided "lightest approach that avoids re-implementing the entire skin" was the wrong heuristic for a library whose entire selling point is composable primitives.
- **The harness disagrees with Claude twice (rungs 3 and 4) and the disagreement is structural, not behavioral.** Computed styles say `#ff3e00`; harness regex says empty. React `onClick` logs `shared`; harness synthetic click sees nothing. The player works in both cases — these are assertion-shape bugs, not Video.js bugs, and a fairer scorecard would read 5/5.
- **The rung-5 YouTube rebuild is the strongest argument for Video.js 10 in this experiment.** Drop the preset, import a dozen primitive components, write 200 lines of CSS, and you get a 4/5-fidelity YouTube clone with working hotkeys and gestures — no escape hatches, no `querySelector`, no ejection. That's the headline.
```