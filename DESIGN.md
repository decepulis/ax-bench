# Design decisions

This doc captures the decisions made during the initial grill-me session. Treat it as a snapshot, not a living spec — it won't necessarily stay synced with the implementation as things change.

## Scope

An **illustrative** test, not a research paper. Output is for a blog post (short section) and two upcoming talks. Primary goal: turn a single anecdote ("Sarah tried to make the mute button red during the bug bash") into a signal that survives N=5 runs.

The thesis has three pillars:
1. LLM-friendly docs aid install and config
2. Shallow abstractions aid styling, customization, and full redesign
3. An eject cliff exists in monoliths; primitives let you scale customization depth in-place

Each rung tests a different pillar.

## Conditions

Two libraries, chosen because their ejection pathways are different:

- **Video.js 10** — composable primitives, exposed markup, open DOM (no shadow DOM, no `::part()`). Ejection stays inside the library.
- **Mux Player** — monolithic web component built on Media Chrome. Customization depth beyond Mux Player's API forces dropping into Media Chrome (a separate library).

## Environment

**Vite + React + TypeScript**. Chosen over Next.js to neutralize SSR noise — Mux Player's web-component architecture plus Next.js App Router generates hydration pain that would dominate signal. Real but a confound.

## Agent

**Claude Opus 4.7 1M context** via **Claude Code headless** (`claude -p`). Claude.ai subscription billing via `CLAUDE_CODE_OAUTH_TOKEN`.

## Rung structure

**Cumulative, drip-fed.** One session walks through all five rungs. Each rung is fed only after the prior finishes; Claude doesn't see the full ladder upfront. Mirrors a real developer's journey.

| Rung | What it tests | Pass check |
|------|---------------|------------|
| 1. Install + render | Docs discoverability, install clarity | `<video>` in DOM, playable |
| 2. Config (muted/autoplay/loop/preview image) | Prop discoverability under non-jargon phrasing | All four runtime-checked |
| 3. Styling (accent color + semi-transparent control bar) | CSS-var vs prop vs `::part()` | Computed color + background match |
| 4. Structural (hide fullscreen, add custom Share button) | **The eject rung** — does architecture communicate eject intent? | Behavioral + LLM-judged eject decision |
| 5. Full redesign (match YouTube reference) | Structural depth after ejection | LLM-judged 1-5 visual fidelity |

## Priming

Fresh Docker container per run. MCPs: Playwright MCP + Chrome DevTools MCP. No skills, no memory, no CLAUDE.md, no docs injection. Each library stands on whatever it ships publicly (including llms.txt if present).

## Run count

- **Pilot:** N=1 per condition (2 cells total, parallel Docker containers).
- **Scale gate:** pilot must complete end-to-end, summaries must be readable, at least one rung must produce differential signal, no show-stopping confounds.
- **Full:** N=5 per condition (10 cells total) if gate passes.

## Metrics (story-forward)

Primary (headline stats for the blog / talks):

1. **Rung 4 eject breakdown** (categorical — the chart)
2. **Install turn count** (rungs 1–2)
3. **llms.txt discovery rate**
4. **Aggregate hallucination count**
5. **One pivotal transcript quote per condition**

Secondary (captured but not headlined): all turn counts, tool breakdown, tokens, screenshots, full transcripts, visual fidelity, structural-completeness.

## Judging

Four LLM passes per run, all using Opus 4.7 1M, all grounded in specific transcript quotes / file citations:

1. **hallucination-judge** — strict definition: invented APIs, props, imports, CSS vars. Buggy code Claude fixed doesn't count.
2. **eject-judge** — rung 4 only. Categorical: `in-library-primitive | library-hack | ejected-correctly | ejected-incorrectly | gave-up`.
3. **visual-fidelity-judge** — rung 5 only. 1–5 rubric against YouTube reference.
4. **summarizer** — neutral per-run markdown report + separately labeled editorial section.

Neutral first, editorial second. The editorial section is where provocative framings are allowed; the neutral body must cite sources for every claim.

## Isolation

