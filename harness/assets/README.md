# Assets

## `youtube-reference.png` (required before running rung 5)

A screenshot of the YouTube player UI that Claude will try to reproduce in rung 5.

**You'll need to capture this yourself.** One reasonable way:

1. Open any public YouTube video in Chrome at 1280×720 or similar
2. Hover to reveal the control bar, with a chapter marker or two visible if possible
3. Take a cropped screenshot of just the player area (Cmd+Shift+4, drag around the player)
4. Save as `youtube-reference.png` in this directory

The judge model will compare Claude's rendered output against this reference. The judge is lenient — it's looking for "recognizably YouTube-like," not pixel-perfect. Pick a representative frame.
