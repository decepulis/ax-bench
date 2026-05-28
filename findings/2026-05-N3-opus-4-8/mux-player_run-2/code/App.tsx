import { useState } from "react";
import {
  MediaController,
  MediaPlayButton,
  MediaMuteButton,
  MediaVolumeRange,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaPipButton,
  MediaFullscreenButton,
  MediaPosterImage,
} from "media-chrome/react";
import MuxVideo from "@mux/mux-video-react";
import "./youtube-player.css";

const PLAYBACK_ID = "BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM";

function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
    </svg>
  );
}

function CaptionsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 12h4v2H4v-2zm10 6H4v-2h10v2zm6 0h-4v-2h4v2zm0-4H10v-2h10v2z" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.488.488 0 0 0 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
    </svg>
  );
}

function TheaterIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z" />
    </svg>
  );
}

function PlayGlyph() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export function App() {
  const [autoplay, setAutoplay] = useState(true);

  return (
    <main>
      <h1>ax-bench</h1>
      <MediaController className="yt-player">
        <MuxVideo
          slot="media"
          playbackId={PLAYBACK_ID}
          streamType="on-demand"
          muted
          loop
          autoPlay
          playsInline
          crossOrigin=""
        />
        <MediaPosterImage
          slot="poster"
          src={`https://image.mux.com/${PLAYBACK_ID}/thumbnail.webp?time=0`}
        />

        <div className="yt-controls" role="group">
          <MediaTimeRange className="yt-scrubber" />
          <div className="yt-row">
            <div className="yt-left">
              <MediaPlayButton />
              <button className="yt-btn" type="button" aria-label="Next">
                <NextIcon />
              </button>
              <div className="yt-volume">
                <MediaMuteButton />
                <MediaVolumeRange />
              </div>
              <MediaTimeDisplay showDuration />
              <span className="yt-title">Two bros</span>
            </div>

            <div className="yt-spacer" />

            <div className="yt-right">
              <button
                className="yt-toggle"
                type="button"
                role="switch"
                aria-checked={autoplay}
                aria-label="Autoplay"
                onClick={() => setAutoplay((v) => !v)}
              >
                <span className="yt-knob">
                  <PlayGlyph />
                </span>
              </button>
              <button className="yt-btn" type="button" aria-label="Subtitles/closed captions">
                <CaptionsIcon />
              </button>
              <button className="yt-btn" type="button" aria-label="Settings">
                <SettingsIcon />
              </button>
              <MediaPipButton />
              <button className="yt-btn" type="button" aria-label="Theater mode">
                <TheaterIcon />
              </button>
              <MediaFullscreenButton />
            </div>
          </div>
        </div>
      </MediaController>
    </main>
  );
}
