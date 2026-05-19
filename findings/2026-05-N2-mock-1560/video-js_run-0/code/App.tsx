import {
  createPlayer,
  videoFeatures,
  PlayButton,
  MuteButton,
  FullscreenButton,
  PiPButton,
  CaptionsButton,
  PlaybackRateButton,
  Controls,
  TimeSlider,
  Time,
} from '@videojs/react';
import { HlsVideo } from '@videojs/react/media/hls-video';
import './Player.css';

const Player = createPlayer({ features: videoFeatures });

const PLAYBACK_ID = 'BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM';
const SRC = `https://stream.mux.com/${PLAYBACK_ID}.m3u8`;
const POSTER = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.jpg?time=0`;

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden className="vjs-icon-play">
    <path d="M8 5v14l11-7z" />
  </svg>
);
const PauseIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden className="vjs-icon-pause">
    <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
  </svg>
);
const VolumeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden className="vjs-icon-volume">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4z" />
  </svg>
);
const MuteIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden className="vjs-icon-mute">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.59 3L19 9.41 17.59 8 15 10.59 12.41 8 11 9.41 13.59 12 11 14.59 12.41 16 15 13.41 17.59 16 19 14.59 16.59 12z" />
  </svg>
);
const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden>
    <path d="M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
  </svg>
);
const CcOnIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden className="vjs-icon-cc-on">
    <path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 7H9.5v-.5h-2v3h2V13H11v1c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1zm7 0h-1.5v-.5h-2v3h2V13H18v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1z" />
  </svg>
);
const CcOffIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden className="vjs-icon-cc-off">
    <path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H5V6h14v12zM7 15h3c.55 0 1-.45 1-1v-1H9.5v.5h-2v-3h2v.5H11v-1c0-.55-.45-1-1-1H7c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1zm7 0h3c.55 0 1-.45 1-1v-1h-1.5v.5h-2v-3h2v.5H18v-1c0-.55-.45-1-1-1h-3c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1z" />
  </svg>
);
const MiniplayerIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden>
    <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16.01H3V4.98h18v14.03zm-10-7h9v6h-9z" />
  </svg>
);
const PipEnterIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden className="vjs-icon-pip-enter">
    <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16.01H3V4.98h18v14.03zm-10-7h9v6h-9z" />
  </svg>
);
const PipExitIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden className="vjs-icon-pip-exit">
    <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16.01H3V4.98h18v14.03zM10 9h7v5h-7z" />
  </svg>
);
const FsEnterIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden className="vjs-icon-fs-enter">
    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zm-3-12v2h3v3h2V5h-5z" />
  </svg>
);
const FsExitIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden className="vjs-icon-fs-exit">
    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
  </svg>
);

export function App() {
  return (
    <main>
      <h1>ax-bench</h1>
      <Player.Provider>
        <Player.Container className="vjs-player">
          <HlsVideo
            src={SRC}
            poster={POSTER}
            autoPlay
            muted
            loop
            playsInline
          />
          <div className="vjs-watermark">MUX</div>
          <Controls.Root className="vjs-controls">
            <TimeSlider.Root className="vjs-time-slider">
              <TimeSlider.Track className="vjs-slider-track">
                <TimeSlider.Buffer className="vjs-slider-buffer" />
                <TimeSlider.Fill className="vjs-slider-fill" />
              </TimeSlider.Track>
              <TimeSlider.Thumb className="vjs-slider-thumb" />
            </TimeSlider.Root>
            <div className="vjs-button-row">
              <PlayButton className="vjs-icon-btn">
                <PlayIcon />
                <PauseIcon />
              </PlayButton>
              <MuteButton className="vjs-icon-btn">
                <VolumeIcon />
                <MuteIcon />
              </MuteButton>
              <div className="vjs-time">
                <Time.Value type="current" />
                <span aria-hidden> / </span>
                <Time.Value type="duration" />
              </div>
              <div className="vjs-title">Two bros</div>
              <div className="vjs-right">
                <PlaybackRateButton
                  className="vjs-icon-btn"
                  aria-label="Settings"
                >
                  <SettingsIcon />
                </PlaybackRateButton>
                <CaptionsButton className="vjs-icon-btn vjs-icon-btn--cc">
                  <CcOnIcon />
                  <CcOffIcon />
                </CaptionsButton>
                <PiPButton
                  className="vjs-icon-btn"
                  aria-label="Miniplayer"
                >
                  <PipEnterIcon />
                  <PipExitIcon />
                </PiPButton>
                <FullscreenButton className="vjs-icon-btn">
                  <FsEnterIcon />
                  <FsExitIcon />
                </FullscreenButton>
              </div>
            </div>
          </Controls.Root>
        </Player.Container>
      </Player.Provider>
    </main>
  );
}
