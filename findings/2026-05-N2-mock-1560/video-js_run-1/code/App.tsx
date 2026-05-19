import { useEffect, useRef, useState } from 'react';
import { createPlayer, videoFeatures } from '@videojs/react';
import { HlsVideo } from '@videojs/react/media/hls-video';
import './player.css';

const Player = createPlayer({ features: videoFeatures });

const PLAYBACK_ID = 'BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM';
const SRC = `https://stream.mux.com/${PLAYBACK_ID}.m3u8`;
const POSTER = `https://image.mux.com/${PLAYBACK_ID}/thumbnail.jpg?time=0`;

function formatTime(s: number) {
  if (!isFinite(s) || s < 0) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

type IconProps = { className?: string };

const PlayIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 36 36" className={className} aria-hidden>
    <path d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z" />
  </svg>
);

const PauseIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 36 36" className={className} aria-hidden>
    <path d="M 12,26 16,26 16,10 12,10 z M 21,26 25,26 25,10 21,10 z" />
  </svg>
);

const NextIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 36 36" className={className} aria-hidden>
    <path d="M 12,24 20.5,18 12,12 V 24 z M 22,12 h 2 v 12 h -2 z" />
  </svg>
);

const VolumeHighIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 36 36" className={className} aria-hidden>
    <path d="M8,21 V15 H12 L17,11 V25 L12,21 H8 z M19.5,18 c0,-1.77 -1.02,-3.29 -2.5,-4.03 v8.05 c1.48,-0.73 2.5,-2.25 2.5,-4.02 z M17,7.97 v2.06 c2.89,0.86 5,3.54 5,6.97 0,3.43 -2.11,6.11 -5,6.97 v2.06 c4.01,-0.91 7,-4.49 7,-9.03 c0,-4.54 -2.99,-8.12 -7,-9.03 z" />
  </svg>
);

const VolumeMutedIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 36 36" className={className} aria-hidden>
    <path d="M21.48,17.98 c0,-1.77 -1.02,-3.29 -2.5,-4.03 v2.21 l 2.45,2.45 c0.03,-0.2 0.05,-0.41 0.05,-0.63 z M23.98,17.98 c0,0.94 -0.2,1.82 -0.54,2.64 l1.51,1.51 c0.66,-1.24 1.03,-2.65 1.03,-4.15 c0,-4.28 -2.99,-7.86 -7,-8.76 v2.05 c2.89,0.86 5,3.54 5,6.71 z M9.25,8.98 l-1.27,1.26 4.72,4.73 H7.98 v6 H11.98 l5,5 v -6.73 l4.25,4.25 c -0.67,0.52 -1.42,0.93 -2.25,1.18 v 2.06 c 1.38,-0.31 2.63,-0.95 3.69,-1.81 l 2.04,2.05 1.27,-1.27 -9,-9 -7.72,-7.72 z M16.98,9.98 l-2.09,2.08 2.09,2.09 V 9.98 z" />
  </svg>
);

const ShareIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 36 36" className={className} aria-hidden>
    <path d="M 23,18 c -1,0 -1.8,0.7 -1.96,1.62 L 14.34,15.6 c 0,-0.2 0.06,-0.4 0.06,-0.6 0,-0.2 -0.02,-0.4 -0.06,-0.6 l 6.62,-3.86 C 21.31,11.36 22.1,12 23,12 c 1.66,0 3,-1.34 3,-3 0,-1.66 -1.34,-3 -3,-3 -1.66,0 -3,1.34 -3,3 0,0.24 0.04,0.47 0.09,0.7 L 13.59,13.52 C 13.04,12.6 12,12 11,12 c -1.66,0 -3,1.34 -3,3 0,1.66 1.34,3 3,3 1,0 2.04,-0.6 2.59,-1.52 l 6.4,3.83 C 19.94,20.53 19.9,20.76 19.9,21 c 0,1.61 1.34,3 3,3 1.66,0 3,-1.34 3,-3 0,-1.66 -1.34,-3 -3,-3 z" />
  </svg>
);

const AutoplayIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 36 36" className={className} aria-hidden>
    <path d="M10,8 H26 a2,2 0 0 1 2,2 V22 a2,2 0 0 1 -2,2 H10 a2,2 0 0 1 -2,-2 V10 a2,2 0 0 1 2,-2 z M15,12 V20 L22,16 z" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const CCIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 36 36" className={className} aria-hidden>
    <path d="M11,11 H25 a2,2 0 0 1 2,2 V23 a2,2 0 0 1 -2,2 H11 a2,2 0 0 1 -2,-2 V13 a2,2 0 0 1 2,-2 z" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <text x="18" y="22" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="8.5" fontWeight="700" fill="currentColor">CC</text>
  </svg>
);

const SettingsIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 36 36" className={className} aria-hidden>
    <path d="M 18,11.2 c -3.75,0 -6.8,3.05 -6.8,6.8 0,3.75 3.05,6.8 6.8,6.8 3.75,0 6.8,-3.05 6.8,-6.8 0,-3.75 -3.05,-6.8 -6.8,-6.8 z m 0,11.4 c -2.54,0 -4.6,-2.06 -4.6,-4.6 0,-2.54 2.06,-4.6 4.6,-4.6 2.54,0 4.6,2.06 4.6,4.6 0,2.54 -2.06,4.6 -4.6,4.6 z" />
    <path d="M 27.8,16.4 26.1,16.1 c -0.13,-0.45 -0.31,-0.88 -0.53,-1.28 l 1.02,-1.4 c 0.21,-0.29 0.18,-0.69 -0.07,-0.94 l -1.0,-1.0 c -0.25,-0.25 -0.65,-0.28 -0.94,-0.07 l -1.4,1.02 c -0.4,-0.22 -0.83,-0.4 -1.28,-0.53 L 21.6,10.2 c -0.05,-0.36 -0.36,-0.62 -0.72,-0.62 H 19.12 c -0.36,0 -0.67,0.26 -0.72,0.62 L 18.1,11.9 c -0.45,0.13 -0.88,0.31 -1.28,0.53 L 15.42,11.41 c -0.29,-0.21 -0.69,-0.18 -0.94,0.07 l -1.0,1.0 c -0.25,0.25 -0.28,0.65 -0.07,0.94 l 1.02,1.4 c -0.22,0.4 -0.4,0.83 -0.53,1.28 l -1.7,0.3 c -0.36,0.05 -0.62,0.36 -0.62,0.72 v1.76 c 0,0.36 0.26,0.67 0.62,0.72 l 1.7,0.3 c 0.13,0.45 0.31,0.88 0.53,1.28 l -1.02,1.4 c -0.21,0.29 -0.18,0.69 0.07,0.94 l 1.0,1.0 c 0.25,0.25 0.65,0.28 0.94,0.07 l 1.4,-1.02 c 0.4,0.22 0.83,0.4 1.28,0.53 l 0.3,1.7 c 0.05,0.36 0.36,0.62 0.72,0.62 h 1.76 c 0.36,0 0.67,-0.26 0.72,-0.62 l 0.3,-1.7 c 0.45,-0.13 0.88,-0.31 1.28,-0.53 l 1.4,1.02 c 0.29,0.21 0.69,0.18 0.94,-0.07 l 1.0,-1.0 c 0.25,-0.25 0.28,-0.65 0.07,-0.94 l -1.02,-1.4 c 0.22,-0.4 0.4,-0.83 0.53,-1.28 l 1.7,-0.3 c 0.36,-0.05 0.62,-0.36 0.62,-0.72 V17.12 c 0,-0.36 -0.26,-0.67 -0.62,-0.72 z" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const MiniplayerIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 36 36" className={className} aria-hidden>
    <path d="M11,11 H25 V18 H17 V25 H11 V11 z M19,20 H27 V26 H19 V20 z" fill="none" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

function Controls({ videoRef }: { videoRef: React.RefObject<HTMLVideoElement> }) {
  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const sync = () => {
      setPaused(v.paused);
      setMuted(v.muted);
      setCurrentTime(v.currentTime);
      setDuration(v.duration);
    };
    sync();
    v.addEventListener('play', sync);
    v.addEventListener('pause', sync);
    v.addEventListener('timeupdate', sync);
    v.addEventListener('durationchange', sync);
    v.addEventListener('volumechange', sync);
    return () => {
      v.removeEventListener('play', sync);
      v.removeEventListener('pause', sync);
      v.removeEventListener('timeupdate', sync);
      v.removeEventListener('durationchange', sync);
      v.removeEventListener('volumechange', sync);
    };
  }, [videoRef]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  };

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
  };

  const seekToEnd = () => {
    const v = videoRef.current;
    if (!v || !isFinite(duration)) return;
    v.currentTime = duration;
  };

  const share = () => {
    console.log('shared');
  };

  const seekFromEvent = (e: React.PointerEvent<HTMLDivElement>) => {
    const v = videoRef.current;
    if (!v || !isFinite(duration)) return;
    const r = e.currentTarget.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    v.currentTime = duration * pct;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="ax-controls">
      <div
        className="ax-progress"
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={isFinite(duration) ? duration : 0}
        aria-valuenow={currentTime}
        onPointerDown={seekFromEvent}
      >
        <div className="ax-progress-track">
          <div className="ax-progress-fill" style={{ width: `${progress}%` }} />
          <div className="ax-progress-thumb" style={{ left: `${progress}%` }} />
        </div>
      </div>
      <div className="ax-row">
        <div className="ax-group">
          <button
            className="ax-btn"
            onClick={togglePlay}
            aria-label={paused ? 'Play' : 'Pause'}
          >
            {paused ? <PlayIcon /> : <PauseIcon />}
          </button>
          <button className="ax-btn" onClick={seekToEnd} aria-label="Next">
            <NextIcon />
          </button>
          <button
            className="ax-btn"
            onClick={toggleMute}
            aria-label={muted ? 'Unmute' : 'Mute'}
          >
            {muted ? <VolumeMutedIcon /> : <VolumeHighIcon />}
          </button>
          <span className="ax-time">
            <span>{formatTime(currentTime)}</span>
            <span className="ax-time-sep"> / </span>
            <span className="ax-time-total">{formatTime(duration)}</span>
          </span>
          <span className="ax-chapter">Two bros</span>
        </div>
        <div className="ax-group">
          <button className="ax-btn" onClick={share} aria-label="Share">
            <ShareIcon />
          </button>
          <button className="ax-btn" aria-label="Autoplay">
            <AutoplayIcon />
          </button>
          <button className="ax-btn" aria-label="Subtitles">
            <CCIcon />
          </button>
          <button className="ax-btn" aria-label="Settings">
            <SettingsIcon />
          </button>
          <button className="ax-btn" aria-label="Miniplayer">
            <MiniplayerIcon />
          </button>
        </div>
      </div>
    </div>
  );
}

export function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  return (
    <main>
      <h1>ax-bench</h1>
      <Player.Provider>
        <div className="ax-player">
          <HlsVideo
            ref={videoRef}
            src={SRC}
            poster={POSTER}
            autoPlay
            muted
            loop
            playsInline
          />
          <Controls videoRef={videoRef} />
        </div>
      </Player.Provider>
    </main>
  );
}
