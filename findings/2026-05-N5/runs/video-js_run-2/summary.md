```markdown
# Run: Video.js 10 / run-2

## Summary

Claude completed all five rungs in ~20 minutes 17 seconds (`metrics.json`) across 390 transcript turns. Four of the five assertion checks passed; rung 4 failed the click-log assertion despite producing a visually correct control bar. The hallucination judge reported 0 fabricated APIs. Rung 4 was categorized as a "library-hack" by the eject judge, and the rung 5 redesign scored 4/5 against the YouTube reference.

## Per-rung timeline

| Rung | Result | Turns | Notable |
|------|--------|-------|---------|
| 1. Install | PASS | 96 | Discovered no stable Video.js 10 release exists and pinned `@videojs/html@10.0.0-beta.23` + `@videojs/react@10.0.0-beta.23` (`rung-1 / turn 22`) after `^10` failed. Read 8+ `.d.ts` files directly out of `node_modules` (`rung-1 / turns 38-50`). |
| 2. Config | PASS | 98 | Caught that React's `muted` prop is a DOM property, not an attribute, racing Chrome's autoplay policy (`rung-1 / turn 40`); switched to imperative `v.muted = true` + `play()` in a `useEffect` (`workspace/src/App.tsx:17-22`). |
| 3. Styling | PASS | 47 | First attempt lost the CSS specificity battle vs `.media-surface`; Claude overrode via the library's CSS custom property instead (`rung-3 / turns 18-19`). |
| 4. Structural | FAIL | 67 | **Eject decision:** library-hack — kept the monolithic `VideoSkin` and injected the Share button via `document.querySelector('.media-button--mute')` + `createPortal` into a `display: contents` sibling (`rung-4 / turn 36`, per `judges/eject.json`). Assertion failed because `shareClickLogged: false` (`metrics.json`) even though Claude reported the click worked (`rung-4 / turn 58`). |
| 5. Redesign | passed build / visual 4/5 | 82 | Restructured into a primitives-based `CustomVideoSkin.tsx` using `PlayButton`, `MuteButton`, `TimeSlider.Root`, `Slider.{Track,Buffer,Fill,Thumb}`, plus `Hotkey`/`Gesture` bindings (`workspace/src/CustomVideoSkin.tsx:25-126`). |

## Notable moments

- **Skipped the docs, went to the types.** After two short WebFetch attempts to `https://github.com/videojs/v10` and `https://videojs.org/docs` returned little (`rung-1 / turns 65, 69`), Claude pivoted to reading `.d.ts` and `.js` files directly out of `node_modules/@videojs/react/dist/dev/` (`rung-1 / turns 38-50`) — and stayed on that pattern for the rest of the run.
- **Autoplay race, root-caused.** In rung 2, autoplay initially failed; Claude diagnosed it as a React-attribute vs JS-property timing issue against Chrome's autoplay policy and tried `defaultMuted` (`rung-2 / turn 41`) before settling on imperative `videoRef.current.muted = true` in a `useEffect` (`workspace/src/App.tsx:17-22`).
- **CSS specificity, twice.** Both rung 3 (control-bar bg) and rung 4 (hide fullscreen) failed first because the skin's own rule loaded after `index.css`; Claude diagnosed the specificity tie and bumped its selector (`rung-3 / turn 18`, `rung-4 / turn 43`).
- **The hack in rung 4.** Rather than swap `VideoSkin` for the underlying primitives — which the type definitions Claude had already read in rung 1 advertised — it inserted a portal target via DOM query and rendered the Share button into it (`judges/eject.json`).
- **Then ejected anyway in rung 5.** When the reference-match task arrived, Claude wrote a completely new primitives-based skin (`workspace/src/CustomVideoSkin.tsx`) using `PlayButton`, `MuteButton`, `TimeSlider.Root`, `Slider.{Track,Buffer,Fill,Thumb}`, `CaptionsButton`, `PiPButton`, `FullscreenButton`, plus 10 `Hotkey` and 3 `Gesture` bindings — and dropped the Share button entirely.
- **Eight assertion checks via headless evaluate.** Across rungs, Claude used `mcp__chrome-devtools__evaluate_script` 29 times to read DOM/`getComputedStyle` state rather than relying on screenshots alone (per per-rung tool counts).

## Hallucinations: 0

Per `judges/hallucinations.json`, every component, namespace, prop, hotkey action, CSS variable, and `data-*` state attribute in the final workspace was verified against the captured `@videojs/react` and `@videojs/html` 10.0.0-beta.23 type definitions in `node_modules`.

## Tool usage

- **Playwright MCP:** not used.
- **Chrome DevTools MCP:** primary verification tool — 29 `evaluate_script`, 14 `navigate_page`, 8 `take_screenshot`, plus `hover`, `take_snapshot`, `list_console_messages`, and `list_network_requests` calls across the run.
- **WebFetch:** 2 calls in rung 1 only — `https://github.com/videojs/v10` and `https://videojs.org/docs` (`rung-1 / turns 65, 69`); abandoned after that in favor of reading `node_modules` directly.
- **Screenshot iterations per rung:** rung-1: 1, rung-2: 1, rung-3: 3 (with a hover-then-snap pattern to defeat auto-hide), rung-4: 1, rung-5: 2.

---

## Editorial (opinionated)

> This section contains interpretive claims. Dismiss or keep as you see fit.

- **Video.js 10 has no docs that mattered.** Claude's two WebFetches returned essentially nothing usable; the entire run was carried by reading `node_modules/@videojs/react/dist/dev/**/*.d.ts`. This is an agent-experience signature: a library whose ".d.ts in node_modules" is *better* than its website-as-the-LLM-sees-it.
- **Rung 4 is the load-bearing observation of this run.** Given that `@videojs/react` exposes `PlayButton`, `MuteButton`, `FullscreenButton`, etc. as documented primitives — and given that Claude had already read those `.d.ts` files in rung 1 — choosing `document.querySelector + createPortal` for a one-button insertion is a tell. The monolithic `VideoSkin` reads as the "official" path strongly enough that Claude treated leaving it as a bigger commitment than DOM-hacking around it.
- **But the lib survived the bigger test.** When rung 5 forced the eject, Claude wrote a clean primitives composition with hotkeys, gestures, buffering indicator, and 4/5 visual fidelity — in 82 turns, with 0 hallucinations. The primitives layer is genuinely there and genuinely usable; it's the *entry ramp* that's misaligned with the task at rung 4's size.
- **The "muted" autoplay diagnosis is the kind of moment a blog post should quote.** Not a Video.js issue — a React + Chrome autoplay-policy issue — but Claude root-caused it in one turn and shipped the imperative `useEffect` fix instead of pattern-matching to "add `defaultMuted`." That's the level at which the model is operating in this run.
```