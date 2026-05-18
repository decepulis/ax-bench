import {
  CaptionsButton,
  Container,
  Controls,
  createPlayer,
  FullscreenButton,
  MuteButton,
  PiPButton,
  PlayButton,
  PlaybackRateButton,
  Poster,
  Time,
  TimeSlider,
} from '@videojs/react';
import { videoFeatures } from '@videojs/react/video';
import { HlsVideo } from '@videojs/react/media/hls-video';

const Player = createPlayer({ features: videoFeatures });

const PLAYBACK_ID = 'BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM';
const SRC = `https://stream.mux.com/${PLAYBACK_ID}.m3u8`;
const POSTER = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.webp?time=0`;
const TITLE = 'Two bros';

function Icon({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <svg
      className={`yt-icon${className ? ' ' + className : ''}`}
      viewBox="0 0 36 36"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function App() {
  return (
    <main>
      <h1>ax-bench</h1>
      <Player.Provider>
        <Container className="yt-player">
          <HlsVideo
            className="yt-video"
            src={SRC}
            autoPlay
            muted
            loop
            playsInline
          />
          <Poster className="yt-poster" src={POSTER} alt="" />

          <div className="yt-gradient" aria-hidden />

          <Controls.Root className="yt-controls">
            <TimeSlider.Root className="yt-progress">
              <TimeSlider.Track className="yt-progress__track">
                <TimeSlider.Buffer className="yt-progress__buffer" />
                <TimeSlider.Fill className="yt-progress__fill" />
              </TimeSlider.Track>
              <TimeSlider.Thumb className="yt-progress__thumb" />
            </TimeSlider.Root>

            <div className="yt-row">
              <div className="yt-group">
                <PlayButton className="yt-btn yt-btn--play" aria-label="Play">
                  <Icon className="yt-icon--play">
                    <path d="M 12,10 L 26,18 L 12,26 Z" />
                  </Icon>
                  <Icon className="yt-icon--pause">
                    <path d="M 12,10 H 16 V 26 H 12 Z M 21,10 H 25 V 26 H 21 Z" />
                  </Icon>
                </PlayButton>

                <MuteButton className="yt-btn yt-btn--mute" aria-label="Mute">
                  <Icon className="yt-icon--vol-on">
                    <path d="M 8,21 V 15 H 13 L 19,10 V 26 L 13,21 Z" />
                    <path
                      d="M 22,13 Q 26,18 22,23"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 25,10 Q 31,18 25,26"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </Icon>
                  <Icon className="yt-icon--vol-off">
                    <path d="M 8,21 V 15 H 13 L 19,10 V 26 L 13,21 Z" />
                    <path
                      d="M 23,14 L 30,22 M 30,14 L 23,22"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </Icon>
                </MuteButton>

                <span className="yt-time">
                  <Time.Value type="current" />
                  <span className="yt-time__sep"> / </span>
                  <Time.Value type="duration" />
                </span>

                <span className="yt-title">{TITLE}</span>
              </div>

              <div className="yt-group">
                <CaptionsButton className="yt-btn yt-btn--cc" aria-label="Subtitles">
                  <span className="yt-cc">CC</span>
                </CaptionsButton>

                <PlaybackRateButton className="yt-btn yt-btn--rate" aria-label="Settings">
                  <Icon>
                    <path
                      d="M 18,12 a 6,6 0 1 1 0,12 a 6,6 0 1 1 0,-12 z M 18,8 v 3 M 18,25 v 3 M 8,18 h 3 M 25,18 h 3 M 10.9,10.9 l 2.1,2.1 M 23,23 l 2.1,2.1 M 10.9,25.1 l 2.1,-2.1 M 23,13 l 2.1,-2.1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </Icon>
                </PlaybackRateButton>

                <PiPButton className="yt-btn yt-btn--pip" aria-label="Miniplayer">
                  <Icon>
                    <path
                      d="M 6,9 H 30 V 27 H 6 Z"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <rect x="18" y="17" width="10" height="8" fill="currentColor" />
                  </Icon>
                </PiPButton>

                <FullscreenButton className="yt-btn yt-btn--fs" aria-label="Fullscreen">
                  <Icon className="yt-icon--fs-enter">
                    <path
                      d="M 10,14 V 10 H 14 M 22,10 H 26 V 14 M 26,22 V 26 H 22 M 14,26 H 10 V 22"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="square"
                    />
                  </Icon>
                  <Icon className="yt-icon--fs-exit">
                    <path
                      d="M 14,10 V 14 H 10 M 22,14 V 10 H 26 M 26,22 H 22 V 26 M 14,26 V 22 H 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="square"
                    />
                  </Icon>
                </FullscreenButton>
              </div>
            </div>
          </Controls.Root>
        </Container>
      </Player.Provider>
    </main>
  );
}
