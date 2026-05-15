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
  Popover,
  Poster,
  SeekButton,
  Time,
  TimeSlider,
  VolumeSlider,
  createPlayer,
  videoFeatures,
} from '@videojs/react';
import { HlsVideo } from '@videojs/react/media/hls-video';
import './player.css';

const PLAYBACK_ID = 'BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM';
const HLS_SRC = `https://stream.mux.com/${PLAYBACK_ID}.m3u8`;
const POSTER_SRC = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.webp?time=0`;
const VIDEO_TITLE = 'ax-bench sample';

const { Provider } = createPlayer({ features: videoFeatures });

const Icon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 36 36" aria-hidden="true" className="yt-icon" {...props} />
);

const PlayGlyph = () => (
  <Icon>
    <path fill="currentColor" d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z" />
  </Icon>
);
const PauseGlyph = () => (
  <Icon>
    <path fill="currentColor" d="M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z" />
  </Icon>
);
const NextGlyph = () => (
  <Icon>
    <path fill="currentColor" d="M 12,24 20.5,18 12,12 V 24 z M 22,12 V 24 H 25 V 12 H 22 z" />
  </Icon>
);
const VolumeOnGlyph = () => (
  <Icon>
    <path
      fill="currentColor"
      d="M 8,21 V 15 H 12 L 17,10 V 26 L 12,21 H 8 z M 23.5,18 c 0,-1.77 -1.02,-3.29 -2.5,-4.03 v 8.05 c 1.48,-0.73 2.5,-2.25 2.5,-4.02 z M 21,6.46 v 2.06 c 2.89,0.86 5,3.54 5,6.71 0,3.17 -2.11,5.85 -5,6.71 v 2.06 c 4.01,-0.91 7,-4.49 7,-8.77 0,-4.28 -2.99,-7.86 -7,-8.77 z"
    />
  </Icon>
);
const VolumeOffGlyph = () => (
  <Icon>
    <path
      fill="currentColor"
      d="m 21.48,17.98 c 0,-1.77 -1.02,-3.29 -2.5,-4.03 v 2.21 l 2.45,2.45 c 0.03,-0.2 0.05,-0.41 0.05,-0.63 z m 2.5,0 c 0,0.94 -0.2,1.82 -0.54,2.64 l 1.51,1.51 c 0.65,-1.22 1.02,-2.61 1.02,-4.15 0,-4.28 -2.99,-7.86 -7,-8.77 v 2.06 c 2.89,0.86 5,3.54 5,6.71 z M 9.25,8.98 7.98,10.24 12.71,14.98 H 7.98 v 6 H 11.98 l 5,5 V 19.25 L 21.23,23.5 c -0.67,0.52 -1.42,0.93 -2.25,1.18 v 2.06 c 1.38,-0.31 2.63,-0.95 3.69,-1.81 l 2.04,2.05 1.27,-1.27 -9,-9 -7.72,-7.72 z M 16.98,9.98 14.89,12.06 16.98,14.15 V 9.98 z"
    />
  </Icon>
);
const CaptionsGlyph = () => (
  <Icon>
    <path
      fill="currentColor"
      d="M 11,11 C 9.9,11 9,11.9 9,13 v 10 c 0,1.1 0.9,2 2,2 h 14 c 1.1,0 2,-0.9 2,-2 V 13 c 0,-1.1 -0.9,-2 -2,-2 z m 0,9 h 3 v 1 h -3 z m 0,-3 h 5 v 1 h -5 z m 7,3 h 4 v 1 h -4 z m 0,-3 h 7 v 1 h -7 z"
    />
  </Icon>
);
const SettingsGlyph = () => (
  <Icon>
    <path
      fill="currentColor"
      d="m 23.94,18.78 c 0.03,-0.25 0.05,-0.51 0.05,-0.78 0,-0.27 -0.02,-0.52 -0.05,-0.78 l 1.68,-1.32 c 0.15,-0.12 0.19,-0.34 0.1,-0.51 l -1.6,-2.76 c -0.09,-0.17 -0.31,-0.24 -0.48,-0.17 l -1.99,0.8 c -0.41,-0.32 -0.86,-0.58 -1.35,-0.78 l -0.30,-2.12 c -0.02,-0.20 -0.20,-0.34 -0.40,-0.34 h -3.20 c -0.20,0 -0.37,0.14 -0.40,0.34 l -0.30,2.12 c -0.49,0.20 -0.94,0.46 -1.35,0.78 l -1.99,-0.80 c -0.18,-0.07 -0.39,0 -0.48,0.17 l -1.60,2.76 c -0.10,0.17 -0.05,0.39 0.10,0.51 l 1.68,1.32 c -0.03,0.26 -0.05,0.52 -0.05,0.78 0,0.27 0.02,0.52 0.05,0.78 l -1.68,1.32 c -0.15,0.12 -0.19,0.34 -0.10,0.51 l 1.60,2.76 c 0.09,0.17 0.31,0.24 0.48,0.17 l 1.99,-0.80 c 0.41,0.32 0.86,0.58 1.35,0.78 l 0.30,2.12 c 0.03,0.20 0.20,0.34 0.40,0.34 h 3.20 c 0.20,0 0.38,-0.14 0.40,-0.34 l 0.30,-2.12 c 0.49,-0.20 0.94,-0.46 1.35,-0.78 l 1.99,0.80 c 0.18,0.07 0.39,0 0.48,-0.17 l 1.60,-2.76 c 0.09,-0.17 0.05,-0.39 -0.10,-0.51 l -1.68,-1.32 z M 18,21 c -1.66,0 -3,-1.34 -3,-3 0,-1.66 1.34,-3 3,-3 1.66,0 3,1.34 3,3 0,1.66 -1.34,3 -3,3 z"
    />
  </Icon>
);
const PipGlyph = () => (
  <Icon>
    <path
      fill="currentColor"
      d="M 25,17 H 17 v 6.4 h 8 V 17 z M 29,25.4 V 10.6 C 29,9.7 28.2,9 27.2,9 H 8.8 C 7.8,9 7,9.7 7,10.6 v 14.8 C 7,26.3 7.8,27 8.8,27 H 27.2 C 28.2,27 29,26.3 29,25.4 z M 27.2,25.42 H 8.8 V 10.58 H 27.2 V 25.42 z"
    />
  </Icon>
);
const FullscreenEnterGlyph = () => (
  <Icon>
    <g fill="currentColor">
      <path d="m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 l 0,6 0,0 z" />
      <path d="m 20,10 0,2 4,0 0,4 2,0 L 26,10 l -6,0 0,0 z" />
      <path d="m 24,24 -4,0 0,2 L 26,26 l 0,-6 -2,0 0,4 0,0 z" />
      <path d="M 12,20 10,20 10,26 l 6,0 0,-2 -4,0 0,-4 0,0 z" />
    </g>
  </Icon>
);
const FullscreenExitGlyph = () => (
  <Icon>
    <g fill="currentColor">
      <path d="m 14,14 -4,0 0,2 6,0 0,-6 -2,0 0,4 0,0 z" />
      <path d="m 22,14 0,-4 -2,0 0,6 6,0 0,-2 -4,0 0,0 z" />
      <path d="m 20,26 2,0 0,-4 4,0 0,-2 -6,0 0,6 0,0 z" />
      <path d="m 10,22 4,0 0,4 2,0 0,-6 -6,0 0,2 0,0 z" />
    </g>
  </Icon>
);

export function App() {
  return (
    <main>
      <h1>ax-bench</h1>
      <Provider>
        <Container className="yt-player">
          <HlsVideo
            className="yt-video"
            src={HLS_SRC}
            autoPlay
            muted
            loop
            playsInline
          />

          <Poster className="yt-poster" src={POSTER_SRC} alt="" />

          <BufferingIndicator
            render={(props, state) => (
              <div
                {...props}
                className="yt-buffering"
                data-visible={state.visible ? '' : undefined}
              >
                <div className="yt-spinner" />
              </div>
            )}
          />

          <div className="yt-bottom-gradient" aria-hidden="true" />

          <Controls.Root className="yt-controls">
            <TimeSlider.Root className="yt-progress">
              <TimeSlider.Track className="yt-progress__track">
                <TimeSlider.Buffer className="yt-progress__buffer" />
                <TimeSlider.Fill className="yt-progress__fill" />
              </TimeSlider.Track>
              <TimeSlider.Thumb className="yt-progress__thumb" />
            </TimeSlider.Root>

            <div className="yt-controls__row">
              <div className="yt-controls__left">
                <PlayButton
                  render={(props, state) => (
                    <button
                      {...props}
                      type="button"
                      className="yt-btn"
                      aria-label={state.paused ? 'Play' : 'Pause'}
                    >
                      {state.paused ? <PlayGlyph /> : <PauseGlyph />}
                    </button>
                  )}
                />

                <SeekButton
                  seconds={10}
                  render={(props) => (
                    <button
                      {...props}
                      type="button"
                      className="yt-btn"
                      aria-label="Next"
                    >
                      <NextGlyph />
                    </button>
                  )}
                />

                <Popover.Root
                  openOnHover
                  delay={100}
                  closeDelay={150}
                  side="top"
                  align="start"
                >
                  <Popover.Trigger
                    render={
                      <MuteButton
                        render={(props, state) => (
                          <button
                            {...props}
                            type="button"
                            className="yt-btn yt-btn--volume"
                            aria-label={state.muted ? 'Unmute' : 'Mute'}
                          >
                            {state.muted ? <VolumeOffGlyph /> : <VolumeOnGlyph />}
                          </button>
                        )}
                      />
                    }
                  />
                  <Popover.Popup className="yt-volume-popup">
                    <VolumeSlider.Root
                      orientation="horizontal"
                      className="yt-volume-slider"
                    >
                      <VolumeSlider.Track className="yt-volume-slider__track">
                        <VolumeSlider.Fill className="yt-volume-slider__fill" />
                      </VolumeSlider.Track>
                      <VolumeSlider.Thumb className="yt-volume-slider__thumb" />
                    </VolumeSlider.Root>
                  </Popover.Popup>
                </Popover.Root>

                <div className="yt-time">
                  <Time.Value type="current" />
                  <span className="yt-time__sep"> / </span>
                  <Time.Value type="duration" />
                </div>

                <div className="yt-title">{VIDEO_TITLE}</div>
              </div>

              <div className="yt-controls__right">
                <CaptionsButton
                  render={(props) => (
                    <button
                      {...props}
                      type="button"
                      className="yt-btn"
                      aria-label="Subtitles/closed captions"
                    >
                      <CaptionsGlyph />
                    </button>
                  )}
                />

                <PlaybackRateButton
                  render={(props) => (
                    <button
                      {...props}
                      type="button"
                      className="yt-btn"
                      aria-label="Settings"
                    >
                      <SettingsGlyph />
                    </button>
                  )}
                />

                <PiPButton
                  render={(props) => (
                    <button
                      {...props}
                      type="button"
                      className="yt-btn"
                      aria-label="Miniplayer"
                    >
                      <PipGlyph />
                    </button>
                  )}
                />

                <FullscreenButton
                  render={(props, state) => (
                    <button
                      {...props}
                      type="button"
                      className="yt-btn"
                      aria-label={state.active ? 'Exit fullscreen' : 'Fullscreen'}
                    >
                      {state.active ? <FullscreenExitGlyph /> : <FullscreenEnterGlyph />}
                    </button>
                  )}
                />
              </div>
            </div>
          </Controls.Root>

          <Hotkey keys="Space" action="togglePaused" />
          <Hotkey keys="k" action="togglePaused" />
          <Hotkey keys="m" action="toggleMuted" />
          <Hotkey keys="f" action="toggleFullscreen" />
          <Hotkey keys="ArrowRight" action="seekStep" value={5} />
          <Hotkey keys="ArrowLeft" action="seekStep" value={-5} />
          <Gesture type="tap" action="togglePaused" pointer="mouse" />
        </Container>
      </Provider>
    </main>
  );
}
