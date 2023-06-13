import { useEffect, useRef, FC } from 'react'
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

type VideoPlayerProps = {
  src: string
  type: string
}

const VideoPlayer: FC<VideoPlayerProps> = ({ src, type }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const videoElement = videoRef.current

    if (!videoElement) return

    const player = videojs(videoElement, {
      controls: true,
      preload: 'auto',
      playbackRates: [0.5, 1, 1.5, 2],
      fluid: true,
      sources: [
        {
          src,
          type
        }
      ]
    })

    player.show()
  }, [src, type])

  return (
    <div className='w-full h-full relative'>
      <video ref={videoRef} className='video-js vjs-fluid vjs-big-play-centered' />
    </div>
  )
}

export default VideoPlayer
