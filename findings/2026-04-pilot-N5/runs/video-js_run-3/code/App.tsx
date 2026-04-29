import {
  forwardRef,
  type DetailedHTMLProps,
  type VideoHTMLAttributes,
} from 'react';
import {
  BufferingIndicator,
  CaptionsButton,
  Controls,
  createPlayer,
  FullscreenButton,
  Gesture,
  Hotkey,
  MuteButton,
  PiPButton,
  PlayButton,
  PlaybackRateButton,
  Poster,
  SeekButton,
  Slider,
  Time,
  TimeSlider,
  useComposedRefs,
  useMediaAttach,
  VolumeSlider,
} from '@videojs/react';
import { videoFeatures } from '@videojs/react/video';
import '@videojs/html/media/hls-video';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'hls-video': DetailedHTMLProps<VideoHTMLAttributes<HTMLVideoElement>, HTMLVideoElement>;
    }
  }
}

const { Provider, Container } = createPlayer({ features: videoFeatures });

const HlsVideo = forwardRef<HTMLVideoElement, VideoHTMLAttributes<HTMLVideoElement>>(
  function HlsVideo(props, ref) {
    return <hls-video ref={useComposedRefs(ref, useMediaAttach())} {...props} />;
  },
);

const PLAYBACK_ID = 'BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM';
const SRC = `https://stream.mux.com/${PLAYBACK_ID}.m3u8`;
const POSTER = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.jpg?time=0`;
const TITLE = 'Two bros';

const I = ({ children, size = 24 }: { children: React.ReactNode; size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
    className="yt-icon"
  >
    {children}
  </svg>
);

const PlayIcon = () => <I><path d="M8 5v14l11-7z" /></I>;
const PauseIcon = () => <I><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></I>;
const NextIcon = () => <I><path d="M6 6l8.5 6L6 18V6zm10 0h2v12h-2z" /></I>;
const VolumeHighIcon = () => (
  <I>
    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3a4.5 4.5 0 0 0-2.5-4.03v8.05A4.5 4.5 0 0 0 16.5 12zM14 3.23v2.06a7 7 0 0 1 0 13.42v2.06a9 9 0 0 0 0-17.54z" />
  </I>
);
const VolumeMuteIcon = () => (
  <I>
    <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.21.05-.42.05-.63zM19 12c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.96 8.96 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06a8.99 8.99 0 0 0 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
  </I>
);
const CCIcon = () => (
  <I>
    <path d="M19 4H5c-1.11 0-2 .9-2 2v12c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.89-2-2-2zM11 11H9.5v-.5h-2v3h2V13H11v1c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1zm7 0h-1.5v-.5h-2v3h2V13H18v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1z" />
  </I>
);
const SettingsIcon = () => (
  <I>
    <path d="M19.43 12.98c.04-.32.07-.64.07-.98s-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65A.488.488 0 0 0 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98s.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z" />
  </I>
);
const TheaterIcon = () => (
  <I>
    <path d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z" />
  </I>
);
const FullscreenEnterIcon = () => (
  <I>
    <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
  </I>
);
const FullscreenExitIcon = () => (
  <I>
    <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
  </I>
);

export function App() {
  return (
    <main>
      <h1>ax-bench</h1>
      <Provider>
        <Container className="yt-player" tabIndex={0}>
          <HlsVideo
            src={SRC}
            playsInline
            crossOrigin="anonymous"
            muted
            loop
            autoPlay
            className="yt-video"
          />
          <Poster src={POSTER} className="yt-poster" />

          <BufferingIndicator className="yt-buffering">
            <span className="yt-spinner" aria-hidden="true" />
          </BufferingIndicator>

          <div className="yt-gradient" aria-hidden="true" />

          <Controls.Root className="yt-controls">
            <TimeSlider.Root className="yt-progress">
              <TimeSlider.Track className="yt-progress__track">
                <TimeSlider.Buffer className="yt-progress__buffer" />
                <TimeSlider.Fill className="yt-progress__fill" />
              </TimeSlider.Track>
              <TimeSlider.Thumb className="yt-progress__thumb" />
            </TimeSlider.Root>

            <div className="yt-bar">
              <div className="yt-bar__left">
                <PlayButton className="yt-btn">
                  <span className="yt-btn__pause"><PauseIcon /></span>
                  <span className="yt-btn__play"><PlayIcon /></span>
                </PlayButton>

                <SeekButton seconds={10} className="yt-btn" aria-label="Next">
                  <NextIcon />
                </SeekButton>

                <div className="yt-volume">
                  <MuteButton className="yt-btn">
                    <span className="yt-btn__unmuted"><VolumeHighIcon /></span>
                    <span className="yt-btn__muted"><VolumeMuteIcon /></span>
                  </MuteButton>
                  <VolumeSlider.Root className="yt-volume__slider">
                    <VolumeSlider.Track className="yt-volume__track">
                      <VolumeSlider.Fill className="yt-volume__fill" />
                    </VolumeSlider.Track>
                    <VolumeSlider.Thumb className="yt-volume__thumb" />
                  </VolumeSlider.Root>
                </div>

                <div className="yt-time">
                  <Time.Value type="current" />
                  <span className="yt-time__sep"> / </span>
                  <Time.Value type="duration" />
                </div>

                <div className="yt-title">{TITLE}</div>
              </div>

              <div className="yt-bar__right">
                <button type="button" className="yt-btn yt-autoplay" aria-label="Autoplay">
                  <span className="yt-autoplay__pill">
                    <span className="yt-autoplay__dot" />
                  </span>
                </button>

                <CaptionsButton className="yt-btn yt-cc">
                  <CCIcon />
                </CaptionsButton>

                <PlaybackRateButton className="yt-btn" aria-label="Settings">
                  <SettingsIcon />
                </PlaybackRateButton>

                <PiPButton className="yt-btn" aria-label="Theater mode">
                  <TheaterIcon />
                </PiPButton>

                <FullscreenButton className="yt-btn">
                  <span className="yt-btn__fs-enter"><FullscreenEnterIcon /></span>
                  <span className="yt-btn__fs-exit"><FullscreenExitIcon /></span>
                </FullscreenButton>
              </div>
            </div>
          </Controls.Root>

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
        </Container>
      </Provider>
    </main>
  );
}
