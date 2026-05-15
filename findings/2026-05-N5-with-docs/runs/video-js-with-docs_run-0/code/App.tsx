import {
  createPlayer,
  Container,
  Controls,
  BufferingIndicator,
  PlayButton,
  MuteButton,
  CaptionsButton,
  PiPButton,
  TimeSlider,
  VolumeSlider,
  Time,
  Hotkey,
  Poster,
} from '@videojs/react';
import { HlsVideo } from '@videojs/react/media/hls-video';
import { videoFeatures } from '@videojs/react/video';

const { Provider } = createPlayer({ features: videoFeatures });

const PLAYBACK_ID = 'BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM';
const SRC = `https://stream.mux.com/${PLAYBACK_ID}.m3u8`;
const POSTER = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.jpg?time=0`;

const PlayIcon = () => (
  <svg viewBox="0 0 36 36" fill="currentColor" aria-hidden="true">
    <path d="M11,10 L25,18 L11,26 Z" />
  </svg>
);
const PauseIcon = () => (
  <svg viewBox="0 0 36 36" fill="currentColor" aria-hidden="true">
    <path d="M11,10 H16 V26 H11 Z M20,10 H25 V26 H20 Z" />
  </svg>
);
const VolumeOnIcon = () => (
  <svg viewBox="0 0 36 36" fill="currentColor" aria-hidden="true">
    <path d="M8,21 V15 H13 L18,10 V26 L13,21 Z" />
    <path
      d="M21 13 C24 16 24 20 21 23 M25 10 C30 14 30 22 25 26"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
const VolumeOffIcon = () => (
  <svg viewBox="0 0 36 36" fill="currentColor" aria-hidden="true">
    <path d="M8,21 V15 H13 L18,10 V26 L13,21 Z" />
    <path
      d="M22,14 L30,22 M30,14 L22,22"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);
const CCIcon = () => (
  <svg
    viewBox="0 0 36 36"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    aria-hidden="true"
  >
    <rect x="5" y="11" width="26" height="14" rx="2.5" />
    <path d="M11 17 H16 M11 21 H14 M20 17 H25 M20 21 H23" />
  </svg>
);
const ShareIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
  </svg>
);
const PiPIcon = () => (
  <svg viewBox="0 0 36 36" fill="currentColor" aria-hidden="true">
    <path d="M7 10 H29 A2 2 0 0 1 31 12 V24 A2 2 0 0 1 29 26 H7 A2 2 0 0 1 5 24 V12 A2 2 0 0 1 7 10 Z" fill="none" stroke="currentColor" strokeWidth="1.8" />
    <rect x="18" y="17" width="9" height="7" rx="1" />
  </svg>
);
export function App() {
  return (
    <main>
      <h1>ax-bench</h1>
      <div className="player">
        <Provider>
          <Container className="yt-player">
            <HlsVideo
              src={SRC}
              autoPlay
              muted
              loop
              playsInline
              className="yt-video"
            />
            <Poster src={POSTER} alt="" className="yt-poster" />
            <BufferingIndicator
              render={(props) => (
                <div {...props} className="yt-spinner">
                  <div className="yt-spinner-ring" />
                </div>
              )}
            />
            <div className="yt-watermark">MUX</div>
            <div className="yt-gradient" />
            <Controls.Root className="yt-controls">
              <TimeSlider.Root className="yt-progress" aria-label="Seek">
                <TimeSlider.Track className="yt-progress-track">
                  <TimeSlider.Buffer className="yt-progress-buffer" />
                  <TimeSlider.Fill className="yt-progress-fill" />
                </TimeSlider.Track>
                <TimeSlider.Thumb className="yt-progress-thumb" />
              </TimeSlider.Root>
              <div className="yt-bar">
                <div className="yt-group">
                  <PlayButton className="yt-btn yt-btn--play" aria-label="Play (k)">
                    <PlayIcon />
                    <PauseIcon />
                  </PlayButton>
                  <div className="yt-volume">
                    <MuteButton className="yt-btn yt-btn--mute" aria-label="Mute (m)">
                      <VolumeOnIcon />
                      <VolumeOffIcon />
                    </MuteButton>
                    <VolumeSlider.Root className="yt-volume-slider" aria-label="Volume">
                      <VolumeSlider.Track className="yt-volume-track">
                        <VolumeSlider.Fill className="yt-volume-fill" />
                      </VolumeSlider.Track>
                      <VolumeSlider.Thumb className="yt-volume-thumb" />
                    </VolumeSlider.Root>
                  </div>
                  <div className="yt-time">
                    <Time.Value type="current" /> / <Time.Value type="duration" />
                  </div>
                </div>
                <div className="yt-group">
                  <CaptionsButton className="yt-btn yt-btn--cc" aria-label="Captions (c)">
                    <CCIcon />
                  </CaptionsButton>
                  <button
                    type="button"
                    className="yt-btn yt-btn--share"
                    aria-label="Share"
                    onClick={() => console.log('shared')}
                  >
                    <ShareIcon />
                  </button>
                  <PiPButton className="yt-btn yt-btn--pip" aria-label="Picture-in-picture (i)">
                    <PiPIcon />
                  </PiPButton>
                </div>
              </div>
            </Controls.Root>
            <Hotkey keys="Space" action="togglePaused" />
            <Hotkey keys="k" action="togglePaused" />
            <Hotkey keys="m" action="toggleMuted" />
          </Container>
        </Provider>
      </div>
    </main>
  );
}
