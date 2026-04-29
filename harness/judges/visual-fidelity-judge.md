You are scoring how closely Claude's rung-5 redesign matches a reference screenshot of the YouTube player.

## Your task

1. Read the reference image: `{{REFERENCE_PATH}}`
2. Read Claude's final screenshot: `{{CANDIDATE_PATH}}`
3. Score visual fidelity on a 1-5 scale:

- **5**: Indistinguishable from YouTube at a glance. Chrome, control bar layout, icon set, and color treatment all match.
- **4**: Clearly YouTube-inspired. Major structural elements present (progress bar, play, volume, title overlay, right-aligned controls). Minor mismatches in spacing or iconography.
- **3**: Recognizable attempt. Several YouTube elements present but layout or treatment diverges materially.
- **2**: Some elements gestured at, but the result wouldn't read as "YouTube-like" to a neutral observer.
- **1**: Unrelated or broken.

4. Output exactly this JSON, nothing else:

```json
{
  "score": 3,
  "rubric": {
    "structural": {
      "progress_bar": true,
      "play_button": true,
      "volume_control": true,
      "settings_cog": false,
      "fullscreen_button": true,
      "chapter_markers": false,
      "title_overlay": false,
      "theater_mode_toggle": false
    },
    "color_palette": "one-line description",
    "typography": "one-line description",
    "notes": "1-3 sentences on what worked and what didn't"
  }
}
```

**Output only the JSON.**
