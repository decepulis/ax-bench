import { useEffect, useRef, type CSSProperties } from "react";
import MuxPlayer from "@mux/mux-player-react";
import type MuxPlayerElement from "@mux/mux-player";

const HIDDEN_CONTROLS = [
  "media-seek-backward-button",
  "media-airplay-button",
  "media-cast-button",
  "media-audio-track-menu-button",
  "media-audio-track-menu",
  "media-playback-rate-menu-button",
  "media-playback-rate-menu",
];

export function App() {
  const playerRef = useRef<MuxPlayerElement>(null);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    let cancelled = false;

    const attach = () => {
      if (cancelled) return true;
      const themeShadow =
        player.shadowRoot?.querySelector("media-theme")?.shadowRoot;
      const bottomBar = themeShadow?.querySelector<HTMLElement>(
        'media-control-bar[part~="bottom"]',
      );
      const topBar = themeShadow?.querySelector<HTMLElement>(
        'media-control-bar[part~="top"]',
      );
      if (!bottomBar) return false;

      if (topBar) topBar.style.display = "none";

      for (const sel of HIDDEN_CONTROLS) {
        bottomBar.querySelectorAll<HTMLElement>(sel).forEach((el) => {
          el.style.display = "none";
        });
      }

      const time =
        bottomBar.querySelector<HTMLElement>("media-time-display");
      const volume =
        bottomBar.querySelector<HTMLElement>("media-volume-range");
      if (time && volume) {
        volume.insertAdjacentElement("afterend", time);
      }

      if (time && !bottomBar.querySelector(".yt-title")) {
        const title = document.createElement("span");
        title.className = "yt-title";
        title.textContent = "Two bros";
        title.style.cssText =
          "color: #fff; font-size: 13px; padding: 0 12px; align-self: center; white-space: nowrap;";
        time.insertAdjacentElement("afterend", title);
      }

      return true;
    };

    if (attach()) return;
    const id = window.setInterval(() => {
      if (attach()) window.clearInterval(id);
    }, 50);
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
        streamType="on-demand"
        muted
        loop
        autoPlay
        thumbnailTime={0}
        title="Two bros"
        accentColor="#ff0000"
        style={
          {
            "--media-control-bar-background":
              "linear-gradient(to top, rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0))",
            "--media-range-track-height": "3px",
            "--media-range-thumb-height": "13px",
            "--media-range-thumb-width": "13px",
            "--media-range-thumb-background": "#ff0000",
            "--media-control-padding": "0 8px",
          } as CSSProperties
        }
      />
    </main>
  );
}
