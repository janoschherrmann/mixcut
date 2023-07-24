import { useEffect, useRef } from 'react'
import { type MediaPlayerElement } from 'vidstack'
import {
  useMediaStore,
  useMediaRemote,
  MediaPlayer,
  MediaOutlet,
  MediaGesture
} from '@vidstack/react'
import { useMixcutContext } from '../contexts/MixcutContext'
import { Button } from './Button'
import { FileUploadButton } from './FileUploadButton'
import { Source } from '../types'
import { filterBlackAndWhite } from '../utils/ffmpeg'

type VideoPlayerProps = {
  src: string
  videoIndex: Source
}

export const VideoPlayer = ({ src, videoIndex }: VideoPlayerProps) => {
  const player = useRef<MediaPlayerElement>(null)
  const mixcutContext = useMixcutContext()
  const remote = useMediaRemote(player)
  const playerState = useMediaStore(player)

  useEffect(() => {
    if (playerState && mixcutContext[videoIndex].remote) {
      mixcutContext.setPlayerState(videoIndex, playerState)
    }

    if (remote && !mixcutContext[videoIndex].remote) {
      mixcutContext.setRemote(videoIndex, remote)
    }
  }, [remote, playerState, videoIndex])

  const handleRemoveVideo = () => mixcutContext.deleteVideoSource(videoIndex)

  if (mixcutContext.ffmpeg) {
    mixcutContext.addToQueue(async () =>
      filterBlackAndWhite(mixcutContext.ffmpeg!, videoIndex)
        .then((bwVideoFile) => {
          mixcutContext.setVideoSource(videoIndex, bwVideoFile)
        })
        .catch((error) => {
          alert(error)
        })
    )
  }

  return (
    <MediaPlayer aspectRatio={16 / 9} load='eager' ref={player} src={src} controls>
      <MediaOutlet>
        <MediaGesture event='pointerup' action='toggle:paused' />
      </MediaOutlet>
      <div className='bg-zinc-900 mt-1 rounded-md px-2 py-1 text-white flex gap-x-2'>
        <FileUploadButton videoIndex={videoIndex} />
        <Button onClick={handleRemoveVideo}>Remove video</Button>
      </div>
    </MediaPlayer>
  )
}
