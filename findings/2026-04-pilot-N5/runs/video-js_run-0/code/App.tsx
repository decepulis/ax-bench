import { createPlayer, videoFeatures } from '@videojs/react';
import { HlsVideo } from '@videojs/react/media/hls-video';
import { YouTubeSkin } from './YouTubeSkin';

const PLAYBACK_ID = 'BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM';
const VIDEO_SRC = `https://stream.mux.com/${PLAYBACK_ID}.m3u8`;
const POSTER_SRC = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.jpg?time=0`;

const { Provider } = createPlayer({ features: videoFeatures });

export function App() {
  return (
    <main>
      <h1>ax-bench</h1>
      <Provider>
        <YouTubeSkin
          poster={POSTER_SRC}
          title="Two bros"
          onShare={() => console.log('shared')}
        >
          <HlsVideo
            src={VIDEO_SRC}
            playsInline
            autoPlay
            muted
            loop
          />
        </YouTubeSkin>
      </Provider>
    </main>
  );
}
