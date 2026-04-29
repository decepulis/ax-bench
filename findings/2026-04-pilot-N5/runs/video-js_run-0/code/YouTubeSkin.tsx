import type { ReactNode, SVGProps } from 'react';
import {
  BufferingIndicator,
  CaptionsButton,
  Container,
  Controls,
  FullscreenButton,
  Gesture,
  Hotkey,
  MuteButton,
  PlayButton,
  Poster,
  TimeSlider,
  Time,
} from '@videojs/react';

interface YouTubeSkinProps {
  children: ReactNode;
  poster?: string;
  title?: string;
  onShare?: () => void;
}

export function YouTubeSkin({
  children,
  poster,
  title,
  onShare,
}: YouTubeSkinProps) {
  return (
    <Container className="yt-skin">
      {children}
      {poster && <Poster src={poster} className="yt-poster" />}

      <BufferingIndicator
        render={(props) => (
          <div {...props} className="yt-buffering">
            <div className="yt-spinner" aria-hidden="true" />
          </div>
        )}
      />

      <div className="yt-watermark" aria-hidden="true">
        MUX
      </div>

      <Controls.Root className="yt-controls">
        <TimeSlider.Root className="yt-progress">
          <TimeSlider.Track className="yt-progress__track">
            <TimeSlider.Buffer className="yt-progress__buffer" />
            <TimeSlider.Fill className="yt-progress__fill" />
          </TimeSlider.Track>
          <TimeSlider.Thumb className="yt-progress__thumb" />
        </TimeSlider.Root>

        <div className="yt-bar">
          <div className="yt-bar__left">
            <PlayButton className="yt-btn yt-btn--play" aria-label="Play">
              <PlayIcon className="yt-icon yt-icon--play" />
              <PauseIcon className="yt-icon yt-icon--pause" />
              <RestartIcon className="yt-icon yt-icon--restart" />
            </PlayButton>
            <MuteButton className="yt-btn yt-btn--mute" aria-label="Mute">
              <VolumeHighIcon className="yt-icon yt-icon--volume-high" />
              <VolumeLowIcon className="yt-icon yt-icon--volume-low" />
              <VolumeOffIcon className="yt-icon yt-icon--volume-off" />
            </MuteButton>
            <span className="yt-time">
              <Time.Value type="current" /> /{' '}
              <Time.Value type="duration" />
            </span>
            {title && <span className="yt-title">{title}</span>}
          </div>

          <div className="yt-bar__right">
            <button type="button" className="yt-btn" aria-label="Settings">
              <SettingsIcon className="yt-icon" />
            </button>
            <CaptionsButton
              className="yt-btn yt-btn--captions"
              aria-label="Subtitles/closed captions"
            >
              <CaptionsIcon className="yt-icon yt-icon--captions-off" />
              <CaptionsIcon className="yt-icon yt-icon--captions-on" />
            </CaptionsButton>
            <button
              type="button"
              className="yt-btn"
              aria-label="Share"
              onClick={onShare}
            >
              <ShareIcon className="yt-icon" />
            </button>
            <FullscreenButton
              className="yt-btn yt-btn--fullscreen"
              aria-label="Fullscreen"
            >
              <FullscreenEnterIcon className="yt-icon yt-icon--fullscreen-enter" />
              <FullscreenExitIcon className="yt-icon yt-icon--fullscreen-exit" />
            </FullscreenButton>
          </div>
        </div>
      </Controls.Root>

      <Gesture
        type="tap"
        action="togglePaused"
        pointer="mouse"
        region="center"
      />
      <Gesture type="doubletap" action="toggleFullscreen" region="center" />

      <Hotkey keys="Space" action="togglePaused" />
      <Hotkey keys="k" action="togglePaused" />
      <Hotkey keys="m" action="toggleMuted" />
      <Hotkey keys="f" action="toggleFullscreen" />
      <Hotkey keys="ArrowLeft" action="seekStep" value={-5} />
      <Hotkey keys="ArrowRight" action="seekStep" value={5} />
    </Container>
  );
}

