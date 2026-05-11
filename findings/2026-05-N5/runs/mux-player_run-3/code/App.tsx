import { useEffect, useRef, type CSSProperties } from "react";
import MuxPlayer from "@mux/mux-player-react";
import type MuxPlayerElement from "@mux/mux-player";

const VIDEO_TITLE = "Two bros";

export function App() {
  const playerRef = useRef<MuxPlayerElement>(null);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const getThemeRoot = (): ShadowRoot | null =>
      player.shadowRoot?.querySelector("media-theme")?.shadowRoot ?? null;

    const hideSelectors = [
      "media-seek-backward-button",
      "media-volume-range",
      "media-airplay-button",
      "media-cast-button",
      "media-playback-rate-menu-button",
      "media-playback-rate-menu",
      "media-audio-track-menu-button",
      "media-audio-track-menu",
      'media-control-bar[part~="top"]',
    ];

    const apply = () => {
      const root = getThemeRoot();
      if (!root) return false;

      const bottomBar = root.querySelector<HTMLElement>(
        'media-control-bar[part~="bottom"]'
      );
      if (!bottomBar) return false;

      for (const sel of hideSelectors) {
        root.querySelectorAll<HTMLElement>(sel).forEach((el) => {
          if (el.style.display !== "none") el.style.display = "none";
        });
      }

      const mute = bottomBar.querySelector<HTMLElement>("media-mute-button");
      const time = bottomBar.querySelector<HTMLElement>("media-time-display");
      if (mute && time && mute.nextElementSibling !== time) {
        bottomBar.insertBefore(mute, time);
      }

      let title = root.querySelector<HTMLElement>("#yt-title");
      if (!title && time) {
        title = document.createElement("span");
        title.id = "yt-title";
        title.textContent = VIDEO_TITLE;
        title.style.cssText =
          "color:#fff;font:500 13px/1 system-ui,sans-serif;padding:0 8px;align-self:center;white-space:nowrap;";
        time.after(title);
      } else if (title && time && title.previousElementSibling !== time) {
        time.after(title);
      }

      // Force-show captions button to match the YouTube reference even if
      // the asset has no subtitle tracks (purely visual parity).
      const ccBtn = root.querySelector<HTMLElement>(
        "media-captions-menu-button"
      );
      if (ccBtn) ccBtn.style.setProperty("display", "flex", "important");

      // YouTube order on the right: CC → settings → PiP → fullscreen.
      const renditionBtnEl = bottomBar.querySelector(
        "media-rendition-menu-button"
      );
      if (ccBtn && renditionBtnEl && ccBtn.nextElementSibling !== renditionBtnEl) {
        bottomBar.insertBefore(ccBtn, renditionBtnEl);
      }

      // Swap the seek-forward icon (which shows "10" + replay-style arrow) for
      // a YouTube-style "next track" glyph.
      const seekFwd = root.querySelector("media-seek-forward-button");
      const seekFwdIcon = seekFwd?.querySelector('svg[slot="icon"]');
      if (seekFwdIcon && !seekFwdIcon.hasAttribute("data-yt")) {
        seekFwdIcon.setAttribute("data-yt", "1");
        seekFwdIcon.setAttribute("viewBox", "0 0 24 24");
        seekFwdIcon.innerHTML =
          '<path d="M6 5v14l9-7-9-7zM16 5h2v14h-2V5z" fill="currentColor"/>';
      }

      // Swap the three-dot rendition menu icon for a gear, matching YouTube.
      const renditionBtn = root.querySelector("media-rendition-menu-button");
      const renditionIcon = renditionBtn?.querySelector('svg[slot="icon"]');
      if (renditionIcon && !renditionIcon.hasAttribute("data-yt")) {
        renditionIcon.setAttribute("data-yt", "1");
        renditionIcon.setAttribute("viewBox", "0 0 24 24");
        renditionIcon.innerHTML =
          '<path d="M19.14 12.94a7.49 7.49 0 0 0 .05-.94 7.49 7.49 0 0 0-.05-.94l2.03-1.58a.5.5 0 0 0 .12-.64l-1.92-3.32a.5.5 0 0 0-.6-.22l-2.39.96a7.03 7.03 0 0 0-1.62-.94l-.36-2.54A.5.5 0 0 0 13.9 2h-3.84a.5.5 0 0 0-.5.42l-.36 2.54a7.03 7.03 0 0 0-1.62.94l-2.39-.96a.5.5 0 0 0-.6.22L2.67 8.48a.5.5 0 0 0 .12.64l2.03 1.58a7.49 7.49 0 0 0 0 1.88L2.79 14.16a.5.5 0 0 0-.12.64l1.92 3.32a.5.5 0 0 0 .6.22l2.39-.96c.5.38 1.04.7 1.62.94l.36 2.54a.5.5 0 0 0 .5.42h3.84a.5.5 0 0 0 .5-.42l.36-2.54a7.03 7.03 0 0 0 1.62-.94l2.39.96a.5.5 0 0 0 .6-.22l1.92-3.32a.5.5 0 0 0-.12-.64l-2.03-1.58zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z" fill="currentColor"/>';
      }

      // Remove any leftover share button from task 4 (no longer needed).
      root.querySelector("#share-button")?.remove();

      return true;
    };

    let themeObserver: MutationObserver | null = null;
    const startThemeObserver = () => {
      const root = getThemeRoot();
      if (!root || themeObserver) return;
      themeObserver = new MutationObserver(apply);
      themeObserver.observe(root, { childList: true, subtree: true });
    };

    if (apply()) {
      startThemeObserver();
    } else {
      const outer = player.shadowRoot;
      if (outer) {
        const boot = new MutationObserver(() => {
          if (apply()) {
            boot.disconnect();
            startThemeObserver();
          }
        });
        boot.observe(outer, { childList: true, subtree: true });
        return () => {
          boot.disconnect();
          themeObserver?.disconnect();
        };
      }
    }

    return () => themeObserver?.disconnect();
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
        title={VIDEO_TITLE}
        style={
          {
            "--media-control-bar-background":
              "linear-gradient(to top, rgba(0,0,0,0.75), rgba(0,0,0,0.4))",
            "--media-range-track-height": "3px",
            borderRadius: "12px",
            overflow: "hidden",
            aspectRatio: "16 / 9",
          } as CSSProperties
        }
      />
    </main>
  );
}
