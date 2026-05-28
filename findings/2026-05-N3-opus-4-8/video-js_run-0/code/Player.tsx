import '@videojs/react/video/skin.css';
import './player.css';
import { type ComponentProps, forwardRef, type ReactNode } from 'react';
import {
  CastEnterIcon,
  CastExitIcon,
  FullscreenEnterIcon,
  FullscreenExitIcon,
  PauseIcon,
  PlayIcon,
  RestartIcon,
  SpinnerIcon,
  VolumeHighIcon,
  VolumeLowIcon,
  VolumeOffIcon,
} from '@videojs/react/icons';
import {
  createPlayer,
  Poster,
  Container,
  BufferingIndicator,
  CaptionsButton,
  CastButton,
  Controls,
  ErrorDialog,
  FullscreenButton,
  Gesture,
  Hotkey,
  MuteButton,
  PiPButton,
  PlayButton,
  Time,
  TimeSlider,
  VolumeSlider,
} from '@videojs/react';
import { videoFeatures } from '@videojs/react/video';
import { HlsVideo } from '@videojs/react/media/hls-video';

const SEEK_TIME = 10;

export const Player = createPlayer({ features: videoFeatures });

interface VideoPlayerProps {
  src: string;
  poster?: string;
}

export function VideoPlayer({ src, poster }: VideoPlayerProps) {
  return (
    <Player.Provider>
      <Container className="media-default-skin media-default-skin--video">
        <HlsVideo src={src} playsInline muted loop autoPlay />

        {poster && <Poster src={poster} />}

        <BufferingIndicator
          render={(props) => (
            <div {...props} className="media-buffering-indicator">
              <div className="media-surface">
                <SpinnerIcon className="media-icon" />
              </div>
            </div>
          )}
        />

        <ErrorDialog.Root>
          <ErrorDialog.Popup className="media-error">
            <div className="media-error__dialog media-surface">
              <div className="media-error__content">
                <ErrorDialog.Title className="media-error__title">Something went wrong.</ErrorDialog.Title>
                <ErrorDialog.Description className="media-error__description" />
              </div>
              <div className="media-error__actions">
                <ErrorDialog.Close className="media-button media-button--primary">OK</ErrorDialog.Close>
              </div>
            </div>
          </ErrorDialog.Popup>
        </ErrorDialog.Root>

        <Controls.Root className="media-controls yt-controls">
          {/* Progress bar */}
          <TimeSlider.Root className="media-slider yt-progress">
            <TimeSlider.Track className="media-slider__track">
              <TimeSlider.Buffer className="media-slider__buffer" />
              <TimeSlider.Fill className="media-slider__fill" />
            </TimeSlider.Track>
            <TimeSlider.Thumb className="media-slider__thumb" />
          </TimeSlider.Root>

          {/* Button row */}
          <div className="yt-row">
            <div className="yt-group">
              <PlayButton className="media-button--play" render={<YtButton />}>
                <RestartIcon className="media-icon media-icon--restart" />
                <PlayIcon className="media-icon media-icon--play" />
                <PauseIcon className="media-icon media-icon--pause" />
              </PlayButton>

              <div className="yt-volume">
                <MuteButton className="media-button--mute" render={<YtButton />}>
                  <VolumeOffIcon className="media-icon media-icon--volume-off" />
                  <VolumeLowIcon className="media-icon media-icon--volume-low" />
                  <VolumeHighIcon className="media-icon media-icon--volume-high" />
                </MuteButton>
                <VolumeSlider.Root className="media-slider yt-volume__slider" orientation="horizontal">
                  <VolumeSlider.Track className="media-slider__track">
                    <VolumeSlider.Fill className="media-slider__fill" />
                  </VolumeSlider.Track>
                  <VolumeSlider.Thumb className="media-slider__thumb media-slider__thumb--persistent" />
                </VolumeSlider.Root>
              </div>

              <div className="yt-time">
                <Time.Value type="current" className="media-time" />
                <span className="yt-time__sep">/</span>
                <Time.Value type="duration" className="media-time" />
              </div>

              <button type="button" className="yt-chapter">
                Two bros
                <ChevronRightIcon />
              </button>
            </div>

            <div className="yt-group">
              <button type="button" className="yt-btn yt-autoplay" aria-label="Autoplay is on">
                <span className="yt-autoplay__track">
                  <span className="yt-autoplay__knob" />
                </span>
              </button>

              <CaptionsButton className="media-button--captions" render={<YtButton />}>
                <CcIcon variant="off" />
                <CcIcon variant="on" />
              </CaptionsButton>

              <button type="button" className="yt-btn" aria-label="Settings">
                <GearIcon />
              </button>

              <PiPButton className="media-button--pip" render={<YtButton />}>
                <MiniplayerIcon variant="enter" />
                <MiniplayerIcon variant="exit" />
              </PiPButton>

              <CastButton className="media-button--cast" render={<YtButton />}>
                <CastEnterIcon className="media-icon media-icon--cast-enter" />
                <CastExitIcon className="media-icon media-icon--cast-exit" />
              </CastButton>

              <FullscreenButton className="media-button--fullscreen" render={<YtButton />}>
                <FullscreenEnterIcon className="media-icon media-icon--fullscreen-enter" />
                <FullscreenExitIcon className="media-icon media-icon--fullscreen-exit" />
              </FullscreenButton>
            </div>
          </div>
        </Controls.Root>

        <div className="media-overlay" />

        {/* Hotkeys */}
        <Hotkey keys="Space" action="togglePaused" />
        <Hotkey keys="k" action="togglePaused" />
        <Hotkey keys="m" action="toggleMuted" />
        <Hotkey keys="f" action="toggleFullscreen" />
        <Hotkey keys="ArrowRight" action="seekStep" value={SEEK_TIME / 2} />
        <Hotkey keys="ArrowLeft" action="seekStep" value={-(SEEK_TIME / 2)} />
        <Hotkey keys="ArrowUp" action="volumeStep" value={0.05} />
        <Hotkey keys="ArrowDown" action="volumeStep" value={-0.05} />

        {/* Gestures */}
        <Gesture type="tap" action="togglePaused" pointer="mouse" region="center" />
        <Gesture type="tap" action="toggleControls" pointer="touch" />
        <Gesture type="doubletap" action="seekStep" value={-SEEK_TIME} region="left" />
        <Gesture type="doubletap" action="toggleFullscreen" region="center" />
        <Gesture type="doubletap" action="seekStep" value={SEEK_TIME} region="right" />
      </Container>
    </Player.Provider>
  );
}

