import { VideoPlayer } from './Player';

const PLAYBACK_ID = 'BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM';
const VIDEO_SRC = `https://stream.mux.com/${PLAYBACK_ID}.m3u8`;
const POSTER_SRC = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.jpg?time=0`;

export function App() {
  return (
    <main>
      <h1>ax-bench</h1>
      <VideoPlayer src={VIDEO_SRC} poster={POSTER_SRC} title="Two bros" />
    </main>
  );
}
