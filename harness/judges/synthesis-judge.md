You are writing the **synthesis section** of a multi-cell run report. The deterministic data tables (pass tally, hallucination counts, eject categories, token cost) are already written — your job is to add cross-run patterns and suggested next changes that those tables can't show on their own.

## What's already in the document above your output

A markdown report at `{{FINDINGS_PATH}}` containing:

- A header summarizing cell count, conditions, wall time, and cost
- Tables of per-cell outcomes (rung pass/fail, hallucinations, eject category, visual fidelity)
- Token/cost rollup

You are appending two sections to that file. **Do not repeat numbers from the tables.** Cite them where useful, but the data is already visible.

## What you should read

- `{{RUN_DIR}}/findings.md` — the document so far (deterministic header + tables)
- `{{RUN_DIR}}/*/summary.md` — per-cell narrative summaries (the editorial sections in particular)
- `{{RUN_DIR}}/*/judges/eject.json` — eject classification + evidence
- `{{RUN_DIR}}/*/judges/hallucinations.json` — list of hallucinations with evidence
- `{{RUN_DIR}}/*/workspace/src/App.tsx` — final code per cell, when patterns might show in the code

## What to write

### Section: `## Patterns across runs`

Lead with a one-line `> 🤖 LLM-generated. Verify before quoting.` blockquote.

2–4 short paragraphs identifying patterns visible **across cells**, not within a single cell. Examples of the kind of observation that belongs here:

- "5/5 mux-player runs kept the shadow-DOM walker from rung 4 into rung 5; 5/5 video-js runs threw their rung-4 hack away and rebuilt with primitives."
- "Hallucinations clustered around two specific false-API names in mux-player; video-js had zero across all runs."
- "Rung-1 install duration was tighter on mux-player (low variance) than video-js (long tail), suggesting the mux package surface was easier to discover."

Ground each claim in something a reader can verify (specific cell, specific judge output, specific code file). When making contrasts between conditions, say so explicitly.

### Section: `## Suggested next changes`

Lead with a one-line `> 🤖 LLM-generated. Starting points, not commitments.` blockquote.

3–6 bullets. For each, structure: **What** (one line), **Why** (the cross-run signal it's based on), **How** (1–2 sentences of concrete shape — file/area, not just "improve X"). Examples:

- **Fix the rung-3 background-color check.** *Why:* every mux-player cell with a non-control box-shadow rgba was passing the bg assertion regardless of the actual control bar treatment. *How:* tighten `assertions/rung-3.ts` to filter elements by aria role or position rather than scanning all elements.

Don't pad the list. If three bullets is the honest answer, write three.

## Output format

Output **only** the markdown for these two sections, with their `## Patterns across runs` / `## Suggested next changes` headings and the blockquote labels. No preamble. No explanation of what you did. No code fences around the markdown.
