import { useEffect, useRef } from "react";
import MuxPlayer from "@mux/mux-player-react";
import type MuxPlayerElement from "@mux/mux-player";

const VIDEO_TITLE = "Two bros";

export function App() {
  const playerRef = useRef<MuxPlayerElement>(null);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const findInShadows = (root: ShadowRoot | Element, selector: string): Element | null => {
      const direct = root.querySelector(selector);
      if (direct) return direct;
      for (const el of root.querySelectorAll("*")) {
        if (el.shadowRoot) {
          const found = findInShadows(el.shadowRoot, selector);
          if (found) return found;
        }
      }
      return null;
    };

    const insertTitle = () => {
      if (!player.shadowRoot) return;
      const timeDisplay = findInShadows(player.shadowRoot, "media-time-display");
      if (!timeDisplay) return;
      const bar = timeDisplay.parentElement;
      if (!bar || bar.querySelector('[data-inline-title="true"]')) return;
      const span = document.createElement("span");
      span.dataset.inlineTitle = "true";
      span.textContent = VIDEO_TITLE;
      Object.assign(span.style, {
        color: "#fff",
        fontSize: "13px",
        fontFamily: '"YouTube Sans","Roboto",system-ui,sans-serif',
        padding: "0 8px",
        whiteSpace: "nowrap",
        alignSelf: "center",
        order: "-1",
      });
      timeDisplay.insertAdjacentElement("afterend", span);
    };

    const observers: MutationObserver[] = [];
    const watch = (root: ShadowRoot) => {
      const obs = new MutationObserver(() => {
        insertTitle();
        for (const el of root.querySelectorAll("*")) {
          const w = el as Element & { _watched?: boolean };
          if (el.shadowRoot && !w._watched) {
            w._watched = true;
            watch(el.shadowRoot);
          }
        }
      });
      obs.observe(root, { childList: true, subtree: true });
      observers.push(obs);
    };
    if (player.shadowRoot) watch(player.shadowRoot);
    insertTitle();
    return () => observers.forEach((o) => o.disconnect());
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
        poster="https://image.mux.com/BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM/thumbnail.webp?time=0"
        accentColor="#ff0000"
      />
    </main>
  );
}
