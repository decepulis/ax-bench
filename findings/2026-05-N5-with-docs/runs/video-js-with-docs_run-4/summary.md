```markdown
# Run: Video.js 10 / run-4

## Summary

This run installed `@videojs/react@10.0.0-beta.23` and progressed cleanly through all five rungs in roughly 17 minutes (`metrics.json` totalDurationMs = 1,025,412), with every rung passing its assertion. Across rungs Claude produced 162 assistant turns (55, 12, 23, 20, 52). Rung 4 was solved via a runtime portal-injection workaround on top of `VideoSkin`; rung 5 was a full rewrite onto Video.js 10's primitive components, which also produced a visual-fidelity score of 4/5.

## Per-rung timeline

| Rung | Result | Turns | Notable |
|------|--------|-------|---------|
| 1. Install | PASS | 55 | Verified package existence via `npm view` before installing, then read ~10 `.d.ts` files under `node_modules/@videojs/react/dist/dev/` as a docs surface (`rung-1 / turn 37–49`) |
| 2. Config | PASS | 12 | Single-edit change adding `autoPlay muted loop` plus `poster` prop on `VideoSkin` (`rung-2 / turn 3`) |
| 3. Styling | PASS | 23 | Grep'd the shipped CSS for `--media-` custom properties, then set `--media-color-primary: #ff3e00` on `.media-default-skin--video` (`rung-3 / turn 8, 28`) |
| 4. Structural | PASS | 20 | **Eject decision:** library-hack — React portal injection on the `.media-button--mute` DOM node (`rung-4 / turn 11`); needed a CSS specificity bump after first fullscreen-hide rule failed to override the skin (`rung-4 / turn 20–24`) |
| 5. Redesign | passed build / visual 4/5 | 52 | Full rewrite onto primitives — `Container`, `Controls.Root`, `TimeSlider.{Root,Track,Buffer,Fill,Thumb}`, `Time.Value`, etc. (`workspace/src/App.tsx:1-159`) |

## Notable moments

- Claude treated `node_modules/@videojs/react/dist/dev/**/*.d.ts` as the canonical documentation surface — no `WebFetch`, no `llms.txt` lookup. Rung 1 alone reads `index.d.ts`, `skin.d.ts`, `create-player.d.ts`, `context.d.ts`, `hls-video/index.d.ts`, and several `.js` source files (`rung-1 / turn 37–68`).
- Before installing, Claude double-checked the user's package names against npm (`npm view @videojs/react`, `npm view @videojs/html`) and discovered they only existed as `10.0.0-beta.*`, retrying the install with the explicit beta version (`rung-1 / turn 14, 20, 22`).
- Rung 4's CSS hide-rule for fullscreen didn't take on first reload — Claude diagnosed it as specificity rather than load order and added a second class selector to outweigh the skin (`rung-4 / turn 20–24`).
- Rung 4's eject judge flagged Claude's chosen path as a "library-hack": Claude explicitly reasoned that "VideoSkin has its controls baked in and only takes children… so there's no slot to compose into," and chose a portal over re-composing primitives (`judges/eject.json`).
- Rung 5 inverted that choice without prompting — Claude read seven primitive-component `.d.ts` files (`time-slider/index.parts.d.ts`, `controls/index.parts.d.ts`, `play-button/play-button.d.ts`, etc.) and replaced `VideoSkin` entirely with a hand-composed control bar (`rung-5 / turn 10–55, 59`).
- Claude noticed at the end of rung 5 that the Captions button had auto-hidden, reading `data-availability="unavailable"` on the DOM and correctly attributing it to the Mux stream's lack of a captions track rather than treating it as a bug (`rung-5 / turn 80`).

## Hallucinations: 0

No symbols, props, hotkey actions, CSS variables, or data attributes used in committed code were absent from the installed type surface (`judges/hallucinations.json`). The audit notes one cosmetic quirk — a `.yt-poster[data-visible="false"]` selector whose value is unreachable because the library toggles `data-visible` by presence — but the attribute name is real and the judge did not classify it as a hallucination.

## Tool usage

Chrome DevTools MCP only; no Playwright MCP and no `WebFetch` calls across any rung. Six `take_screenshot` calls total: one per rung in rungs 1–4 and two in rung 5. The MCP was used primarily to verify state via `evaluate_script` (querying `video` element props, computed styles, button availability) rather than visual diffing — screenshots functioned as final confirmation, not iterative feedback.

---

## Editorial (opinionated)

> This section contains interpretive claims. Dismiss or keep as you see fit.

- The run is a quiet endorsement of "ship rich `.d.ts` files and let agents read them" as a docs strategy. Claude never opened a browser to view docs, never asked for an `llms.txt`, and produced zero hallucinations — all of the API surface knowledge came from `dist/dev/**.d.ts`. For a library still in beta, that's a remarkably low-friction agent onboarding path.
- Rung 4 is the most interesting moment in the run: Video.js 10's two-tier API (turnkey `VideoSkin` vs. primitive composition) gave Claude a fork, and it chose the wrong one — a runtime portal hack — because `VideoSkin` looked like the intended path. Then rung 5 forced the right choice, and Claude executed it cleanly. The library's primitives are clearly there; the ergonomics for *discovering when to abandon `VideoSkin`* are not.
- A reader could fairly say: Video.js 10's primitive layer is agent-legible, but its skin layer is an attractive nuisance. Once an agent commits to `VideoSkin`, the architecturally-clean answer to "add one custom button" becomes a portal — and the agent will rationalize that locally rather than back out.
- The visual-fidelity 4/5 came after a full rewrite that took ~7.8 minutes (`metrics.json` rung 5 durationMs = 467,887) and produced a 159-line `App.tsx`. That's a reasonable price for "looks like YouTube," but it's worth noting that the entire run's cost (≈$8.20 across rungs) is dominated by rung 5 ($3.78). Visual rebuilds are where the budget goes.
```