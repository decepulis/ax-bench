import { useState } from 'react';
import {
  createPlayer,
  Container,
  Controls,
  TimeSlider,
  Time,
  PlayButton,
  MuteButton,
  CaptionsButton,
  PiPButton,
  FullscreenButton,
  Poster,
  BufferingIndicator,
  Hotkey,
  Gesture,
} from '@videojs/react';
import { videoFeatures } from '@videojs/react/video';
import { HlsVideo } from '@videojs/react/media/hls-video';
import './youtube-skin.css';

const Player = createPlayer({ features: videoFeatures, displayName: 'Player' });

const PLAYBACK_ID = 'BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM';
const STREAM_URL = `https://stream.mux.com/${PLAYBACK_ID}.m3u8`;
const POSTER_URL = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.jpg?time=0`;
const TITLE = 'Two bros';

type SvgProps = React.SVGProps<SVGSVGElement>;

const Icon = ({ children, ...props }: SvgProps) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" {...props}>
    {children}
  </svg>
);

const PlayIcon = (p: SvgProps) => (
  <Icon {...p}>
    <path d="M8 5v14l11-7z" />
  </Icon>
);
const PauseIcon = (p: SvgProps) => (
  <Icon {...p}>
    <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
  </Icon>
);
const NextIcon = (p: SvgProps) => (
  <Icon {...p}>
    <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
  </Icon>
);
const VolumeHighIcon = (p: SvgProps) => (
  <Icon {...p}>
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
  </Icon>
);
const VolumeLowIcon = (p: SvgProps) => (
  <Icon {...p}>
    <path d="M5 9v6h4l5 5V4L9 9H5zm11.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
  </Icon>
);
const VolumeOffIcon = (p: SvgProps) => (
  <Icon {...p}>
    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
  </Icon>
);
const CaptionsOffIcon = (p: SvgProps) => (
  <Icon {...p}>
    <path d="M19 4H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm-8 7H9.5v-.5h-2v3h2V13H11v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-4a1 1 0 011-1h3a1 1 0 011 1v1zm7 0h-1.5v-.5h-2v3h2V13H18v1a1 1 0 01-1 1h-3a1 1 0 01-1-1v-4a1 1 0 011-1h3a1 1 0 011 1v1z" />
  </Icon>
);
const CaptionsOnIcon = (p: SvgProps) => (
  <Icon {...p}>
    <path d="M19 4H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zM11 11H9.5v-.5h-2v3h2V13H11v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-4a1 1 0 011-1h3a1 1 0 011 1v1zm7 0h-1.5v-.5h-2v3h2V13H18v1a1 1 0 01-1 1h-3a1 1 0 01-1-1v-4a1 1 0 011-1h3a1 1 0 011 1v1z" />
    <rect x="3" y="20" width="18" height="2" rx="1" />
  </Icon>
);
const GearIcon = (p: SvgProps) => (
  <Icon {...p}>
    <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65a.5.5 0 00.12-.64l-2-3.46a.5.5 0 00-.61-.22l-2.49 1a7.027 7.027 0 00-1.69-.98l-.38-2.65A.5.5 0 0014 2h-4a.5.5 0 00-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1a.5.5 0 00-.61.22l-2 3.46a.5.5 0 00.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65a.5.5 0 00-.12.64l2 3.46a.5.5 0 00.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65a.5.5 0 00.49.42h4a.5.5 0 00.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1a.5.5 0 00.61-.22l2-3.46a.5.5 0 00-.12-.64l-2.11-1.65zM12 15.5A3.5 3.5 0 1115.5 12 3.5 3.5 0 0112 15.5z" />
  </Icon>
);
const PiPEnterIcon = (p: SvgProps) => (
  <Icon {...p}>
    <path d="M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3a1.97 1.97 0 00-2 1.98V19a2 2 0 002 2h18a2 2 0 002-2zm-2 .02H3V4.97h18v14.05z" />
  </Icon>
);
const PiPExitIcon = (p: SvgProps) => (
  <Icon {...p}>
    <path d="M21 19.02V4.97H3v14.05h18zM5 7h7v6H5V7z" />
  </Icon>
);
const TheaterIcon = (p: SvgProps) => (
  <Icon {...p}>
    <path d="M19 6.5H5a1 1 0 00-1 1v9a1 1 0 001 1h14a1 1 0 001-1v-9a1 1 0 00-1-1zm-1 9H6v-7h12v7z" />
  </Icon>
);
const FullscreenEnterIcon = (p: SvgProps) => (
  <Icon {...p}>
    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
  </Icon>
);
const FullscreenExitIcon = (p: SvgProps) => (
  <Icon {...p}>
    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
  </Icon>
);

function AutoplayToggle() {
  const [on, setOn] = useState(true);
  return (
    <button
      type="button"
      className="yt-autoplay"
      aria-label="Autoplay is on"
      aria-pressed={on}
      onClick={() => setOn((v) => !v)}
    >
      <span className="yt-autoplay__track">
        <span className="yt-autoplay__knob" />
      </span>
    </button>
  );
}

function YouTubeSkin({
  poster,
  title,
  children,
}: {
  poster?: string;
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <Container className="yt-skin">
      {children}
      {poster && <Poster src={poster} alt="" className="yt-poster" />}

      <BufferingIndicator className="yt-buffering">
        <span className="yt-spinner" />
      </BufferingIndicator>

      <Controls.Root className="yt-controls">
        <TimeSlider.Root className="yt-progress">
          <TimeSlider.Track className="yt-progress-track">
            <TimeSlider.Buffer className="yt-progress-buffer" />
            <TimeSlider.Fill className="yt-progress-fill" />
          </TimeSlider.Track>
          <TimeSlider.Thumb className="yt-progress-thumb" />
        </TimeSlider.Root>

        <div className="yt-bar">
          <div className="yt-bar__side">
            <PlayButton className="yt-btn media-button--play" aria-label="Play">
              <PlayIcon className="media-icon media-icon--play" />
              <PauseIcon className="media-icon media-icon--pause" />
            </PlayButton>
            <button type="button" className="yt-btn" aria-label="Next video">
              <NextIcon />
            </button>
            <MuteButton className="yt-btn media-button--mute" aria-label="Mute">
              <VolumeOffIcon className="media-icon media-icon--volume-off" />
              <VolumeLowIcon className="media-icon media-icon--volume-low" />
              <VolumeHighIcon className="media-icon media-icon--volume-high" />
            </MuteButton>
            <div className="yt-time">
              <Time.Value type="current" />
              {' / '}
              <Time.Value type="duration" />
            </div>
            {title && <div className="yt-title">{title}</div>}
          </div>
          <div className="yt-bar__side">
            <AutoplayToggle />
            <CaptionsButton
              className="yt-btn media-button--captions"
              aria-label="Subtitles/closed captions"
            >
              <CaptionsOffIcon className="media-icon media-icon--captions-off" />
              <CaptionsOnIcon className="media-icon media-icon--captions-on" />
            </CaptionsButton>
            <button type="button" className="yt-btn" aria-label="Settings">
              <GearIcon />
            </button>
            <PiPButton className="yt-btn media-button--pip" aria-label="Miniplayer">
              <PiPEnterIcon className="media-icon media-icon--pip-enter" />
              <PiPExitIcon className="media-icon media-icon--pip-exit" />
            </PiPButton>
            <button type="button" className="yt-btn" aria-label="Theater mode">
              <TheaterIcon />
            </button>
            <FullscreenButton
              className="yt-btn media-button--fullscreen"
              aria-label="Fullscreen"
            >
              <FullscreenEnterIcon className="media-icon media-icon--fullscreen-enter" />
              <FullscreenExitIcon className="media-icon media-icon--fullscreen-exit" />
            </FullscreenButton>
          </div>
        </div>
      </Controls.Root>

      <Gesture type="tap" action="togglePaused" pointer="mouse" region="center" />
      <Gesture type="doubletap" action="toggleFullscreen" region="center" />
      <Hotkey keys="Space" action="togglePaused" />
      <Hotkey keys="k" action="togglePaused" />
      <Hotkey keys="m" action="toggleMuted" />
      <Hotkey keys="f" action="toggleFullscreen" />
      <Hotkey keys="ArrowRight" action="seekStep" value={5} />
      <Hotkey keys="ArrowLeft" action="seekStep" value={-5} />
    </Container>
  );
}

export function App() {
  return (
    <main>
      <h1>ax-bench</h1>
      <div style={{ aspectRatio: '16 / 9', width: '100%' }}>
        <Player.Provider>
          <YouTubeSkin poster={POSTER_URL} title={TITLE}>
            <HlsVideo src={STREAM_URL} autoPlay muted loop playsInline />
          </YouTubeSkin>
        </Player.Provider>
      </div>
    </main>
  );
}
