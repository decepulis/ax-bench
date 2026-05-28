import { useState } from "react";
import MuxVideo from "@mux/mux-video-react";
import {
  MediaController,
  MediaControlBar,
  MediaPlayButton,
  MediaMuteButton,
  MediaVolumeRange,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaCaptionsButton,
  MediaPipButton,
  MediaFullscreenButton,
  MediaChromeButton,
} from "media-chrome/react";
import "./player.css";

const PLAYBACK_ID = "BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM";

// YouTube-style icons use a 0 0 36 36 viewBox.
function Icon({ slot, d }: { slot?: string; d: string }) {
  return (
    <span slot={slot} className="yt-ico">
      <svg viewBox="0 0 36 36" fill="currentColor" aria-hidden="true">
        <path d={d} />
      </svg>
    </span>
  );
}

const PLAY = "M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z";
const PAUSE = "M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z";
const NEXT = "M 12,24 20.5,18 12,12 V 24 z M 22,12 V 24 H 24 V 12 H 22 z";
const VOL_HIGH =
  "M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 z M19,14 L19,22 C20.48,21.26 21.5,19.74 21.5,18 C21.5,16.31 20.48,14.74 19,14 z M19,11.29 C21.89,12.15 24,14.83 24,18 C24,21.17 21.89,23.85 19,24.71 L19,26.77 C23.01,25.86 26,22.28 26,18 C26,13.72 23.01,10.14 19,9.23 L19,11.29 z";
const VOL_LOW =
  "M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 z M19,14 L19,22 C20.48,21.26 21.5,19.74 21.5,18 C21.5,16.31 20.48,14.74 19,14 z";
const VOL_MUTE =
  "M21.48,17.98 C21.48,16.21 20.46,14.69 18.98,13.95 L18.98,16.42 L21.42,18.86 C21.45,18.57 21.48,18.28 21.48,17.98 z M23.98,17.98 C23.98,18.92 23.78,19.8 23.43,20.62 L24.94,22.13 C25.61,20.88 26,19.48 26,17.98 C26,13.7 23.01,10.12 19,9.21 L19,11.27 C21.89,12.13 23.98,14.81 23.98,17.98 z M9.25,8.98 L8,10.23 L12.77,15 L8,15 L8,21 L12,21 L17,26 L17,19.23 L21.25,23.48 C20.58,24 19.83,24.42 19,24.7 L19,26.76 C20.38,26.45 21.63,25.81 22.69,24.92 L24.73,26.96 L25.98,25.71 L17,16.73 L9.25,8.98 z M17,10 L14.77,12.23 L17,14.46 L17,10 z";
const CC =
  "M11,11 C9.9,11 9,11.9 9,13 L9,23 C9,24.1 9.9,25 11,25 L25,25 C26.1,25 27,24.1 27,23 L27,13 C27,11.9 26.1,11 25,11 L11,11 z M17,17 L15.5,17 L15.5,16.5 L13.5,16.5 L13.5,19.5 L15.5,19.5 L15.5,19 L17,19 L17,20 C17,20.55 16.55,21 16,21 L13,21 C12.45,21 12,20.55 12,20 L12,16 C12,15.45 12.45,15 13,15 L16,15 C16.55,15 17,15.45 17,16 L17,17 z M24,17 L22.5,17 L22.5,16.5 L20.5,16.5 L20.5,19.5 L22.5,19.5 L22.5,19 L24,19 L24,20 C24,20.55 23.55,21 23,21 L20,21 C19.45,21 19,20.55 19,20 L19,16 C19,15.45 19.45,15 20,15 L23,15 C23.55,15 24,15.45 24,16 L24,17 z";
const SETTINGS =
  "M 23.94,18.78 C 23.97,18.52 24,18.26 24,18 24,17.74 23.97,17.48 23.94,17.22 L 25.65,15.89 C 25.81,15.77 25.85,15.55 25.75,15.37 L 24.13,12.57 C 24.03,12.39 23.81,12.32 23.62,12.39 L 21.61,13.2 C 21.19,12.88 20.74,12.61 20.25,12.41 L 19.95,10.27 C 19.92,10.07 19.75,9.92 19.55,9.92 L 16.31,9.92 C 16.11,9.92 15.95,10.07 15.92,10.27 L 15.62,12.41 C 15.13,12.61 14.68,12.89 14.26,13.2 L 12.25,12.39 C 12.07,12.32 11.85,12.39 11.75,12.57 L 10.13,15.37 C 10.03,15.55 10.07,15.77 10.23,15.89 L 11.94,17.22 C 11.91,17.48 11.89,17.75 11.89,18 11.89,18.25 11.91,18.52 11.94,18.78 L 10.23,20.11 C 10.07,20.23 10.03,20.45 10.13,20.63 L 11.75,23.43 C 11.85,23.61 12.07,23.68 12.25,23.61 L 14.26,22.8 C 14.68,23.12 15.13,23.39 15.62,23.59 L 15.92,25.73 C 15.95,25.93 16.11,26.08 16.31,26.08 L 19.55,26.08 C 19.75,26.08 19.92,25.93 19.94,25.73 L 20.24,23.59 C 20.73,23.39 21.18,23.11 21.6,22.8 L 23.61,23.61 C 23.79,23.68 24.01,23.61 24.11,23.43 L 25.73,20.63 C 25.83,20.45 25.79,20.23 25.63,20.11 L 23.94,18.78 z M 17.93,20.7 C 16.44,20.7 15.23,19.49 15.23,18 15.23,16.51 16.44,15.3 17.93,15.3 19.42,15.3 20.63,16.51 20.63,18 20.63,19.49 19.42,20.7 17.93,20.7 z";
