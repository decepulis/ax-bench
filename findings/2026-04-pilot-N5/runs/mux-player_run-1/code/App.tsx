import { useEffect, useRef } from "react";
import MuxPlayer from "@mux/mux-player-react";
import type MuxPlayerElement from "@mux/mux-player";

export function App() {
  const playerRef = useRef<MuxPlayerElement>(null);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const findInShadow = (
      root: ShadowRoot | null,
      selector: string,
    ): Element | null => {
      if (!root) return null;
      const direct = root.querySelector(selector);
      if (direct) return direct;
      for (const el of root.querySelectorAll<HTMLElement>("*")) {
        if (el.shadowRoot) {
          const nested = findInShadow(el.shadowRoot, selector);
          if (nested) return nested;
        }
      }
      return null;
    };

    const insertChapterLabel = () => {
      const time = findInShadow(player.shadowRoot, "media-time-display");
      if (!time) return false;
      const root = time.getRootNode() as ShadowRoot;
      if (root.querySelector("[data-chapter-label]")) return true;

      const label = document.createElement("span");
      label.dataset.chapterLabel = "true";
      label.textContent = "Two bros ›";
      label.style.cssText =
        "color: #fff; font: 13px/1 Roboto, system-ui, sans-serif; padding: 0 8px; align-self: center; opacity: 0.95; order: -6;";
      time.insertAdjacentElement("afterend", label);
      return true;
    };

    if (insertChapterLabel()) return;

    let cancelled = false;
    const tick = () => {
      if (cancelled) return;
      if (!insertChapterLabel()) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
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
        autoPlay
        loop
        muted
        poster="https://image.mux.com/BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM/thumbnail.jpg?time=0"
        accentColor="#ff0000"
      />
    </main>
  );
}
