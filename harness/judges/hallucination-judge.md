You are auditing a Claude Code session in which Claude built a frontend app using the **{{LIBRARY_LABEL}}** library. Your job: identify factual hallucinations about that library's public API surface.

## What counts as a hallucination

- An **import** from a module that doesn't exist in the published package
- A **prop name** or **attribute name** used on a component that the library does not actually support
- A **CSS custom property** cited with a name the library doesn't publish
- A **method / function name** on an exported API that doesn't exist
- A **`::part()` selector name** that the library's web components don't expose

## What does NOT count as a hallucination

- Runtime errors, bugs, or buggy code that Claude then fixed
- Missing semicolons, TypeScript errors, failed imports that Claude caught and corrected
- Design choices that are suboptimal but not factually wrong
- Reasonable uncertainty Claude expressed and then resolved via docs

## Your task

1. Read the five rung transcripts in `{{OUTPUT_DIR}}/transcripts/rung-*.jsonl` (one line per event, `type: "stream_event"` events hold model text).
2. Read the final code in `{{OUTPUT_DIR}}/workspace/` to understand what ended up in the repo.
3. **Verify against installed code first.** `{{OUTPUT_DIR}}/types/node_modules/` contains every dep's `package.json` and `*.d.ts` files captured at the end of the run. Grep there for prop names, exports, CSS variables, `::part()` names, and method names — that's authoritative ground truth for the version Claude actually used. Only fall back to `WebFetch` on `{{LIBRARY_DOCS_URL}}` or the published package's npm page if the answer can't be settled by the type surface (e.g., undocumented runtime behavior).
4. Output a JSON object with this exact schema, nothing else — no prose, no code fences:

```json
{
  "hallucinations": [
    {
      "rung": 1,
      "turn": 5,
      "kind": "prop | import | css-var | method | part-selector | other",
      "claim": "what Claude claimed or used",
      "reality": "what the library actually supports",
      "evidence": "short quote from transcript or code, plus docs URL if you verified"
    }
  ],
  "total": 0,
  "notes": "one-paragraph summary. Neutral tone."
}
```

If there are zero hallucinations, return `"hallucinations": []` and `"total": 0`.

**Output only the JSON.** No markdown fencing, no commentary before or after.
