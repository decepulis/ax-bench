# Pilot N=5 — April 2026

First production run. 10 cells = 5 video-js + 5 mux-player, run in 2 batches
of 5 parallel containers. ~99 min total wall time including judges. All 10
cells exited cleanly.

This doc is what we believe **right now**. It's a snapshot — re-read it
when iterating on Video.js 10 or the harness, and update or supersede as
we learn more. The per-cell evidence lives in `runs/{condition}_run-{n}/`.

---

## Pass tally

|         | Rung 1<br>install | Rung 2<br>config | Rung 3<br>styling | Rung 4<br>structural | Rung 5<br>redesign | Visual<br>(of /5) |
| ------- | :---------------: | :--------------: | :---------------: | :------------------: | :----------------: | :---------------: |
| **video-js**   | 5/5 | 4/5 | 5/5 | 4/5 | 5/5 build | 4×4, 1×4 |
| **mux-player** | 5/5 | 0/5 | 3/5 | 5/5 | 5/5 build | 4×4, 1×3 |

Hallucinations per run (from the hallucination judge):

- **video-js**: 0, 0, 0, 0, 0
- **mux-player**: 1, 5, 1, 1, 1

Eject classification, rung 4: **10/10 `library-hack`** — neither library's
intended ejection path was reached for, even when (video-js) it was already
in scope, or when (mux-player) the underlying primitive sat in `node_modules`
as a transitive dep.

---

## Findings

### 1. Mux rung 2 is universally broken — but partly the harness's fault

5/5 mux-player runs failed rung 2. The harness checks the inner `<video>`
element's `autoplay` and `poster` HTML attributes; `<MuxPlayer>` consumes
those as React props and does not propagate them as DOM attributes. In at
least 2 runs the player was *demonstrably autoplaying* when Claude looked
(`runs/mux-player_run-0/summary.md`, `runs/mux-player_run-2/summary.md`)
and the agent declared "Done" with high confidence; the harness disagreed
silently.

This is real signal *and* a harness bug:

- **Real signal**: the agent's self-report is overconfident and disconnected
  from ground truth. Mux Player props don't reflect into the DOM where
  observability checks expect them, so a developer running CI assertions
  against attribute presence would also be surprised. That's a Mux Player
  AX cost worth keeping in the writeup.
- **Harness bug**: the assertion is the wrong shape. We should test
  *behavior* (`videoEl.paused === false`, `videoEl.muted === true`, an
  image actually rendered for the poster) rather than attribute presence.
  Until we fix this, "rung 2 mux fail" carries less weight than it
  deserves to.

→ **Decision**: fix the assertion to behavioral checks before the next run.

### 2. Universal `library-hack` on rung 4 — same outcome, different stories

All 10 runs solved rung 4 by going around the library's blessed extension
surface rather than through it.

**video-js** (`runs/video-js_run-{0..4}/code/App.tsx`):

- Hide fullscreen: `.media-default-skin .media-button--fullscreen { display: none }`
- Add Share button: `useEffect` + `document.querySelector('.media-button--mute')`
  + `createPortal`

What's notable: **the primitive composition was already in scope from
rung 3**. The "right" answer was to delete one `<FullscreenButton/>` line
and add a sibling `<button>` in the existing skin file. All 5 runs threw
that composition away, reverted to the default `<VideoSkin>`, and reached
around it via internal BEM class names.

→ This is not a discoverability problem. It's a defaults problem: the path
of least keystrokes was "fall back to the monolith and class-target." The
agent had the better path *and walked away from it*.

**mux-player** (`runs/mux-player_run-{0..4}/code/App.tsx`):

- Hide fullscreen: `::part(fullscreen)` rules, or shadow-DOM `display:none`
- Add Share button: recursive `findInShadow` walker piercing the player's
  shadow root, sometimes with `requestAnimationFrame` polling and a
  `MutationObserver` for re-mount

→ Genuinely hidden ejection. `media-chrome` is a transitive dep of
`@mux/mux-player-react` — already in `node_modules` — but no run discovered
it via grep, no run installed it, no run reached for it even after an
Explore subagent (run-3) surfaced "Mux Player wraps Media Chrome".

