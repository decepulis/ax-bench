import { useEffect, useRef } from 'react';
import {
  CaptionsButton,
  Container,
  Controls,
  FullscreenButton,
  Gesture,
  Hotkey,
  MuteButton,
  PlayButton,
  PlaybackRateButton,
  Poster,
  Time,
  TimeSlider,
  VolumeSlider,
  createPlayer,
} from '@videojs/react';
import { Video, videoFeatures } from '@videojs/react/video';
import './player.css';

const Player = createPlayer({ features: videoFeatures });

const PLAYBACK_ID = 'BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM';
const SRC = `https://stream.mux.com/${PLAYBACK_ID}.m3u8`;
const POSTER = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.webp?time=0`;
const TITLE = 'Two bros';

function Icon({
  path,
  className,
}: {
  path: string;
  className?: string;
}) {
  return (
    <svg
      className={['yt-icon', className].filter(Boolean).join(' ')}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d={path} />
    </svg>
  );
}

const PLAY = 'M8 5v14l11-7z';
const PAUSE = 'M6 4h4v16H6zm8 0h4v16h-4z';
const VOLUME_HIGH =
  'M3 9v6h4l5 5V4L7 9zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z';
const VOLUME_OFF =
  'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C23.16 14.33 24 12.27 24 10c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9zM12 4 9.91 6.09 12 8.18z';
const SETTINGS =
  'M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1a7.03 7.03 0 0 0-1.69-.98l-.38-2.65A.5.5 0 0 0 14 2h-4a.5.5 0 0 0-.49.42l-.38 2.65c-.61.24-1.17.56-1.69.98l-2.49-1a.5.5 0 0 0-.61.22l-2 3.46a.5.5 0 0 0 .12.64L4.57 11.02c-.04.32-.07.64-.07.98s.03.66.07.98L2.46 14.63a.5.5 0 0 0-.12.64l2 3.46c.14.24.43.34.61.22l2.49-1c.52.42 1.08.74 1.69.98l.38 2.65c.05.24.26.42.5.42h4a.5.5 0 0 0 .49-.42l.38-2.65c.61-.24 1.17-.56 1.69-.98l2.49 1c.18.12.47.02.61-.22l2-3.46a.5.5 0 0 0-.12-.64zM12 15.5A3.5 3.5 0 1 1 12 8.5a3.5 3.5 0 0 1 0 7z';
const CC =
  'M19 4H5a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm-8 7H9.5v-.5h-2v3h2V13H11v1c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1zm7 0h-1.5v-.5h-2v3h2V13H18v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1z';
const THEATER =
  'M19 6.002H5c-1.1 0-2 .898-2 2v8c0 1.101.9 2 2 2h14c1.1 0 2-.899 2-2v-8c0-1.102-.9-2-2-2zm0 10H5v-8h14v8z';
const FS_ENTER = 'M7 14H5v5h5v-2H7zm-2-4h2V7h3V5H5zm12 7h-3v2h5v-5h-2zM14 5v2h3v3h2V5z';
const FS_EXIT = 'M5 16h3v3h2v-5H5zm3-8H5v2h5V5H8zm6 11h2v-3h3v-2h-5zm2-11V5h-2v5h5V8z';

export function App() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  return (
    <main>
      <Player.Provider>
        <Container className="yt-player">
          <Video ref={videoRef} src={SRC} playsInline autoPlay muted loop />
          <Poster src={POSTER} className="yt-poster" alt="" />
          <div className="yt-watermark">MUX</div>
          <div className="yt-gradient" />

          <Gesture
            type="tap"
            action="togglePaused"
            pointer="mouse"
            region="center"
          />

          <Controls.Root className="yt-controls">
            <TimeSlider.Root className="yt-progress">
              <TimeSlider.Track className="yt-progress__track">
                <TimeSlider.Buffer className="yt-progress__buffer" />
                <TimeSlider.Fill className="yt-progress__fill" />
              </TimeSlider.Track>
              <TimeSlider.Thumb className="yt-progress__thumb" />
            </TimeSlider.Root>

            <div className="yt-row">
              <div className="yt-left">
                <PlayButton className="yt-btn" aria-label="Play / Pause">
                  <Icon path={PLAY} className="yt-icon--play" />
                  <Icon path={PAUSE} className="yt-icon--pause" />
                </PlayButton>

                <div className="yt-volume">
                  <MuteButton className="yt-btn" aria-label="Mute">
                    <Icon path={VOLUME_HIGH} className="yt-icon--volume-high" />
                    <Icon path={VOLUME_OFF} className="yt-icon--volume-off" />
                  </MuteButton>
                  <VolumeSlider.Root
                    className="yt-volume__slider"
                    orientation="horizontal"
                  >
                    <VolumeSlider.Track className="yt-volume__track">
                      <VolumeSlider.Fill className="yt-volume__fill" />
                    </VolumeSlider.Track>
                    <VolumeSlider.Thumb className="yt-volume__thumb" />
                  </VolumeSlider.Root>
                </div>

                <div className="yt-time">
                  <Time.Value type="current" />
                  <span className="yt-time__sep">/</span>
                  <Time.Value type="duration" />
                </div>

                <div className="yt-title">{TITLE}</div>
              </div>

              <div className="yt-right">
                <PlaybackRateButton className="yt-btn" aria-label="Settings">
                  <Icon path={SETTINGS} />
                </PlaybackRateButton>
                <CaptionsButton className="yt-btn" aria-label="Captions">
                  <Icon path={CC} />
                </CaptionsButton>
                <button type="button" className="yt-btn" aria-label="Theater mode">
                  <Icon path={THEATER} />
                </button>
                <FullscreenButton className="yt-btn" aria-label="Fullscreen">
                  <Icon path={FS_ENTER} className="yt-icon--fs-enter" />
                  <Icon path={FS_EXIT} className="yt-icon--fs-exit" />
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
        </Container>
      </Player.Provider>
    </main>
  );
}
