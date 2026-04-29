import type { ReactNode } from 'react';
import {
  BufferingIndicator,
  CaptionsButton,
  Container,
  Controls,
  Gesture,
  Hotkey,
  MuteButton,
  PiPButton,
  PlaybackRateButton,
  PlayButton,
  Poster,
  TimeSlider,
  Time,
  createPlayer,
} from '@videojs/react';
import { videoFeatures } from '@videojs/react/video';
import { HlsVideo } from '@videojs/react/media/hls-video';
import './player.css';

const Player = createPlayer({ features: videoFeatures });

const PLAYBACK_ID = 'BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM';
const STREAM_URL = `https://stream.mux.com/${PLAYBACK_ID}.m3u8`;
const POSTER_URL = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.jpg?time=0`;

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M6 5h4v14H6zM14 5h4v14h-4z" />
  </svg>
);

const NextIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M6 6v12l8.5-6L6 6zm10 0v12h2V6h-2z" />
  </svg>
);

const VolumeOnIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
  </svg>
);

const VolumeMutedIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18z" />
  </svg>
);

const CCIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M19 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm-8 7H9.5v-.5h-2v3h2V13H11v1c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1zm7 0h-1.5v-.5h-2v3h2V13H18v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1z" />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.488.488 0 0 0 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1a.5.5 0 0 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65a.5.5 0 0 0-.12.64l2 3.46c.14.25.43.34.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.65zM12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z" />
  </svg>
);

const PiPIcon = () => (
  <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
    <path d="M19 7h-8v6h8V7zm2-4H3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zm0 16.01H3V4.98h18v14.03z" />
  </svg>
);

function YouTubeSkin({ children, poster }: { children: ReactNode; poster?: string }) {
  return (
    <Container className="yt-skin">
      {children}
      {poster && <Poster src={poster} className="yt-poster" />}
      <BufferingIndicator
        render={(props, state) => (
          <div {...props} className="yt-buffering">
            {state.visible && <div className="yt-spinner" />}
          </div>
        )}
      />

      <Gesture type="tap" action="togglePaused" pointer="mouse" region="center" />
      <Gesture type="tap" action="toggleControls" pointer="touch" />

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
            <PlayButton
              className="yt-btn"
              render={(props, state) => (
                <button {...props}>{state.paused ? <PlayIcon /> : <PauseIcon />}</button>
              )}
            />
            <button type="button" className="yt-btn" aria-label="Next">
              <NextIcon />
            </button>
            <MuteButton
              className="yt-btn"
              render={(props, state) => (
                <button {...props}>
                  {state.muted ? <VolumeMutedIcon /> : <VolumeOnIcon />}
                </button>
              )}
            />
            <button
              type="button"
              className="yt-btn yt-btn--share"
              onClick={() => console.log('shared')}
              aria-label="Share"
            >
              Share
            </button>
            <span className="yt-time">
              <Time.Value type="current" />
              <span className="yt-time__sep"> / </span>
              <Time.Value type="duration" />
            </span>
            <span className="yt-title">Two bros</span>
          </div>

          <div className="yt-bar__group yt-bar__group--right">
            <CaptionsButton className="yt-btn">
              <CCIcon />
            </CaptionsButton>
            <PlaybackRateButton
              className="yt-btn"
              render={(props) => (
                <button {...props} aria-label="Settings">
                  <SettingsIcon />
                </button>
              )}
            />
            <PiPButton className="yt-btn">
              <PiPIcon />
            </PiPButton>
          </div>
        </div>
      </Controls.Root>

      <Hotkey keys="Space" action="togglePaused" />
      <Hotkey keys="k" action="togglePaused" />
      <Hotkey keys="m" action="toggleMuted" />
      <Hotkey keys="ArrowRight" action="seekStep" value={5} />
      <Hotkey keys="ArrowLeft" action="seekStep" value={-5} />
      <Hotkey keys="0-9" action="seekToPercent" />
    </Container>
  );
}

export function App() {
  return (
    <main>
      <h1>ax-bench</h1>
      <Player.Provider>
        <YouTubeSkin poster={POSTER_URL}>
          <HlsVideo src={STREAM_URL} playsInline autoPlay muted loop />
        </YouTubeSkin>
      </Player.Provider>
    </main>
  );
}
