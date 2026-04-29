import MuxPlayer from "@mux/mux-player-react";

export function App() {
  return (
    <main>
      <h1>ax-bench</h1>
      <MuxPlayer
        theme="yt-theme"
        playbackId="BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM"
        streamType="on-demand"
        muted
        loop
        autoPlay
        poster="https://image.mux.com/BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM/thumbnail.webp?time=0"
      />
    </main>
  );
}
