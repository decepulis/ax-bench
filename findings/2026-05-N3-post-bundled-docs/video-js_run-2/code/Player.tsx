import type { SVGProps } from 'react';
import {
  CaptionsButton,
  Controls,
  FullscreenButton,
  MuteButton,
  PiPButton,
  PlayButton,
  PlaybackRateButton,
  Poster,
  Time,
  TimeSlider,
  createPlayer,
  videoFeatures,
} from '@videojs/react';
import {
  CaptionsOffIcon,
  CaptionsOnIcon,
  FullscreenEnterIcon,
  FullscreenExitIcon,
  PauseIcon,
  PipEnterIcon,
  PipExitIcon,
  PlayIcon,
  RestartIcon,
  VolumeHighIcon,
  VolumeLowIcon,
  VolumeOffIcon,
} from '@videojs/react/icons';
import { HlsVideo } from '@videojs/react/media/hls-video';

const Player = createPlayer({ features: videoFeatures });

interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
}

export function VideoPlayer({ src, poster, title }: VideoPlayerProps) {
  return (
    <Player.Provider>
      <Player.Container className="yt-player">
        <HlsVideo src={src} playsInline autoPlay muted loop />
        {poster && <Poster className="yt-poster" src={poster} />}

        <Controls.Root className="yt-controls">
          <TimeSlider.Root className="yt-progress" aria-label="Seek">
            <TimeSlider.Track className="yt-progress__track">
              <TimeSlider.Buffer className="yt-progress__buffer" />
              <TimeSlider.Fill className="yt-progress__fill" />
            </TimeSlider.Track>
            <TimeSlider.Thumb className="yt-progress__thumb" />
          </TimeSlider.Root>

          <Controls.Group className="yt-row" aria-label="Playback controls">
            <div className="yt-row__side">
              <PlayButton className="yt-btn yt-btn--play" aria-label="Play">
                <PlayIcon className="yt-icon yt-icon--play" />
                <PauseIcon className="yt-icon yt-icon--pause" />
                <RestartIcon className="yt-icon yt-icon--restart" />
              </PlayButton>

              <MuteButton className="yt-btn yt-btn--mute" aria-label="Mute">
                <VolumeOffIcon className="yt-icon yt-icon--volume-off" />
                <VolumeLowIcon className="yt-icon yt-icon--volume-low" />
                <VolumeHighIcon className="yt-icon yt-icon--volume-high" />
              </MuteButton>

              <div className="yt-time">
                <Time.Value type="current" />
                <span className="yt-time__sep"> / </span>
                <Time.Value type="duration" />
              </div>

              {title && <span className="yt-title">{title}</span>}
            </div>

            <div className="yt-row__side yt-row__side--right">
              <CaptionsButton className="yt-btn yt-btn--captions" aria-label="Subtitles">
                <CaptionsOffIcon className="yt-icon yt-icon--captions-off" />
                <CaptionsOnIcon className="yt-icon yt-icon--captions-on" />
              </CaptionsButton>

              <PlaybackRateButton className="yt-btn yt-btn--settings" aria-label="Settings">
                <SettingsIcon className="yt-icon yt-icon--settings" />
              </PlaybackRateButton>

              <PiPButton className="yt-btn yt-btn--pip" aria-label="Picture-in-picture">
                <PipEnterIcon className="yt-icon yt-icon--pip-enter" />
                <PipExitIcon className="yt-icon yt-icon--pip-exit" />
              </PiPButton>

              <FullscreenButton className="yt-btn yt-btn--fullscreen" aria-label="Fullscreen">
                <FullscreenEnterIcon className="yt-icon yt-icon--fs-enter" />
                <FullscreenExitIcon className="yt-icon yt-icon--fs-exit" />
              </FullscreenButton>
            </div>
          </Controls.Group>
        </Controls.Root>
      </Player.Container>
    </Player.Provider>
  );
}

function SettingsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={22}
      height={22}
      fill="currentColor"
      aria-hidden="true"
      {...props}
    >
      <path d="M12 15.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Zm7.43-2.09c.04-.46.07-.93.07-1.41s-.03-.95-.07-1.41l2.11-1.65a.5.5 0 0 0 .12-.64l-2-3.46a.5.5 0 0 0-.61-.22l-2.49 1a7.34 7.34 0 0 0-2.44-1.42l-.38-2.65A.5.5 0 0 0 13.25 2h-2.5a.5.5 0 0 0-.49.41l-.38 2.65a7.34 7.34 0 0 0-2.44 1.42l-2.49-1a.5.5 0 0 0-.61.22l-2 3.46a.5.5 0 0 0 .12.64l2.11 1.65c-.04.46-.07.93-.07 1.41s.03.95.07 1.41L2.46 15.06a.5.5 0 0 0-.12.64l2 3.46a.5.5 0 0 0 .61.22l2.49-1c.74.6 1.55 1.08 2.44 1.42l.38 2.65a.5.5 0 0 0 .49.41h2.5c.25 0 .46-.17.49-.41l.38-2.65a7.34 7.34 0 0 0 2.44-1.42l2.49 1a.5.5 0 0 0 .61-.22l2-3.46a.5.5 0 0 0-.12-.64l-2.11-1.65Z" />
    </svg>
  );
}