**Same eject category, different stories.** The mux-player runs were
*pushed* into hacking. The video-js runs were *offered* a clean path and
hacked anyway.

### 3. Hallucinations split clean by library

video-js: 0 across 5 runs. mux-player: 9 total across 5 runs (1, 5, 1, 1, 1),
clustered tightly around two false API names:

- `--media-control-bar-background` — invented CSS variable, plausible-sounding,
  not consumed by Mux Player or Media Chrome (`runs/mux-player_run-0/judges/hallucinations.json`,
  +4 others)
- `::part(control-bar bottom)` / `::part(control-bar top)` — multi-token
  selectors that never match (CSS `::part()` takes a single ident; the real
  parts are `::part(top)` and `::part(bottom)`). Survived from rung 3 into
  rung 5 in run-1.

Both are pattern-match failures: the agent confidently *predicted* the
shape of an API based on adjacent conventions and didn't verify. Media
Chrome's CSS-variable namespace is dense and consistent enough that
`--media-control-bar-background` is "the obvious name" — it just doesn't
exist.

video-js had the opposite property: every imported symbol verified against
`dist/dev/index.d.ts`. The TS surface is dense enough and the agent's
`node_modules` grep habits are thorough enough that fabrication didn't
happen.

### 4. Rung-4 → rung-5 erasure asymmetry

- **video-js**: every run threw away the rung-4 `createPortal` hack on
  rung 5 and rebuilt with primitive composition (`runs/video-js_run-0/code/YouTubeSkin.tsx`
  is representative). Rung 4 was a regression; rung 5 was the redemption arc.
- **mux-player**: every run *kept* the shadow-DOM walker from rung 4 and
  *extended* it for rung 5 (reordering controls, injecting a title span).
  The hack became load-bearing.

Same library-hack label, opposite trajectories. video-js's hack was
disposable scaffolding; mux-player's hack was infrastructure. That's the
single most important contrast for the writeup.

### 5. No agent fetched docs in any of 10 runs

Zero `WebFetch` or `WebSearch` calls. No `llms.txt` discovered or referenced.
Documentation discovery happened entirely by:

1. Reading `.d.ts` files from `node_modules`
2. Grepping bundled `.mjs` files (mux-player's `themes/gerwig/index.mjs`
   was the de facto API reference)
3. Running `evaluate_script` against the live DOM

This is the most important methodological finding for the talk. If we
believe agents won't fetch docs unprompted, then *every* documentation
investment that lives outside `node_modules` and the type surface is a
bet on a channel agents don't currently use.

→ **Decision**: keep this as a finding, don't try to "fix" it by prompting
the agent to consult docs. The natural behavior is the data point.

---

## Harness changes for next run

1. **Fix rung 2 assertion** to behavioral checks (`paused`, `muted`,
   poster image rendered). See finding #1. → required.
2. **Pin one browser MCP per cell** in `template/CLAUDE.md`. Variance in
   tool choice (Playwright vs Chrome DevTools, sometimes both) currently
   confounds variance in agent behavior — see `runs/mux-player_run-3` rung
   5, where a Playwright hover got intercepted by a click layer that
   Chrome DevTools wouldn't have flagged. → required.
3. **Mandatory per-rung screenshot** at end-of-rung in
   `assertions/screenshot.ts`. Counts varied 0–6 per rung; visual judge
   depends on them. → required.
4. **Track tokens-per-rung** as a first-class metric in `metrics.json`.
   Rung-4 wall time spread was 25 → 150+ turns. Making "the library shape
   pushed the agent into 5 minutes of node_modules grepping" a number
   instead of vibes. → required.

### Discussed and parked

- **Retry loop on assertion failure** (hand failures back to the agent).
  Tests a different question than "what does an agent ship without
  supervision?" — closer to a CI-loop story. If we want it, run as a
  side experiment on rung-2 mux only, not in the main run.
- **N=10 instead of N=5**. Headline findings already saturated (5/5 mux
  rung-2 fail, 10/10 library-hack). Visual fidelity scores and per-run
  hallucination counts would tighten with more runs, but those aren't
  the headline. Time better spent on a *third* condition (Vidstack? a
  hand-rolled `<video>` baseline?) than on more runs of the same two.
