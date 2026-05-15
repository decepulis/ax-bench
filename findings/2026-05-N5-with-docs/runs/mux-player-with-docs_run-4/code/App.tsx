import { useEffect, useRef, type CSSProperties } from "react";
import MuxPlayer from "@mux/mux-player-react";
import type MuxPlayerElement from "@mux/mux-player";

const VIDEO_TITLE = "Two bros";

export function App() {
  const playerRef = useRef<MuxPlayerElement>(null);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const inject = (): boolean => {
      const theme = player.shadowRoot?.querySelector("media-theme");
      const bottomBar = theme?.shadowRoot?.querySelector<HTMLElement>(
        'media-control-bar[part~="bottom"]'
      );
      const timeDisplay = bottomBar?.querySelector("media-time-display");
      if (!bottomBar || !timeDisplay) return false;
      if (bottomBar.querySelector(".yt-title")) return true;

      const titleEl = document.createElement("span");
      titleEl.className = "yt-title";
      titleEl.textContent = VIDEO_TITLE;
      timeDisplay.insertAdjacentElement("afterend", titleEl);
      return true;
    };

    if (inject()) return;
    const interval = window.setInterval(() => {
      if (inject()) window.clearInterval(interval);
    }, 50);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <main>
      <h1>ax-bench</h1>
      <MuxPlayer
        ref={playerRef}
        playbackId="BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM"
        streamType="on-demand"
        autoPlay
        muted
        loop
        thumbnailTime={0}
        accentColor="#ff0000"
        style={
          {
            "--media-control-bar-background":
              "linear-gradient(transparent, rgba(0, 0, 0, 0.7))",
            "--media-range-track-height": "3px",
            "--media-range-thumb-height": "13px",
            "--media-range-thumb-width": "13px",
          } as CSSProperties
        }
      />
    </main>
  );
}
