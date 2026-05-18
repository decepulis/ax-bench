import MuxPlayer from "@mux/mux-player-react";

export function App() {
  return (
    <main>
      <h1>ax-bench</h1>
      <MuxPlayer
        playbackId="BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM"
        autoPlay
        muted
        loop
        thumbnailTime={0}
        accentColor="#ff3e00"
        theme="theme-youtube"
      />
    </main>
  );
}
