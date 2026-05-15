import { createPlayer, videoFeatures } from '@videojs/react';
import { HlsVideo } from '@videojs/react/media/hls-video';
import { YouTubeSkin } from './YouTubeSkin';
import './youtube-skin.css';

const PLAYBACK_ID = 'BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM';
const SRC = `https://stream.mux.com/${PLAYBACK_ID}.m3u8`;
const POSTER = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.jpg?time=0`;

const player = createPlayer({ features: videoFeatures });

export function App() {
  return (
    <main>
      <h1>ax-bench</h1>
      <player.Provider>
        <YouTubeSkin poster={POSTER} title="Two bros">
          <HlsVideo src={SRC} autoPlay muted loop playsInline />
        </YouTubeSkin>
      </player.Provider>
    </main>
  );
}
