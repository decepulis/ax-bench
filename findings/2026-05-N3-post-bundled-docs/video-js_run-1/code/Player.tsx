import '@videojs/react/video/skin.css';
import './Player.css';
import { createPlayer, videoFeatures } from '@videojs/react';
import { HlsVideo } from '@videojs/react/media/hls-video';
import { PlayerSkin } from './PlayerSkin';

const Player = createPlayer({ features: videoFeatures });

interface VideoPlayerProps {
  src: string;
  poster?: string;
}

export function VideoPlayer({ src, poster }: VideoPlayerProps) {
  return (
    <Player.Provider>
      <PlayerSkin poster={poster}>
        <HlsVideo src={src} playsInline autoPlay muted loop />
      </PlayerSkin>
    </Player.Provider>
  );
}
