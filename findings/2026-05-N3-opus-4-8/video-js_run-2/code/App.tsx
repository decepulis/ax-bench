import { VideoPlayer } from './Player';

const STREAM_URL =
  'https://stream.mux.com/BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM.m3u8';

export function App() {
  return (
    <main>
      <h1>ax-bench</h1>
      <VideoPlayer src={STREAM_URL} />
    </main>
  );
}
