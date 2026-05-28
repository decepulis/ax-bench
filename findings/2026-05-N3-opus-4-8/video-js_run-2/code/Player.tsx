'use client';

import '@videojs/react/video/skin.css';
import './player.css';
import { type ComponentProps, forwardRef, type ReactNode, useRef, useState } from 'react';
import {
  CaptionsOffIcon,
  CaptionsOnIcon,
  CheckIcon,
  ChevronIcon,
  FullscreenEnterIcon,
  FullscreenExitIcon,
  PauseIcon,
  PipEnterIcon,
  PipExitIcon,
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
  Controls,
  ErrorDialog,
  FullscreenButton,
  Gesture,
  Hotkey,
  Menu,
  MuteButton,
  PiPButton,
  PlayButton,
  PlaybackRateMenu,
  usePlaybackRateMenu,
  SeekIndicator,
  Slider,
  StatusAnnouncer,
  StatusIndicator,
  Time,
  TimeSlider,
  VolumeIndicator,
  VolumeSlider,
} from '@videojs/react';
import { videoFeatures } from '@videojs/react/video';
import { HlsVideo } from '@videojs/react/media/hls-video';

const TOP_STATUS_ACTIONS = ['toggleSubtitles', 'toggleFullscreen', 'togglePictureInPicture'] as const;
const CENTER_STATUS_ACTIONS = ['togglePaused'] as const;

