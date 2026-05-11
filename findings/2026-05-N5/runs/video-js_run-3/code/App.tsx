import { createPlayer, videoFeatures } from '@videojs/react';
import { HlsVideo } from '@videojs/react/media/hls-video';
import { YouTubeSkin } from './YouTubeSkin';
import './youtube-skin.css';

const PLAYBACK_ID = 'BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM';
const HLS_SRC = `https://stream.mux.com/${PLAYBACK_ID}.m3u8`;
const POSTER_SRC = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.webp?time=0`;

const Player = createPlayer({
  features: videoFeatures,
  displayName: 'VideoPlayer',
});

export function App() {
  return (
    <main>
      <h1>ax-bench</h1>
      <Player.Provider>
        <YouTubeSkin poster={POSTER_SRC} title="Two bros">
          <HlsVideo
            src={HLS_SRC}
            playsInline
            controls={false}
            autoPlay
            muted
            loop
          />
        </YouTubeSkin>
      </Player.Provider>
    </main>
  );
}
