import { type ComponentProps, forwardRef, isValidElement, type ReactNode } from 'react';
import {
  CaptionsOffIcon,
  CaptionsOnIcon,
  CheckIcon,
  PauseIcon,
  PlayIcon,
  RestartIcon,
  SpinnerIcon,
  VolumeHighIcon,
  VolumeLowIcon,
  VolumeOffIcon,
  FullscreenEnterIcon,
  FullscreenExitIcon,
} from '@videojs/react/icons';
import {
  BufferingIndicator,
  CaptionsButton,
  Container,
  Controls,
  ErrorDialog,
  FullscreenButton,
  Gesture,
  Hotkey,
  Menu,
  MuteButton,
  PiPButton,
  PlaybackRateMenu,
  PlayButton,
  Poster,
  type RenderProp,
  StatusAnnouncer,
  Time,
  TimeSlider,
  usePlaybackRateMenu,
} from '@videojs/react';

const SEEK_TIME = 5;

const YtButton = forwardRef<HTMLButtonElement, ComponentProps<'button'>>(function YtButton(
  { className, ...props },
  ref,
) {
  return <button ref={ref} type="button" className={`yt-btn ${className ?? ''}`} {...props} />;
});

function GearIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.488.488 0 0 0 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z" />
    </svg>
  );
}

function MiniPlayerIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-8-7h6v5h-6v-5z" />
    </svg>
  );
}

function PlaybackRateMenuItems() {
  const { options, setValue, value } = usePlaybackRateMenu();
  return (
    <Menu.RadioGroup
      className="yt-menu__group"
      value={value}
      onValueChange={setValue}
      label="Playback rate"
    >
      {options.map((option) => (
        <Menu.RadioItem
          key={option.value}
          className="yt-menu__item"
          value={option.value}
          disabled={option.disabled}
        >
          <Menu.ItemIndicator checked={option.value === value} forceMount className="yt-menu__indicator">
            <CheckIcon className="yt-menu__check" />
          </Menu.ItemIndicator>
          <span>{option.label}</span>
        </Menu.RadioItem>
      ))}
    </Menu.RadioGroup>
  );
}

export interface PlayerSkinProps {
  children?: ReactNode;
  className?: string;
  poster?: string | RenderProp<Poster.State>;
  chapter?: string;
}

export function PlayerSkin({ children, className, poster, chapter = 'Two bros' }: PlayerSkinProps) {
  return (
    <Container className={`media-default-skin media-default-skin--video yt-player ${className ?? ''}`}>
      {children}

      {poster && (
        <Poster
          src={typeof poster === 'string' ? poster : undefined}
          render={isRenderProp(poster) ? poster : undefined}
        />
      )}

      <BufferingIndicator
        render={(props) => (
          <div {...props} className="yt-buffering">
            <SpinnerIcon className="yt-spinner" />
          </div>
        )}
      />

      <ErrorDialog.Root>
        <ErrorDialog.Popup className="yt-error">
          <ErrorDialog.Title className="yt-error__title">Something went wrong.</ErrorDialog.Title>
          <ErrorDialog.Description className="yt-error__description" />
          <ErrorDialog.Close className="yt-btn yt-btn--primary">OK</ErrorDialog.Close>
        </ErrorDialog.Popup>
      </ErrorDialog.Root>

      <Controls.Root className="yt-controls">
        <TimeSlider.Root className="yt-progress">
          <TimeSlider.Track className="yt-progress__track">
            <TimeSlider.Buffer className="yt-progress__buffer" />
            <TimeSlider.Fill className="yt-progress__fill" />
          </TimeSlider.Track>
          <TimeSlider.Thumb className="yt-progress__thumb" />
        </TimeSlider.Root>

        <div className="yt-bottom">
          <div className="yt-bottom__group">
            <PlayButton render={<YtButton aria-label="Play" />} className="yt-btn--play">
              <PlayIcon className="yt-icon yt-icon--play" />
              <PauseIcon className="yt-icon yt-icon--pause" />
              <RestartIcon className="yt-icon yt-icon--restart" />
            </PlayButton>

            <MuteButton render={<YtButton aria-label="Mute" />} className="yt-btn--mute">
              <VolumeOffIcon className="yt-icon yt-icon--vol-off" />
              <VolumeLowIcon className="yt-icon yt-icon--vol-low" />
              <VolumeHighIcon className="yt-icon yt-icon--vol-high" />
            </MuteButton>

            <span className="yt-time">
              <Time.Value type="current" />
              {' / '}
              <Time.Value type="duration" />
            </span>

            {chapter && <span className="yt-chapter">{chapter}</span>}
          </div>

          <div className="yt-bottom__group yt-bottom__group--right">
            <CaptionsButton render={<YtButton aria-label="Subtitles/closed captions" />} className="yt-btn--cc">
              <CaptionsOffIcon className="yt-icon yt-icon--cc-off" />
              <CaptionsOnIcon className="yt-icon yt-icon--cc-on" />
            </CaptionsButton>

            <PlaybackRateMenu.Root side="top" align="end">
              <PlaybackRateMenu.Trigger render={<YtButton aria-label="Settings" />}>
                <GearIcon className="yt-icon" />
              </PlaybackRateMenu.Trigger>
              <PlaybackRateMenu.Content className="yt-menu">
                <PlaybackRateMenuItems />
              </PlaybackRateMenu.Content>
            </PlaybackRateMenu.Root>

            <PiPButton render={<YtButton aria-label="Miniplayer" />} className="yt-btn--pip">
              <MiniPlayerIcon className="yt-icon" />
            </PiPButton>

            <FullscreenButton render={<YtButton aria-label="Fullscreen" />} className="yt-btn--fs">
              <FullscreenEnterIcon className="yt-icon yt-icon--fs-enter" />
              <FullscreenExitIcon className="yt-icon yt-icon--fs-exit" />
            </FullscreenButton>
          </div>
        </div>
      </Controls.Root>

      <Hotkey keys="Space" action="togglePaused" />
      <Hotkey keys="k" action="togglePaused" />
      <Hotkey keys="m" action="toggleMuted" />
      <Hotkey keys="f" action="toggleFullscreen" />
      <Hotkey keys="c" action="toggleSubtitles" />
      <Hotkey keys="i" action="togglePictureInPicture" />
      <Hotkey keys="ArrowRight" action="seekStep" value={SEEK_TIME} />
      <Hotkey keys="ArrowLeft" action="seekStep" value={-SEEK_TIME} />
      <Hotkey keys="ArrowUp" action="volumeStep" value={0.05} />
      <Hotkey keys="ArrowDown" action="volumeStep" value={-0.05} />
      <Hotkey keys="0-9" action="seekToPercent" />

      <Gesture type="tap" action="togglePaused" pointer="mouse" region="center" />
      <Gesture type="tap" action="toggleControls" pointer="touch" />
      <Gesture type="doubletap" action="toggleFullscreen" region="center" />

      <StatusAnnouncer />
    </Container>
  );
}

function isRenderProp(value: unknown): value is RenderProp<unknown> {
  return typeof value === 'function' || isValidElement(value);
}
