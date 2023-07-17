import { useRef } from 'react'
import { type MediaPlayerElement } from 'vidstack'
import {
  MediaPlayer,
  MediaOutlet,
  useMediaStore,
  MediaPlayButton,
  MediaMuteButton,
  MediaFullscreenButton
} from '@vidstack/react'
import {
  PauseIcon,
  PlayIcon,
  ReplayIcon,
  MuteIcon,
  VolumeHighIcon,
  VolumeLowIcon
} from '@vidstack/react/icons'
import { useVideoContext } from '../contexts/VideoContext'

type VideoPlayerProps = {
  src: string
  videoIndex: 'firstSource' | 'secondSource'
}
const VideoPlayer = ({ src, videoIndex }: VideoPlayerProps) => {
  const player = useRef<MediaPlayerElement>(null)
  const videoContext = useVideoContext()

  const handleRemoveVideo = () => videoContext.deleteSource(videoIndex)

  return (
    <MediaPlayer aspectRatio={16 / 9} load='eager' ref={player} src={src}>
      <MediaOutlet />
      <div className='bg-zinc-900 mt-1 rounded-md px-2 py-1 text-white flex gap-x-2'>
        <MediaPlayButton className='w-6 h-6'>
          <PlayIcon className='paused:block ended:hidden hidden w-6 h-6' slot='play' />
          <PauseIcon className='not-paused:block hidden w-6 h-6' slot='pause' />
          <ReplayIcon className='ended:block hidden w-6 h-6' slot='replay' />
        </MediaPlayButton>
        <MediaMuteButton>
          <MuteIcon className='hidden group-data-[volume=muted]:block w-6 h-6' />
          <VolumeLowIcon className='hidden group-data-[volume=low]:block' />
          <VolumeHighIcon className='hidden group-data-[volume=high]:block' />
        </MediaMuteButton>
        <MediaFullscreenButton className='w-6 h-6' />
        <button className='bg-zinc-800 hover:bg-zinc-700 rounded-sm text-gray-300 px-2 py-1 text-sm'>
          Switch video
        </button>
        <button
          onClick={handleRemoveVideo}
          className='bg-zinc-800 hover:bg-zinc-700 rounded-sm text-gray-300 px-2 py-1 text-sm'>
          Remove video
        </button>
      </div>
    </MediaPlayer>
  )
}

export default VideoPlayer
