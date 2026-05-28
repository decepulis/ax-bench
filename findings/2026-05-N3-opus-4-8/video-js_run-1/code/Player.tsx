import { type CSSProperties, type ComponentProps, forwardRef, type ReactNode, isValidElement } from 'react';
import { CaptionsOffIcon, CaptionsOnIcon, CheckIcon, ChevronIcon, FullscreenEnterIcon, FullscreenExitIcon, PauseIcon, PipEnterIcon, PipExitIcon, PlayIcon, SpinnerIcon, VolumeHighIcon, VolumeLowIcon, VolumeOffIcon } from '@videojs/react/icons';
import { createPlayer, Poster, Container, usePlayer, BufferingIndicator, CaptionsButton, Controls, ErrorDialog, FullscreenButton, Gesture, Hotkey, Menu, MuteButton, PiPButton, PlayButton, PlaybackRateMenu, usePlaybackRateMenu, Popover, SeekButton, SeekIndicator, Slider, StatusAnnouncer, StatusIndicator, Time, TimeSlider, Tooltip, VolumeIndicator, VolumeSlider, type RenderProp } from '@videojs/react';
import { videoFeatures } from '@videojs/react/video';
import { HlsVideo } from '@videojs/react/media/hls-video';
import '@videojs/react/video/skin.css';
import './player-theme.css';

const TOP_STATUS_ACTIONS = ['toggleSubtitles', 'toggleFullscreen', 'togglePictureInPicture'] as const;

const CENTER_STATUS_ACTIONS = ['togglePaused'] as const;

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

// ================================================================
// Player
// ================================================================

const SEEK_TIME = 10;

export const Player = createPlayer({ features: videoFeatures });

export interface VideoPlayerProps {
  src: string;
  style?: CSSProperties;
  className?: string;
  title?: string;
  poster?: string | RenderProp<Poster.State> | undefined;
}

