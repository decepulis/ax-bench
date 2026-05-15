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
  Poster,
  Slider,
  Time,
  TimeSlider,
  VolumeSlider,
} from '@videojs/react';
import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  poster?: string;
  title?: string;
}

export function YouTubeSkin({ children, poster, title }: Props) {
  return (
    <Container className="yt">
      <div className="yt__stage">
        {children}
        {poster && <Poster className="yt__poster" src={poster} alt="" />}
        <BufferingIndicator
          render={(p, state) => (
            <div {...p} className="yt__spinner">
              {state.visible && <Spinner />}
            </div>
          )}
        />
        <div className="yt__gradient" aria-hidden="true" />
        <Controls.Root className="yt__controls">
          <TimeSlider.Root className="yt__progress">
            <TimeSlider.Track className="yt__progress-track">
              <TimeSlider.Buffer className="yt__progress-buffer" />
              <TimeSlider.Fill className="yt__progress-fill" />
            </TimeSlider.Track>
            <TimeSlider.Thumb className="yt__progress-thumb" />
          </TimeSlider.Root>
          <div className="yt__bar">
            <div className="yt__side">
              <PlayButton
                className="yt__btn"
                render={(props, state) => (
                  <button {...props} aria-label={state.paused ? 'Play' : 'Pause'}>
                    {state.paused ? <PlayIcon /> : <PauseIcon />}
                  </button>
                )}
              />
              <button type="button" className="yt__btn" aria-label="Next video">
                <NextIcon />
              </button>
              <div className="yt__volume">
                <MuteButton
                  className="yt__btn"
                  render={(props, state) => (
                    <button
                      {...props}
                      aria-label={state.muted ? 'Unmute' : 'Mute'}
                    >
                      {state.muted ? <VolumeMutedIcon /> : <VolumeIcon />}
                    </button>
                  )}
                />
                <VolumeSlider.Root className="yt__vol-slider" thumbAlignment="edge">
                  <VolumeSlider.Track className="yt__vol-track">
                    <Slider.Fill className="yt__vol-fill" />
                  </VolumeSlider.Track>
                  <Slider.Thumb className="yt__vol-thumb" />
                </VolumeSlider.Root>
              </div>
              <div className="yt__time">
                <Time.Value type="current" />
                <span aria-hidden="true"> / </span>
                <Time.Value type="duration" />
              </div>
              {title && <span className="yt__title">{title}</span>}
            </div>
            <div className="yt__side yt__side--right">
              <button
                type="button"
                className="yt__btn yt__btn--autoplay"
                aria-label="Autoplay is on"
              >
                <AutoplayIcon />
              </button>
              <CaptionsButton
                className="yt__btn"
                render={(props) => (
                  <button {...props} aria-label="Subtitles/closed captions">
                    <CaptionsIcon />
                  </button>
                )}
              />
              <button type="button" className="yt__btn" aria-label="Settings">
                <SettingsIcon />
              </button>
              <PiPButton
                className="yt__btn"
                render={(props) => (
                  <button {...props} aria-label="Miniplayer">
                    <MiniplayerIcon />
                  </button>
                )}
              />
              <FullscreenButton
                className="yt__btn"
                render={(props, state) => (
                  <button
                    {...props}
                    aria-label={state.fullscreen ? 'Exit full screen' : 'Full screen'}
                  >
                    {state.fullscreen ? <FullscreenExitIcon /> : <FullscreenEnterIcon />}
                  </button>
                )}
              />
            </div>
          </div>
        </Controls.Root>
      </div>
      <Gesture type="tap" action="togglePaused" pointer="mouse" region="center" />
      <Gesture type="tap" action="toggleControls" pointer="touch" />
      <Hotkey keys="Space" action="togglePaused" />
      <Hotkey keys="k" action="togglePaused" />
      <Hotkey keys="m" action="toggleMuted" />
      <Hotkey keys="f" action="toggleFullscreen" />
    </Container>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true">
      <path d="M11 9 L26 18 L11 27 Z" fill="currentColor" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true">
      <rect x="10" y="9" width="5" height="18" fill="currentColor" />
      <rect x="21" y="9" width="5" height="18" fill="currentColor" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true">
      <path d="M9 9 L22 18 L9 27 Z" fill="currentColor" />
      <rect x="23" y="9" width="3" height="18" fill="currentColor" />
    </svg>
  );
}

function VolumeIcon() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true">
      <path
        d="M8 14 L8 22 L13 22 L19 27 L19 9 L13 14 Z"
        fill="currentColor"
      />
      <path
        d="M22 13 Q26 18 22 23"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
      />
      <path
        d="M25 10 Q30 18 25 26"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
      />
    </svg>
  );
}

function VolumeMutedIcon() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true">
      <path
        d="M8 14 L8 22 L13 22 L19 27 L19 9 L13 14 Z"
        fill="currentColor"
      />
      <path
        d="M22 13 L30 23 M30 13 L22 23"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function AutoplayIcon() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true">
      <rect
        x="6"
        y="13"
        width="24"
        height="10"
        rx="5"
        fill="currentColor"
        opacity="0.55"
      />
      <circle cx="23" cy="18" r="4" fill="#fff" />
      <path d="M21.5 16 L25 18 L21.5 20 Z" fill="#0f0f0f" />
    </svg>
  );
}

function CaptionsIcon() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true">
      <rect
        x="5"
        y="10"
        width="26"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <rect x="9" y="17" width="6" height="2.2" fill="currentColor" />
      <rect x="17" y="17" width="10" height="2.2" fill="currentColor" />
    </svg>
  );
}

function SettingsIcon() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true">
      <path
        d="M18 12 a6 6 0 1 0 0.0001 0 Z M18 15 a3 3 0 1 1 -0.0001 0 Z"
        fill="currentColor"
      />
      <path
        d="M18 6 v3 M18 27 v3 M6 18 h3 M27 18 h3 M9.5 9.5 l2 2 M24.5 24.5 l2 2 M26.5 9.5 l-2 2 M11.5 24.5 l-2 2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MiniplayerIcon() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true">
      <rect
        x="5"
        y="9"
        width="26"
        height="18"
        rx="2"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
      />
      <rect x="18" y="17" width="10" height="7" rx="1" fill="currentColor" />
    </svg>
  );
}

function FullscreenEnterIcon() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true">
      <path
        d="M8 14 V8 H14 M22 8 H28 V14 M28 22 V28 H22 M14 28 H8 V22"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FullscreenExitIcon() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true">
      <path
        d="M14 8 V14 H8 M22 14 H28 V8 M28 22 H22 V28 M14 28 V22 H8"
        stroke="currentColor"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 50 50" aria-hidden="true">
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="90 60"
      />
    </svg>
  );
}
