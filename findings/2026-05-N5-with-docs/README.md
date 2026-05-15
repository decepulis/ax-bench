# With-docs N=5 — May 2026

Ablation arm of the May 2026 N=5 run. Two new conditions added —
`video-js-with-docs` and `mux-player-with-docs` — each identical to its
baseline except for a soft footer hint appended to every rung when
`WITH_DOCS=1`:

```
> See: <docs URL> for the library's documentation.
```

The point was to test whether **dangling the docs URL on every rung**
(not just rung 1) shifts behavior — the May baseline had logged "zero
`WebFetch` / `WebSearch` calls across 10 cells," and we wanted to know
if a per-rung nudge would change that.

This doc is what we believe **right now**. Auto-synthesized cross-run
patterns are in [`findings.md`](./findings.md) (LLM-generated, verify
before quoting); the editorial framing here is hand-written.

---

## Headline: the soft footer was operationally inert

**9 of 10 cells made zero `WebFetch` / `WebSearch` calls.** The one
exception, `mux-player-with-docs_run-2`, fetched the docs URL twice
during rung 4 — and the answer it pulled back (`--media-control-bar-background`
as the way to color the control bar) turned out to be wrong, so the
cell ejected to shadow-DOM piercing anyway.

This is a stronger version of the May baseline's "zero docs-fetches"
finding: even with a per-rung dangle of the docs URL, **Claude treats
the installed `node_modules/<lib>/**/*.d.ts` type surface as its
authoritative oracle** and rarely reaches for the network. A free local
grep beats a paid network round-trip when the hint phrasing has no
imperative force.

→ Mechanism change planned: see "Next iteration" below and `DESIGN.md`
under *Harness patches after pilot → WITH_DOCS ablation condition*.

---

## Pass tally — and the May delta

|         | Rung 1<br>install | Rung 2<br>config | Rung 3<br>styling | Rung 4<br>structural | Rung 5<br>redesign | Halluc. |
| ------- | :---------------: | :--------------: | :---------------: | :------------------: | :----------------: | :-----: |
| **video-js-with-docs**   | 5/5 (—) | 5/5 (—) | 2/5 (▼) | 1/5 (—) | 5/5 build | 0,0,0,2,0 |
| **mux-player-with-docs** | 5/5 (—) | 0/5 (—) | 2/5 (▲) | 3/5 (▼) | 5/5 build | 0,0,1,0,0 |

`▲` better, `▼` worse, `—` unchanged vs the May baseline at
`findings/2026-05-N5/README.md`.

**Cost:** $134.51 total ($73.45 agent + $61.06 judges). Longest cell
23.4 min. ≈ identical to the May baseline ($134.89).

The pass-rate deltas are small and inside what we'd expect from N=5
noise. They're **not** a signal that the docs hint helped or hurt —
they're a signal that the hint barely changed behavior.

---

## What we expected vs. what happened

We expected the per-rung URL dangle to lift WebFetch usage from
"essentially zero" (May baseline) toward "non-zero on the harder
rungs," and to see at least one cell visibly anchor its rung-3 / rung-4
work to docs content rather than `.d.ts` greps.

Instead:

- **WebFetch usage stayed at essentially zero** — 9/10 cells made no
  web calls at all (May baseline was 0/10). Adding a per-rung URL
  didn't move the needle.
- **The 1/10 that fetched got back wrong info.** `mux-player-with-docs_run-2`
  fetched twice in rung 4 looking for the control-bar background CSS
  variable; the docs answer didn't reflect the gerwig theme's actual
  implementation (a `::before` overlay), and the cell pivoted to
  shadow-DOM hacking like the rest.
- **Hallucination shape is the same as baseline.** Mux cells still
  cluster on the invented `--media-control-bar-background` (one cell:
  `mux-player-with-docs_run-2`, rung 3). Video-js cells scatter
  hallucinations on render-prop state names — `state.active`
  (`video-js-with-docs_run-3`) and `state.volume` / `data-captions`
  (`video-js-with-docs_run-3`). The docs hint did not catch these.
