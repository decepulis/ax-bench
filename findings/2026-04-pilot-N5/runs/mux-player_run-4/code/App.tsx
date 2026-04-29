import { useEffect, useRef } from "react";
import MuxPlayer, {
  type MuxPlayerRefAttributes,
} from "@mux/mux-player-react";

function findAllInShadow(
  root: ShadowRoot | Element | null,
  selector: string,
): HTMLElement[] {
  const result: HTMLElement[] = [];
  if (!root) return result;
  const found = root.querySelectorAll?.(selector);
  if (found) result.push(...(found as NodeListOf<HTMLElement>));
  for (const el of root.querySelectorAll?.("*") ?? []) {
    if ((el as Element).shadowRoot) {
      result.push(...findAllInShadow((el as Element).shadowRoot, selector));
    }
  }
  return result;
}

export function App() {
  const playerRef = useRef<MuxPlayerRefAttributes | null>(null);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    let cancelled = false;

    const customize = () => {
      if (cancelled) return;

      const bottomBar = findAllInShadow(
        player.shadowRoot,
        "media-control-bar[part~='bottom']",
      )[0];
      if (!bottomBar) {
        requestAnimationFrame(customize);
        return;
      }

      const hideSelectors = [
        "media-seek-backward-button",
        "media-seek-forward-button",
        "media-airplay-button",
        "media-cast-button",
      ];
      for (const sel of hideSelectors) {
        for (const el of findAllInShadow(bottomBar, sel)) {
          el.style.display = "none";
        }
      }

      const timeDisplay = findAllInShadow(bottomBar, "media-time-display")[0];
      const muteButton = findAllInShadow(bottomBar, "media-mute-button")[0];
      const volumeRange = findAllInShadow(bottomBar, "media-volume-range")[0];
      if (timeDisplay && muteButton && volumeRange) {
        timeDisplay.parentElement?.insertBefore(muteButton, timeDisplay);
        timeDisplay.parentElement?.insertBefore(volumeRange, timeDisplay);
      }

      if (timeDisplay && !bottomBar.querySelector(".video-title")) {
        const titleEl = document.createElement("span");
        titleEl.className = "video-title";
        titleEl.textContent = "Two bros";
        titleEl.style.cssText = [
          "color: #fff",
          "font: 13px/1 helvetica, arial, sans-serif",
          "padding: 0 10px",
          "align-self: center",
          "opacity: 0.9",
          "white-space: nowrap",
        ].join(";");
        timeDisplay.insertAdjacentElement("afterend", titleEl);
      }
    };

    customize();

    return () => {
      cancelled = true;
    };
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
        accentColor="#ff3e00"
      />
    </main>
  );
}
