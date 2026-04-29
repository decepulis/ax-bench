import { useState, type SVGProps } from 'react';
import {
  createPlayer,
  videoFeatures,
  Container,
  Controls,
  PlayButton,
  MuteButton,
  CaptionsButton,
  PiPButton,
  FullscreenButton,
  Time,
  TimeSlider,
  Hotkey,
  Gesture,
  Poster,
  BufferingIndicator,
} from '@videojs/react';
import { HlsVideo } from '@videojs/react/media/hls-video';
import './player.css';

const PLAYBACK_ID = 'BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM';
const HLS_SRC = `https://stream.mux.com/${PLAYBACK_ID}.m3u8`;
const POSTER_SRC = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.jpg?time=0`;

const Player = createPlayer({ features: videoFeatures });

function Icon({ children, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" {...props}>
      {children}
    </svg>
  );
}

const PlayIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path fill="currentColor" d="M6 4l14 8-14 8z" />
  </Icon>
);
const PauseIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path fill="currentColor" d="M6 4h4v16H6zM14 4h4v16h-4z" />
  </Icon>
);
const VolumeIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path
      fill="currentColor"
      d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4.03v8.06A4.5 4.5 0 0 0 16.5 12zm-2.5-9v2.06A7 7 0 0 1 19 12a7 7 0 0 1-5 6.71V21a9 9 0 0 0 7-9 9 9 0 0 0-7-9z"
    />
  </Icon>
);
const VolumeOffIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path
      fill="currentColor"
      d="M16.5 12c0-1.77-1-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.93 8.93 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73 12 10.73 4.27 3zM12 4 9.91 6.09 12 8.18V4z"
    />
  </Icon>
);
const CCIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path
      fill="currentColor"
      d="M19 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM11 11H9.5v-.5h-2v3h2V13H11v1c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1zm7 0h-1.5v-.5h-2v3h2V13H18v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1z"
    />
  </Icon>
);
const GearIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path
      fill="currentColor"
      d="M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.49.49 0 0 0 14 2h-4a.49.49 0 0 0-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1a.5.5 0 0 0-.61.22l-2 3.46a.5.5 0 0 0 .12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98L2.46 14.63a.5.5 0 0 0-.12.64l2 3.46a.5.5 0 0 0 .61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.05.24.26.42.49.42h4c.24 0 .44-.17.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1a.5.5 0 0 0 .61-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.65zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"
    />
  </Icon>
);
const MiniPlayerIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path
      fill="currentColor"
      d="M21 3H3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 16h-9v-6h9v6z"
    />
  </Icon>
);
const FullscreenEnterIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path
      fill="currentColor"
      d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
    />
  </Icon>
);
const FullscreenExitIcon = (p: SVGProps<SVGSVGElement>) => (
  <Icon {...p}>
    <path
      fill="currentColor"
      d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
    />
  </Icon>
);

function YTPlayer() {
  const [autoplayOn, setAutoplayOn] = useState(true);

  return (
    <Player.Provider>
      <Container className="yt-player">
        <HlsVideo
          className="yt-video"
          src={HLS_SRC}
          autoPlay
          loop
          muted
          playsInline
        />
        <Poster className="yt-poster" src={POSTER_SRC} alt="" />
        <BufferingIndicator
          render={(props) => <div {...props} className="yt-spinner" />}
        />

        <Controls.Root className="yt-controls">
          <TimeSlider.Root className="yt-progress">
            <TimeSlider.Track className="yt-progress__track">
              <TimeSlider.Buffer className="yt-progress__buffer" />
              <TimeSlider.Fill className="yt-progress__fill" />
            </TimeSlider.Track>
            <TimeSlider.Thumb className="yt-progress__thumb" />
          </TimeSlider.Root>

          <div className="yt-bar">
            <div className="yt-bar__group">
              <PlayButton className="yt-btn yt-btn--play" aria-label="Play (k)">
                <PlayIcon className="yt-icon yt-icon--play" />
                <PauseIcon className="yt-icon yt-icon--pause" />
              </PlayButton>
              <MuteButton className="yt-btn yt-btn--mute" aria-label="Mute (m)">
                <VolumeIcon className="yt-icon yt-icon--volume" />
                <VolumeOffIcon className="yt-icon yt-icon--volume-off" />
              </MuteButton>
              <span className="yt-time">
                <Time.Value type="current" />
                <span className="yt-time__sep"> / </span>
                <Time.Value type="duration" />
              </span>
              <span className="yt-title">Two bros</span>
            </div>

            <div className="yt-bar__group">
              <button
                type="button"
                className="yt-autoplay"
                aria-label={autoplayOn ? 'Autoplay is on' : 'Autoplay is off'}
                aria-pressed={autoplayOn}
                data-on={autoplayOn ? '' : undefined}
                onClick={() => setAutoplayOn((v) => !v)}
              />
              <CaptionsButton className="yt-btn" aria-label="Subtitles (c)">
                <CCIcon className="yt-icon" />
              </CaptionsButton>
              <button type="button" className="yt-btn" aria-label="Settings">
                <GearIcon className="yt-icon" />
              </button>
              <PiPButton className="yt-btn" aria-label="Miniplayer (i)">
                <MiniPlayerIcon className="yt-icon" />
              </PiPButton>
              <FullscreenButton
                className="yt-btn yt-btn--fs"
                aria-label="Fullscreen (f)"
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
        <Hotkey keys="ArrowLeft" action="seekStep" value={-5} />
        <Hotkey keys="ArrowRight" action="seekStep" value={5} />
        <Gesture
          type="tap"
          action="togglePaused"
          pointer="mouse"
          region="center"
        />
      </Container>
    </Player.Provider>
  );
}

export function App() {
  return (
    <main>
      <h1>ax-bench</h1>
      <YTPlayer />
    </main>
  );
}
