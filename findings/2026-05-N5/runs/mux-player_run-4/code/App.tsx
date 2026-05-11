import { useEffect, useRef, type CSSProperties } from "react";
import MuxPlayer from "@mux/mux-player-react";
import type MuxPlayerElement from "@mux/mux-player";

const VIDEO_TITLE = "Two bros";

const playerStyle = {
  "--media-control-bar-background": "transparent",
  "--media-control-background": "transparent",
  "--media-control-hover-background": "rgba(255, 255, 255, 0.12)",
  "--media-range-track-height": "3px",
  "--media-range-track-background": "rgba(255, 255, 255, 0.3)",
  "--media-range-thumb-background": "#ff3e00",
  "--media-range-thumb-width": "13px",
  "--media-range-thumb-height": "13px",
  "--media-time-range-buffered-color": "rgba(255, 255, 255, 0.45)",
} as CSSProperties;

function arrangeYouTubeControls(themeRoot: ShadowRoot): boolean {
  const controlBar = themeRoot.querySelector<HTMLElement>(
    'media-control-bar[part~="bottom"]'
  );
  if (!controlBar) return false;

  const play = controlBar.querySelector("media-play-button");
  const seekForward = controlBar.querySelector("media-seek-forward-button");
  const mute = controlBar.querySelector("media-mute-button");
  const volume = controlBar.querySelector("media-volume-range");
  const time = controlBar.querySelector("media-time-display");
  const spacer = controlBar.querySelector<HTMLElement>(".spacer");
  if (!play || !seekForward || !mute || !volume || !time || !spacer)
    return false;

  // Order: play, next, mute, volume, time, [title], spacer, ...right-side
  play.after(seekForward);
  seekForward.after(mute);
  mute.after(volume);
  volume.after(time);

  let title = controlBar.querySelector<HTMLElement>(
    '[data-yt-title="true"]'
  );
  if (!title) {
    title = document.createElement("span");
    title.dataset.ytTitle = "true";
    title.textContent = VIDEO_TITLE;
    title.style.cssText =
      "color: #fff; font-size: 13px; padding: 0 12px; white-space: nowrap; align-self: center; text-shadow: 0 0 4px rgba(0,0,0,0.6);";
  }
  time.after(title);
  title.after(spacer);

  return true;
}

export function App() {
  const playerRef = useRef<MuxPlayerElement>(null);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const apply = () => {
      const themeRoot = player.shadowRoot
        ?.querySelector("media-theme")
        ?.shadowRoot;
      if (!themeRoot) return false;
      return arrangeYouTubeControls(themeRoot);
    };

    if (apply()) return;

    const observer = new MutationObserver(() => {
      if (apply()) observer.disconnect();
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
        accentColor="#ff3e00"
        proudlyDisplayMuxBadge
        style={playerStyle}
      />
    </main>
  );
}
