import MuxVideo from "@mux/mux-video-react";
import {
  MediaCaptionsButton,
  MediaController,
  MediaControlBar,
  MediaFullscreenButton,
  MediaLoadingIndicator,
  MediaMuteButton,
  MediaPlayButton,
  MediaPosterImage,
  MediaTimeDisplay,
  MediaTimeRange,
  MediaVolumeRange,
} from "media-chrome/react";

const PLAYBACK_ID = "BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM";

export function App() {
  return (
    <main>
      <h1>ax-bench</h1>
      <MediaController className="yt-player">
        <MuxVideo
          slot="media"
          src={`https://stream.mux.com/${PLAYBACK_ID}.m3u8`}
          autoPlay
          muted
          loop
          playsInline
        />
        <MediaPosterImage
          slot="poster"
          src={`https://image.mux.com/${PLAYBACK_ID}/thumbnail.jpg?time=0`}
        />
        <MediaLoadingIndicator slot="centered-chrome" noAutohide />

        <MediaTimeRange />
        <MediaControlBar>
          <MediaPlayButton />
          <button className="yt-btn" type="button" aria-label="Next">
            <svg viewBox="0 0 36 36" width="22" height="22" aria-hidden="true">
              <path
                d="M 12,24 20.5,18 12,12 V 24 z M 22,12 H 24 V 24 H 22 V 12 z"
                fill="currentColor"
              />
            </svg>
          </button>
          <MediaMuteButton />
          <MediaVolumeRange />
          <MediaTimeDisplay showDuration />
          <span className="yt-title">Two bros</span>

          <span className="yt-spacer" />

          <MediaCaptionsButton />
          <button className="yt-btn" type="button" aria-label="Settings">
            <svg viewBox="0 0 36 36" width="22" height="22" aria-hidden="true">
              <path
                d="M 23.94,18.78 c .03,-0.25 .05,-0.51 .05,-0.78 0,-0.27 -0.02,-0.52 -0.05,-0.78 l 1.68,-1.32 c .15,-0.12 .19,-0.33 .09,-0.51 l -1.6,-2.76 c -0.09,-0.17 -0.31,-0.24 -0.48,-0.17 l -1.99,.8 c -0.41,-0.32 -0.86,-0.58 -1.35,-0.78 l -0.30,-2.12 c -0.03,-0.19 -0.19,-0.33 -0.39,-0.33 l -3.2,0 c -0.2,0 -0.36,.14 -0.39,.33 l -0.30,2.12 c -0.48,.2 -0.93,.47 -1.35,.78 l -1.99,-0.8 c -0.18,-0.07 -0.39,0 -0.48,.17 l -1.6,2.76 c -0.10,.17 -0.05,.39 .09,.51 l 1.68,1.32 c -0.03,.25 -0.05,.52 -0.05,.78 0,.26 .02,.52 .05,.78 l -1.68,1.32 c -0.15,.12 -0.19,.33 -0.09,.51 l 1.6,2.76 c .09,.17 .31,.24 .48,.17 l 1.99,-0.8 c .41,.32 .86,.58 1.35,.78 l .30,2.12 c .04,.19 .20,.33 .39,.33 l 3.2,0 c .2,0 .36,-0.14 .39,-0.33 l .30,-2.12 c .48,-0.2 .93,-0.47 1.35,-0.78 l 1.99,.8 c .18,.07 .39,0 .48,-0.17 l 1.6,-2.76 c .09,-0.17 .05,-0.39 -0.09,-0.51 l -1.68,-1.32 0,0 z M 18,21 c -1.66,0 -3,-1.34 -3,-3 0,-1.66 1.34,-3 3,-3 1.66,0 3,1.34 3,3 0,1.66 -1.34,3 -3,3 l 0,0 z"
                fill="currentColor"
              />
            </svg>
          </button>
          <button className="yt-btn" type="button" aria-label="Miniplayer">
            <svg viewBox="0 0 36 36" width="22" height="22" aria-hidden="true">
              <path d="M11,13 L11,21 L25,21 L25,13 L11,13 Z M23,19 L19,19 L19,16 L23,16 L23,19 Z" fill="currentColor" />
            </svg>
          </button>
          <button className="yt-btn" type="button" aria-label="Theater mode">
            <svg viewBox="0 0 36 36" width="22" height="22" aria-hidden="true">
              <path d="M 26,13 H 10 v 11 h 16 v -11 z m -1,9 H 11 v -8 h 14 v 8 z" fill="currentColor" />
            </svg>
          </button>
          <MediaFullscreenButton />
        </MediaControlBar>
      </MediaController>
    </main>
  );
}
