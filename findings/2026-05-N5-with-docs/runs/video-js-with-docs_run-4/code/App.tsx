import {
  BufferingIndicator,
  CaptionsButton,
  Container,
  Controls,
  FullscreenButton,
  Gesture,
  Hotkey,
  MuteButton,
  PiPButton,
  PlayButton,
  PlaybackRateButton,
  Poster,
  Time,
  TimeSlider,
  createPlayer,
} from "@videojs/react";
import { videoFeatures } from "@videojs/react/video";
import { HlsVideo } from "@videojs/react/media/hls-video";

const { Provider } = createPlayer({ features: videoFeatures });

const PLAYBACK_ID = "BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM";
const STREAM_URL = `https://stream.mux.com/${PLAYBACK_ID}.m3u8`;
const POSTER_URL = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.png?time=0`;

function Icon({ d, className }: { d: string; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

const PlayPath = "M8 5v14l11-7z";
const PausePath = "M6 4h4v16H6zM14 4h4v16h-4z";
const RestartPath =
  "M12 5V1L7 6l5 5V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z";
const VolOnPath =
  "M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z";
const VolOffPath =
  "M16.5 12A4.5 4.5 0 0 0 14 8v2.2l2.5 2.5v-.7zM19 12a7 7 0 0 1-1.1 3.8l1.5 1.5A9 9 0 0 0 21 12a9 9 0 0 0-6-8.5v2.1A7 7 0 0 1 19 12zM4.3 3 3 4.3 7.7 9H3v6h4l5 5v-6.7l4.2 4.2a7 7 0 0 1-2.2 1.2v2.1a9 9 0 0 0 3.7-1.8l2 2 1.4-1.3-9-9L4.3 3zM12 4 9.9 6.1 12 8.2V4z";
const PipPath =
  "M19 11h-8v6h8v-6zm2-7H3a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 14H3V6h18v12z";
const FsEnterPath =
  "M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z";
const FsExitPath =
  "M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z";
const SharePath =
  "M18 16.1a3 3 0 0 0-2.2 1l-7.1-4.1 .1-1-.1-1 7-4.1A3 3 0 1 0 15 5v.5l-.1.5-7 4.1a3 3 0 1 0 0 3.8l7.1 4.1c0 .3-.1.6-.1 1a3 3 0 1 0 3-3z";

export function App() {
  return (
    <main>
      <h1>ax-bench</h1>
      <Provider>
        <Container className="yt-player">
          <HlsVideo
            src={STREAM_URL}
            autoPlay
            muted
            loop
            playsInline
            className="yt-video"
          />

          <Poster src={POSTER_URL} alt="" className="yt-poster" />

          <BufferingIndicator
            render={(props) => (
              <div {...props} className="yt-buffering">
                <div className="yt-spinner" />
              </div>
            )}
          />

          <div className="yt-bottom">
            <TimeSlider.Root className="yt-progress">
              <TimeSlider.Track className="yt-progress-track">
                <TimeSlider.Buffer className="yt-progress-buffer" />
                <TimeSlider.Fill className="yt-progress-fill" />
              </TimeSlider.Track>
              <TimeSlider.Thumb className="yt-progress-thumb" />
            </TimeSlider.Root>

            <Controls.Root className="yt-controls">
              <div className="yt-group yt-left">
                <PlayButton className="yt-btn yt-btn-play">
                  <Icon d={PlayPath} className="yt-icon yt-icon-play" />
                  <Icon d={PausePath} className="yt-icon yt-icon-pause" />
                  <Icon d={RestartPath} className="yt-icon yt-icon-restart" />
                </PlayButton>

                <MuteButton className="yt-btn yt-btn-mute">
                  <Icon d={VolOnPath} className="yt-icon yt-icon-vol-on" />
                  <Icon d={VolOffPath} className="yt-icon yt-icon-vol-off" />
                </MuteButton>

                <div className="yt-time">
                  <Time.Value type="current" />
                  <span className="yt-time-sep">/</span>
                  <Time.Value type="duration" />
                </div>

                <span className="yt-title">Two bros</span>
              </div>

              <div className="yt-group yt-right">
                <button
                  type="button"
                  className="yt-btn"
                  aria-label="Share"
                  onClick={() => console.log("shared")}
                >
                  <Icon d={SharePath} className="yt-icon" />
                </button>

                <PlaybackRateButton
                  className="yt-btn yt-btn-rate"
                  aria-label="Playback speed"
                />

                <CaptionsButton
                  className="yt-btn yt-btn-cc"
                  aria-label="Captions"
                >
                  <span className="yt-cc-text">CC</span>
                </CaptionsButton>

                <PiPButton className="yt-btn yt-btn-pip">
                  <Icon d={PipPath} className="yt-icon" />
                </PiPButton>

                <FullscreenButton className="yt-btn yt-btn-fs">
                  <Icon d={FsEnterPath} className="yt-icon yt-icon-fs-enter" />
                  <Icon d={FsExitPath} className="yt-icon yt-icon-fs-exit" />
                </FullscreenButton>
              </div>
            </Controls.Root>
          </div>

          <Hotkey keys="Space" action="togglePaused" />
          <Hotkey keys="k" action="togglePaused" />
          <Hotkey keys="m" action="toggleMuted" />
          <Hotkey keys="f" action="toggleFullscreen" />
          <Hotkey keys="ArrowRight" action="seekStep" value={5} />
          <Hotkey keys="ArrowLeft" action="seekStep" value={-5} />
          <Gesture
            type="tap"
            action="togglePaused"
            pointer="mouse"
            region="center"
          />
          <Gesture type="tap" action="toggleControls" pointer="touch" />
        </Container>
      </Provider>
    </main>
  );
}
