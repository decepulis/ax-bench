import {
  MediaController,
  MediaPosterImage,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaPlayButton,
  MediaSeekForwardButton,
  MediaMuteButton,
  MediaVolumeRange,
  MediaCaptionsButton,
  MediaPipButton,
  MediaFullscreenButton,
} from "media-chrome/react";
import {
  MediaSettingsMenu,
  MediaSettingsMenuItem,
  MediaSettingsMenuButton,
  MediaPlaybackRateMenu,
  MediaRenditionMenu,
} from "media-chrome/react/menu";
import MuxVideo from "@mux/mux-video-react";

const PLAYBACK_ID = "BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM";
const POSTER = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.webp?time=0`;

export function App() {
  return (
    <main>
      <h1>ax-bench</h1>
      <MediaController className="yt-player" defaultSubtitles>
        <MuxVideo
          slot="media"
          playbackId={PLAYBACK_ID}
          poster={POSTER}
          crossOrigin=""
          muted
          loop
          autoPlay
          preload="auto"
        />
        <MediaPosterImage slot="poster" src={POSTER} />

        <div className="yt-chrome">
          <MediaTimeRange className="yt-progress" />

          <div className="yt-bar">
            <div className="yt-cluster">
              <MediaPlayButton className="yt-btn" />
              <MediaSeekForwardButton className="yt-btn" seekOffset={10} />
              <div className="yt-volume">
                <MediaMuteButton className="yt-btn" />
                <MediaVolumeRange className="yt-volume-range" />
              </div>
              <MediaTimeDisplay className="yt-time" showDuration />
            </div>

            <div className="yt-cluster">
              <MediaCaptionsButton className="yt-btn" />
              <MediaSettingsMenu hidden className="yt-settings">
                <MediaSettingsMenuItem>
                  Speed
                  <MediaPlaybackRateMenu slot="submenu" hidden>
                    <div slot="title">Speed</div>
                  </MediaPlaybackRateMenu>
                </MediaSettingsMenuItem>
                <MediaSettingsMenuItem>
                  Quality
                  <MediaRenditionMenu slot="submenu" hidden>
                    <div slot="title">Quality</div>
                  </MediaRenditionMenu>
                </MediaSettingsMenuItem>
              </MediaSettingsMenu>
              <MediaSettingsMenuButton className="yt-btn" />
              <MediaPipButton className="yt-btn" />
              <MediaFullscreenButton className="yt-btn" />
            </div>
          </div>
        </div>
      </MediaController>
    </main>
  );
}
