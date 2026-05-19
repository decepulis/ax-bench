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
  PlaybackRateButton,
  PlayButton,
  Poster,
  SeekButton,
  Time,
  TimeSlider,
} from '@videojs/react';
import { videoFeatures } from '@videojs/react/video';
import { HlsVideo } from '@videojs/react/media/hls-video';
import {
  CaptionsOffIcon,
  CaptionsOnIcon,
  FullscreenEnterIcon,
  FullscreenExitIcon,
  PauseIcon,
  PipEnterIcon,
  PipExitIcon,
  PlayIcon,
  SpinnerIcon,
  VolumeHighIcon,
  VolumeOffIcon,
} from '@videojs/react/icons';

const Player = createPlayer({ features: videoFeatures });

const SRC = 'https://stream.mux.com/BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM.m3u8';
const POSTER =
  'https://image.mux.com/BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM/thumbnail.jpg?time=0';
const TITLE = 'Two bros';

export function App() {
  return (
    <main>
      <h1>ax-bench</h1>
      <Player.Provider>
        <Player.Container className="yt-player">
          <HlsVideo
            className="yt-video"
            src={SRC}
            playsInline
            autoPlay
            muted
            loop
          />

          <Poster className="yt-poster" src={POSTER} />

          <BufferingIndicator
            render={(props) => (
              <div {...props} className="yt-buffering">
                <SpinnerIcon className="yt-spinner" />
              </div>
            )}
          />

          <Gesture type="tap" action="togglePaused" pointer="mouse" region="center" />
          <Hotkey keys="Space" action="togglePaused" />
          <Hotkey keys="k" action="togglePaused" />
          <Hotkey keys="m" action="toggleMuted" />
          <Hotkey keys="f" action="toggleFullscreen" />
          <Hotkey keys="ArrowRight" action="seekStep" value={5} />
          <Hotkey keys="ArrowLeft" action="seekStep" value={-5} />

          <div className="yt-watermark">MUX</div>

          <Controls.Root className="yt-bottom">
            <TimeSlider.Root className="yt-progress" label="Seek">
              <TimeSlider.Track className="yt-progress__track">
                <TimeSlider.Buffer className="yt-progress__buffer" />
                <TimeSlider.Fill className="yt-progress__fill" />
              </TimeSlider.Track>
              <TimeSlider.Thumb className="yt-progress__thumb" />
            </TimeSlider.Root>

            <div className="yt-controls">
              <div className="yt-controls__group">
                <PlayButton className="yt-btn yt-btn--play" aria-label="Play / Pause">
                  <PlayIcon className="yt-icon yt-icon--play" />
                  <PauseIcon className="yt-icon yt-icon--pause" />
                </PlayButton>

                <SeekButton
                  seconds={10}
                  className="yt-btn yt-btn--next"
                  aria-label="Next"
                >
                  <NextIcon className="yt-icon" />
                </SeekButton>

                <MuteButton className="yt-btn yt-btn--mute" aria-label="Mute / Unmute">
                  <VolumeHighIcon className="yt-icon yt-icon--vol-on" />
                  <VolumeOffIcon className="yt-icon yt-icon--vol-off" />
                </MuteButton>

                <Time.Group className="yt-time">
                  <Time.Value type="current" />
                  <Time.Separator>{' / '}</Time.Separator>
                  <Time.Value type="duration" />
                </Time.Group>

                <span className="yt-title">{TITLE}</span>
              </div>

              <div className="yt-controls__group">
                <CaptionsButton className="yt-btn yt-btn--captions" aria-label="Subtitles/CC">
                  <CaptionsOnIcon className="yt-icon yt-icon--cc-on" />
                  <CaptionsOffIcon className="yt-icon yt-icon--cc-off" />
                </CaptionsButton>

                <PlaybackRateButton className="yt-btn yt-btn--settings" aria-label="Settings">
                  <GearIcon className="yt-icon" />
                </PlaybackRateButton>

                <PiPButton className="yt-btn yt-btn--pip" aria-label="Miniplayer">
                  <MiniPlayerIcon className="yt-icon yt-icon--pip-off" />
                  <PipExitIcon className="yt-icon yt-icon--pip-on" />
                </PiPButton>

                <button type="button" className="yt-btn yt-btn--theater" aria-label="Theater mode">
                  <TheaterIcon className="yt-icon" />
                </button>

                <FullscreenButton className="yt-btn yt-btn--fullscreen" aria-label="Fullscreen">
                  <FullscreenEnterIcon className="yt-icon yt-icon--fs-off" />
                  <FullscreenExitIcon className="yt-icon yt-icon--fs-on" />
                </FullscreenButton>
              </div>
            </div>
          </Controls.Root>
        </Player.Container>
      </Player.Provider>
    </main>
  );
}

type IconProps = { className?: string };

function NextIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 36 36" fill="currentColor" aria-hidden="true">
      <path d="M12 10v16l11-8zM23 10h2v16h-2z" />
    </svg>
  );
}

function GearIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96a7.03 7.03 0 00-1.62-.94l-.36-2.54A.488.488 0 0013.92 2h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96a.477.477 0 00-.59.22L2.74 8.47c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94 0 .31.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1112 8.4a3.6 3.6 0 010 7.2z" />
    </svg>
  );
}

function MiniPlayerIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 36 36" fill="currentColor" aria-hidden="true">
      <path d="M30 8H6a2 2 0 00-2 2v16a2 2 0 002 2h24a2 2 0 002-2V10a2 2 0 00-2-2zm0 18H6V10h24v16zM18 18h10v6H18z" />
    </svg>
  );
}

function TheaterIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 36 36" fill="currentColor" aria-hidden="true">
      <path d="M30 11H6c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h24c.55 0 1-.45 1-1V12c0-.55-.45-1-1-1zm-1 12H7V13h22v10z" />
    </svg>
  );
}