**Docker container per run.** Fresh `/home/pwuser/.claude` inside container means no skills/memory/CLAUDE.md contamination without needing `--bare`. Filesystem confined to the container. OAuth via `CLAUDE_CODE_OAUTH_TOKEN` env var.

## Contingencies

- If the pilot succeeds on both conditions with no differential signal: tasks need to be harder (mobile viewport? a11y requirements? drop to Sonnet?).
- If Mux Player wins rung 4 cleanly (ejects to Media Chrome in most runs): publish it. Framing shifts to "both libraries' architectures communicate eject intent — here's what that teaches us about AX." No loyalty test.
- If harness breaks on one condition but works on the other: iterate before scaling.

## Harness patches after pilot

Two adjustments to the original "fresh container, no guidance" design, both made after the first pilot revealed harness issues that would have dominated the signal. Both apply symmetrically to both conditions.

### CLAUDE.md in workspace template

**Problem:** Claude's Bash tool spawned `pnpm dev` to verify its work, which never exits, and each rung hung for ~15 minutes until the safety timeout fired.

**Patch:** `harness/template/CLAUDE.md` tells the agent the Vite dev server is already running at `localhost:5173` and not to start another.

Not signal-affecting — it describes harness state, not library guidance.

### Docs URL in rung-1 prompt

**Problem:** Training-cutoff asymmetry. Video.js 10's scoped `@videojs/*` packages didn't exist when Opus 4.7 was trained; Mux Player did. In the pilot, the video-js cell ran `pnpm add video.js@^10`, hit `ERR_PNPM_NO_MATCHING_VERSION`, and pivoted to `video.js@8.23.7` — from that point the run was testing Video.js 8, not 10. The agent had no reason to visit videojs.org because from its perspective there was no v10 to visit docs for.

**Patch:** rung 1 now includes the library's docs URL:

- video-js → `https://videojs.org`
- mux-player → `https://www.mux.com/docs/guides/mux-player-web`

Shifts the test from *"does the agent remember Video.js 10 exists?"* (dominated by training-cutoff dumb luck) to *"once the agent has the docs, do the docs help?"* — the question the thesis is actually about.

**Transparency:** this will be called out as a footnote in the blog post. The underlying upstream issue — agents with pre-v10 training data have no path to discover v10 exists — is a real product problem needing a separate fix (npm meta-package, CLI discoverability, or similar). A future re-run after that upstream work lands should show whether the URL handout is still necessary.

### Per-library install hint

**Problem:** Even with the docs URL in the prompt, a later pilot saw Claude run `pnpm add video.js@^10`, hit `NO_MATCHING_VERSION`, declare "Video.js 10 doesn't exist," and silently install `video.js@8.23.7` — without ever fetching the docs URL. Zero `WebFetch` calls in 280 turns. Same training-cutoff asymmetry as the docs-URL patch was meant to address, just one layer deeper: a docs URL Claude doesn't read can't help.

**Patch:** rung-1 now includes a per-library, library-specific one-liner naming the published package:

- video-js → "Video.js 10 *does* exist — install via the scoped packages `@videojs/html` and `@videojs/react`. Do not fall back to `video.js@8`."
- mux-player → "Mux Player is published as `@mux/mux-player-react` for React."

**Asymmetry note:** the mux-player line is harmless reinforcement (Claude already finds the right package); the video-js line is load-bearing. We accept this asymmetry as a known concession to keep the run testing Video.js 10 instead of Video.js 8. Same blog-post footnote as the docs URL — the upstream fix (npm meta-package or similar) makes this hint unnecessary.

### WITH_DOCS ablation condition

**Goal:** test whether *handing Claude the docs URL on every rung* changes behavior vs. the baseline (where rung 1 alone mentions the URL). The hope was a clean A/B: same task, same primer, only difference is whether the docs URL is dangled on rungs 2–5 as well.

**Mechanism (v1, May 2026):** when `WITH_DOCS=1`, every rung template's trailing `{{LIBRARY_DOCS_HINT}}` placeholder is replaced with a soft footer:

```
> See: <docs URL> for the library's documentation.
```

