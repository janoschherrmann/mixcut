import { useEffect, useRef } from 'react'
import { MediaSeekingEvent, type MediaPlayerElement } from 'vidstack'
import {
  useMediaStore,
  useMediaRemote,
  MediaPlayer,
  MediaOutlet,
  MediaGesture
} from '@vidstack/react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { Dropzone } from './Dropzone'
import { useMixcutContext } from '../contexts/MixcutContext'
import { Button } from './Button'
import { FileUploadButton } from './FileUploadButton'
import { Source } from '../types'

type VideoPlayerProps = {
  videoIndex: Source
}

export const VideoPlayer = ({ videoIndex }: VideoPlayerProps) => {
  const player = useRef<MediaPlayerElement>(null)
  const mixcutContext = useMixcutContext()
  const remote = useMediaRemote(player)
  const playerState = useMediaStore(player)

  let videoFile = mixcutContext[videoIndex].file
  let src: string | undefined

  if (videoFile) {
    src = URL.createObjectURL(videoFile)
  }

  const wavesurfer = mixcutContext[videoIndex].waveSurfer

  useEffect(() => {
    if (playerState && !mixcutContext[videoIndex].playerState) {
      mixcutContext.setPlayerState(videoIndex, playerState)
    }

    if (remote && !mixcutContext[videoIndex].remote) {
      mixcutContext.setRemote(videoIndex, remote)
    }
  }, [remote, playerState, videoIndex])

  const handleRemoveVideo = () => mixcutContext.deleteVideoSource(videoIndex)

  const handleSeek = (event: MediaSeekingEvent) => {
    const audioTime = wavesurfer?.getCurrentTime() ?? 0
    const videoTime = event.detail
    const seekTo = videoTime / playerState?.duration

    if (audioTime === videoTime) return
    if (!isFinite(seekTo)) return

    wavesurfer?.seekTo(seekTo)
    wavesurfer?.pause()
    remote?.pause()
  }

  if (!src) return <Dropzone videoIndex={videoIndex} />

  return (
    <MediaPlayer
      aspectRatio={16 / 9}
      load='eager'
      ref={player}
      src={src}
      controls
      onPlay={() => wavesurfer?.play()}
      onPause={() => wavesurfer?.pause()}
      onSeeking={handleSeek}>
      <MediaOutlet>
        <MediaGesture event='pointerup' action='toggle:paused' />
      </MediaOutlet>
      <div className='mt-1 flex gap-x-2 items-center'>
        <span className='text-xs font-semibold text-indigo-500 flex bg-indigo-400/10 rounded-md px-4 py-0.5 self-stretch place-items-center'>
          Video {videoIndex === Source.FIRST_SOURCE ? '1' : '2'}
        </span>
        <FileUploadButton videoIndex={videoIndex} />
        <Button onClick={handleRemoveVideo} className='flex-grow'>
          <Cross2Icon className='w-3 h-3' />
          Remove video
        </Button>
      </div>
    </MediaPlayer>
  )
}
