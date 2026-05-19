```markdown
# Run: Video.js 10 / run-2

## Summary

Across five rungs Claude built a Video.js 10 React player using `@videojs/react@10.0.0-beta.24`, completing in 16m6s (966267 ms per `metrics.json`) over 190 assistant turns (51 / 22 / 36 / 26 / 55 per rung). Four of five rung assertions passed; rung 3 failed the accent-color check. The rung 5 redesign drew a 4/5 visual-fidelity score (`judges/visual-fidelity.json`). Zero hallucinations were flagged (`judges/hallucinations.json`).

## Per-rung timeline

| Rung | Result | Turns | Notable |
|------|--------|-------|---------|
| 1. Install | PASS | 51 | Picked `@videojs/react` + `HlsVideo` immediately, no WebFetch needed; ended with working HLS via `<VideoSkin>` (`workspace/src/Player.tsx`, pre-rung-5 state) |
| 2. Config | PASS | 22 | Passed `autoPlay muted loop` straight on `<HlsVideo>`; assertion records `playing: true` + `previewImageVisible: true` (`metrics.json`) |
| 3. Styling | FAIL | 36 | Bar bg matched (`rgba(0,0,0,0.5)` on `.media-controls`) but `accentMatches: []` — no `#ff3e00` found on player elements (`metrics.json` rung 3) |
| 4. Structural | PASS | 26 | **Eject decision:** `library-hack` (`judges/eject.json`) — `useEffect` + `document.querySelector('.media-button--mute')` + `createPortal` slot; fullscreen hidden via specificity-bumped CSS rule |
| 5. Redesign | passed build / visual 4/5 | 55 | Fully replaced `<VideoSkin>` with a custom layout composed from `Controls.Root`, `TimeSlider.{Root,Track,Buffer,Fill,Thumb}`, `PlayButton`, `MuteButton`, `Time.Value`, `CaptionsButton`, `PlaybackRateButton`, `PiPButton`, `FullscreenButton` (`workspace/src/Player.tsx:42-101`) |

## Notable moments

- **Library discovery without docs.** Claude landed on `@videojs/react` + `HlsVideo` on rung 1 with no `WebFetch` call (transcript tool-use scan), suggesting the package surface was already in training or surfaced via npm/file inspection.
- **Skin retained through rung 4.** Through rungs 1–4 the player rendered inside the packaged `<VideoSkin>`; styling and structural changes were threaded through skin CSS classes (`.media-default-skin--video .media-button--fullscreen` selector in pre-rung-5 `src/index.css`, per `judges/eject.json` evidence).
- **Portal-injected Share button.** Rather than recomposing the controls tree, Claude inserted a `display:contents` slot div as a sibling of the muted button via `useEffect` and rendered the Share button into it with `createPortal` (`judges/eject.json` evidence quoting `rung-4` assistant turn).
- **CSS specificity walk-back.** During rung 4 the fullscreen-hide rule was overridden by skin CSS until Claude bumped the selector chain (`judges/eject.json` notes: "Bump specificity").
- **Wholesale skin replacement on rung 5.** The final `workspace/src/Player.tsx` no longer imports `VideoSkin`; the entire UI is composed from `@videojs/react` primitives with data-attribute-driven CSS (`workspace/src/index.css:201-220` toggles icons via `[data-paused]`, `[data-muted]`, `[data-volume-level]`, `[data-fullscreen]`, `[data-pip]`, `[data-active]`).
- **Rung 4 console noise.** The assertion captured a React warning about `fetchPriority`/`fetchpriority` casing and a callback-ref warning leaking from `@videojs/react/media/hls-video` (`metrics.json` rung 4 `consoleSample`).

## Hallucinations: 0

`judges/hallucinations.json` confirms all twelve named imports from `@videojs/react`, the eleven icons from `@videojs/react/icons`, the `HlsVideo` import path, and every `--media-slider-*` CSS var / `data-*` attribute resolve against the installed `.d.ts` files.

## Tool usage

Claude used **Chrome DevTools MCP** as its sole browser surface — no Playwright MCP calls in any rung. Real `mcp__chrome-devtools__take_screenshot` invocations per rung: 6 / 2 / 3 / 2 / 5. `evaluate_script` was used heavily (6 / 3 / 4 / 6 / 5) to query DOM/computed styles. `WebFetch` does not appear as an actual invocation in any transcript (every rung shows it only in the tool catalog header, never as a call); Claude relied on installed types in `node_modules` and direct skin-CSS reads rather than online docs.

---

## Editorial (opinionated)

> This section contains interpretive claims. Dismiss or keep as you see fit.

- **The library taught itself.** Without a bundled hint and without a single `WebFetch`, Claude found `@videojs/react@10.0.0-beta.24`'s primitive layer, used it correctly, and produced zero hallucinations. That is a strong signal that Video.js 10's TypeScript surface is legible enough for an agent to learn the API by reading `dist/dev/*.d.ts`.
- **Rung 4 is the diagnostic moment.** Faced with a perfectly composable primitive set, Claude still chose to portal-inject around `<VideoSkin>` instead of ejecting. The library-hack decision suggests that when the "default skin" is comfortable, agents will reach for DOM workarounds before they reach for composition — even when composition is one rung away (and obviously available, as rung 5 proved).
- **`#ff3e00` going missing on rung 3 is the cautionary tale.** The bg color passed because skin classes were stylable; the accent failed because Video.js 10's accent surface is data-attribute-driven, not a single CSS variable, and Claude didn't find the right hook while still inside the skin abstraction. The styling shape of the library and its eject pattern are coupled — you don't really get to "just style" the default skin.
- **Rung 5 is the brochure shot.** A 4/5 YouTube-style rebuild composed cleanly from primitives, with state-driven icon swaps via `[data-*]` selectors, is exactly the demo you would put in the Video.js 10 launch post. The arc — `<VideoSkin>` → portal hack → full eject — is the agent-experience story this library wants to tell, even if the middle step is the one library authors should worry about.
```