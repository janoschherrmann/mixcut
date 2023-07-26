import { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import { useMixcutContext } from '../contexts/MixcutContext'
import { Source } from '../types'
import { Button } from './Button'
import { PauseIcon, PlayIcon } from '@radix-ui/react-icons'

type WaveformProps = {
  audioBlob: Blob
  videoIndex: Source
}

const Waveform = ({ audioBlob, videoIndex }: WaveformProps) => {
  const mixcutContext = useMixcutContext()
  const containerRef = useRef<HTMLDivElement>(null)
  // Workaround to force re-render of component when play/pause state changes
  const [isPlaying, setIsPlaying] = useState(false)

  const wavesurfer = mixcutContext[videoIndex].wavesurfer
  const remote = mixcutContext[videoIndex].remote
  const playerState = mixcutContext[videoIndex].playerState

  wavesurfer?.on('play', () => {
    remote?.play()
    setIsPlaying(true)
  })

  wavesurfer?.on('pause', () => {
    remote?.pause()
    setIsPlaying(false)
  })

  wavesurfer?.on('seeking', () => {
    const audioTime = wavesurfer?.getCurrentTime()
    const videoTime = playerState?.currentTime

    if (audioTime === videoTime) return

    remote?.seek(audioTime)
    remote?.pause()
    wavesurfer?.pause()
  })

  useEffect(() => {
    if (containerRef.current && !wavesurfer) {
      const ws = WaveSurfer.create({
        container: containerRef.current,
        waveColor: '#c7d2fe',
        progressColor: '#6d28d9',
        height: 'auto'
      })

      mixcutContext.setWaveSurfer(videoIndex, ws)

      const objectUrl = URL.createObjectURL(audioBlob)
      ws.load(objectUrl)
      ws.setMuted(true)
    }
  }, [audioBlob, wavesurfer, videoIndex])

  const handlePlayPause = () => {
    if (isPlaying) {
      wavesurfer?.pause()
      remote?.pause()
      setIsPlaying(false)
    } else {
      wavesurfer?.play()
      remote?.play()
      setIsPlaying(true)
    }
  }

  return (
    <div>
      <div ref={containerRef} />
      <div className='pt-2'>
        <Button onClick={handlePlayPause}>
          {isPlaying ? <PauseIcon className='w-3 h-3' /> : <PlayIcon className='w-3 h-3' />}
        </Button>
      </div>
    </div>
  )
}

export default Waveform
