import type { ReactNode, SVGProps } from 'react';
import {
  AlertDialog,
  BufferingIndicator,
  CaptionsButton,
  Container,
  Controls,
  ErrorDialog,
  FullscreenButton,
  Gesture,
  Hotkey,
  MuteButton,
  PiPButton,
  PlayButton,
  Popover,
  Poster,
  SeekButton,
  Slider,
  Time,
  TimeSlider,
  Tooltip,
  VolumeSlider,
} from '@videojs/react';

type IconProps = SVGProps<SVGSVGElement>;

const PlayIcon = (p: IconProps) => (
  <svg viewBox="0 0 18 18" width="22" height="22" fill="none" aria-hidden {...p}>
    <path fill="currentColor" d="m14.051 10.723-7.985 4.964a1.98 1.98 0 0 1-2.758-.638A2.06 2.06 0 0 1 3 13.964V4.036C3 2.91 3.895 2 5 2c.377 0 .747.109 1.066.313l7.985 4.964a2.057 2.057 0 0 1 .627 2.808c-.16.257-.373.475-.627.637" />
  </svg>
);
const PauseIcon = (p: IconProps) => (
  <svg viewBox="0 0 18 18" width="22" height="22" fill="none" aria-hidden {...p}>
    <rect width="5" height="14" x="2" y="2" fill="currentColor" rx="1.75" />
    <rect width="5" height="14" x="11" y="2" fill="currentColor" rx="1.75" />
  </svg>
);
const RestartIcon = (p: IconProps) => (
  <svg viewBox="0 0 18 18" width="22" height="22" fill="none" aria-hidden {...p}>
    <path fill="currentColor" d="M9 17a8 8 0 0 1-8-8h2a6 6 0 1 0 1.287-3.713l1.286 1.286A.25.25 0 0 1 5.396 7H1.25A.25.25 0 0 1 1 6.75V2.604a.25.25 0 0 1 .427-.177l1.438 1.438A8 8 0 1 1 9 17" />
    <path fill="currentColor" d="m11.61 9.639-3.331 2.07a.826.826 0 0 1-1.15-.266.86.86 0 0 1-.129-.452V6.849C7 6.38 7.374 6 7.834 6c.158 0 .312.045.445.13l3.331 2.071a.858.858 0 0 1 0 1.438" />
  </svg>
);
const NextIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden {...p}>
    <path fill="currentColor" d="M6 5.14v13.72c0 .79.87 1.27 1.54.84L18.34 13c.63-.39.63-1.31 0-1.7L7.54 4.3C6.87 3.87 6 4.35 6 5.14" />
    <rect x="17" y="5" width="2" height="14" rx="0.6" fill="currentColor" />
  </svg>
);
const VolumeOffIcon = (p: IconProps) => (
  <svg viewBox="0 0 18 18" width="22" height="22" fill="none" aria-hidden {...p}>
    <path fill="currentColor" d="M.714 6.008h3.072l4.071-3.857c.5-.376 1.143 0 1.143.601V15.28c0 .602-.643.903-1.143.602l-4.071-3.858H.714c-.428 0-.714-.3-.714-.752V6.76c0-.451.286-.752.714-.752M14.5 7.586l-1.768-1.768a1 1 0 1 0-1.414 1.414L13.085 9l-1.767 1.768a1 1 0 0 0 1.414 1.414l1.768-1.768 1.768 1.768a1 1 0 0 0 1.414-1.414L15.914 9l1.768-1.768a1 1 0 0 0-1.414-1.414z" />
  </svg>
);
const VolumeLowIcon = (p: IconProps) => (
  <svg viewBox="0 0 18 18" width="22" height="22" fill="none" aria-hidden {...p}>
    <path fill="currentColor" d="M.714 6.008h3.072l4.071-3.857c.5-.376 1.143 0 1.143.601V15.28c0 .602-.643.903-1.143.602l-4.071-3.858H.714c-.428 0-.714-.3-.714-.752V6.76c0-.451.286-.752.714-.752m10.568.59a.91.91 0 0 1 0-1.316.91.91 0 0 1 1.316 0c1.203 1.203 1.47 2.216 1.522 3.208q.012.255.011.51c0 1.16-.358 2.733-1.533 3.803a.7.7 0 0 1-.298.156c-.382.106-.873-.011-1.018-.156a.91.91 0 0 1 0-1.316c.57-.57.995-1.551.995-2.487 0-.944-.26-1.667-.995-2.402" />
  </svg>
);
const VolumeHighIcon = (p: IconProps) => (
  <svg viewBox="0 0 18 18" width="22" height="22" fill="none" aria-hidden {...p}>
    <path fill="currentColor" d="M15.6 3.3c-.4-.4-1-.4-1.4 0s-.4 1 0 1.4C15.4 5.9 16 7.4 16 9s-.6 3.1-1.8 4.3c-.4.4-.4 1 0 1.4.2.2.5.3.7.3.3 0 .5-.1.7-.3C17.1 13.2 18 11.2 18 9s-.9-4.2-2.4-5.7" />
    <path fill="currentColor" d="M.714 6.008h3.072l4.071-3.857c.5-.376 1.143 0 1.143.601V15.28c0 .602-.643.903-1.143.602l-4.071-3.858H.714c-.428 0-.714-.3-.714-.752V6.76c0-.451.286-.752.714-.752m10.568.59a.91.91 0 0 1 0-1.316.91.91 0 0 1 1.316 0c1.203 1.203 1.47 2.216 1.522 3.208q.012.255.011.51c0 1.16-.358 2.733-1.533 3.803a.7.7 0 0 1-.298.156c-.382.106-.873-.011-1.018-.156a.91.91 0 0 1 0-1.316c.57-.57.995-1.551.995-2.487 0-.944-.26-1.667-.995-2.402" />
  </svg>
);
const CaptionsOffIcon = (p: IconProps) => (
  <svg viewBox="0 0 18 18" width="22" height="22" fill="none" aria-hidden {...p}>
    <rect width="16" height="12" x="1" y="3" stroke="currentColor" strokeWidth="2" rx="3" />
    <rect width="3" height="2" x="3" y="8" fill="currentColor" rx="1" />
    <rect width="2" height="2" x="13" y="8" fill="currentColor" rx="1" />
    <rect width="4" height="2" x="11" y="11" fill="currentColor" rx="1" />
    <rect width="5" height="2" x="7" y="8" fill="currentColor" rx="1" />
    <rect width="7" height="2" x="3" y="11" fill="currentColor" rx="1" />
  </svg>
);
const CaptionsOnIcon = (p: IconProps) => (
  <svg viewBox="0 0 18 18" width="22" height="22" fill="none" aria-hidden {...p}>
    <path fill="currentColor" d="M15 2a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3zM4 11a1 1 0 1 0 0 2h5a1 1 0 1 0 0-2zm8 0a1 1 0 1 0 0 2h2a1 1 0 1 0 0-2zM4 8a1 1 0 0 0 0 2h1a1 1 0 0 0 0-2zm4 0a1 1 0 0 0 0 2h3a1 1 0 1 0 0-2zm6 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2" />
  </svg>
);
const SettingsIcon = (p: IconProps) => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden {...p}>
    <path fill="currentColor" d="M19.43 12.98a7.8 7.8 0 0 0 .07-.98 7.8 7.8 0 0 0-.07-.98l2.11-1.65a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1a7.3 7.3 0 0 0-1.69-.98l-.38-2.65A.49.49 0 0 0 14 2h-4a.49.49 0 0 0-.49.42l-.38 2.65c-.61.25-1.18.58-1.69.98l-2.49-1a.5.5 0 0 0-.61.22l-2 3.46a.5.5 0 0 0 .12.64L4.57 11c-.05.32-.07.65-.07.98s.02.66.07.98l-2.11 1.65a.5.5 0 0 0-.12.64l2 3.46a.5.5 0 0 0 .61.22l2.49-1c.51.4 1.08.73 1.69.98l.38 2.65c.04.24.25.42.49.42h4c.24 0 .45-.18.49-.42l.38-2.65c.61-.25 1.18-.58 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46a.5.5 0 0 0-.12-.64zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7" />
  </svg>
);
const PipEnterIcon = (p: IconProps) => (
  <svg viewBox="0 0 18 18" width="22" height="22" fill="none" aria-hidden {...p}>
    <path fill="currentColor" d="M13 2a4 4 0 0 1 4 4v2.035A3.5 3.5 0 0 0 16.5 8H15V6.273C15 5.018 13.96 4 12.679 4H4.32C3.04 4 2 5.018 2 6.273v5.454C2 12.982 3.04 14 4.321 14H6v1.5q0 .255.035.5H4a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z" />
    <rect width="10" height="7" x="8" y="10" fill="currentColor" rx="2" />
    <path fill="currentColor" d="M7.129 5.547a.6.6 0 0 0-.656.13L3.677 8.473A.6.6 0 0 0 4.102 9.5h2.796c.332 0 .602-.27.602-.602V6.103a.6.6 0 0 0-.371-.556" />
  </svg>
);
const PipExitIcon = (p: IconProps) => (
  <svg viewBox="0 0 18 18" width="22" height="22" fill="none" aria-hidden {...p}>
    <path fill="currentColor" d="M13 2a4 4 0 0 1 4 4v2.036A3.5 3.5 0 0 0 16.5 8H15V6.273C15 5.018 13.96 4 12.679 4H4.32C3.04 4 2 5.018 2 6.273v5.454C2 12.982 3.04 14 4.321 14H6v1.5q0 .255.036.5H4a4 4 0 0 1-4-4V6a4 4 0 0 1 4-4z" />
    <rect width="10" height="7" x="8" y="10" fill="currentColor" rx="2" />
    <path fill="currentColor" d="M4.871 10.454a.6.6 0 0 0 .656-.131l2.796-2.796A.6.6 0 0 0 7.898 6.5H5.102a.603.603 0 0 0-.602.602v2.795a.6.6 0 0 0 .371.556" />
  </svg>
);
const FullscreenEnterIcon = (p: IconProps) => (
  <svg viewBox="0 0 18 18" width="22" height="22" fill="none" aria-hidden {...p}>
    <path fill="currentColor" d="M9.57 3.617A1 1 0 0 0 8.646 3H4c-.552 0-1 .449-1 1v4.646a.996.996 0 0 0 1.001 1 1 1 0 0 0 .706-.293l4.647-4.647a1 1 0 0 0 .216-1.089m4.812 4.812a1 1 0 0 0-1.089.217l-4.647 4.647a.998.998 0 0 0 .708 1.706H14c.552 0 1-.449 1-1V9.353a1 1 0 0 0-.618-.924" />
  </svg>
);
const FullscreenExitIcon = (p: IconProps) => (
  <svg viewBox="0 0 18 18" width="22" height="22" fill="none" aria-hidden {...p}>
    <path fill="currentColor" d="M7.883 1.93a.99.99 0 0 0-1.09.217L2.146 6.793A.998.998 0 0 0 2.853 8.5H7.5c.551 0 1-.449 1-1V2.854a1 1 0 0 0-.617-.924m7.263 7.57H10.5c-.551 0-1 .449-1 1v4.646a.996.996 0 0 0 1.001 1.001 1 1 0 0 0 .706-.293l4.646-4.646a.998.998 0 0 0-.707-1.707z" />
  </svg>
);
const SpinnerIcon = (p: IconProps) => (
  <svg viewBox="0 0 18 18" width="48" height="48" fill="currentColor" aria-hidden {...p}>
    {[
      { x: 8, y: 0.5, w: 2, h: 5, op: 0.5, b: '0s' },
      { x: 12.243, y: 2.257, w: 2, h: 5, op: 0.45, b: '0.125s', t: 'rotate(45 13.243 4.757)' },
      { x: 12.5, y: 8, w: 5, h: 2, op: 0.4, b: '0.25s' },
      { x: 10.743, y: 12.243, w: 5, h: 2, op: 0.35, b: '0.375s', t: 'rotate(45 13.243 13.243)' },
      { x: 8, y: 12.5, w: 2, h: 5, op: 0.3, b: '0.5s' },
      { x: 3.757, y: 10.743, w: 2, h: 5, op: 0.25, b: '0.625s', t: 'rotate(45 4.757 13.243)' },
      { x: 0.5, y: 8, w: 5, h: 2, op: 0.15, b: '0.75s' },
      { x: 2.257, y: 3.757, w: 5, h: 2, op: 0.1, b: '0.875s', t: 'rotate(45 4.757 4.757)' },
    ].map((r, i) => (
      <rect key={i} width={r.w} height={r.h} x={r.x} y={r.y} opacity={r.op} rx="1" transform={r.t}>
        <animate attributeName="opacity" begin={r.b} calcMode="linear" dur="1s" repeatCount="indefinite" values="1;0" />
      </rect>
    ))}
  </svg>
);

