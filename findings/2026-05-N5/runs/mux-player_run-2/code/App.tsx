import { useEffect, useRef, type ComponentRef } from "react";
import MuxPlayer from "@mux/mux-player-react";

const VIDEO_TITLE = "Two bros";

export function App() {
  const playerRef = useRef<ComponentRef<typeof MuxPlayer>>(null);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const title = document.createElement("span");
    title.textContent = VIDEO_TITLE;
    title.setAttribute("part", "title");
    Object.assign(title.style, {
      color: "#fff",
      font: "inherit",
      fontSize: "13px",
      padding: "0 8px",
      whiteSpace: "nowrap",
      display: "inline-flex",
      alignItems: "center",
      pointerEvents: "none",
      order: "-4",
    });

    const place = () => {
      const timeDisplay = player.shadowRoot
        ?.querySelector("media-theme")
        ?.shadowRoot?.querySelector("media-time-display");
      if (!timeDisplay) return false;
      if (title.previousElementSibling === timeDisplay) return true;
      timeDisplay.insertAdjacentElement("afterend", title);
      return true;
    };

    if (!place()) {
      const id = window.setInterval(() => {
        if (place()) window.clearInterval(id);
      }, 50);
      return () => {
        window.clearInterval(id);
        title.remove();
      };
    }

    return () => {
      title.remove();
    };
  }, []);

  return (
    <main>
      <h1>ax-bench</h1>
      <div className="player-wrap">
        <MuxPlayer
          ref={playerRef}
          playbackId="BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM"
          streamType="on-demand"
          autoPlay
          muted
          loop
          thumbnailTime={0}
          accentColor="#ff0000"
          title={VIDEO_TITLE}
          style={{
            "--media-control-bar-background": "transparent",
            "--media-range-track-height": "3px",
            "--media-range-thumb-background": "#ff0000",
            "--controls-backdrop-color":
              "linear-gradient(to top, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0) 100%)",
          }}
        />
        <span className="mux-badge" aria-hidden>
          <span className="mux-badge-bracket">[</span>
          MUX
          <span className="mux-badge-bracket">]</span>
        </span>
      </div>
    </main>
  );
}
