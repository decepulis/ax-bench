import { useEffect, useRef } from "react";
import MuxPlayer from "@mux/mux-player-react";
import type MuxPlayerElement from "@mux/mux-player";

const VIDEO_TITLE = "Two bros";

const playerStyle = {
  "--seek-backward-button": "none",
  "--seek-forward-button": "none",
  "--rendition-menu-button": "none",
  "--playback-rate-button": "none",
  "--audio-track-menu-button": "none",
  "--airplay-button": "none",
  "--cast-button": "none",
  "--media-control-bar-display": "flex",
} as React.CSSProperties;

export function App() {
  const playerRef = useRef<MuxPlayerElement>(null);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    let cancelled = false;

    const insertTitle = (): boolean => {
      const theme = player.shadowRoot?.querySelector("media-theme");
      const themeShadow = theme?.shadowRoot;
      if (!themeShadow) return false;
      const volumeRange = themeShadow.querySelector("media-volume-range");
      if (!volumeRange) return false;
      if (themeShadow.querySelector(".yt-title-inline")) return true;

      const label = document.createElement("span");
      label.className = "yt-title-inline";
      label.textContent = VIDEO_TITLE;
      label.style.cssText = [
        "color: white",
        "font: inherit",
        "font-size: 13px",
        "padding: 0 10px",
        "display: inline-flex",
        "align-items: center",
        "height: 100%",
        "white-space: nowrap",
        "overflow: hidden",
        "text-overflow: ellipsis",
      ].join(";");
      volumeRange.insertAdjacentElement("afterend", label);
      return true;
    };

    if (insertTitle()) return;
    const id = window.setInterval(() => {
      if (cancelled) return;
      if (insertTitle()) window.clearInterval(id);
    }, 100);

    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
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
        style={playerStyle}
      />
    </main>
  );
}