type IconProps = SVGProps<SVGSVGElement>;

function PlayIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 36 36" {...props}>
      <path fill="currentColor" d="M11 9v18l15-9z" />
    </svg>
  );
}

function PauseIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 36 36" {...props}>
      <path fill="currentColor" d="M11 9h4v18h-4zm10 0h4v18h-4z" />
    </svg>
  );
}

function RestartIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 36 36" {...props}>
      <path
        fill="currentColor"
        d="M18 8a10 10 0 1 0 9.49 13H25.3A8 8 0 1 1 18 10v3l5-4-5-4z"
      />
    </svg>
  );
}

function VolumeHighIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 36 36" {...props}>
      <path
        fill="currentColor"
        d="M8 14v8h5l7 5V9l-7 5zm14.5 4a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4M20 5.7v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6"
      />
    </svg>
  );
}

function VolumeLowIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 36 36" {...props}>
      <path
        fill="currentColor"
        d="M8 14v8h5l7 5V9l-7 5zm14.5 4a4.5 4.5 0 0 0-2.5-4v8a4.5 4.5 0 0 0 2.5-4"
      />
    </svg>
  );
}

function VolumeOffIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 36 36" {...props}>
      <path
        fill="currentColor"
        d="M8 14v8h5l7 5V9l-7 5zm19.07-3.07-1.41 1.41L28.59 15l-2.93 2.93 1.41 1.41L30 16.41l2.93 2.93 1.41-1.41L31.41 15l2.93-2.93-1.41-1.41L30 13.59z"
      />
    </svg>
  );
}

function CaptionsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 36 36" {...props}>
      <path
        fill="currentColor"
        d="M30 9H6a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h24a3 3 0 0 0 3-3V12a3 3 0 0 0-3-3M11 21h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2v1.5H9v3h2zm10 0h-2a2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2h2v1.5h-2v3h2z"
      />
    </svg>
  );
}

function SettingsIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 36 36" {...props}>
      <path
        fill="currentColor"
        d="M28.6 19.4 31 17.6l-3-5.2-2.8 1.1a8 8 0 0 0-2.4-1.4L22.4 9h-6l-.4 3.1a8 8 0 0 0-2.4 1.4L10.8 12.4l-3 5.2L10.2 19.4a8 8 0 0 0 0 2.8L7.8 24l3 5.2 2.8-1.1a8 8 0 0 0 2.4 1.4l.4 3.1h6l.4-3.1a8 8 0 0 0 2.4-1.4l2.8 1.1 3-5.2-2.4-1.8a8 8 0 0 0 0-2.8M19.4 24a4 4 0 1 1 0-8 4 4 0 0 1 0 8"
      />
    </svg>
  );
}

function ShareIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 36 36" {...props}>
      <path
        fill="currentColor"
        d="m24 22.5-7.6-4.4q-.4 1.4-1.5 2.3l8 4.7q1-1.7 1.1-2.6m-.6-9.1-7.7 4.5q1 .9 1.4 2.2l7.7-4.5q-.6-1-1.4-2.2M27 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6m-15 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6m15 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6"
      />
    </svg>
  );
}

function FullscreenEnterIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 36 36" {...props}>
      <path
        fill="currentColor"
        d="M10 16h2v-4h4v-2h-6zm0 4v6h6v-2h-4v-4zm12-10v2h4v4h2v-6zm4 14h-4v2h6v-6h-2z"
      />
    </svg>
  );
}

function FullscreenExitIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 36 36" {...props}>
      <path
        fill="currentColor"
        d="M14 14h-4v2h6v-6h-2zm0 8h-4v2h4v4h2v-6zm10 4h2v-4h4v-2h-6zm2-12v-4h-2v6h6v-2z"
      />
    </svg>
  );
}
