import MuxPlayer from "@mux/mux-player-react";
import type MuxPlayerElement from "@mux/mux-player";
import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

export function App() {
  const playerRef = useRef<MuxPlayerElement>(null);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;
    let cancelled = false;
    let observer: MutationObserver | undefined;

    const tryInject = () => {
      if (cancelled) return true;
      const bottomBar = player.shadowRoot
        ?.querySelector("media-theme")
        ?.shadowRoot?.querySelector(
          'media-control-bar[part="control-bar bottom"]',
        );
      const timeDisplay = bottomBar?.querySelector("media-time-display");
      const muteButton = bottomBar?.querySelector("media-mute-button");
      if (!bottomBar || !timeDisplay || !muteButton) return false;
      if (bottomBar.querySelector("[data-title-chip]")) return true;

      timeDisplay.insertAdjacentElement("beforebegin", muteButton);

      const title = document.createElement("span");
      title.dataset.titleChip = "";
      title.textContent = "Two bros";
      Object.assign(title.style, {
        color: "white",
        font: "inherit",
        padding: "0 8px",
        display: "inline-flex",
        alignItems: "center",
      });
      timeDisplay.insertAdjacentElement("afterend", title);
      return true;
    };

    if (!tryInject()) {
      observer = new MutationObserver(() => {
        if (tryInject()) observer?.disconnect();
      });
      observer.observe(player, { childList: true, subtree: true });
    }

    return () => {
      cancelled = true;
      observer?.disconnect();
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
        accentColor="#ff0000"
        proudlyDisplayMuxBadge
        style={
          {
            "--media-control-bar-background": "rgba(0, 0, 0, 0.5)",
            "--seek-backward-button": "none",
            "--seek-forward-button": "none",
            "--volume-range": "none",
            "--audio-track-menu-button": "none",
            "--airplay-button": "none",
            "--cast-button": "none",
            "--playback-rate-button": "none",
            "--pip-button": "none",
          } as CSSProperties
        }
      />
    </main>
  );
}
