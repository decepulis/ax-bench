import {
  createPlayer,
  Controls,
  TimeSlider,
  Time,
  PlayButton,
  MuteButton,
  CaptionsButton,
  PiPButton,
  FullscreenButton,
  Hotkey,
  Gesture,
} from '@videojs/react';
import { videoFeatures } from '@videojs/react/video';
import { HlsVideo } from '@videojs/react/media/hls-video';

const PLAYBACK_ID = 'BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM';
const HLS_SRC = `https://stream.mux.com/${PLAYBACK_ID}.m3u8`;
const POSTER_SRC = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.jpg?time=0`;
const TITLE = 'Two bros';

const { Provider, Container } = createPlayer({ features: videoFeatures });

function Icon({ d, className }: { d: string; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`yt-icon${className ? ` ${className}` : ''}`}
      aria-hidden="true"
    >
      <path d={d} fill="currentColor" />
    </svg>
  );
}

const ICON = {
  play: 'M8 5v14l11-7z',
  pause: 'M6 19h4V5H6v14zm8-14v14h4V5h-4z',
  volumeOn:
    'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z',
  volumeOff:
    'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.17v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z',
  settings:
    'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.488.488 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94 0 .32.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1 1 12 8.4a3.6 3.6 0 0 1 0 7.2z',
  cc: 'M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 7H9.5v-.5h-2v3h2V13H11v1c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1zm7 0h-1.5v-.5h-2v3h2V13H18v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1z',
  miniplayer:
    'M21 3H3c-1.11 0-2 .89-2 2v14c0 1.1.89 2 2 2h18c1.1 0 1.99-.9 1.99-2L23 5c0-1.11-.9-2-2-2zm0 16.01H3V4.98h18v14.03zM19 8h-8v6h8V8z',
  pip: 'M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z',
  fsEnter:
    'M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z',
  fsExit:
    'M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z',
};

export function App() {
  return (
    <main>
      <h1>ax-bench</h1>
      <Provider>
        <Container className="yt-player">
          <HlsVideo
            src={HLS_SRC}
            poster={POSTER_SRC}
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            className="yt-video"
          />
          <div className="yt-mux" aria-hidden="true">MUX</div>

          <Controls.Root className="yt-controls">
            <div className="yt-gradient" />

            <TimeSlider.Root className="yt-progress">
              <TimeSlider.Track className="yt-progress__track">
                <TimeSlider.Buffer className="yt-progress__buffer" />
                <TimeSlider.Fill className="yt-progress__fill" />
              </TimeSlider.Track>
              <TimeSlider.Thumb className="yt-progress__thumb" />
            </TimeSlider.Root>

            <div className="yt-bar">
              <div className="yt-bar__group">
                <PlayButton className="yt-btn yt-btn--play" aria-label="Play">
                  <Icon className="yt-icon--play" d={ICON.play} />
                  <Icon className="yt-icon--pause" d={ICON.pause} />
                </PlayButton>
                <MuteButton className="yt-btn yt-btn--mute" aria-label="Mute">
                  <Icon className="yt-icon--vol-on" d={ICON.volumeOn} />
                  <Icon className="yt-icon--vol-off" d={ICON.volumeOff} />
                </MuteButton>
                <div className="yt-time">
                  <Time.Value className="yt-time__value" type="current" />
                  <span className="yt-time__sep">/</span>
                  <Time.Value className="yt-time__value" type="duration" />
                </div>
                <div className="yt-title">{TITLE}</div>
              </div>

              <div className="yt-bar__group">
                <button
                  type="button"
                  className="yt-btn"
                  aria-label="Settings"
                  onClick={() => {}}
                >
                  <Icon d={ICON.settings} />
                </button>
                <CaptionsButton className="yt-btn yt-btn--cc" aria-label="Subtitles/closed captions">
                  <Icon d={ICON.cc} />
                </CaptionsButton>
                <button
                  type="button"
                  className="yt-btn"
                  aria-label="Miniplayer"
                  onClick={() => {}}
                >
                  <Icon d={ICON.miniplayer} />
                </button>
                <PiPButton className="yt-btn yt-btn--pip" aria-label="Picture in picture">
                  <Icon d={ICON.pip} />
                </PiPButton>
                <FullscreenButton className="yt-btn yt-btn--fs" aria-label="Fullscreen">
                  <Icon className="yt-icon--fs-enter" d={ICON.fsEnter} />
                  <Icon className="yt-icon--fs-exit" d={ICON.fsExit} />
                </FullscreenButton>
              </div>
            </div>
          </Controls.Root>

          <Gesture type="tap" action="togglePaused" pointer="mouse" region="center" />
          <Hotkey keys="Space" action="togglePaused" />
          <Hotkey keys="k" action="togglePaused" />
          <Hotkey keys="m" action="toggleMuted" />
          <Hotkey keys="f" action="toggleFullscreen" />
          <Hotkey keys="ArrowRight" action="seekStep" value={5} />
          <Hotkey keys="ArrowLeft" action="seekStep" value={-5} />
        </Container>
      </Provider>
    </main>
  );
}