const PLAYBACK_ID = 'BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM';
const POSTER_URL = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.jpg?time=0`;
const SEEK_TIME = 10;

export const Player = createPlayer({ features: videoFeatures });

interface VideoPlayerProps {
  src: string;
}

export function VideoPlayer({ src }: VideoPlayerProps): ReactNode {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [autoplayOn, setAutoplayOn] = useState(true);
  const [theater, setTheater] = useState(false);

  const restart = () => {
    const v = videoRef.current;
    if (v) {
      v.currentTime = 0;
      void v.play();
    }
  };

  return (
    <Player.Provider>
      <Container className={`media-default-skin media-default-skin--video yt-skin${theater ? ' yt-skin--theater' : ''}`}>
        <HlsVideo ref={videoRef} src={src} playsInline muted loop autoPlay />

        <Poster src={POSTER_URL} />

        <BufferingIndicator
          render={(props) => (
            <div {...props} className="media-buffering-indicator">
              <SpinnerIcon className="media-icon" />
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
          {/* Progress / scrubber */}
          <div className="yt-progress">
            <TimeSlider.Root className="yt-slider">
              <TimeSlider.Track className="yt-slider__track">
                <TimeSlider.Buffer className="yt-slider__buffer" />
                <TimeSlider.Fill className="yt-slider__fill" />
              </TimeSlider.Track>
              <TimeSlider.Thumb className="yt-slider__thumb" />

              <div className="media-surface media-preview yt-preview">
                <Slider.Thumbnail className="media-preview__thumbnail" />
                <TimeSlider.Value type="pointer" className="media-time media-preview__time" />
              </div>
            </TimeSlider.Root>
          </div>

          {/* Button bar */}
          <div className="yt-bar">
            <div className="yt-bar__side">
              <PlayButton className="media-button--play" render={<Button title="Play (k)" />}>
                <RestartIcon className="media-icon media-icon--restart" />
                <PlayIcon className="media-icon media-icon--play" />
                <PauseIcon className="media-icon media-icon--pause" />
              </PlayButton>

              <Button className="yt-btn" title="Next" aria-label="Next" onClick={restart}>
                <NextIcon className="media-icon" />
              </Button>

              <div className="yt-volume">
                <MuteButton className="media-button--mute" render={<Button title="Mute (m)" />}>
                  <VolumeOffIcon className="media-icon media-icon--volume-off" />
                  <VolumeLowIcon className="media-icon media-icon--volume-low" />
                  <VolumeHighIcon className="media-icon media-icon--volume-high" />
                </MuteButton>
                <VolumeSlider.Root className="yt-volume__slider" orientation="horizontal">
                  <VolumeSlider.Track className="yt-volume__track">
                    <VolumeSlider.Fill className="yt-volume__fill" />
                  </VolumeSlider.Track>
                  <VolumeSlider.Thumb className="yt-volume__thumb" />
                </VolumeSlider.Root>
              </div>

              <div className="yt-time">
                <Time.Value type="current" className="yt-time__value" />
                <span className="yt-time__sep">/</span>
                <Time.Value type="duration" className="yt-time__value" />
              </div>
            </div>

            <div className="yt-bar__side">
              <button
                type="button"
                className={`yt-autoplay${autoplayOn ? ' yt-autoplay--on' : ''}`}
                role="switch"
                aria-checked={autoplayOn}
                aria-label="Autoplay"
                title="Autoplay is on"
                onClick={() => setAutoplayOn((v) => !v)}
              >
                <span className="yt-autoplay__track">
                  <span className="yt-autoplay__knob" />
                </span>
              </button>

              <CaptionsButton className="media-button--captions yt-btn--cc" render={<Button title="Subtitles (c)" />}>
                <CaptionsOffIcon className="media-icon media-icon--captions-off" />
                <CaptionsOnIcon className="media-icon media-icon--captions-on" />
              </CaptionsButton>

              <PlaybackRateMenu.Root side="top" align="end">
                <PlaybackRateMenu.Trigger className="yt-btn" render={<Button title="Settings" aria-label="Settings" />}>
                  <SettingsIcon className="media-icon yt-icon--settings" />
                </PlaybackRateMenu.Trigger>
                <PlaybackRateMenu.Content className="media-surface media-popover media-menu media-menu--playback-rate">
                  <PlaybackRateMenuItems />
                </PlaybackRateMenu.Content>
              </PlaybackRateMenu.Root>

              <PiPButton className="media-button--pip" render={<Button title="Miniplayer (i)" />}>
                <MiniplayerIcon className="media-icon media-icon--pip-enter" />
                <PipExitIcon className="media-icon media-icon--pip-exit" />
              </PiPButton>

              <Button
                className={`yt-btn${theater ? ' yt-btn--active' : ''}`}
                title="Theater mode (t)"
                aria-label="Theater mode"
                onClick={() => setTheater((v) => !v)}
              >
                <TheaterIcon className="media-icon" />
              </Button>

              <FullscreenButton className="media-button--fullscreen" render={<Button title="Fullscreen (f)" />}>
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
        <Hotkey keys="c" action="toggleSubtitles" />
        <Hotkey keys="i" action="togglePictureInPicture" />
        <Hotkey keys="ArrowRight" action="seekStep" value={SEEK_TIME / 2} />
        <Hotkey keys="ArrowLeft" action="seekStep" value={-(SEEK_TIME / 2)} />
        <Hotkey keys="ArrowUp" action="volumeStep" value={0.05} />
        <Hotkey keys="ArrowDown" action="volumeStep" value={-0.05} />
        <Hotkey keys="0-9" action="seekToPercent" />

        {/* Gestures */}
        <Gesture type="tap" action="togglePaused" pointer="mouse" region="center" />
        <Gesture type="tap" action="toggleControls" pointer="touch" />
        <Gesture type="doubletap" action="seekStep" value={-SEEK_TIME} region="left" />
        <Gesture type="doubletap" action="toggleFullscreen" region="center" />
        <Gesture type="doubletap" action="seekStep" value={SEEK_TIME} region="right" />

        {/* Input feedback */}
        <StatusAnnouncer />
        <div className="media-input-feedback">
          <VolumeIndicator.Root className="media-surface media-input-feedback-island media-input-feedback-island--volume">
            <VolumeIndicator.Fill className="media-input-feedback-island__content">
              <VolumeHighIcon className="media-icon media-icon--volume-high" />
              <VolumeLowIcon className="media-icon media-icon--volume-low" />
              <VolumeOffIcon className="media-icon media-icon--volume-off" />
              <VolumeIndicator.Value className="media-input-feedback-island__value" />
            </VolumeIndicator.Fill>
          </VolumeIndicator.Root>

          <StatusIndicator.Root
            actions={TOP_STATUS_ACTIONS}
            className="media-surface media-input-feedback-island media-input-feedback-island--status"
          >
            <div className="media-input-feedback-island__content">
              <CaptionsOnIcon className="media-icon media-icon--captions-on" />
              <CaptionsOffIcon className="media-icon media-icon--captions-off" />
              <FullscreenEnterIcon className="media-icon media-icon--fullscreen-enter" />
              <FullscreenExitIcon className="media-icon media-icon--fullscreen-exit" />
              <PipEnterIcon className="media-icon media-icon--pip-enter" />
              <PipExitIcon className="media-icon media-icon--pip-exit" />
              <StatusIndicator.Value className="media-input-feedback-island__value" />
            </div>
          </StatusIndicator.Root>

          <SeekIndicator.Root className="media-input-feedback-bubble">
            <ChevronIcon className="media-icon media-icon--seek" />
            <SeekIndicator.Value className="media-time" />
          </SeekIndicator.Root>

          <StatusIndicator.Root actions={CENTER_STATUS_ACTIONS} className="media-input-feedback-bubble">
            <PlayIcon className="media-icon media-icon--play" />
            <PauseIcon className="media-icon media-icon--pause" />
          </StatusIndicator.Root>
        </div>
      </Container>
    </Player.Provider>
  );
}

// ================================================================
// Components
// ================================================================

const Button = forwardRef<HTMLButtonElement, ComponentProps<'button'>>(function Button({ className, ...props }, ref) {
  return <button ref={ref} type="button" className={`yt-button ${className ?? ''}`} {...props} />;
});

function PlaybackRateMenuItems(): ReactNode {
  const { options, setValue, value } = usePlaybackRateMenu();
  return (
    <Menu.RadioGroup className="media-menu__group" value={value} onValueChange={setValue} label="Playback rate">
      {options.map((option) => (
        <Menu.RadioItem key={option.value} className="media-menu__item" value={option.value} disabled={option.disabled}>
          <span>{option.label}</span>
          <Menu.ItemIndicator checked={option.value === value} forceMount className="media-menu__indicator">
            <CheckIcon className="media-icon" />
          </Menu.ItemIndicator>
        </Menu.RadioItem>
      ))}
    </Menu.RadioGroup>
  );
}

type IconProps = { className?: string };

function NextIcon({ className }: IconProps): ReactNode {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
    </svg>
  );
}

function SettingsIcon({ className }: IconProps): ReactNode {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.488.488 0 0014 1h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5a3.5 3.5 0 110-7 3.5 3.5 0 010 7z" />
    </svg>
  );
}

function MiniplayerIcon({ className }: IconProps): ReactNode {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21 3H3a2 2 0 00-2 2v14a2 2 0 002 2h18a2 2 0 002-2V5a2 2 0 00-2-2zm0 16H3V5h18v14z" />
      <rect x="12" y="11" width="8" height="6" rx="1" />
    </svg>
  );
}

function TheaterIcon({ className }: IconProps): ReactNode {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="2.5" y="6.5" width="19" height="11" rx="1" fill="currentColor" />
    </svg>
  );
}
