import {
  BufferingIndicator,
  CaptionsButton,
  Container,
  Controls,
  createPlayer,
  FullscreenButton,
  Gesture,
  Hotkey,
  MuteButton,
  PiPButton,
  PlayButton,
  Poster,
  Time,
  TimeSlider,
  videoFeatures,
  VolumeSlider,
} from '@videojs/react';
import { HlsVideo } from '@videojs/react/media/hls-video';

const { Provider } = createPlayer({ features: videoFeatures });

const PLAYBACK_ID = 'BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM';
const SRC = `https://stream.mux.com/${PLAYBACK_ID}.m3u8`;
const POSTER = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.jpg?time=0`;
const TITLE = 'Two bros';

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d={d} />
    </svg>
  );
}

const ICONS = {
  play: 'M8 5v14l11-7z',
  pause: 'M6 19h4V5H6v14zm8-14v14h4V5h-4z',
  next: 'M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z',
  volumeHigh:
    'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z',
  volumeMuted:
    'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z',
  cc:
    'M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 1.99-.9 1.99-2L23 6c0-1.1-.9-2-2-2zM11 11H9.5v-.5h-2v3h2V13H11v1c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1zm7 0h-1.5v-.5h-2v3h2V13H18v1c0 .55-.45 1-1 1h-3c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1z',
  gear:
    'M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.12-.22-.39-.3-.61-.22l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.23-.09-.49 0-.61.22l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.12.22.39.3.61.22l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.23.09.49 0 .61-.22l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zM12 15.5c-1.93 0-3.5-1.57-3.5-3.5s1.57-3.5 3.5-3.5 3.5 1.57 3.5 3.5-1.57 3.5-3.5 3.5z',
  miniPlayer:
    'M21 3H3c-1.11 0-2 .89-2 2v14c0 1.1.89 2 2 2h18c1.1 0 2-.9 2-2V4.98C23 3.88 22.1 3 21 3zm0 16.01H3V4.99h18v14.02zm-10-7h9v6h-9z',
  theater:
    'M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z',
  fullscreenEnter:
    'M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z',
  fullscreenExit:
    'M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z',
  spinner:
    'M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z',
};

export function App() {
  return (
    <main>
      <h1>ax-bench</h1>
      <Provider>
        <Container className="yt">
          <HlsVideo
            className="yt__video"
            src={SRC}
            playsInline
            autoPlay
            muted
            loop
          />
          <Poster className="yt__poster" src={POSTER} />

          <BufferingIndicator
            render={(props, state) => (
              <div {...props} className="yt__buffering">
                {state.visible && <Icon d={ICONS.spinner} />}
              </div>
            )}
          />

          <Gesture event="tap" action="togglePaused" className="yt__gesture" />
          <Gesture
            event="doubletap"
            action="toggleFullscreen"
            className="yt__gesture"
          />

          <div className="yt__bottom-gradient" aria-hidden="true" />

          <Controls.Root className="yt__controls">
            <TimeSlider.Root className="yt__progress">
              <TimeSlider.Track className="yt__progress-track">
                <TimeSlider.Buffer className="yt__progress-buffer" />
                <TimeSlider.Fill className="yt__progress-fill" />
              </TimeSlider.Track>
              <TimeSlider.Thumb className="yt__progress-thumb" />
            </TimeSlider.Root>

            <div className="yt__row">
              <div className="yt__group yt__group--left">
                <PlayButton className="yt__btn">
                  <span className="yt__icon yt__icon--play">
                    <Icon d={ICONS.play} />
                  </span>
                  <span className="yt__icon yt__icon--pause">
                    <Icon d={ICONS.pause} />
                  </span>
                </PlayButton>

                <button
                  type="button"
                  className="yt__btn"
                  aria-label="Next video"
                >
                  <Icon d={ICONS.next} />
                </button>

                <div className="yt__volume">
                  <MuteButton className="yt__btn">
                    <span className="yt__icon yt__icon--vol-on">
                      <Icon d={ICONS.volumeHigh} />
                    </span>
                    <span className="yt__icon yt__icon--vol-off">
                      <Icon d={ICONS.volumeMuted} />
                    </span>
                  </MuteButton>
                  <VolumeSlider.Root className="yt__vol-slider">
                    <VolumeSlider.Track className="yt__vol-track">
                      <VolumeSlider.Fill className="yt__vol-fill" />
                    </VolumeSlider.Track>
                    <VolumeSlider.Thumb className="yt__vol-thumb" />
                  </VolumeSlider.Root>
                </div>

                <span className="yt__time">
                  <Time.Value type="currentTime" />
                  {' / '}
                  <Time.Value type="duration" />
                </span>

                <span className="yt__title">{TITLE}</span>
              </div>

              <div className="yt__group yt__group--right">
                <CaptionsButton className="yt__btn">
                  <Icon d={ICONS.cc} />
                </CaptionsButton>
                <button
                  type="button"
                  className="yt__btn"
                  aria-label="Settings"
                >
                  <Icon d={ICONS.gear} />
                </button>
                <button
                  type="button"
                  className="yt__btn"
                  aria-label="Miniplayer"
                >
                  <Icon d={ICONS.miniPlayer} />
                </button>
                <PiPButton className="yt__btn">
                  <Icon d={ICONS.theater} />
                </PiPButton>
                <FullscreenButton className="yt__btn">
                  <span className="yt__icon yt__icon--fs-enter">
                    <Icon d={ICONS.fullscreenEnter} />
                  </span>
                  <span className="yt__icon yt__icon--fs-exit">
                    <Icon d={ICONS.fullscreenExit} />
                  </span>
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
          <Hotkey keys="ArrowUp" action="volumeStep" value={0.05} />
          <Hotkey keys="ArrowDown" action="volumeStep" value={-0.05} />
        </Container>
      </Provider>
    </main>
  );
}
