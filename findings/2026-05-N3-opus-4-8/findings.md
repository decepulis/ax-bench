# Synthesis — 2026-05-N3-opus-4-8

6 cells across 2 conditions (mux-player, video-js). Longest cell 24.4min; agent cost $25.8330, judge cost $43.1943, total $69.0273.

## Cell outcomes (deterministic)

Rung legend: ✓ pass · ✗ fail · TO timed out · — not run.

| Cell | Rung 1 | Rung 2 | Rung 3 | Rung 4 | Rung 5 | Halluc. | Eject | Visual |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | --- | :---: |
| mux-player_run-0 | ✓ | ✗ | ✓ | ✗ | ✓ | 0 | — | — |
| mux-player_run-1 | ✓ | ✗ | ✓ | ✓ | ✓ | 0 | — | — |
| mux-player_run-2 | ✓ | ✗ | ✓ | ✓ | ✓ | 0 | — | — |
| video-js_run-0 | ✓ | ✓ | ✓ | ✗ | ✓ | 0 | — | — |
| video-js_run-1 | ✓ | ✓ | ✓ | ✗ | ✓ | 0 | — | — |
| video-js_run-2 | ✓ | ✓ | ✓ | ✗ | ✓ | 0 | — | — |

## Token / cost rollup (deterministic)

| Cell | Agent in | Agent out | Agent cost | Judge in | Judge out | Judge cost | Total cost |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| mux-player_run-0 | 183 | 52600 | $3.1186 | 83 | 26143 | $8.6083 | $11.7269 |
| mux-player_run-1 | 219 | 67259 | $4.0891 | 125 | 46537 | $6.9299 | $11.0190 |
| mux-player_run-2 | 137 | 51195 | $2.2656 | 95 | 34445 | $5.6841 | $7.9497 |
| video-js_run-0 | 219 | 88365 | $5.7350 | 131 | 36911 | $7.5711 | $13.3061 |
| video-js_run-1 | 249 | 91156 | $6.7634 | 135 | 36137 | $8.1537 | $14.9171 |
| video-js_run-2 | 175 | 70002 | $3.8612 | 90 | 33919 | $6.2473 | $10.1085 |

---

## Patterns across runs

> 🤖 LLM-generated. Verify before quoting.

**Rung 4's architecture splits cleanly by library, even though the harness columns don't show it.** 3/3 mux-player cells were classified `library-hack` by the eject judge — each one wrote a recursive shadow-walker (`findBottomControlBar` / `findInShadow` / `deepQuery`) and imperatively spliced a button next to `media-volume-range`, with assistant text in each cell explicitly noting "the default theme has no slot" before piercing (see `mux-player_run-0/judges/eject.json`, `mux-player_run-1/judges/eject.json`, `mux-player_run-2/judges/eject.json`). 3/3 video-js cells were classified `in-library-primitive` — each one read `docs/how-to/customize-skins.md`, pasted the ejected skin source, and added Share as a real `Button` primitive sibling to `VolumePopover` (see all three `video-js_*/judges/eject.json`). The mux-player runs reached for forensic DOM tooling; the video-js runs reached for the documented eject path. The PASS/FAIL column hides this — read the eject judge first.

**The `shareClickLogged: false` failure is suspiciously cross-library.** All 3 video-js rung-4 cells failed the assertion despite Claude's own `evaluate_script` showing the click fired (`video-js_run-0/summary.md` notes the disagreement explicitly; same shape in run-1 and run-2). One mux-player cell (run-0) failed identically with `library-hack` code that also logged `shared` to console under Claude's probe. Four of six rung-4 cells had Claude verify the click in-browser and the harness disagree — this is a noise floor on the rung-4 PASS column, not six independent signals about button-injection quality.

**Documentation discovery split sharply by what shipped in the npm tarball.** All 3 video-js cells found `node_modules/@videojs/react/docs/` (with an `llms.txt` index) within the first 20–80 turns of rung 1 and treated it as the canonical reference for every subsequent rung (`video-js_run-0/summary.md` rung-1, `video-js_run-1/summary.md` rung-1, `video-js_run-2/summary.md` rung-1). All 3 mux-player cells issued zero WebFetch/WebSearch and zero bundled-doc reads — every API claim came from priors plus live shadow-DOM probing and reads of `node_modules/.../*.d.ts`. The visible behavioral consequence: video-js runs found `--media-color-primary` from a docs grep; mux-player runs found `--media-accent-color` by dumping the player's shadow-DOM stylesheet via `evaluate_script`.

**Rung 2 failed 3/3 on mux-player and passed 3/3 on video-js — and the mux-player failure mode is identical across cells.** Each mux-player cell set `muted loop autoPlay thumbnailTime={0}` (run-0, run-1) or `poster=...` (run-2) on `<MuxPlayer>`, verified via JS that `muted/loop/autoplay` were true on the `<mux-player>` element, and declared success — but the harness inspected the underlying `<video>` element where `autoplay: false, poster: null` (`mux-player_run-{0,1,2}/judges/...` and per-cell `assertions/rung-2.json`). Video-js's `VideoSkin`'s `poster` prop and props-pass-through on `HlsVideo` exposed the same attributes the assertion reads. The rung-2 column is currently measuring a prop-vs-attribute leakage in Mux Player, not a behavior gap in Claude.

