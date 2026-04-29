import { useEffect, useRef, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import type { MuxPlayerRefAttributes } from "@mux/mux-player-react";

const PLAYBACK_ID = "BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM";

function fmtTime(s: number) {
  if (!isFinite(s) || s < 0) s = 0;
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${sec}`;
}

export function App() {
  const playerRef = useRef<MuxPlayerRefAttributes>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(true);
  const [autoplayOn, setAutoplayOn] = useState(true);

  useEffect(() => {
    const p = playerRef.current;
    if (!p) return;
    const onTime = () => setCurrentTime(p.currentTime);
    const onDur = () => setDuration(p.duration || 0);
    const onPlay = () => setPaused(false);
    const onPause = () => setPaused(true);
    const onVol = () => setMuted(p.muted);
    p.addEventListener("timeupdate", onTime);
    p.addEventListener("durationchange", onDur);
    p.addEventListener("play", onPlay);
    p.addEventListener("pause", onPause);
    p.addEventListener("volumechange", onVol);
    setMuted(p.muted);
    setPaused(p.paused);
    return () => {
      p.removeEventListener("timeupdate", onTime);
      p.removeEventListener("durationchange", onDur);
      p.removeEventListener("play", onPlay);
      p.removeEventListener("pause", onPause);
      p.removeEventListener("volumechange", onVol);
    };
  }, []);

  const togglePlay = () => {
    const p = playerRef.current;
    if (!p) return;
    if (p.paused) p.play();
    else p.pause();
  };

  const toggleMute = () => {
    const p = playerRef.current;
    if (!p) return;
    p.muted = !p.muted;
  };

  const skipNext = () => {
    const p = playerRef.current;
    if (!p || !p.duration) return;
    p.currentTime = p.duration;
  };

  const seekToFraction = (frac: number) => {
    const p = playerRef.current;
    if (!p || !p.duration) return;
    p.currentTime = Math.max(0, Math.min(p.duration, frac * p.duration));
  };

  const onSeekDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    el.setPointerCapture(e.pointerId);
    const handle = (clientX: number) => {
      const rect = el.getBoundingClientRect();
      const frac = (clientX - rect.left) / rect.width;
      seekToFraction(frac);
    };
    handle(e.clientX);
    const onMove = (ev: PointerEvent) => handle(ev.clientX);
    const onUp = (ev: PointerEvent) => {
      el.releasePointerCapture(ev.pointerId);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", onUp);
      el.removeEventListener("pointercancel", onUp);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
  };

  const toggleFullscreen = () => {
    const node = wrapRef.current;
    if (!node) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      node.requestFullscreen?.();
    }
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <main>
      <h1>ax-bench</h1>
      <div ref={wrapRef} className="yt-wrap">
        <MuxPlayer
          ref={playerRef}
          playbackId={PLAYBACK_ID}
          streamType="on-demand"
          muted
          loop
          autoPlay
          thumbnailTime={0}
          accentColor="#ff0000"
        />
        <button
          type="button"
          className="yt-click-layer"
          aria-label={paused ? "Play" : "Pause"}
          onClick={togglePlay}
        />
        <div className="yt-controls">
          <div
            className="yt-progress"
            role="slider"
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={duration || 0}
            aria-valuenow={currentTime}
            onPointerDown={onSeekDown}
          >
            <div className="yt-progress-track">
              <div
                className="yt-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div
              className="yt-progress-thumb"
              style={{ left: `${progress}%` }}
            />
          </div>
          <div className="yt-row">
            <div className="yt-left">
              <button
                type="button"
                className="yt-btn"
                onClick={togglePlay}
                aria-label={paused ? "Play" : "Pause"}
              >
                {paused ? <IconPlay /> : <IconPause />}
              </button>
              <button
                type="button"
                className="yt-btn"
                onClick={skipNext}
                aria-label="Next"
              >
                <IconNext />
              </button>
              <button
                type="button"
                className="yt-btn"
                onClick={toggleMute}
                aria-label={muted ? "Unmute" : "Mute"}
              >
                {muted ? <IconMute /> : <IconVolume />}
              </button>
              <span className="yt-time">
                {fmtTime(currentTime)} / {fmtTime(duration)}
              </span>
              <span className="yt-title">Two bros</span>
            </div>
            <div className="yt-right">
              <button
                type="button"
                className="yt-btn"
                onClick={() => setAutoplayOn((v) => !v)}
                aria-label="Autoplay"
                aria-pressed={autoplayOn}
              >
                <IconAutoplay on={autoplayOn} />
              </button>
              <button type="button" className="yt-btn" aria-label="Subtitles">
                <IconCC />
              </button>
              <button type="button" className="yt-btn" aria-label="Settings">
                <IconSettings />
              </button>
              <button type="button" className="yt-btn" aria-label="Miniplayer">
                <IconMiniplayer />
              </button>
              <button type="button" className="yt-btn" aria-label="Theater mode">
                <IconTheater />
              </button>
              <button
                type="button"
                className="yt-btn"
                aria-label="Full screen"
                onClick={toggleFullscreen}
              >
                <IconFullscreen />
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function IconPlay() {
  return (
    <svg viewBox="0 0 36 36" width="36" height="36" aria-hidden="true">
      <path d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z" fill="#fff" />
    </svg>
  );
}

function IconPause() {
  return (
    <svg viewBox="0 0 36 36" width="36" height="36" aria-hidden="true">
      <path d="M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z" fill="#fff" />
    </svg>
  );
}

function IconNext() {
  return (
    <svg viewBox="0 0 36 36" width="36" height="36" aria-hidden="true">
      <path d="M 12,24 20.5,18 12,12 V 24 z M 22,12 v 12 h 2 V 12 h -2 z" fill="#fff" />
    </svg>
  );
}

function IconVolume() {
  return (
    <svg viewBox="0 0 36 36" width="36" height="36" aria-hidden="true">
      <path
        d="M 8,21 V 15 H 12 L 17,10 V 26 L 12,21 H 8 z M 20,16 c 1.7,0.6 3,2.2 3,4 0,1.8 -1.3,3.4 -3,4 v 2 c 2.7,-0.6 5,-3 5,-6 0,-3 -2.3,-5.4 -5,-6 z"
        fill="#fff"
      />
    </svg>
  );
}

function IconMute() {
  return (
    <svg viewBox="0 0 36 36" width="36" height="36" aria-hidden="true">
      <path
        d="M 8,21 V 15 H 12 L 17,10 V 26 L 12,21 H 8 z M 22,15 25,18 28,15 29.5,16.5 26.5,19.5 29.5,22.5 28,24 25,21 22,24 20.5,22.5 23.5,19.5 20.5,16.5 z"
        fill="#fff"
      />
    </svg>
  );
}

function IconAutoplay({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 36 36" width="36" height="36" aria-hidden="true">
      <g>
        <rect x="6" y="13" width="24" height="10" rx="5" fill={on ? "#fff" : "rgba(255,255,255,0.4)"} />
        <circle cx={on ? 25 : 11} cy="18" r="3.5" fill={on ? "#000" : "#fff"} />
        {on && (
          <path d="M 23.5,16.5 L 26,18 L 23.5,19.5 Z" fill="#000" />
        )}
      </g>
    </svg>
  );
}

function IconCC() {
  return (
    <svg viewBox="0 0 36 36" width="36" height="36" aria-hidden="true">
      <path
        d="M 11,11 H 25 a 2,2 0 0 1 2,2 v 10 a 2,2 0 0 1 -2,2 H 11 a 2,2 0 0 1 -2,-2 V 13 a 2,2 0 0 1 2,-2 z"
        fill="none"
        stroke="#fff"
        strokeWidth="1.5"
      />
      <path
        d="M 14,17 v 4 h 2 m 4,-4 v 4 h 2"
        fill="none"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconSettings() {
  return (
    <svg viewBox="0 0 36 36" width="36" height="36" aria-hidden="true">
      <path
        d="M 23.94,18.78 c .03,-0.25 .05,-0.51 .05,-0.78 0,-0.27 -0.02,-0.52 -0.05,-0.78 l 1.68,-1.31 c .15,-0.12 .19,-0.33 .09,-0.51 l -1.6,-2.76 c -0.09,-0.17 -0.31,-0.24 -0.48,-0.17 l -1.99,.8 c -0.41,-0.32 -0.86,-0.58 -1.35,-0.78 l -0.30,-2.11 c -0.02,-0.19 -0.19,-0.33 -0.39,-0.33 h -3.2 c -0.2,0 -0.36,.14 -0.39,.33 l -0.30,2.11 c -0.48,.2 -0.93,.47 -1.35,.78 l -1.99,-0.8 c -0.18,-0.07 -0.39,0 -0.48,.17 l -1.6,2.76 c -0.10,.17 -0.05,.39 .09,.51 l 1.68,1.31 c -0.03,.25 -0.05,.52 -0.05,.78 0,.26 .02,.52 .05,.78 l -1.68,1.31 c -0.15,.12 -0.19,.33 -0.09,.51 l 1.6,2.76 c .09,.17 .31,.24 .48,.17 l 1.99,-0.8 c .41,.32 .86,.58 1.35,.78 l .30,2.11 c .03,.19 .19,.33 .39,.33 h 3.2 c .2,0 .36,-0.14 .39,-0.33 l .30,-2.11 c .48,-0.2 .93,-0.47 1.35,-0.78 l 1.99,.8 c .18,.07 .39,0 .48,-0.17 l 1.6,-2.76 c .09,-0.17 .05,-0.39 -0.09,-0.51 z M 18,21 c -1.66,0 -3,-1.34 -3,-3 0,-1.66 1.34,-3 3,-3 1.66,0 3,1.34 3,3 0,1.66 -1.34,3 -3,3 z"
        fill="#fff"
      />
    </svg>
  );
}

function IconMiniplayer() {
  return (
    <svg viewBox="0 0 36 36" width="36" height="36" aria-hidden="true">
      <path
        d="M 25,17 H 17 v 6.5 H 25 V 17 z M 29,25 V 11 H 7 v 14 h 22 z m -2,-1.98 H 9 V 12.97 h 18 v 10.05 z"
        fill="#fff"
      />
    </svg>
  );
}

function IconTheater() {
  return (
    <svg viewBox="0 0 36 36" width="36" height="36" aria-hidden="true">
      <path d="M 26,13 H 10 v 10 h 16 v -10 z m -2,8 H 12 v -6 h 12 v 6 z" fill="#fff" />
    </svg>
  );
}

function IconFullscreen() {
  return (
    <svg viewBox="0 0 36 36" width="36" height="36" aria-hidden="true">
      <g fill="#fff">
        <path d="m 10,16 2,0 0,-4 4,0 0,-2 L 10,10 z" />
        <path d="m 20,10 0,2 4,0 0,4 2,0 L 26,10 z" />
        <path d="m 24,24 -4,0 0,2 L 26,26 l 0,-6 -2,0 z" />
        <path d="M 12,20 10,20 10,26 16,26 16,24 12,24 z" />
      </g>
    </svg>
  );
}
