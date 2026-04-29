```markdown
# Run: Video.js 10 / run-4

## Summary

Claude completed all five rungs of the Video.js 10 build (`@videojs/react` and `@videojs/html` 10.0.0-beta.23) in a single session over ~25 minutes (`metrics.json` totalDurationMs: 1,512,111). Across the run, Claude took 251 assistant turns (54 / 46 / 26 / 49 / 76 per rung) and every assertion passed (`metrics.json`). The hallucination judge recorded zero hallucinations, the rung-4 eject judge classified the structural change as a `library-hack`, and rung 5 scored 4/5 on visual fidelity.

## Per-rung timeline

| Rung | Result | Turns | Notable |
|------|--------|-------|---------|
| 1. Install | PASS | 54 | Resolved package via `npm view @videojs/react` and read `.d.ts` files in `node_modules` to discover `createPlayer` / `videoFeatures` / `VideoSkin` (`rung-1 / turn 5`, `turn 15`, `turn 21`). |
| 2. Config | PASS | 46 | First autoplay attempt used `usePlayer((s) => s.play)`, which threw a `StoreError`; Claude diagnosed it and rewrote with a `videoRef`-based effect (`rung-2 / turn 37`). |
| 3. Styling | PASS | 26 | Read the published `skin.css` to find `--media-color-primary`, then fixed CSS load-order so user overrides win (`rung-3 / turn 2`, `turn 12`). |
| 4. Structural | PASS | 49 | **Eject decision:** library-hack (`rung-4 / turn 22`, `turn 23`) — `display: none` on `.media-button--fullscreen` and a `createPortal` Share button injected via `document.querySelector('.media-button--mute')`. |
| 5. Redesign | passed build / visual 4/5 | 76 | Threw out `VideoSkin` and recomposed primitives (`Controls.Root`, `TimeSlider.*`, `Time.Group`, `PlayButton`, etc.) into a YouTube-style layout (`rung-5 / turn 29`, `workspace/src/App.tsx`). |

## Notable moments

- Claude never used WebFetch and never looked up an `llms.txt` — all API discovery was internal, by reading `.d.ts` files inside `node_modules/@videojs/react/dist/dev/` and `node_modules/.pnpm/@videojs+core@10.0.0-beta.23_*/.../core/dist/dev/` (`rung-1 / turns 11–36`).
- In rung 2, Claude built a wrong mental model of the player store: `usePlayer((s) => s.play)` produced `StoreError` because the action lost its binding through a selector. Claude noticed in console messages and pivoted to a direct `videoRef.play()` effect (`rung-2 / turn 35`, `turn 37`, `turn 38`).
- Rung-4 contains an explicit fork in reasoning: Claude wrote "I need to check the part exports (Controls, Slider, TimeSlider, etc.) since VideoSkin is monolithic and I'll have to compose my own controls layout" (`rung-4 / turn 4`, also quoted in `judges/eject.json`), then read `controls/index.parts.d.ts` — but rather than recompose, shipped a `createPortal` + DOM-querySelector hack (`rung-4 / turn 22`).
- After rung 4's first verification screenshot, Claude noticed the native `<video controls>` attribute was double-rendering chrome over the custom skin and removed it (`rung-4 / turns 37–38`).
- In rung 5, controls would not show during screenshot capture because Claude dispatched `mousemove`; reading `controls-root.js` revealed the listener was on `pointermove`, and Claude resent synthetic `pointermove` events (`rung-5 / turns 49–54`).
- The rung-5 redesign was a wholesale rewrite of `App.tsx` and `index.css` (`workspace/src/App.tsx`: 176 lines; `workspace/src/index.css`: 359 lines) and removed the `@videojs/react/video/skin.css` import from `main.tsx` (`rung-5 / turn 34`).

## Hallucinations: 0

`judges/hallucinations.json` notes that one transient `usePlayer((s) => s.play)` selector path in rung 2 was a hallucinated API but was caught by Claude at runtime and replaced, so the judge classified it as "buggy code Claude then fixed" rather than a hallucination.

## Tool usage

Claude used the **Chrome DevTools MCP** server exclusively for browser interaction — no Playwright MCP, no WebFetch, no WebSearch. Across the run, MCP calls included `evaluate_script` (×25), `navigate_page` (×14), `take_screenshot` (×9), `take_snapshot` (×4), `list_console_messages` (×6), `click` (×2), `hover` (×2), and one each of `new_page`, `list_pages`, `select_page`, `list_network_requests`. Screenshot iterations per rung: rung 1 = 1, rung 2 = 1, rung 3 = 2, rung 4 = 2, rung 5 = 3. API discovery was driven by `Read` against `.d.ts` files in `node_modules` (47 reads total) and shell `find`/`ls` (`metrics.json`, transcript tool counts).

---

## Editorial (opinionated)

> This section contains interpretive claims. Dismiss or keep as you see fit.

- Video.js 10's strongest agent-experience signal in this run is that Claude solved the entire build by *reading the package's own type definitions*. No web docs, no `llms.txt`, no hallucinated APIs — the shipped `.d.ts` surface was self-sufficient. That's a quietly remarkable bar for a beta library.
- The rung-4 eject is the headline failure mode and it's a *taste* failure, not a *capability* failure. Claude correctly identified that `VideoSkin` is monolithic and that primitive parts existed, then chose a `createPortal` + `querySelector('.media-button--mute')` hack anyway. One rung later, given a bigger canvas, it tore out `VideoSkin` and used the primitives cleanly. The library has the right shape; Claude just didn't reach for it until the prompt forced a bigger scope.
- A blog-post sentence: "Claude built a working YouTube-clone player against a beta video library it had never seen, with zero hallucinations and a 4/5 visual match — but when asked to add one button, it injected it into the DOM via a portal instead of recomposing the controls."
- The `usePlayer((s) => s.play)` misstep in rung 2 is the one place the API surprised Claude: store actions look like Zustand selectors but bind differently. If the v10 docs (or types) ever ship a one-liner about that, it probably erases the only real friction in this run.
```
