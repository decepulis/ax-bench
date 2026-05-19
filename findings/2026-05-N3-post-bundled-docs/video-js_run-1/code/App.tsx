import { VideoPlayer } from './Player';

const PLAYBACK_ID = 'BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM';
const SRC = `https://stream.mux.com/${PLAYBACK_ID}.m3u8`;
const POSTER = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.jpg?time=0`;

export function App() {
  return (
    <main>
      <h1>ax-bench</h1>
      <VideoPlayer src={SRC} poster={POSTER} />
    </main>
  );
}
