# Synthesis — N5-with-docs

10 cells across 2 conditions (mux-player, video-js). Longest cell 23.4min; agent cost $73.4500, judge cost $61.0635, total $134.5135.

## Cell outcomes (deterministic)

Rung legend: ✓ pass · ✗ fail · TO timed out · — not run.

| Cell | Rung 1 | Rung 2 | Rung 3 | Rung 4 | Rung 5 | Halluc. | Eject | Visual |
| --- | :---: | :---: | :---: | :---: | :---: | :---: | --- | :---: |
| mux-player-with-docs_run-0 | ✓ | ✗ | ✓ | ✗ | ✓ | 0 | — | — |
| mux-player-with-docs_run-1 | ✓ | ✗ | ✓ | ✗ | ✓ | 0 | — | — |
| mux-player-with-docs_run-2 | ✓ | ✗ | ✗ | ✓ | ✓ | 1 | — | — |
| mux-player-with-docs_run-3 | ✓ | ✗ | ✗ | ✓ | ✓ | 0 | — | — |
| mux-player-with-docs_run-4 | ✓ | ✗ | ✗ | ✓ | ✓ | 0 | — | — |
| video-js-with-docs_run-0 | ✓ | ✓ | ✗ | ✗ | ✓ | 0 | — | — |
| video-js-with-docs_run-1 | ✓ | ✓ | ✗ | ✗ | ✓ | 0 | — | — |
| video-js-with-docs_run-2 | ✓ | ✓ | ✗ | ✗ | ✓ | 0 | — | — |
| video-js-with-docs_run-3 | ✓ | ✓ | ✓ | ✗ | ✓ | 2 | — | — |
| video-js-with-docs_run-4 | ✓ | ✓ | ✓ | ✓ | ✓ | 0 | — | — |

## Token / cost rollup (deterministic)

| Cell | Agent in | Agent out | Agent cost | Judge in | Judge out | Judge cost | Total cost |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| mux-player-with-docs_run-0 | 161 | 48335 | $4.5894 | 137 | 42686 | $6.7928 | $11.3821 |
| mux-player-with-docs_run-1 | 149 | 45898 | $4.5011 | 112 | 46639 | $5.1925 | $9.6937 |
| mux-player-with-docs_run-2 | 179 | 36429 | $6.1440 | 78 | 23276 | $4.0185 | $10.1625 |
| mux-player-with-docs_run-3 | 184 | 48833 | $7.2618 | 154 | 40695 | $6.1386 | $13.4004 |
| mux-player-with-docs_run-4 | 176 | 32876 | $5.4636 | 123 | 33504 | $5.9361 | $11.3997 |
| video-js-with-docs_run-0 | 169 | 87027 | $11.0466 | 119 | 39687 | $9.7072 | $20.7538 |
| video-js-with-docs_run-1 | 157 | 61197 | $8.3390 | 103 | 35707 | $6.1733 | $14.5123 |
| video-js-with-docs_run-2 | 162 | 56793 | $8.5132 | 119 | 35036 | $5.2863 | $13.7995 |
| video-js-with-docs_run-3 | 154 | 51915 | $9.3981 | 149 | 55779 | $7.4901 | $16.8882 |
| video-js-with-docs_run-4 | 141 | 59098 | $8.1933 | 90 | 25400 | $4.3281 | $12.5214 |

---

## Patterns across runs

> 🤖 LLM-generated. Verify before quoting.

**The "with-docs" hint was operationally inert.** 9 of 10 cells made zero `WebFetch` / `WebSearch` calls across the entire run; only `mux-player-with-docs_run-2` actually fetched the dangled URL (twice, in rung 4, to `mux.com/docs/guides/...`) — and the answer it got was a CSS variable that didn't behave as documented, sending Claude into shadow-DOM piercing anyway. Across both libraries, the model treated `.d.ts` files in `node_modules` (plus, for mux, the bundled gerwig theme source) as the authoritative oracle. The condition selects for "types are good enough," not for "docs were consulted."

**Rung 4 was a library-hack in 10/10 cells, but rung 5 diverges sharply by library.** Every cell's rung-4 eject judge returned `library-hack`: video-js cells universally chose `createPortal` + `MutationObserver` against the rendered `VideoSkin` DOM, while mux cells universally chose recursive shadow-walkers piercing `media-theme.shadowRoot → media-control-bar[part~="bottom"]`. The divergence shows up on the next rung: all 5 video-js cells **abandoned** the rung-4 portal hack and rebuilt rung 5 from primitives (`Controls.Root`, `TimeSlider.*`, `PlayButton`, …) — see `video-js-with-docs_run-{0..4}/workspace/src/App.tsx`. All 5 mux cells **kept** the rung-4 shadow-walker pattern and reused it in rung 5 to inject a "Two bros" title chip (see `mux-player-with-docs_run-4/workspace/src/App.tsx:14-35`). Mux Player's API surface offers no obviously-discoverable rebuild path; video-js's primitives are right there in the same package.