**Hallucinations were nearly zero overall and concentrated on Media Chrome `::part()` selectors, not on either wrapping library.** 5 of 6 cells had zero hallucinations in the final code; the only flagged case (`mux-player_run-1`) was `.yt-player::part(poster)` on `<MediaController>` — wrong because `::part()` doesn't pierce nested shadow roots and the slot exposes `layer poster-layer`, not `poster` (`mux-player_run-1/judges/hallucinations.json`). Every mid-run slip Claude made in the other cells (`--media-control-bar-background`, `slot="icon"` on `MediaChromeButton`, `import type MuxPlayerElement from "@mux/mux-player"` in rung 4) was empirically caught by the agent's own probing and removed before commit.

## Suggested next changes

> 🤖 LLM-generated. Starting points, not commitments.

- **Treat the rung-4 share-click assertion as known-flaky until reproduced in isolation.** *Why:* 4 of 6 rung-4 cells failed `shareClickLogged: false` while Claude's own in-browser probe logged `shared`, across both libraries and across `library-hack` and `in-library-primitive` implementations — that's a tooling signal, not a library-quality signal. *How:* re-run the assertion's click path against a known-good rung-4 commit (e.g., `video-js_run-0/workspace`) outside the harness; if it reproduces, look at whether the assertion's synthetic click traverses Video.js's `Tooltip.Trigger` and Mux Player's shadow-mounted button the way the page's native pointer events do. Add a per-cell "click reachability" debug line to the harness before re-running.

- **Add a "rung-2 verification matches assertion target" check the agent can run.** *Why:* 3/3 mux-player cells declared rung-2 success after verifying the JS properties they could probe; the assertion read the underlying `<video>` element and disagreed. The gap is not Claude's reasoning — it's that "what an agent can see" and "what the harness checks" diverge for Mux Player but converge for video-js. *How:* either expose a documented probe target on `<mux-player>` (e.g., a method or attribute that mirrors the inner `<video>` autoplay/poster state), or change the rung-2 assertion to test the same property the agent will naturally test (the `<mux-player>` element's `muted/loop/autoplay` JS properties).

- **Ship docs inside the `@mux/mux-player-react` npm tarball, ideally with an `llms.txt` index.** *Why:* the cleanest cross-condition difference in this run is that video-js cells found `node_modules/@videojs/react/docs/llms.txt` within the first 20 turns and used it as the authoritative reference thereafter; mux-player cells issued zero docs reads and substituted shadow-DOM forensics — including the only surviving hallucination (`::part(poster)` on `MediaController`, which a docs reference would have shown lists `layer poster-layer`). *How:* add a `docs/` directory to the published `@mux/mux-player-react` package (and to `media-chrome`), structured to match what `cat docs/llms.txt` rewards: an index that names the canonical recipes (custom controls, custom theme, `::part()` reference, theming variables).

- **Document a canonical "add a control bar button" recipe for Mux Player and make the eject path visible.** *Why:* all 3 mux-player rung-4 cells recognized the default theme had no slot for a new button and chose shadow-DOM piercing over ejecting to Media Chrome — and in rung 5 all 3 ejected to Media Chrome immediately, the same pivot they'd refused one rung earlier. The agent demonstrably *knows* the eject path exists once it has a hard layout target; it just doesn't see it as an affordance for incremental customization. *How:* add a recipe to mux-player-react docs titled along the lines of "add or remove a control bar button" that walks through the Media Chrome composition (`<MediaController><MuxVideo>...`) as the recommended path — the same shape Claude reached for unprompted in rung 5.

- **Fix the `::part(poster)` documentation gap in Media Chrome.** *Why:* the one surviving hallucination across all 6 cells (mux-player_run-1) was a real-feeling `::part(poster)` selector on `<MediaController>` — wrong only because `::part()` doesn't pierce the `media-poster-image`'s nested shadow root. This is the kind of slip an experienced developer would make too. *How:* in the `MediaController` / `MediaContainer` docs, name the parts the poster slot actually exposes (`layer poster-layer`) and either add an `exportparts` chain that forwards `poster` outward, or call out explicitly that you have to style via the slotted element or with `::slotted(...)`.

- **Decide whether the rung-3 mux-player CSS-variable miss is worth a docs entry.** *Why:* across mux-player cells Claude tried plausible-but-wrong names (`--media-control-bar-background`, `--media-control-background`, `--controls-backdrop-color`, `--media-control-bar-display`) before either finding the right one via shadow-DOM CSS dump or pivoting to `::part(control-bar)`. The right variables existed all along; nothing in the agent's training surfaced them. *How:* a short "theming reference" page listing every `--media-*` custom property the Gerwig theme consumes, with the canonical use case for each — published in the tarball per the bundled-docs change above.
Appended `## Patterns across runs` (5 paragraphs) and `## Suggested next changes` (6 bullets) to `runs/2026-05-N3-opus-4-8/findings.md`. Each pattern claim is grounded in named cells + judge files; each suggestion is structured **What / Why / How**.
