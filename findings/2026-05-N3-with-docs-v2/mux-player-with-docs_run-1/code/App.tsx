import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";
import MuxPlayer from "@mux/mux-player-react";

export function App() {
  const playerRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const getThemeRoot = (): ShadowRoot | null =>
      player.shadowRoot?.querySelector("media-theme")?.shadowRoot ?? null;

    const tryInject = (): boolean => {
      const root = getThemeRoot();
      if (!root) return false;
      const time = root.querySelector("media-time-display");
      const mute = root.querySelector("media-mute-button");
      if (!time || !mute) return false;
      if (root.querySelector("[data-chapter-title]")) return true;

      // Match YouTube ordering: ... mute, time, chapter-title ...
      time.parentNode?.insertBefore(mute, time);

      const label = document.createElement("span");
      label.dataset.chapterTitle = "";
      label.textContent = "Two bros";
      label.style.cssText =
        "color:#fff;padding:0 8px;font:13px/1 system-ui,sans-serif;align-self:center;white-space:nowrap;";
      time.insertAdjacentElement("afterend", label);
      return true;
    };

    if (tryInject()) return;

    const observer = new MutationObserver(() => {
      if (tryInject()) observer.disconnect();
    });
    const target =
      getThemeRoot() ?? player.shadowRoot ?? player;
    observer.observe(target, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <h1>ax-bench</h1>
      <MuxPlayer
        ref={playerRef as never}
        playbackId="BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM"
        muted
        autoPlay
        loop
        thumbnailTime={0}
        accentColor="#ff0000"
        style={
          {
            "--controls-backdrop-color": "transparent",
            "--bottom-seek-backward-button": "none",
            "--bottom-volume-range": "none",
            "--bottom-rendition-menu-button": "none",
            "--bottom-audio-track-menu-button": "none",
            "--bottom-airplay-button": "none",
            "--bottom-cast-button": "none",
            "--media-range-track-height": "3px",
            "--media-range-thumb-height": "12px",
            "--media-range-thumb-width": "12px",
          } as CSSProperties
        }
      />
    </main>
  );
}