const MINIPLAYER =
  "M25,17 L17,17 L17,23 L25,23 L25,17 L25,17 z M29,25.02 L29,10.98 C29,9.88 28.1,9 27,9 L9,9 C7.9,9 7,9.88 7,10.98 L7,25.02 C7,26.12 7.9,27 9,27 L27,27 C28.1,27 29,26.12 29,25.02 L29,25.02 z M27,25.04 L9,25.04 L9,10.96 L27,10.96 L27,25.04 L27,25.04 z";
const THEATER =
  "M26,13 L10,13 C8.9,13 8,13.9 8,15 L8,21 C8,22.1 8.9,23 10,23 L26,23 C27.1,23 28,22.1 28,21 L28,15 C28,13.9 27.1,13 26,13 z M26,21 L10,21 L10,15 L26,15 L26,21 z";
const FULLSCREEN_ENTER =
  "m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z M 20,10 l 0,2 4,0 0,4 2,0 L 26,10 l -6,0 0,0 z m 4,14 -4,0 0,2 L 26,26 l 0,-6 -2,0 0,4 0,0 z M 12,20 l -2,0 0,6 6,0 0,-2 -4,0 0,-4 0,0 z";
const FULLSCREEN_EXIT =
  "m 14,14 -4,0 0,2 6,0 0,-6 -2,0 0,4 0,0 z m 8,0 0,-4 -2,0 0,6 6,0 0,-2 -4,0 0,0 z m -2,12 2,0 0,-4 4,0 0,-2 -6,0 0,6 0,0 z m -6,-4 -4,0 0,2 6,0 0,-6 -2,0 0,4 0,0 z";

export function App() {
  const [autoplayOn, setAutoplayOn] = useState(true);

  return (
    <main>
      <h1>ax-bench</h1>
      <MediaController className="yt-player">
        <MuxVideo
          slot="media"
          playbackId={PLAYBACK_ID}
          poster={`https://image.mux.com/${PLAYBACK_ID}/thumbnail.jpg?time=0`}
          muted
          loop
          autoPlay
          crossOrigin=""
        />

        <div className="yt-bottom">
          <MediaTimeRange className="yt-progress" />
          <MediaControlBar className="yt-controls">
            <MediaPlayButton className="yt-btn">
              <Icon slot="play" d={PLAY} />
              <Icon slot="pause" d={PAUSE} />
            </MediaPlayButton>

            <MediaChromeButton className="yt-btn" aria-label="Next">
              <Icon d={NEXT} />
            </MediaChromeButton>

            <MediaMuteButton className="yt-btn">
              <Icon slot="high" d={VOL_HIGH} />
              <Icon slot="medium" d={VOL_HIGH} />
              <Icon slot="low" d={VOL_LOW} />
              <Icon slot="off" d={VOL_MUTE} />
            </MediaMuteButton>
            <MediaVolumeRange className="yt-volume" />

            <MediaTimeDisplay className="yt-time" showDuration />

            <span className="yt-chapter">Two bros</span>

            <span className="yt-spacer" />

            <button
              type="button"
              className={`yt-autoplay ${autoplayOn ? "on" : ""}`}
              aria-label="Autoplay"
              aria-pressed={autoplayOn}
              onClick={() => setAutoplayOn((v) => !v)}
            >
              <span className="yt-autoplay-track">
                <span className="yt-autoplay-knob" />
              </span>
            </button>

            <MediaCaptionsButton className="yt-btn">
              <Icon slot="on" d={CC} />
              <Icon slot="off" d={CC} />
            </MediaCaptionsButton>

            <MediaChromeButton className="yt-btn" aria-label="Settings">
              <Icon d={SETTINGS} />
            </MediaChromeButton>

            <MediaPipButton className="yt-btn">
              <Icon slot="enter" d={MINIPLAYER} />
              <Icon slot="exit" d={MINIPLAYER} />
            </MediaPipButton>

            <MediaChromeButton className="yt-btn" aria-label="Theater mode">
              <Icon d={THEATER} />
            </MediaChromeButton>

            <MediaFullscreenButton className="yt-btn">
              <Icon slot="enter" d={FULLSCREEN_ENTER} />
              <Icon slot="exit" d={FULLSCREEN_EXIT} />
            </MediaFullscreenButton>
          </MediaControlBar>
        </div>
      </MediaController>
    </main>
  );
}
