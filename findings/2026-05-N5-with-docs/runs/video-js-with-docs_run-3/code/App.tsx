import {
  BufferingIndicator,
  CaptionsButton,
  Container,
  Controls,
  createPlayer,
  FullscreenButton,
  Gesture,
  Hotkey,
  MuteButton,
  PiPButton,
  PlayButton,
  PlaybackRateButton,
  Poster,
  TimeSlider,
  Time,
  VolumeSlider,
} from '@videojs/react';
import { videoFeatures } from '@videojs/react/video';
import { MuxVideo } from '@videojs/react/media/mux-video';

const { Provider } = createPlayer({ features: videoFeatures });

const PLAYBACK_ID = 'BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM';
const SRC = `https://stream.mux.com/${PLAYBACK_ID}.m3u8`;
const POSTER = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.jpg?time=0`;
const CHAPTER_LABEL = 'Two bros';

function PlayIcon() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true">
      <path d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z" fill="currentColor" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true">
      <path d="M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z" fill="currentColor" />
    </svg>
  );
}
function VolumeHighIcon() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true">
      <path d="M8,21 L8,15 L12,15 L17,10 L17,26 L12,21 L8,21 Z M20,11 C23,13 23,23 20,25 M22,8 C28,11 28,25 22,28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function VolumeLowIcon() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true">
      <path d="M8,21 L8,15 L12,15 L17,10 L17,26 L12,21 L8,21 Z M20,11 C23,13 23,23 20,25" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function VolumeOffIcon() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true">
      <path d="M8,21 L8,15 L12,15 L17,10 L17,26 L12,21 L8,21 Z M21,14 L28,21 M28,14 L21,21" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function CaptionsIcon() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true">
      <rect x="5" y="11" width="26" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9,16 L13,16 M9,20 L15,20 M17,16 L23,16 M17,20 L27,20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}
function SettingsIcon() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true">
      <path
        d="M18,12 a6,6 0 1 0 0,12 a6,6 0 1 0 0,-12 M18,8 v3 M18,25 v3 M11.5,10.5 l2.1,2.1 M22.4,23.4 l2.1,2.1 M8,18 h3 M25,18 h3 M11.5,25.5 l2.1,-2.1 M22.4,12.6 l2.1,-2.1"
        fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}
function MiniPlayerIcon() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true">
      <rect x="6" y="9" width="24" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <rect x="18" y="17" width="11" height="9" fill="currentColor" />
    </svg>
  );
}
function FullscreenEnterIcon() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true">
      <path d="M10,15 L10,10 L15,10 M21,10 L26,10 L26,15 M26,21 L26,26 L21,26 M15,26 L10,26 L10,21" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function FullscreenExitIcon() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true">
      <path d="M14,10 L14,15 L9,15 M22,15 L27,15 L27,10 M27,22 L22,22 L22,27 M14,27 L14,22 L9,22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function YouTubeSkin({ children }: { children: React.ReactNode }) {
  return (
    <Container className="yt-player">
      {children}
      <Poster src={POSTER} className="yt-poster" alt="" />
      <BufferingIndicator
        render={(props) => (
          <div {...props} className="yt-buffering">
            <div className="yt-spinner" />
          </div>
        )}
      />

      <Gesture type="tap" action="togglePaused" pointer="mouse" />
      <Gesture type="doubletap" action="toggleFullscreen" pointer="mouse" />

      <Controls.Root className="yt-controls">
        <div className="yt-gradient" />

        <TimeSlider.Root className="yt-progress">
          <TimeSlider.Track className="yt-progress__track">
            <TimeSlider.Buffer className="yt-progress__buffer" />
            <TimeSlider.Fill className="yt-progress__fill" />
          </TimeSlider.Track>
          <TimeSlider.Thumb className="yt-progress__thumb" />
        </TimeSlider.Root>

        <div className="yt-bottom">
          <div className="yt-bottom__left">
            <PlayButton
              className="yt-btn"
              aria-label="Play"
              render={(props, state) => (
                <button {...props}>{state.paused ? <PlayIcon /> : <PauseIcon />}</button>
              )}
            />
            <div className="yt-volume-group">
              <MuteButton
                className="yt-btn"
                aria-label="Mute"
                render={(props, state) => (
                  <button {...props}>
                    {state.muted || state.volume === 0 ? (
                      <VolumeOffIcon />
                    ) : state.volume < 0.5 ? (
                      <VolumeLowIcon />
                    ) : (
                      <VolumeHighIcon />
                    )}
                  </button>
                )}
              />
              <VolumeSlider.Root className="yt-volume">
                <VolumeSlider.Track className="yt-volume__track">
                  <VolumeSlider.Fill className="yt-volume__fill" />
                </VolumeSlider.Track>
                <VolumeSlider.Thumb className="yt-volume__thumb" />
              </VolumeSlider.Root>
            </div>
            <div className="yt-time">
              <Time.Value type="current" /> <span className="yt-time__sep">/</span>{' '}
              <Time.Value type="duration" />
            </div>
            <div className="yt-chapter">
              <span className="yt-chapter__dot">•</span> {CHAPTER_LABEL}
            </div>
          </div>

          <div className="yt-bottom__right">
            <CaptionsButton
              className="yt-btn"
              aria-label="Subtitles/closed captions"
              render={(props) => (
                <button {...props}>
                  <CaptionsIcon />
                </button>
              )}
            />
            <PlaybackRateButton
              className="yt-btn"
              aria-label="Settings"
              render={(props) => (
                <button {...props}>
                  <SettingsIcon />
                </button>
              )}
            />
            <PiPButton
              className="yt-btn"
              aria-label="Miniplayer"
              render={(props) => (
                <button {...props}>
                  <MiniPlayerIcon />
                </button>
              )}
            />
            <FullscreenButton
              className="yt-btn"
              aria-label="Fullscreen"
              render={(props, state) => (
                <button {...props}>
                  {state.fullscreen ? <FullscreenExitIcon /> : <FullscreenEnterIcon />}
                </button>
              )}
            />
          </div>
        </div>
      </Controls.Root>

      <Hotkey keys="Space" action="togglePaused" />
      <Hotkey keys="k" action="togglePaused" />
      <Hotkey keys="m" action="toggleMuted" />
      <Hotkey keys="f" action="toggleFullscreen" />
      <Hotkey keys="ArrowLeft" action="seekStep" value={-5} />
      <Hotkey keys="ArrowRight" action="seekStep" value={5} />
    </Container>
  );
}

export function App() {
  return (
    <main>
      <h1>ax-bench</h1>
      <Provider>
        <YouTubeSkin>
          <MuxVideo src={SRC} autoPlay muted loop playsInline />
        </YouTubeSkin>
      </Provider>
    </main>
  );
}