export function VideoPlayer({ src, className, poster, title, ...rest }: VideoPlayerProps): ReactNode {
  return (
    <Player.Provider>
      <Container className={`media-default-skin media-default-skin--video yt-skin ${className ?? ''}`} {...rest}>
        <HlsVideo src={src} muted loop autoPlay playsInline />

        {poster && (
          <Poster src={isString(poster) ? poster : undefined} render={isRenderProp(poster) ? poster : undefined} />
        )}

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
          <Tooltip.Provider>
            {/* Progress bar (full width, YouTube style) */}
            <div className="yt-progress-row">
              <TimeSlider.Root className="media-slider yt-progress">
                <TimeSlider.Track className="media-slider__track">
                  <TimeSlider.Buffer className="media-slider__buffer" />
                  <TimeSlider.Fill className="media-slider__fill" />
                </TimeSlider.Track>
                <TimeSlider.Thumb className="media-slider__thumb" />

                <div className="media-surface media-preview media-slider__preview">
                  <Slider.Thumbnail className="media-preview__thumbnail" />
                  <TimeSlider.Value type="pointer" className="media-time media-preview__time" />
                  <SpinnerIcon className="media-preview__spinner media-icon" />
                </div>
              </TimeSlider.Root>
            </div>

            {/* Button row */}
            <div className="yt-row">
              <div className="yt-group yt-group--left">
                <Tooltip.Root side="top">
                  <Tooltip.Trigger
                    render={
                      <PlayButton className="media-button--play" render={<Button />}>
                        <PlayIcon className="media-icon media-icon--play" />
                        <PauseIcon className="media-icon media-icon--pause" />
                      </PlayButton>
                    }
                  />
                  <Tooltip.Popup className="media-surface media-tooltip">Play / Pause</Tooltip.Popup>
                </Tooltip.Root>

                <Tooltip.Root side="top">
                  <Tooltip.Trigger
                    render={
                      <SeekButton seconds={3600} className="media-button--next" render={<Button aria-label="Next" />}>
                        <NextIcon className="media-icon" />
                      </SeekButton>
                    }
                  />
                  <Tooltip.Popup className="media-surface media-tooltip">Next</Tooltip.Popup>
                </Tooltip.Root>

                <VolumeControl />

                <div className="yt-time">
                  <Time.Value type="current" className="media-time" />
                  <span className="yt-time__sep">/</span>
                  <Time.Value type="duration" className="media-time" />
                </div>

                {title && <span className="yt-title">{title}</span>}
              </div>

              <div className="yt-group yt-group--right">
                <Tooltip.Root side="top">
                  <Tooltip.Trigger
                    render={
                      <Button aria-label="Share" className="media-button--share" onClick={() => console.log('shared')}>
                        <ShareIcon className="media-icon" />
                      </Button>
                    }
                  />
                  <Tooltip.Popup className="media-surface media-tooltip">Share</Tooltip.Popup>
                </Tooltip.Root>

                <Tooltip.Root side="top">
                  <Tooltip.Trigger
                    render={
                      <CaptionsButton className="media-button--captions" render={<Button />}>
                        <CaptionsOffIcon className="media-icon media-icon--captions-off" />
                        <CaptionsOnIcon className="media-icon media-icon--captions-on" />
                      </CaptionsButton>
                    }
                  />
                  <Tooltip.Popup className="media-surface media-tooltip">Subtitles</Tooltip.Popup>
                </Tooltip.Root>

                <PlaybackRateMenu.Root side="top" align="end">
                  <Tooltip.Root side="top">
                    <Tooltip.Trigger
                      render={
                        <PlaybackRateMenu.Trigger className="media-button--settings" render={<Button aria-label="Settings" />}>
                          <SettingsIcon className="media-icon" />
                        </PlaybackRateMenu.Trigger>
                      }
                    />
                    <Tooltip.Popup className="media-surface media-tooltip">Settings</Tooltip.Popup>
                  </Tooltip.Root>
                  <PlaybackRateMenu.Content className="media-surface media-popover media-menu media-menu--playback-rate">
                    <PlaybackRateMenuItems />
                  </PlaybackRateMenu.Content>
                </PlaybackRateMenu.Root>

                <Tooltip.Root side="top">
                  <Tooltip.Trigger
                    render={
                      <PiPButton className="media-button--pip" render={<Button />}>
                        <PipEnterIcon className="media-icon media-icon--pip-enter" />
                        <PipExitIcon className="media-icon media-icon--pip-exit" />
                      </PiPButton>
                    }
                  />
                  <Tooltip.Popup className="media-surface media-tooltip">Miniplayer</Tooltip.Popup>
                </Tooltip.Root>

                <Tooltip.Root side="top">
                  <Tooltip.Trigger
                    render={
                      <FullscreenButton className="media-button--fullscreen" render={<Button />}>
                        <FullscreenEnterIcon className="media-icon media-icon--fullscreen-enter" />
                        <FullscreenExitIcon className="media-icon media-icon--fullscreen-exit" />
                      </FullscreenButton>
                    }
                  />
                  <Tooltip.Popup className="media-surface media-tooltip">Fullscreen</Tooltip.Popup>
                </Tooltip.Root>
              </div>
            </div>
          </Tooltip.Provider>
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
        <Hotkey keys="Home" action="seekToPercent" value={0} />
        <Hotkey keys="End" action="seekToPercent" value={100} />

        {/* Gestures */}
        <Gesture type="tap" action="togglePaused" pointer="mouse" region="center" />
        <Gesture type="tap" action="toggleControls" pointer="touch" />
        <Gesture type="doubletap" action="seekStep" value={-SEEK_TIME} region="left" />
        <Gesture type="doubletap" action="toggleFullscreen" region="center" />
        <Gesture type="doubletap" action="seekStep" value={SEEK_TIME} region="right" />

        {/* Input Feedback */}
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
  return (
    <button
      ref={ref}
      type="button"
      className={`media-button media-button--subtle media-button--icon ${className ?? ''}`}
      {...props}
    />
  );
});

function VolumeControl(): ReactNode {
  const volumeUnsupported = usePlayer((s) => s.volumeAvailability === 'unsupported');

  const muteButton = (
    <Tooltip.Root side="top">
      <Tooltip.Trigger
        render={
          <MuteButton className="media-button--mute" render={<Button />}>
            <VolumeOffIcon className="media-icon media-icon--volume-off" />
            <VolumeLowIcon className="media-icon media-icon--volume-low" />
            <VolumeHighIcon className="media-icon media-icon--volume-high" />
          </MuteButton>
        }
      />
      <Tooltip.Popup className="media-surface media-tooltip">Mute</Tooltip.Popup>
    </Tooltip.Root>
  );

  if (volumeUnsupported) return <div className="yt-volume">{muteButton}</div>;

  return (
    <div className="yt-volume">
      {muteButton}
      <VolumeSlider.Root className="media-slider yt-volume-slider" orientation="horizontal">
        <VolumeSlider.Track className="media-slider__track">
          <VolumeSlider.Fill className="media-slider__fill" />
        </VolumeSlider.Track>
        <VolumeSlider.Thumb className="media-slider__thumb media-slider__thumb--persistent" />
      </VolumeSlider.Root>
    </div>
  );
}

function NextIcon({ className }: { className?: string }): ReactNode {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M6 6l8.5 6L6 18V6zm10 0h2.5v12H16V6z" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }): ReactNode {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
    </svg>
  );
}

function ShareIcon({ className }: { className?: string }): ReactNode {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M14 9V5l8 7-8 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11z" />
    </svg>
  );
}

// ================================================================
// Utilities
// ================================================================

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isRenderProp(value: unknown): value is RenderProp<unknown> {
  return typeof value === 'function' || isValidElement(value);
}
