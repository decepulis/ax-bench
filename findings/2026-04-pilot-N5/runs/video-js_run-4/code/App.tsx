import { useEffect, useRef } from 'react';
import {
  createPlayer,
  videoFeatures,
  PlayButton,
  SeekButton,
  MuteButton,
  FullscreenButton,
  PiPButton,
  CaptionsButton,
  PlaybackRateButton,
  Poster,
  BufferingIndicator,
  Controls,
  TimeSlider,
  VolumeSlider,
  Time,
  Hotkey,
  Gesture,
} from '@videojs/react';
import { Video } from '@videojs/react/video';

const PLAYBACK_ID = 'BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM';
const VIDEO_SRC = `https://stream.mux.com/${PLAYBACK_ID}.m3u8`;
const POSTER_SRC = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.jpg?time=0`;
const TITLE = 'Two bros';

const { Provider, Container } = createPlayer({ features: videoFeatures });

const Icon = ({ d, className }: { d: string; className?: string }) => (
  <svg
    className={`yt-icon${className ? ` ${className}` : ''}`}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden
  >
    <path d={d} />
  </svg>
);

const PLAY = 'M8 5v14l11-7z';
const PAUSE = 'M6 5h4v14H6zm8 0h4v14h-4z';
const NEXT =
  'M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z';
const VOL_HIGH =
  'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z';
const VOL_LOW = 'M7 9v6h4l5 5V4l-5 5H7z';
const VOL_OFF =
  'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z';
const CC =
  'M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 7H9.5v-.5h-2v3h2V13H11v1c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1zm7 0h-1.5v-.5h-2v3h2V13H18v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1z';
const SETTINGS =
  'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94 0 .31.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z';
const PIP_ENTER =
  'M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z';
const FULLSCREEN_ENTER =
  'M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z';
const FULLSCREEN_EXIT =
  'M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z';
const SPINNER =
  'M12 4V2A10 10 0 002 12h2a8 8 0 018-8z';

export function App() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const tryPlay = () => void video.play().catch(() => {});
    if (video.readyState >= 2) tryPlay();
    video.addEventListener('loadeddata', tryPlay);
    return () => video.removeEventListener('loadeddata', tryPlay);
  }, []);

  return (
    <main>
      <h1>ax-bench</h1>
      <Provider>
        <Container className="yt-player">
          <Video
            ref={videoRef}
            src={VIDEO_SRC}
            playsInline
            autoPlay
            muted
            loop
          />
          <Poster src={POSTER_SRC} className="yt-poster" />

          <BufferingIndicator
            render={(props) => (
              <div {...props} className="yt-buffering">
                <Icon d={SPINNER} className="yt-spinner" />
              </div>
            )}
          />

          <div className="yt-gradient" />

          <Controls.Root className="yt-controls">
            <TimeSlider.Root className="yt-progress">
              <TimeSlider.Track className="yt-progress-track">
                <TimeSlider.Buffer className="yt-progress-buffer" />
                <TimeSlider.Fill className="yt-progress-fill" />
              </TimeSlider.Track>
              <TimeSlider.Thumb className="yt-progress-thumb" />
            </TimeSlider.Root>

            <div className="yt-bar">
              <div className="yt-bar-left">
                <PlayButton className="yt-btn yt-btn--play">
                  <Icon d={PLAY} className="yt-icon--play" />
                  <Icon d={PAUSE} className="yt-icon--pause" />
                </PlayButton>
                <SeekButton seconds={10} className="yt-btn">
                  <Icon d={NEXT} />
                </SeekButton>
                <MuteButton className="yt-btn yt-btn--mute">
                  <Icon d={VOL_OFF} className="yt-icon--vol-off" />
                  <Icon d={VOL_LOW} className="yt-icon--vol-low" />
                  <Icon d={VOL_HIGH} className="yt-icon--vol-high" />
                </MuteButton>
                <VolumeSlider.Root className="yt-volume">
                  <VolumeSlider.Track className="yt-volume-track">
                    <VolumeSlider.Fill className="yt-volume-fill" />
                  </VolumeSlider.Track>
                  <VolumeSlider.Thumb className="yt-volume-thumb" />
                </VolumeSlider.Root>
                <Time.Group className="yt-time">
                  <Time.Value type="current" />
                  <Time.Separator>{' / '}</Time.Separator>
                  <Time.Value type="duration" />
                </Time.Group>
                <span className="yt-title">{TITLE}</span>
              </div>

              <div className="yt-bar-right">
                <CaptionsButton className="yt-btn">
                  <Icon d={CC} />
                </CaptionsButton>
                <PlaybackRateButton className="yt-btn yt-btn--rate">
                  <Icon d={SETTINGS} />
                </PlaybackRateButton>
                <PiPButton className="yt-btn">
                  <Icon d={PIP_ENTER} />
                </PiPButton>
                <FullscreenButton className="yt-btn yt-btn--fullscreen">
                  <Icon d={FULLSCREEN_ENTER} className="yt-icon--fs-enter" />
                  <Icon d={FULLSCREEN_EXIT} className="yt-icon--fs-exit" />
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
          <Gesture
            type="tap"
            action="togglePaused"
            pointer="mouse"
            region="center"
          />
          <Gesture
            type="doubletap"
            action="toggleFullscreen"
            region="center"
          />
        </Container>
      </Provider>
    </main>
  );
}
