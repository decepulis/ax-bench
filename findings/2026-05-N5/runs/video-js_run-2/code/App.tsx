import { useEffect, useRef } from 'react';
import { createPlayer, videoFeatures } from '@videojs/react';
import { Video } from '@videojs/react/video';
import { CustomVideoSkin } from './CustomVideoSkin';

const Player = createPlayer({ features: videoFeatures });

const PLAYBACK_ID = 'BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM';
const SRC = `https://stream.mux.com/${PLAYBACK_ID}.m3u8`;
const POSTER = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.jpg?time=0`;

export function App() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // React renders `muted` as a DOM property, not an attribute, which can race
  // against Chrome's autoplay policy. Set it imperatively then start playback.
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.play().catch(() => {});
  }, []);

  return (
    <main>
      <h1>ax-bench</h1>
      <Player.Provider>
        <CustomVideoSkin poster={POSTER} title="Two bros">
          <Video
            ref={videoRef}
            src={SRC}
            poster={POSTER}
            playsInline
            autoPlay
            muted
            loop
          />
        </CustomVideoSkin>
      </Player.Provider>
    </main>
  );
}