- **Refining the eject judge** with a severity dimension (`surface-hack`
  / `internals-hack` / `eject`). The current binary loses spread between
  "one CSS rule" and "120-frame shadow-DOM polling MutationObserver."
  Worth doing eventually; not blocking next run.

---

## Discoverability — how to make eject findable

Working from where the agent **actually reads** in these runs (`.d.ts` files,
`package.json` `exports`, console messages, JSDoc, the live DOM) — not
from where it didn't (docs sites, llms.txt, blog posts, GitHub).

**Highest leverage:**

- **Re-export the primitive from a subpath.** `@mux/mux-player-react/eject`
  (or `/primitives`) re-exporting `media-chrome` elements. Converts "install
  a different package" (which Claude never did) into "import from a sibling
  subpath" (which Claude does naturally). For video-js this exists —
  `@videojs/react/skins`, etc. — but isn't the *first thing* the agent reads.
- **Console hint when the agent pokes at internals.** Claude calls
  `list_console_messages` between rungs. A `console.warn` triggered by
  external shadow-DOM mutation, mentioning the eject subpath, lands inside
  the agent's existing read loop. This is the only signal that catches the
  agent *mid-hack*.
- **`AGENTS.md` at the package root in `node_modules`.** Claude greps
  `node_modules` anyway. An agent-targeted file gets read for free.

**Other channels Claude reads:**

- `@example` JSDoc blocks on the high-level component showing the eject
  composition. Claude reads JSDoc as documentation.
- Type-level breadcrumbs — when the API runs out, the closest-thing prop's
  JSDoc should mention the eject path.

**For video-js specifically — different problem:**

The primitives were already in scope and 5/5 ditched them. Two angles:

- Make the primitive composition the *default* output of `createPlayer`/scaffolding,
  not `<VideoSkin>`. Right now `VideoSkin` reads as "the answer" to an agent
  grepping types. If the starter is already a primitive composition, "add
  a button" is one line; "fall back to VideoSkin and portal-hack" is the
  longer path.
- JSDoc on `<VideoSkin>` reframing it as a *preset*, not the primitive,
  and pointing at the composition path.

**Wouldn't move the needle:**

- Standalone `llms.txt` at the docs site. Agents don't fetch docs.
- Better prose docs on mux.com / videojs.dev. Same reason.
- Blog posts on "how to eject." Same reason.

---

## Open questions for the next iteration

- Does the rung-4 video-js regression hold if we change the rung-3 ending
  state? Currently rung 3 leaves the workspace using `--media-color-primary`
  on a primitive composition. If rung 3 ended with the default `<VideoSkin>`,
  would rung 4 still hack? Or is the regression specifically because the
  prompt feels like "switch back to defaults and modify"?
- Would a `console.warn` on shadow-DOM mutation actually catch mux-player
  agents in rung 4? Worth a single-cell A/B run when we ship the change.
- Does `@mux/mux-player-react/eject` (re-exported from `media-chrome`) get
  discovered if it exists? Easy A/B — fork the package, add the subpath,
  rerun the mux condition.
- N=5 is enough for the qualitative cliff; what would convince us a third
  library is worth running? (Suggested gate: pick one with a *different*
  ejection shape — e.g., Vidstack's slot-heavy composition, or Plyr's
  closed surface — and run pilot N=2 to see if it lands in a third spot.)

---

## Pointers

- Per-cell evidence: `runs/{condition}_run-{n}/`
  - `summary.md` — neutral judge writeup, includes editorial section
  - `metrics.json` — pass/fail, turns, tool calls, duration
  - `judges/` — hallucinations, eject classification, visual fidelity
  - `assertions/` — Playwright pass/fail per rung
  - `screenshots/` — `rung-{N}-final.png`
  - `code/` — final `App.tsx`, CSS, `package.json` (skipped: lockfile,
    node_modules, dist, transcripts)
- Harness as it ran: commit before the next change, see `git log
  -- harness/`. Transcripts not committed (1.9MB/cell) — regenerate
  by re-running `pnpm run-cell` if needed.
