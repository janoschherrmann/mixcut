import { useEffect, useRef } from 'react'
import { type MediaPlayerElement } from 'vidstack'
import {
  useMediaStore,
  useMediaRemote,
  MediaPlayer,
  MediaOutlet,
  MediaPlayButton,
  MediaMuteButton,
  MediaFullscreenButton,
  MediaSeekButton,
  MediaMenu,
  MediaPlaybackRateMenuItems,
  MediaMenuButton,
  MediaMenuItems,
  MediaPlaybackRateMenuButton,
  MediaGesture
} from '@vidstack/react'
import {
  PauseIcon,
  PlayIcon,
  ReplayIcon,
  MuteIcon,
  VolumeHighIcon,
  VolumeLowIcon,
  FullscreenIcon,
  FullscreenExitIcon,
  SeekForward15Icon,
  SeekBackward15Icon,
  SettingsIcon,
  ArrowLeftIcon,
  OdometerIcon,
  ChevronRightIcon
} from '@vidstack/react/icons'
import { useVideoContext } from '../contexts/VideoContext'
import { Button } from './Button'
import { FileUploadButton } from './FileUploadButton'

type VideoPlayerProps = {
  src: string
  videoIndex: 'firstSource' | 'secondSource'
}

export const VideoPlayer = ({ src, videoIndex }: VideoPlayerProps) => {
  const player = useRef<MediaPlayerElement>(null)
  const videoContext = useVideoContext()
  const remote = useMediaRemote(player)
  const playerState = useMediaStore(player)

  useEffect(() => {
    if (playerState && videoContext[videoIndex].remote) {
      videoContext.setPlayerState(videoIndex, playerState)
    }

    if (remote && !videoContext[videoIndex].remote) {
      videoContext.setRemote(videoIndex, remote)
    }
  }, [remote, playerState, videoIndex])

  const handleRemoveVideo = () => videoContext.deleteSource(videoIndex)

  return (
    <MediaPlayer aspectRatio={16 / 9} load='eager' ref={player} src={src}>
      <MediaOutlet>
        <MediaGesture event='pointerup' action='toggle:paused' />
      </MediaOutlet>
      <div className='bg-zinc-900 mt-1 rounded-md px-2 py-1 text-white flex gap-x-2'>
        <MediaPlayButton
          className='flex h-7 w-7 items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded-sm text-gray-300 px-1'
          aria-label='Play'>
          {!playerState.ended && <PlayIcon className='paused:block ended:hidden hidden' />}
          <PauseIcon className='not-paused:block hidden' />
          <ReplayIcon className='ended:block hidden' />
        </MediaPlayButton>
        <MediaMuteButton
          className='group flex h-7 w-7 items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded-sm text-gray-300 px-1'
          aria-label='Mute'>
          <MuteIcon className='hidden group-data-[volume=muted]:block' />
          <VolumeLowIcon className='hidden group-data-[volume=low]:block' />
          <VolumeHighIcon className='hidden group-data-[volume=high]:block' />
        </MediaMuteButton>
        <MediaSeekButton
          seconds={-15}
          className='flex h-7 w-7 items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded-sm text-gray-300 px-1'>
          <SeekBackward15Icon />
        </MediaSeekButton>
        <MediaSeekButton
          className='flex h-7 w-7 items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded-sm text-gray-300 px-1'
          seconds={15}
          aria-label='Seek forward 15 seconds'>
          <SeekForward15Icon />
        </MediaSeekButton>
        <FileUploadButton videoIndex={videoIndex} />
        <Button onClick={handleRemoveVideo}>Remove video</Button>
        <MediaFullscreenButton
          className='flex h-7 w-7 items-center justify-center bg-zinc-800 hover:bg-zinc-700 rounded-sm text-gray-300 px-1'
          aria-label='Fullscreen'>
          <FullscreenIcon className='not-fullscreen:block hidden' />
          <FullscreenExitIcon className='fullscreen:block hidden' />
        </MediaFullscreenButton>
      </div>
    </MediaPlayer>
  )
}
