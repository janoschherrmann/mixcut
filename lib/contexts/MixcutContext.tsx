/* eslint-disable @typescript-eslint/no-empty-function */
import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
  useCallback,
  useRef
} from 'react'
import { MediaRemoteControl, MediaState } from 'vidstack'
import WaveSurfer from 'wavesurfer.js'
import { Source } from '../types'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { extractAudio, loadFFmpeg } from '../utils/ffmpeg'

type VideoState = {
  file?: File | Blob
  audioFile?: Blob
  wavesurfer?: WaveSurfer
  remote?: MediaRemoteControl
  playerState?: Readonly<MediaState>
  hasError: boolean
  errorMessage: string
}

type FFmpegOperation = () => Promise<void>

export type MixcutState = {
  firstSource: VideoState
  secondSource: VideoState
  outputFile?: Blob
  ffmpeg?: FFmpeg
  isFFmpegRunning: boolean
  addToQueue: (operation: FFmpegOperation) => Promise<void>
  deleteVideoSource: (source: Source) => void
  setVideoSource: (source: Source, file: File | Blob) => void
  setAudioSource: (source: Source, file: Blob) => void
  setFFmpeg: (ffmpeg: FFmpeg) => void
  setWaveSurfer: (source: Source, wavesurfer: WaveSurfer) => void
  setRemote: (source: Source, remote: MediaRemoteControl) => void
  setPlayerState: (source: Source, playerState: Readonly<MediaState>) => void
}

export const initialMixcutState: MixcutState = {
  firstSource: {
    hasError: false,
    errorMessage: ''
  },
  secondSource: {
    hasError: false,
    errorMessage: ''
  },
  isFFmpegRunning: false,
  addToQueue: async (_operation: FFmpegOperation) => {},
  deleteVideoSource: (_source: Source) => {},
  setVideoSource: (_source: Source, _file: File | Blob) => {},
  setAudioSource: (_source: Source, _file: Blob) => {},
  setFFmpeg: (_ffmpeg: FFmpeg) => {},
  setWaveSurfer: (_source: Source, _wavesurfer: WaveSurfer) => {},
  setRemote: (_source: Source, _remote: MediaRemoteControl) => {},
  setPlayerState: (_source: Source, _playerState: Readonly<MediaState>) => {}
}

const MixcutContext = createContext<MixcutState>(initialMixcutState)

export const MixcutProvider = ({ children }: { children: ReactNode }) => {
  const [mixcutState, setMixcutState] = useState<MixcutState>(initialMixcutState)
  const queueRef = useRef<FFmpegOperation[]>([])
  const isRunningRef = useRef<boolean>(false)

  useEffect(() => {
    loadFFmpeg()
      .then((ffmpeg) => {
        setFFmpeg(ffmpeg)
      })
      .catch((error) => {
        alert(error)
      })
  }, [])

  const processQueue = useCallback(async () => {
    console.log('Processing queue')

    if (isRunningRef.current) return

    if (queueRef.current.length === 0) {
      isRunningRef.current = false
      return
    }

    isRunningRef.current = true
    const operation = queueRef.current.shift()
    try {
      if (operation) await operation()
    } catch (err) {
      console.error(err)
    } finally {
      isRunningRef.current = false
      if (queueRef.current.length > 0) {
        processQueue()
      } else {
        console.log('Finished processing queue')
      }
    }
  }, [])

  const addToQueue = async (operation: FFmpegOperation) => {
    console.log('Adding operation to queue')
    queueRef.current.push(operation)
    if (!isRunningRef.current) {
      await processQueue()
    }
  }

  const deleteVideoSource = useCallback(
    (source: Source) =>
      setMixcutState((prevMixcutState) => ({
        ...prevMixcutState,
        [source]: {
          ...prevMixcutState[source],
          file: undefined,
          audioFile: undefined
        }
      })),
    []
  )

  const setVideoSource = (source: Source, file: File | Blob) =>
    setMixcutState((prevMixcutState) => ({
      ...prevMixcutState,
      [source]: {
        file,
        audioFile: undefined,
        hasError: false,
        errorMessage: ''
      }
    }))

  const setAudioSource = (source: Source, audioFile: Blob) => {
    setMixcutState((prevMixcutState) => ({
      ...prevMixcutState,
      [source]: {
        ...prevMixcutState[source],
        audioFile
      }
    }))
  }

  const setFFmpeg = useCallback((ffmpeg: FFmpeg) => {
    setMixcutState((prevMixcutState) => ({ ...prevMixcutState, ffmpeg }))
  }, [])

  const setWaveSurfer = useCallback(
    (source: Source, wavesurfer: WaveSurfer) =>
      setMixcutState((prevMixcutState) => ({
        ...prevMixcutState,
        [source]: {
          ...prevMixcutState[source],
          wavesurfer
        }
      })),
    []
  )

  const setRemote = useCallback(
    (source: Source, remote: MediaRemoteControl) =>
      setMixcutState((prevMixcutState) => ({
        ...prevMixcutState,
        [source]: {
          ...prevMixcutState[source],
          remote
        }
      })),
    []
  )

  const setPlayerState = useCallback(
    (source: Source, playerState: Readonly<MediaState>) =>
      setMixcutState((prevMixcutState) => ({
        ...prevMixcutState,
        [source]: {
          ...prevMixcutState[source],
          playerState
        }
      })),
    []
  )

  useEffect(() => {
    if (mixcutState.firstSource.file) {
      addToQueue(async () =>
        extractAudio(mixcutState.ffmpeg!, mixcutState.firstSource.file!)
          .then((audioFile) => {
            setAudioSource(Source.FIRST_SOURCE, audioFile)
          })
          .catch((error) => {
            alert(error)
          })
      )
    }

    if (mixcutState.secondSource.file) {
      addToQueue(async () =>
        extractAudio(mixcutState.ffmpeg!, mixcutState.secondSource.file!)
          .then((audioFile) => {
            setAudioSource(Source.SECOND_SOURCE, audioFile)
          })
          .catch((error) => {
            alert(error)
          })
      )
    }
  }, [mixcutState.firstSource.file, mixcutState.secondSource.file])

  const value = {
    ...mixcutState,
    addToQueue,
    isFFmpegRunning: isRunningRef.current,
    deleteVideoSource,
    setVideoSource,
    setAudioSource,
    setFFmpeg,
    setWaveSurfer,
    setRemote,
    setPlayerState
  }

  return <MixcutContext.Provider value={value}>{children}</MixcutContext.Provider>
}

export const useMixcutContext = () => {
  return useContext(MixcutContext)
}