- **Rung-4 → rung-5 strategy split is the same as baseline.** All 5
  mux cells kept the rung-4 shadow-walker pattern into rung 5
  (recursive `shadowRoot` traversal + injected DOM). All 5 video-js
  cells abandoned the rung-4 portal-on-VideoSkin and rebuilt rung 5
  from primitives (`Controls.Root`, `TimeSlider.*`, `PlayButton`,
  …). The structural divergence is **library**-driven, not
  hint-driven.

---

## Why a soft footer can't compete

The workspace ships `node_modules/<lib>/**/*.d.ts` and, for mux, the
bundled gerwig theme CSS source. Given:

- A free, local, greppable type surface that answers most "what's the
  API?" questions correctly, and
- A footer-style URL with no imperative phrasing,

Claude rationally picks the local oracle every time. The hint as
written *invites* a fetch but doesn't *require* one. The mux rung-3
failure (`--media-control-bar-background`) is the canonical case:
plausible-sounding CSS-var name, no type entry to disprove it,
self-`getComputedStyle`-verifies → cascades through.

For the docs to actually shape output, the hint has to either
(a) raise the cost of *not* consulting docs, or (b) bring docs into
context whether or not Claude fetches.

---

## Next iteration

v2 (already landed on `main`, not yet run): flip the placeholder from
a trailing soft footer to a **leading imperative pre-task line** on
every rung:

```
> Before writing any code, fetch <docs URL>. It is the authoritative
> reference for this library at the version you have installed.
```

Tests a narrower question: *given an explicit instruction to fetch,
does Claude do it — and does that change output?* If v2 is still inert
on N=5, the next escalation is inline-injecting a curated docs excerpt
(so docs land in context regardless of `WebFetch`). See `DESIGN.md`
*Harness patches after pilot → WITH_DOCS ablation condition*.

---

## Other findings (from the synthesis)

The synthesis raised four suggestions ([`findings.md`](./findings.md));
the two below are reusable signal independent of the docs question:

1. **Rung-2 mux-player is still 0/5 with the same shape as baseline.**
   `autoplay: false, poster: null, previewImageVisible: false` despite
   playback running and the thumbnail rendering. Same root cause as
   the May baseline: assertion reads the literal `<video>` attribute
   but Mux Player drives playback programmatically and renders the
   poster via `thumbnailTime`. → Already on the punch-list as a
   harness fix.
2. **Rung-3 mux-player hallucination is reproducible.**
   `--media-control-bar-background` showed up again
   (`mux-player-with-docs_run-2`, plus mid-run flirts that
   self-corrected). The assertion correctly flags
   `semiTransparentBlackFound: false` but doesn't surface *which*
   CSS variable Claude used — making the hallucination inferable only
   from screenshots + judge JSON. → Same fix flagged in May baseline
   (suggestion #2 there): sample the computed background of the
   actual `media-control-bar` shadow element and log the load-bearing
   var name in the assertion output.

---

## Pointers

- Per-cell evidence: `runs/{condition}_run-{n}/`
  - `summary.md` — neutral writeup + editorial section
  - `metrics.json` — pass/fail, turns, tool calls, duration, token + cost
  - `judges/` — hallucinations, eject (rung 4 only), visual fidelity (rung 5)
  - `assertions/` — Playwright JSON per rung
  - `screenshots/` — per-rung `rung-{N}-final.png`
  - `code/` — final `App.tsx`, CSS, `package.json`, any extra component
    files (e.g. `YouTubeSkin.tsx`). Lockfile, `node_modules`, `dist`,
    transcripts not committed.
- Auto-synthesis: [`findings.md`](./findings.md) — LLM-generated
  cross-run patterns + suggested changes. Treat as a first pass,
  verify file citations before quoting.
- Harness as it ran: see `git log` immediately before this commit.
  Hint mechanism for this run was the v1 soft footer; v2 (imperative
  pre-task) is on `main` for the next run.
