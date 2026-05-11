```markdown
# Run: Video.js 10 / run-4

## Summary

Across 5 rungs, Claude completed in 14m 25s wall-clock (`metrics.json`
`totalDurationMs: 865355`). Assertions passed on rungs 1, 2, 3, and 5; rung 4
failed (the injected Share button rendered but its click handler never logged
`'shared'` — `metrics.json` `rung-4.assertion.shareClickLogged: false`). Rung 5
scored 4/5 on visual fidelity (`judges/visual-fidelity.json`). Total assistant
turns across rungs: ~201.

## Per-rung timeline

| Rung | Result | Turns | Notable |
|------|--------|-------|---------|
| 1. Install | PASS | 64 | Verified package existence on npm before installing, found v10.0.0-beta.23 (`rung-1 / turn 7`, `turn 9`) |
| 2. Config | PASS | 12 | Added `muted`/`loop`/`autoPlay` plus a Mux thumbnail poster in one edit (`rung-2 / turn 2`) |
| 3. Styling | PASS | 33 | First control-bar bg override lost the specificity tiebreak vs vendor CSS; fixed by chaining classes (`rung-3 / turn 22`, `turn 23`) |
| 4. Structural | FAIL | 29 | **Eject decision:** library-hack (`rung-4 / turn 16`, `judges/eject.json`). Share click handler did not log to console (`metrics.json` `rung-4.assertion.shareClickLogged: false`) |
| 5. Redesign | passed build / visual 4/5 | 63 | Discarded `VideoSkin` and rebuilt from primitives (`Container` + `Controls.Root` + `PlayButton` + `TimeSlider.*` etc.) (`rung-5 / turn 19`, `workspace/src/App.tsx`) |

## Notable moments

- **Type-surface-first onboarding.** Before writing any player code, Claude read 8+ `.d.ts` files from `node_modules/@videojs/react/dist/dev/` to learn the API surface — `index.d.ts`, the video preset, `hls-video`, `create-player`, `context`, `dom.d.ts` from the pnpm-store `@videojs/core` (`rung-1 / turns 17–39`). No WebFetch, no `llms.txt` lookup.
- **The same specificity bug appeared twice.** Both the rung-3 control-bar bg and the rung-4 fullscreen-hide rules initially lost to the late-loading vendor stylesheet; both were fixed by chaining a second class name to bump specificity (`rung-3 / turn 22-23`, `rung-4 / turn 21-22`).
- **Eject signal was recognized but not taken.** Claude wrote "The VideoSkin is closed (its control bar isn't a children slot)" and then chose to query `.media-button--mute` from the DOM, insert a sibling `<div>` via `mute.after(slot)`, and `createPortal` a Share button into it (`rung-4 / turn 16`, `judges/eject.json`). The in-library primitive path was deferred until rung 5.
- **Rung 5 was a full rewrite, not a patch.** Claude dropped `VideoSkin` entirely, wrote a 192-line `App.tsx` composing `Container` + `Controls.Root` + `PlayButton` + `MuteButton` + `VolumeSlider.*` + `TimeSlider.*` + `Time.Value` + `CaptionsButton` + `PiPButton` + `FullscreenButton` + `Gesture` + `Hotkey`, plus an inline SVG icon set (`workspace/src/App.tsx`).
- **Two API misnames slipped through into final code.** `<Gesture event="tap" .../>` (the prop is `type`, not `event`) and `<Time.Value type="currentTime" />` (the union is `'current' | 'duration' | 'remaining'`) — both render because runtime is lax, but neither matches the published surface (`judges/hallucinations.json`, `workspace/src/App.tsx:84`, `workspace/src/App.tsx:139`).
- **Verification done by reading the DOM, not docs.** Before structural changes Claude queried the actual rendered control bar to confirm it was a flat children list (`rung-4 / turn 12`), and inspected CSS variables on `.media-default-skin` to find `--media-color-primary` (`rung-3 / turn 14`).

## Hallucinations: 2

- **`<Gesture event="...">` — the prop is `type`** (`judges/hallucinations.json`; `workspace/src/App.tsx:84`, `:86`). The `event` attribute is silently dropped at runtime.
- **`<Time.Value type="currentTime" />` — the valid value is `"current"`** (`judges/hallucinations.json`; `workspace/src/App.tsx:139`). The `TimeType` union admits only `'current' | 'duration' | 'remaining'`.

## Tool usage

Claude used the **Chrome DevTools MCP** throughout: `new_page`, `navigate_page`, `evaluate_script`, `list_console_messages`, `list_network_requests`, `take_snapshot`, `take_screenshot`, and `resize_page` (loaded via `ToolSearch` on demand). No Playwright MCP. No `WebFetch` — every API question was answered by reading `.d.ts` files inside `node_modules`. Screenshot iterations per rung: rung 1 = 1, rung 2 = 0 (verified via `evaluate_script` only), rung 3 = 2, rung 4 = 1, rung 5 = 4 (including a `resize_page` to 1400×900 for a final side-by-side against the reference, `rung-5 / turn 50`).

---

## Editorial (opinionated)

> This section contains interpretive claims. Dismiss or keep as you see fit.

- **Video.js 10's type surface is the docs.** Claude didn't consult any external documentation — it built the entire player off `.d.ts` files in `node_modules`. That worked beautifully for everything except the two props that have looser-than-declared runtime types (`Gesture.type` widened to `string`, `Time.Value` defaulting silently). The library's lax runtime quietly absorbed bad inputs that the published types would have caught at build time — a small but real argument for strict mode.
- **The "closed skin → escape hatch → primitives" arc is the story of this run.** Rung 4 is where Claude saw the wall (`VideoSkin` is closed) and decided to climb over it (DOM portal). Rung 5 is where the same prompt structure forces a redesign and Claude finally walks through the door labeled `Container + Controls.Root`. Video.js 10 *has* the right primitives — but at rung 4's level of prompting pressure, the hack was less work than the eject. That's a design-ergonomics finding, not a model finding.
- **Specificity wars are an under-discussed agent tax.** Twice in this run Claude wrote a CSS rule, navigated the browser, observed the rule lost, and rewrote it with one more chained class. Each round costs a screenshot, an `evaluate_script`, and a turn. A library whose vendor stylesheet ships at `:where(...)`-level specificity (or as layered CSS) would have saved Claude two turn-pairs.
- **The Share button regression is the run's most interesting failure.** The DOM was right, the placement was right, the `aria-label` was right — but the click handler didn't fire, and Claude reported the rung "done" without exercising the button (`rung-4 / turn 24` checked existence, not click). When the assertion is "does pressing this thing produce a side effect," the agent should press the thing.
```