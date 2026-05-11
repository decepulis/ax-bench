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
  PiPButton,
  PlayButton,
  PlaybackRateButton,
  Poster,
  SeekButton,
  Time,
  TimeSlider,
} from '@videojs/react';

interface YouTubeSkinProps {
  poster?: string;
  title?: string;
  children?: ReactNode;
}

export function YouTubeSkin({ poster, title, children }: YouTubeSkinProps) {
  return (
    <Container className="yt-skin">
      {children}
      {poster && <Poster className="yt-poster" src={poster} />}

      <BufferingIndicator
        render={(props) => (
          <div {...props} className="yt-buffering">
            <SpinnerIcon />
          </div>
        )}
      />

      <div className="yt-gradient" aria-hidden />

      <Controls.Root className="yt-controls">
        <TimeSlider.Root className="yt-progress">
          <TimeSlider.Track className="yt-progress__track">
            <TimeSlider.Buffer className="yt-progress__buffer" />
            <TimeSlider.Fill className="yt-progress__fill" />
          </TimeSlider.Track>
          <TimeSlider.Thumb className="yt-progress__thumb" />
        </TimeSlider.Root>

        <div className="yt-row">
          <div className="yt-row__side yt-row__side--left">
            <PlayButton className="yt-btn yt-btn--play" aria-label="Play">
              <PlayIcon className="yt-icon yt-icon--play" />
              <PauseIcon className="yt-icon yt-icon--pause" />
              <ReplayIcon className="yt-icon yt-icon--replay" />
            </PlayButton>
            <SeekButton
              seconds={10}
              className="yt-btn yt-btn--next"
              aria-label="Next"
            >
              <NextIcon />
            </SeekButton>
            <MuteButton className="yt-btn yt-btn--mute" aria-label="Mute">
              <VolumeOnIcon className="yt-icon yt-icon--volume-on" />
              <VolumeOffIcon className="yt-icon yt-icon--volume-off" />
            </MuteButton>
            <Time.Value type="current" className="yt-time" />
            <span className="yt-time-sep">/</span>
            <Time.Value type="duration" className="yt-time" />
            {title && <span className="yt-title">{title}</span>}
          </div>

          <div className="yt-row__side yt-row__side--right">
            <CaptionsButton className="yt-btn yt-btn--cc" aria-label="Subtitles">
              <CaptionsIcon />
            </CaptionsButton>
            <PlaybackRateButton
              className="yt-btn yt-btn--settings"
              aria-label="Settings"
            >
              <GearIcon />
            </PlaybackRateButton>
            <PiPButton className="yt-btn yt-btn--pip" aria-label="Miniplayer">
              <MiniPlayerIcon />
            </PiPButton>
            <FullscreenButton
              className="yt-btn yt-btn--fs"
              aria-label="Fullscreen"
            >
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
      <Hotkey keys="ArrowRight" action="seekStep" value={5} />
      <Hotkey keys="ArrowLeft" action="seekStep" value={-5} />
      <Hotkey keys="ArrowUp" action="volumeStep" value={0.05} />
      <Hotkey keys="ArrowDown" action="volumeStep" value={-0.05} />
      <Gesture
        type="tap"
        action="togglePaused"
        pointer="mouse"
        region="center"
      />
      <Gesture type="tap" action="toggleControls" pointer="touch" />
      <Gesture
        type="doubletap"
        action="toggleFullscreen"
        region="center"
      />
    </Container>
  );
}

function Icon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 36 36"
      width={36}
      height={36}
      fill="currentColor"
      aria-hidden
      {...props}
    >
      {children}
    </svg>
  );
}

function PlayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M12,26 L26,18 L12,10 L12,26 Z" />
    </Icon>
  );
}

function PauseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M11,10 L15,10 L15,26 L11,26 Z M21,10 L25,10 L25,26 L21,26 Z" />
    </Icon>
  );
}

function ReplayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M18 11V7l-5 5 5 5v-4c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
    </Icon>
  );
}

function NextIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M 12,24 20.5,18 12,12 V 24 z M 22,12 V 24 H 24 V 12 H 22 z" />
    </Icon>
  );
}

function VolumeOnIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M8,21 L12,21 L17,26 L17,10 L12,15 L8,15 L8,21 Z M22.5,18 C22.5,16 21.5,14.5 20,13.7 L20,22.3 C21.5,21.5 22.5,20 22.5,18 Z M20,8.7 L20,10.8 C22.9,11.6 25,14.5 25,18 C25,21.5 22.9,24.4 20,25.2 L20,27.3 C24,26.4 27,22.8 27,18 C27,13.2 24,9.6 20,8.7 Z" />
    </Icon>
  );
}

function VolumeOffIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M21.48,17.98 C21.48,16.21 20.46,14.69 18.98,13.95 L18.98,16.06 L21.45,18.52 C21.47,18.34 21.48,18.17 21.48,17.98 z M23.98,17.98 C23.98,18.92 23.77,19.81 23.43,20.62 L24.94,22.13 C25.61,20.88 25.98,19.48 25.98,17.98 C25.98,13.71 22.98,10.15 18.98,9.23 L18.98,11.29 C21.86,12.16 23.98,14.83 23.98,17.98 z M3.71,3.71 L2.29,5.12 L7.46,10.29 L6.98,10.29 L6.98,15.29 L10.98,15.29 L15.98,20.29 L15.98,12.97 L20.27,17.26 C19.6,17.78 18.85,18.18 18.04,18.41 L18.04,20.47 C19.42,20.16 20.66,19.56 21.72,18.71 L24.27,21.26 L25.68,19.85 L12.96,7.13 L3.71,3.71 z M15.98,5.29 L13.39,7.88 L15.98,10.47 L15.98,5.29 z" />
    </Icon>
  );
}

function CaptionsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M11,11 C9.9,11 9,11.9 9,13 L9,23 C9,24.1 9.9,25 11,25 L25,25 C26.1,25 27,24.1 27,23 L27,13 C27,11.9 26.1,11 25,11 L11,11 Z M11,19 L15,19 L15,21 L11,21 L11,19 Z M11,15 L21,15 L21,17 L11,17 L11,15 Z M17,19 L25,19 L25,21 L17,21 L17,19 Z M23,15 L25,15 L25,17 L23,17 L23,15 Z" />
    </Icon>
  );
}

function GearIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="m 23.94,18.78 c .03,-.25 .05,-.51 .05,-.78 0,-.27 -.02,-.52 -.05,-.78 l 1.68,-1.32 c .15,-.12 .19,-.33 .09,-.51 l -1.6,-2.76 c -.09,-.17 -.31,-.24 -.48,-.17 l -1.99,.8 c -.41,-.32 -.86,-.58 -1.35,-.78 l -.30,-2.12 c -.02,-.19 -.19,-.34 -.39,-.34 l -3.2,0 c -.2,0 -.36,.15 -.39,.34 l -.30,2.12 c -.48,.2 -.93,.47 -1.35,.78 l -1.99,-.8 c -.18,-.07 -.39,0 -.48,.17 l -1.6,2.76 c -.10,.17 -.05,.39 .09,.51 l 1.68,1.32 c -.03,.25 -.05,.52 -.05,.78 0,.26 .02,.52 .05,.78 l -1.68,1.32 c -.15,.12 -.19,.33 -.09,.51 l 1.6,2.76 c .09,.17 .31,.24 .48,.17 l 1.99,-.8 c .41,.32 .86,.58 1.35,.78 l .30,2.12 c .03,.19 .19,.34 .39,.34 l 3.2,0 c .2,0 .37,-.15 .39,-.34 l .30,-2.12 c .48,-.2 .93,-.47 1.35,-.78 l 1.99,.8 c .18,.07 .39,0 .48,-.17 l 1.6,-2.76 c .09,-.17 .05,-.39 -.09,-.51 l -1.68,-1.32 0,0 z m -5.94,2.01 c -1.54,0 -2.8,-1.25 -2.8,-2.8 0,-1.54 1.25,-2.8 2.8,-2.8 1.54,0 2.8,1.25 2.8,2.8 0,1.54 -1.25,2.8 -2.8,2.8 l 0,0 z" />
    </Icon>
  );
}

function MiniPlayerIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="M25,17 L17,17 L17,23 L25,23 L25,17 L25,17 Z M29,25 L29,10.98 C29,9.88 28.1,9 27,9 L9,9 C7.9,9 7,9.88 7,10.98 L7,25 C7,26.1 7.9,27 9,27 L27,27 C28.1,27 29,26.1 29,25 L29,25 Z M27,25.02 L9,25.02 L9,10.97 L27,10.97 L27,25.02 L27,25.02 Z" />
    </Icon>
  );
}

function FullscreenEnterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z m 2,4 -2,0 0,6 6,0 0,-2 -4,0 0,-4 0,0 z m 12,4 -4,0 0,2 6,0 0,-6 -2,0 0,4 0,0 z m -4,-14 0,2 4,0 0,4 2,0 L 26,10 l -6,0 0,0 z" />
    </Icon>
  );
}

function FullscreenExitIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <Icon {...props}>
      <path d="m 14,14 -4,0 0,2 6,0 0,-6 -2,0 0,4 0,0 z m -4,8 4,0 0,4 2,0 0,-6 -6,0 0,2 0,0 z m 12,4 2,0 0,-4 4,0 0,-2 -6,0 0,6 0,0 z m 2,-12 0,-4 -2,0 0,6 6,0 0,-2 -4,0 0,0 z" />
    </Icon>
  );
}

function SpinnerIcon() {
  return (
    <svg
      className="yt-spinner"
      viewBox="0 0 50 50"
      width={48}
      height={48}
      aria-hidden
    >
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="80 50"
      />
    </svg>
  );
}