type Props = { children: ReactNode; posterSrc?: string; title?: string };

export function YTSkin({ children, posterSrc, title }: Props) {
  return (
    <Container className="yt">
      {children}
      {posterSrc && <Poster src={posterSrc} className="yt__poster" />}
      <BufferingOverlay />
      <ErrorOverlay />
      <Gesture type="tap" action="togglePaused" pointer="mouse" region="center" />
      <Gesture type="tap" action="toggleControls" pointer="touch" />
      <Gesture type="doubletap" action="toggleFullscreen" region="center" />
      <Hotkey keys="Space" action="togglePaused" />
      <Hotkey keys="k" action="togglePaused" />
      <Hotkey keys="m" action="toggleMuted" />
      <Hotkey keys="f" action="toggleFullscreen" />
      <Hotkey keys="ArrowRight" action="seekStep" value={5} />
      <Hotkey keys="ArrowLeft" action="seekStep" value={-5} />
      <Hotkey keys="ArrowUp" action="volumeStep" value={0.05} />
      <Hotkey keys="ArrowDown" action="volumeStep" value={-0.05} />

      <Controls.Root className="yt__controls">
        <TimeSlider.Root className="yt__progress">
          <Slider.Track className="yt__progress-track">
            <Slider.Buffer className="yt__progress-buffer" />
            <Slider.Fill className="yt__progress-fill" />
          </Slider.Track>
          <Slider.Thumb className="yt__progress-thumb" />
        </TimeSlider.Root>

        <div className="yt__bar">
          <div className="yt__group">
            <PlayButton className="yt__btn yt__btn--play" aria-label="Play / Pause">
              <RestartIcon className="yt__icon yt__icon--restart" />
              <PlayIcon className="yt__icon yt__icon--play" />
              <PauseIcon className="yt__icon yt__icon--pause" />
            </PlayButton>

            <SeekButton seconds={10} className="yt__btn" aria-label="Next">
              <NextIcon />
            </SeekButton>

            <Popover.Root openOnHover delay={150} closeDelay={150} side="top">
              <div className="yt__volume">
                <Popover.Trigger
                  render={
                    <MuteButton className="yt__btn yt__btn--mute" aria-label="Mute">
                      <VolumeOffIcon className="yt__icon yt__icon--vol-off" />
                      <VolumeLowIcon className="yt__icon yt__icon--vol-low" />
                      <VolumeHighIcon className="yt__icon yt__icon--vol-high" />
                    </MuteButton>
                  }
                />
                <Popover.Popup className="yt__vol-popup">
                  <VolumeSlider.Root className="yt__vol">
                    <Slider.Track className="yt__vol-track">
                      <Slider.Fill className="yt__vol-fill" />
                    </Slider.Track>
                    <Slider.Thumb className="yt__vol-thumb" />
                  </VolumeSlider.Root>
                </Popover.Popup>
              </div>
            </Popover.Root>

            <span className="yt__time">
              <Time.Value type="current" />
              <span className="yt__time-sep">/</span>
              <Time.Value type="duration" />
            </span>

            {title && <span className="yt__title">{title}</span>}
          </div>

          <div className="yt__group">
            <CaptionsButton className="yt__btn" aria-label="Captions">
              <CaptionsOffIcon className="yt__icon yt__icon--cc-off" />
              <CaptionsOnIcon className="yt__icon yt__icon--cc-on" />
            </CaptionsButton>

            <Tooltip.Provider>
              <Tooltip.Root side="top">
                <Tooltip.Trigger
                  render={
                    <button type="button" className="yt__btn" aria-label="Settings">
                      <SettingsIcon />
                    </button>
                  }
                />
                <Tooltip.Popup className="yt__tooltip">Settings</Tooltip.Popup>
              </Tooltip.Root>
            </Tooltip.Provider>

            <PiPButton className="yt__btn" aria-label="Picture in picture">
              <PipEnterIcon className="yt__icon yt__icon--pip-enter" />
              <PipExitIcon className="yt__icon yt__icon--pip-exit" />
            </PiPButton>

            <FullscreenButton className="yt__btn" aria-label="Fullscreen">
              <FullscreenEnterIcon className="yt__icon yt__icon--fs-enter" />
              <FullscreenExitIcon className="yt__icon yt__icon--fs-exit" />
            </FullscreenButton>
          </div>
        </div>
      </Controls.Root>
    </Container>
  );
}

function BufferingOverlay() {
  return (
    <BufferingIndicator
      render={(props) => (
        <div {...props} className="yt__buffering">
          <SpinnerIcon />
        </div>
      )}
    />
  );
}

function ErrorOverlay() {
  return (
    <ErrorDialog.Root>
      <AlertDialog.Popup className="yt__error">
        <AlertDialog.Title className="yt__error-title">Something went wrong.</AlertDialog.Title>
        <ErrorDialog.Description className="yt__error-desc" />
        <AlertDialog.Close className="yt__btn yt__error-close">OK</AlertDialog.Close>
      </AlertDialog.Popup>
    </ErrorDialog.Root>
  );
}
