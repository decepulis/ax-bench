import { useEffect, useRef } from 'react';
import MuxPlayer from '@mux/mux-player-react';
import type MuxPlayerElement from '@mux/mux-player';

export function App() {
  const playerRef = useRef<MuxPlayerElement>(null);

  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    let stopped = false;

    const customize = () => {
      if (stopped) return;
      const bottomBar = player.shadowRoot
        ?.querySelector('media-theme')
        ?.shadowRoot?.querySelector('media-control-bar[part~="bottom"]');

      if (!bottomBar) {
        requestAnimationFrame(customize);
        return;
      }

      const spacer = bottomBar.querySelector<HTMLElement>('.spacer');
      if (spacer) spacer.style.order = '6';

      if (!bottomBar.querySelector('[data-title-display]')) {
        const titleEl = document.createElement('span');
        titleEl.dataset.titleDisplay = '';
        titleEl.textContent = 'Two bros';
        titleEl.style.cssText =
          'color:#fff;font:500 13px system-ui,sans-serif;padding:0 8px;align-self:center;order:5;white-space:nowrap;';
        bottomBar.appendChild(titleEl);
      }
    };

    customize();

    return () => {
      stopped = true;
    };
  }, []);

  return (
    <main>
      <h1>ax-bench</h1>
      <MuxPlayer
        ref={playerRef}
        playbackId="BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM"
        muted
        loop
        autoPlay
        thumbnailTime={0}
        accentColor="#ff0000"
      />
    </main>
  );
}
