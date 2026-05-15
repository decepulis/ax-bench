import { useEffect, useRef, type CSSProperties } from "react";
import MuxPlayer from "@mux/mux-player-react";
import type MuxPlayerElement from "@mux/mux-player";

function deepQuery(root: Document | ShadowRoot | null, selector: string): Element | null {
  if (!root) return null;
  const direct = root.querySelector(selector);
  if (direct) return direct;
  for (const el of root.querySelectorAll("*")) {
    if (el.shadowRoot) {
      const found = deepQuery(el.shadowRoot, selector);
      if (found) return found;
    }
  }
  return null;
}

export function App() {
  const playerRef = useRef<MuxPlayerElement>(null);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const TITLE_ID = "yt-title";

    const layout = () => {
      const root = player.shadowRoot;
      const timeDisplay = deepQuery(root, "media-time-display");
      const volumeRange = deepQuery(root, "media-volume-range");
      if (!timeDisplay || !volumeRange) return false;
      const parent = volumeRange.parentElement;
      if (!parent) return false;

      // Reorder: place time-display right after volume-range.
      if (timeDisplay.previousElementSibling !== volumeRange) {
        parent.insertBefore(timeDisplay, volumeRange.nextSibling);
      }

      // Inject "Two bros" title after the relocated time display.
      if (!parent.querySelector(`#${TITLE_ID}`)) {
        const title = document.createElement("span");
        title.id = TITLE_ID;
        title.textContent = "Two bros";
        title.style.cssText =
          "color:#fff;font:500 13px system-ui,-apple-system,sans-serif;padding:0 8px;align-self:center;white-space:nowrap;";
        parent.insertBefore(title, timeDisplay.nextSibling);
      }
      return true;
    };

    if (layout()) return;

    const observer = new MutationObserver(() => {
      if (layout()) observer.disconnect();
    });
    observer.observe(player, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <h1>ax-bench</h1>
      <MuxPlayer
        ref={playerRef}
        playbackId="BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM"
        streamType="on-demand"
        muted
        loop
        autoPlay
        thumbnailTime={0}
        accentColor="#ff0000"
        style={
          {
            "--controls-backdrop-color": "transparent",
          } as CSSProperties
        }
      />
    </main>
  );
}
