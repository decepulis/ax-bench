import { createPlayer } from '@videojs/react';
import { videoFeatures } from '@videojs/react/video';
import { HlsVideo } from '@videojs/react/media/hls-video';
import { YTSkin } from './Skin';

const Player = createPlayer({ features: videoFeatures });

const PLAYBACK_ID = 'BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM';
const SRC = `https://stream.mux.com/${PLAYBACK_ID}.m3u8`;
const POSTER = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.webp?time=0`;

export function App() {
  return (
    <main>
      <h1>ax-bench</h1>
      <Player.Provider>
        <YTSkin posterSrc={POSTER} title="Two bros">
          <HlsVideo
            src={SRC}
            poster={POSTER}
            autoPlay
            muted
            loop
            playsInline
            controls={false}
          />
        </YTSkin>
      </Player.Provider>
    </main>
  );
}
