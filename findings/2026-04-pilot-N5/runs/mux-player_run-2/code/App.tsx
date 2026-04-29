import { useEffect, useRef } from "react";
import MuxPlayer from "@mux/mux-player-react";
import type MuxPlayerElement from "@mux/mux-player";

const VIDEO_TITLE = "Two bros";

function findBottomControlBar(root: ShadowRoot | null): Element | null {
  if (!root) return null;
  for (const bar of root.querySelectorAll("media-control-bar")) {
    if ((bar.getAttribute("part") || "").split(/\s+/).includes("bottom")) {
      return bar;
    }
  }
  for (const el of root.querySelectorAll("*")) {
    const found = findBottomControlBar((el as Element).shadowRoot);
    if (found) return found;
  }
  return null;
}

export function App() {
  const playerRef = useRef<MuxPlayerElement>(null);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    let raf = 0;
    let attempts = 0;

    const apply = () => {
      const bar = findBottomControlBar(player.shadowRoot);
      const timeDisplay = bar?.querySelector("media-time-display");
      const volumeRange = bar?.querySelector("media-volume-range");
      if (!bar || !timeDisplay || !volumeRange) {
        if (++attempts < 120) raf = requestAnimationFrame(apply);
        return;
      }

      // Move time display to after the volume range (YouTube order).
      if (timeDisplay.previousElementSibling !== volumeRange) {
        volumeRange.insertAdjacentElement("afterend", timeDisplay);
      }

      // Inject the video title right after the time display. Inline styles
      // are required because shadow-DOM children don't pick up global CSS.
      if (!bar.querySelector(".mux-yt-title")) {
        const span = document.createElement("span");
        span.className = "mux-yt-title";
        span.textContent = VIDEO_TITLE;
        Object.assign(span.style, {
          display: "flex",
          alignItems: "center",
          color: "#fff",
          fontSize: "13px",
          fontWeight: "400",
          padding: "0 8px",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        });
        timeDisplay.insertAdjacentElement("afterend", span);
      }
    };

    apply();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <main>
      <h1>ax-bench</h1>
      <MuxPlayer
        ref={playerRef}
        playbackId="BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM"
        muted
        loop
        autoPlay
        thumbnailTime={0}
        accentColor="#ff0000"
      />
    </main>
  );
}