**Hallucination shape is library-specific.** The 2 final-code hallucinations on the mux side cluster on a single invented CSS variable, `--media-control-bar-background` (rung 3, runs 2 and 3; `judges/hallucinations.json`). Two more cells flirted with the same name mid-run and self-corrected. The name is plausible — media-chrome's naming convention is `--media-*-background` — which is exactly the surface a token-predicting model misreads. The 3 final-code hallucinations on the video-js side scatter across **render-prop state names and `data-*` attributes** at the typed boundary of primitive components: `state.active` (run-1), `state.volume` and `data-captions` (run-3). The typed surface caught zero of these; the model guessed the conventionally-named property over the published one.

**Visual fidelity is bimodal by library.** Rung-5 visual scores: video-js = 4, 4, 4, 4, 4 (mean 4.0); mux = 4, 1, 4, 2, 1 (mean 2.4). The mux 1/5 cells (`run-1`, `run-4`) are the ones where shadow-DOM injection / `::part` subtraction left no visible chrome at all in the final screenshot — the "redesign" was mostly CSS hiding plus a shadow-injected title. The mux 4/5 cells used `::part(play){order:-N}` reordering instead. Video-js's clean rebuild path produces a tighter distribution; mux's rebuild-via-mutation pattern is high-variance because the mutator races with the player's own shadow rendering.

## Suggested next changes

> 🤖 LLM-generated. Starting points, not commitments.

- **Fix the rung-2 mux-player assertion.** *Why:* all 5 mux cells failed rung 2 with the same shape — `autoplay: false, poster: null, previewImageVisible: false` — even though playback was running and the thumbnail was visible (Claude's own probes confirmed `playing: true` in every case). The harness reads the literal `<video>` `poster` / `autoplay` attributes, which Mux Player doesn't set because it drives playback programmatically and renders the poster via `thumbnailTime`. *How:* in `assertions/rung-2.ts`, accept either the literal attribute OR a rendered poster image via the shadow tree, and detect "is currently playing" instead of "has autoplay attribute."

- **Tighten the rung-3 mux-player background-color assertion against the right surface.** *Why:* 4/5 mux cells reached for `--media-control-bar-background` (a non-existent CSS variable); 3 of those carried it into final code with no visible effect — the gerwig theme's built-in `::before` overlay still produces a translucent control-bar appearance, which is what Claude "verified" by eye. The current assertion correctly flags `semiTransparentBlackFound: false`, but the failure mode looks accidental rather than diagnostic. *How:* in `assertions/rung-3.ts`, sample the computed background of the actual `media-control-bar` shadow element (not arbitrary descendants), and log *which* CSS variable was the load-bearing one — that makes the hallucination directly visible in the assertion output rather than inferable from screenshots.

- **Drop the `with-docs` condition or change its mechanism.** *Why:* 9/10 cells made zero web calls; the one cell that fetched got a wrong answer. As an ablation it produced no contrast — these results are operationally indistinguishable from a no-docs run. *How:* either remove the `> See: https://…` hint and reclaim the condition slot, or replace it with an inline-injected docs excerpt (so the docs land in context whether or not Claude WebFetches), or fail the rung when an un-grounded API symbol is introduced.

- **Surface the rung-4 → rung-5 reuse-vs-rebuild signal in the deterministic table.** *Why:* the cleanest cross-condition pattern in this run — mux cells reuse the rung-4 shadow-walker into rung 5 (5/5), video-js cells throw the rung-4 portal away and rebuild from primitives (5/5) — is currently only visible to someone who reads all 10 narrative summaries. *How:* add a `Rung-5 strategy` column to the per-cell table populated by a small post-judge step that diffs rung-4's `App.tsx` against rung-5's and classifies as `reused` / `rebuilt` / `mixed`.

- **Separate "button present" from "click logged" in rung-4 reporting.** *Why:* 8/10 cells produced `shareClickLogged: false` despite the Share button being rendered with correct aria-label, and in `video-js-with-docs_run-3` Claude personally verified the click logged `shared` in DevTools moments before the harness's re-check returned false (`rung-4 / "Click logs 'shared' ✓"` vs. `assertions/rung-4.json`). The `MutationObserver`-based architectures lose their click handler between page evaluations — that's a meaningful architectural signal, but right now it looks identical to "button never rendered." *How:* in `assertions/rung-4.ts`, emit `shareButtonPresent`, `shareAriaLabelOk`, and `shareClickLogged` as three independent booleans, and add an `instabilityClass` field that distinguishes "handler lost after re-render" from "button absent."

Appended two sections to `/Users/dariuscepulis/Desktop/ax-bench/runs/N5-with-docs/findings.md`:

- **Patterns across runs** — four paragraphs covering (1) the `with-docs` condition firing 1/10, (2) universal rung-4 library-hack but diverging rung-5 reuse-vs-rebuild by library, (3) mux hallucinations clustering on one fake CSS var while video-js hallucinations scatter on render-prop state names, (4) bimodal visual fidelity (video-js 4.0 mean, mux 2.4).
- **Suggested next changes** — five bullets, each with What/Why/How: fix rung-2 mux assertion (5/5 false negatives), tighten rung-3 mux assertion against the right surface, drop or rework the `with-docs` condition, surface rung-4→rung-5 strategy in the deterministic table, and split rung-4 share-button outcome into presence vs. click-logged.
