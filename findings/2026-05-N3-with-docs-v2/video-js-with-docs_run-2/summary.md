```markdown
# Run: Video.js 10 / run-2

## Summary

Claude completed all five rungs of the Video.js 10 (with-docs) sequence in 22m 06s of wall time (`metrics.json`, `totalDurationMs: 1325849`), across roughly 221 assistant turns and 144 tool calls. Four of five rungs passed their structured assertions; rung 4 returned `pass: false` because the share-click console log was not captured by the assertion harness even though Claude verified the handler fired manually (`metrics.json`, rung 4, `shareClickLogged: false`). Rung 5 produced a working build with a custom-composed UI and scored 4/5 on visual fidelity (`judges/visual-fidelity.json`).

## Per-rung timeline

| Rung | Result | Turns | Notable |
|------|--------|-------|---------|
| 1. Install | PASS | ~47 | Installed `@videojs/react` + `@videojs/html` v10.0.0-beta.23, wrote a `VideoSkin`-based player after reading six `.d.ts` files from the installed package (`rung-1 / turn ~30`, `workspace/src/App.tsx`) |
| 2. Config | PASS | ~43 | Native `autoPlay` did not fire on mount; Claude added a `ref` + `useEffect` calling `.play()` after diagnosing it as a player-attach-timing issue (`rung-2 / turn ~30`) |
| 3. Styling | PASS | ~39 | Found `--media-color-primary` token in `skin.css`; bumped CSS specificity twice to override the library's late-loading background rule (`rung-3 / turn ~25`) |
| 4. Structural | FAIL (assertion) | ~37 | **Eject decision:** `library-hack` (`judges/eject.json`) — kept `VideoSkin`, hid fullscreen via `.media-default-skin .media-button--fullscreen.media-button { display: none }` and injected a Share button into `.media-button-group` via `createPortal` (`rung-4 / turn ~20`) |
| 5. Redesign | passed build / visual 4/5 | ~55 | Discarded `VideoSkin` and `skin.css` entirely; composed custom UI from `Controls.Root` + `TimeSlider.*` + `VolumeSlider.*` + `Time.Value` + buttons + `Hotkey`/`Gesture` (`workspace/src/App.tsx:87-152`) |

## Notable moments

- Rung 1: After the prompt's WebFetch hint, Claude pulled `videojs.org` twice then pivoted to reading installed `.d.ts` files in `node_modules/@videojs/react/dist/dev/` — the docs were treated as orientation, the type definitions as ground truth (`rung-1 / turn ~12`).
- Rung 2: When `autoPlay` didn't fire, Claude diagnosed by running `evaluate_script` in Chrome DevTools to compare `paused`, `currentTime`, and `networkState` against `play()` results before settling on the ref-effect workaround (`rung-2 / turn ~22`).
- Rung 4: Claude explicitly identified the primitive-composition path ("the right approach is to compose my own controls layout"), then chose against it: "keep VideoSkin, hide fullscreen via CSS, and inject a Share button into the volume's button-group using a React portal. Cleaner than re-implementing the entire skin." (`rung-4 / turn ~7`).
- Rung 5: The reference screenshot prompt triggered the opposite call — Claude re-read seven primitive `.d.ts` files (`time-value`, `play-button`, `slider`, `time-slider`, `volume-slider`, `poster`, `slider-fill`) and then rebuilt from scratch (`rung-5 / turns ~5-12`).
- Rung 5: Self-corrected an invented CSS variable mid-rung: "slider variables are `--media-slider-fill`, `--media-slider-buffer`, `--media-slider-pointer` (not `-thumb`)" — verified by reading `skin.css` directly (`rung-5 / turn ~18`, `judges/hallucinations.json` notes).
- Rung 3: Hit the same specificity issue twice in two rungs (rung 3 background, rung 4 fullscreen-hide) — both resolved by class duplication rather than `!important` (`rung-3 / turn ~20`, `rung-4 / turn ~15`).

## Hallucinations: 1

- Rung 5, turn ~30: invented a `[data-hidden]` attribute selector on `Poster` in `workspace/src/player.css:32`. The real attribute exposed by the component is `data-visible` per `poster-data-attrs.d.ts`; the rule never matches but is masked because `<Video>` covers the `<Poster>` anyway (`judges/hallucinations.json`).

## Tool usage

Chrome DevTools MCP throughout — no Playwright MCP invocations. `WebFetch` hit `https://videojs.org` six times total (twice in rung 1, once each in rungs 2-5), per the imperative pre-task hint. Screenshot counts per rung were modest: R1=1, R2=1, R3=2, R4=1, R5=3 — most visual verification happened via `evaluate_script` reads of computed styles, bounding rects, and DOM attributes rather than image diffs.

---

## Editorial (opinionated)

> This section contains interpretive claims. Dismiss or keep as you see fit.

- The `videojs.org` WebFetch is a ritual, not a source of truth: Claude touches it once per rung then immediately reads `.d.ts` and dist `skin.css` from `node_modules`. The hint did its job by orienting; the work happens against installed types. Video.js 10's investment in shipped type definitions and a transparent default-skin CSS file is doing more for the agent experience than any docs site could.
- Rung 4 is the cleanest example yet of "the docs told me, and I still chose the hack." Claude *named* the right path in the same breath as rejecting it ("Cleaner than re-implementing the entire skin"). One rung later, given a screenshot, the same agent happily did the re-implementation. The lesson isn't that Claude can't compose primitives — it's that without a visual target the cost/benefit math leans toward the patch.
- The specificity bug bit twice in a row. The library ships `.media-default-skin .X` rules that load after user CSS, forcing every override to duplicate a class. Two specificity workarounds in three rungs is a smell — a CSS layer or a higher-specificity user hook would eliminate a class of agent failures and a class of human bug reports.
- For a beta.23 library, the API surface held up remarkably well: across 144 tool calls only one hallucinated identifier survived, and it was a data attribute that was masked into invisibility by sibling DOM. The cost of being wrong was zero. That's a property of the *runtime*, not the agent — and it suggests the library could ship even more no-op-on-typo defaults to widen that margin.
```