const YtButton = forwardRef<HTMLButtonElement, ComponentProps<'button'>>(function YtButton(
  { className, ...props },
  ref,
) {
  return <button ref={ref} type="button" className={`yt-btn ${className ?? ''}`} {...props} />;
});

function ChevronRightIcon(): ReactNode {
  return (
    <svg
      className="yt-chevron"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="9 6 15 12 9 18" />
    </svg>
  );
}

function GearIcon(): ReactNode {
  return (
    <svg className="media-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1a7.3 7.3 0 0 0-1.69-.98l-.38-2.65A.49.49 0 0 0 14 2h-4a.49.49 0 0 0-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1a.5.5 0 0 0-.61.22l-2 3.46a.5.5 0 0 0 .12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65a.5.5 0 0 0-.12.64l2 3.46c.14.24.43.34.68.22l2.49-1c.52.39 1.08.73 1.69.98l.38 2.65c.05.24.25.42.49.42h4c.24 0 .45-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.25.12.54.02.68-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.65zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z" />
    </svg>
  );
}

function MiniplayerIcon({ variant }: { variant: 'enter' | 'exit' }): ReactNode {
  return (
    <svg
      className={`media-icon media-icon--pip-${variant}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <rect x="12" y="11" width="7" height="6" rx="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function CcIcon({ variant }: { variant: 'off' | 'on' }): ReactNode {
  return (
    <svg
      className={`media-icon media-icon--captions-${variant}`}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19 4H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 7H9.5v-.5h-2v3h2V13H11v1c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1zm7 0h-1.5v-.5h-2v3h2V13H18v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1z" />
    </svg>
  );
}
