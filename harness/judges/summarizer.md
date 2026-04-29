You are writing a **neutral per-run report** for an experiment comparing Claude's behavior across two video-player libraries. Your output is markdown. Do not offer opinions in the main body — the editorial section at the end is where opinions go.

## Inputs you should read

- `{{OUTPUT_DIR}}/metrics.json` — per-rung timings, exit codes, assertion results
- `{{OUTPUT_DIR}}/transcripts/rung-*.jsonl` — raw session transcripts (NDJSON)
- `{{OUTPUT_DIR}}/assertions/rung-*.json` — structured assertion outputs
- `{{OUTPUT_DIR}}/judges/hallucinations.json` — hallucination audit
- `{{OUTPUT_DIR}}/judges/eject.json` — rung 4 categorical decision
- `{{OUTPUT_DIR}}/judges/visual-fidelity.json` — rung 5 score (if applicable)
- `{{OUTPUT_DIR}}/workspace/` — Claude's final code

## Grounding rule

Every behavioral claim in the neutral body MUST cite a source. Use one of:

- `rung-N / turn X` when quoting the transcript
- `workspace/src/App.tsx` when referencing final code
- `metrics.json` when citing timing or counts

Do not make claims you can't cite. If you can't cite, drop the claim.

## Output format

Produce this exact markdown, filling in the blanks:

```markdown
# Run: {{LIBRARY_LABEL}} / run-{{RUN_INDEX}}

## Summary

One paragraph. Neutral. What happened at a 30,000-foot view. Total turn count,
total duration, total rungs passed. No interpretation.

## Per-rung timeline

| Rung | Result | Turns | Notable |
|------|--------|-------|---------|
| 1. Install | PASS/FAIL | N | brief note with `rung-1 / turn X` citation |
| 2. Config | PASS/FAIL | N | brief note |
| 3. Styling | PASS/FAIL | N | brief note |
| 4. Structural | PASS/FAIL | N | **Eject decision:** {decision} (`rung-4 / turn X`) |
| 5. Redesign | passed build / visual {N}/5 | N | brief note |

## Notable moments

3-6 bullets, each grounded in a specific transcript turn or file citation.
These are the moments a reader would find most characteristic of this run.
Include any "ah, Claude discovered llms.txt" or "Claude tried X three times
before settling on Y" observations.

## Hallucinations: {N}

If non-zero, list them with citations from the hallucination judge.

## Tool usage

Briefly summarize: did Claude use Playwright MCP? Chrome DevTools MCP?
WebFetch (and which URLs)? How many screenshot iterations per rung?

---

## Editorial (opinionated)

> This section contains interpretive claims. Dismiss or keep as you see fit.

2-4 bullets offering provocative framings. What does this run *suggest* about
{{LIBRARY_LABEL}}'s agent experience? What would a blog-post paragraph say
about this particular run? Be willing to overstate — the reader will pull what
they want.
```

**Output only the markdown.** No preamble, no "here is the report."
