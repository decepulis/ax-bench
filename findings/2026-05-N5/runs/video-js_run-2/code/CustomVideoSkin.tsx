import type { ReactNode } from 'react';
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
} from '@videojs/react';

type CustomVideoSkinProps = {
  children: ReactNode;
  poster?: string;
  title?: string;
};

export function CustomVideoSkin({ children, poster, title }: CustomVideoSkinProps) {
  return (
    <Container className="yt-skin">
      {children}

      {poster && <Poster src={poster} className="yt-poster" />}

      <BufferingIndicator
        render={(props) => (
          <div {...props} className="yt-buffering">
            <SpinnerIcon />
          </div>
        )}
      />

      <Controls.Root className="yt-controls">
        <TimeSlider.Root className="yt-progress">
          <Slider.Track className="yt-progress__track">
            <Slider.Buffer className="yt-progress__buffer" />
            <Slider.Fill className="yt-progress__fill" />
          </Slider.Track>
          <Slider.Thumb className="yt-progress__thumb" />
        </TimeSlider.Root>

        <div className="yt-bar">
          <div className="yt-bar__left">
            <PlayButton
              className="yt-btn yt-btn--play"
              render={<button type="button" aria-label="Play" />}
            >
              <PlayIcon className="yt-icon yt-icon--play" />
              <PauseIcon className="yt-icon yt-icon--pause" />
            </PlayButton>

            <MuteButton
              className="yt-btn yt-btn--mute"
              render={<button type="button" aria-label="Mute" />}
            >
              <VolumeHighIcon className="yt-icon yt-icon--volume-high" />
              <VolumeLowIcon className="yt-icon yt-icon--volume-low" />
              <VolumeOffIcon className="yt-icon yt-icon--volume-off" />
            </MuteButton>

            <span className="yt-time">
              <Time.Value type="current" /> / <Time.Value type="duration" />
            </span>

            {title && <span className="yt-title">{title}</span>}
          </div>

          <div className="yt-bar__right">
            <CaptionsButton
              className="yt-btn yt-btn--captions"
              render={<button type="button" aria-label="Subtitles" />}
            >
              <CCIcon className="yt-icon yt-icon--captions-off" />
              <CCIcon className="yt-icon yt-icon--captions-on" />
            </CaptionsButton>

            <button
              type="button"
              className="yt-btn yt-btn--settings yt-btn--no-state"
              aria-label="Settings"
            >
              <SettingsIcon className="yt-icon" />
            </button>

            <PiPButton
              className="yt-btn yt-btn--pip"
              render={<button type="button" aria-label="Miniplayer" />}
            >
              <PipIcon className="yt-icon yt-icon--pip-enter" />
              <PipIcon className="yt-icon yt-icon--pip-exit" />
            </PiPButton>

            <FullscreenButton
              className="yt-btn yt-btn--fullscreen"
              render={<button type="button" aria-label="Fullscreen" />}
            >
              <FullscreenEnterIcon className="yt-icon yt-icon--fullscreen-enter" />
              <FullscreenExitIcon className="yt-icon yt-icon--fullscreen-exit" />
            </FullscreenButton>
          </div>
        </div>
      </Controls.Root>

      <Hotkey keys="Space" action="togglePaused" />
      <Hotkey keys="k" action="togglePaused" />
      <Hotkey keys="m" action="toggleMuted" />
      <Hotkey keys="f" action="toggleFullscreen" />
      <Hotkey keys="i" action="togglePictureInPicture" />
      <Hotkey keys="c" action="toggleSubtitles" />
      <Hotkey keys="ArrowRight" action="seekStep" value={5} />
      <Hotkey keys="ArrowLeft" action="seekStep" value={-5} />
      <Hotkey keys="ArrowUp" action="volumeStep" value={0.05} />
      <Hotkey keys="ArrowDown" action="volumeStep" value={-0.05} />
      <Gesture type="tap" action="togglePaused" pointer="mouse" region="center" />
      <Gesture type="tap" action="toggleControls" pointer="touch" />
      <Gesture type="doubletap" action="toggleFullscreen" region="center" />
    </Container>
  );
}

type IconProps = { className?: string };

function PlayIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function PauseIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
    </svg>
  );
}

function VolumeHighIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
    </svg>
  );
}

function VolumeLowIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 9v6h4l5 5V4l-5 5H7zm9.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
    </svg>
  );
}

function VolumeOffIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.17v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z" />
    </svg>
  );
}

function CCIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.89-2-2-2zm-8 7H9.5v-.5h-2v3h2V13H11v1c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1zm7 0h-1.5v-.5h-2v3h2V13H18v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1z" />
    </svg>
  );
}

function SettingsIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.5.5 0 0 0 .12-.61l-1.92-3.32a.5.5 0 0 0-.59-.22l-2.39.96a7.05 7.05 0 0 0-1.62-.94l-.36-2.54A.5.5 0 0 0 13.92 2h-3.84a.5.5 0 0 0-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.5.5 0 0 0-.59.22L2.74 8.47a.5.5 0 0 0 .12.61l2.03 1.58c-.05.3-.09.62-.09.94 0 .32.02.64.07.94l-2.03 1.58a.5.5 0 0 0-.12.61l1.92 3.32a.5.5 0 0 0 .59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54a.5.5 0 0 0 .48.41h3.84a.5.5 0 0 0 .47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96a.5.5 0 0 0 .59-.22l1.92-3.32a.5.5 0 0 0-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z" />
    </svg>
  );
}

function PipIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z" />
    </svg>
  );
}

function FullscreenEnterIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
    </svg>
  );
}

function FullscreenExitIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg className="yt-spinner" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="40 20" />
    </svg>
  );
}
