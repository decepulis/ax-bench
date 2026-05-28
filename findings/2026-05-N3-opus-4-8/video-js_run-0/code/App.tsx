import { VideoPlayer } from './Player';

const HLS_SRC =
  'https://stream.mux.com/BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM.m3u8';

const POSTER =
  'https://image.mux.com/BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM/thumbnail.webp?time=0';

export function App() {
  return (
    <main>
      <h1>ax-bench</h1>
      <VideoPlayer src={HLS_SRC} poster={POSTER} />
    </main>
  );
}