Off (`WITH_DOCS=0`), the placeholder collapses to empty and rungs are byte-identical to baseline. Two new conditions wired up: `video-js-with-docs` and `mux-player-with-docs`. Runs land in `runs/<label>/<condition>_run-<i>/`.

**May 2026 result: operationally inert.** Across `N5-with-docs` (10 cells), 9/10 made zero `WebFetch` / `WebSearch` calls. The 1 cell that did fetch (`mux-player-with-docs_run-2`) got back wrong CSS-variable info and ejected to shadow-DOM piercing anyway. Findings comparable to the no-docs May baseline within noise.

**Why the soft footer can't compete:** the workspace already ships `node_modules/<lib>/**/*.d.ts` (Claude greps these freely) and, for mux, the bundled gerwig theme CSS source. Given a free local oracle and a paid network round-trip, Claude rationally picks the local one for "what's the API surface." A footer-style URL with no imperative phrasing doesn't shift that tradeoff. **Lesson:** a hint that *invites* WebFetch can't beat a type-surface that *enables* grep.

**Mechanism (v2):** keep the URL-only delivery (no inline docs injection yet) but flip the framing from soft-footer to imperative-pre-task. Every rung template now leads with the `{{LIBRARY_DOCS_HINT}}` placeholder; when `WITH_DOCS=1` it expands to:

```
> Before writing any code, fetch <docs URL>. It is the authoritative reference for this library at the version you have installed.
```

Tests a narrower question than v1: *given an explicit instruction to fetch the docs, does Claude do it — and if so, does that change output quality?*

**May 2026 result: behavior moved, oracle didn't.** Across `N3-with-docs-v2` (6 cells), `WebFetch` jumped from 2 calls / 10 cells (v1) to 81 calls / 6 cells; every cell fetched. The hint works as a tool-call lever. But every cell then ran the same `node_modules`-grep playbook as v1 for its load-bearing reads (mux rung-4 cells racked up 404s on guessed GitHub paths before falling back to `node_modules/@mux/mux-player/dist/themes/gerwig/index.mjs`). Rung 3 pass rate moved 2/5 → 3/3 on both libs (N=3 too small to call). Eject behavior, hallucination shape: unchanged. Per-run writeup: [`findings/2026-05-N3-with-docs-v2/`](findings/2026-05-N3-with-docs-v2/README.md).

**Why even an imperative hint can't move the oracle:** [WebFetch](https://platform.claude.com/docs/en/agents-and-tools/tool-use/web-fetch-tool) hands the URL to a smaller model that answers one focused question against the page and returns just that answer — never the raw page. So when Claude obediently fetches, *the docs never enter Claude's context.* What returns is a Q&A summary, gone after the next turn. Meanwhile `Read node_modules/<pkg>/dist/types/*.d.ts` returns verbatim source Claude can re-grep all rung. The local file is a higher-fidelity oracle by tool contract, not by training quirk. **Lesson:** v1's "invite vs enable" framing generalizes — even an imperative invitation can't beat a type-surface that enables `Grep`, because of what `WebFetch` actually returns. (Independently observed in the [`llms.txt` playbook](https://dev.to/toyama0919/using-llmstxt-with-cursor-and-claude-code-a-concrete-playbook-4jln), whose corrective recipe inverts the agent's default — fetch `llms.txt` first, *then* consult local types.)

**Next move:** to change the oracle, the docs need to land in context as text, not as a `WebFetch` Q&A round-trip. Either inline-inject a curated docs excerpt, or re-aim the hint at content the agent reads directly — `llms.txt` if shipped, or an explicit pointer to `node_modules/<pkg>/dist/types/` so it skips the round-trip entirely. The narrower next question: not *will Claude fetch?* (it will) but *what content shape, in context, actually changes output quality?*

## What this test does NOT do

- Compare multiple frameworks (Next.js, Remix, SvelteKit, vanilla HTML) — Vite only.
- Compare multiple models — Opus 4.7 only.
- Establish a human baseline.
- Support statistical inference. N=5 is illustrative, not inferential.
