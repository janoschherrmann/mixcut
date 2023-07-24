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
import { Source } from '../types'
import { FFmpeg } from '@ffmpeg/ffmpeg'
import { loadFFmpeg } from '../utils/ffmpeg'

type VideoState = {
  file?: File
  transformedFile?: Blob | File
  audioFile?: Blob
  remote?: MediaRemoteControl
  playerState?: Readonly<MediaState>
  hasError: boolean
  errorMessage: string
}

type FFmpegOperation = () => Promise<void>

export type MixcutState = {
  firstSource: VideoState
  secondSource: VideoState
  ffmpeg?: FFmpeg
  isFFmpegRunning: boolean
  addToQueue: (operation: FFmpegOperation) => Promise<void>
  deleteVideoSource: (source: Source) => void
  setVideoSource: (source: Source, file: File) => void
  setTransformedFile: (source: Source, file: Blob | File) => void
  setAudioSource: (source: Source, file: Blob) => void
  setFFmpeg: (ffmpeg: FFmpeg) => void
  setRemote: (source: Source, remote: MediaRemoteControl) => void
  setPlayerState: (source: Source, playerState: Readonly<MediaState>) => void
}

export const initialMixcutState: MixcutState = {
  firstSource: {
    file: undefined,
    remote: undefined,
    hasError: false,
    errorMessage: ''
  },
  secondSource: {
    file: undefined,
    remote: undefined,
    hasError: false,
    errorMessage: ''
  },
  isFFmpegRunning: false,
  addToQueue: async (_operation: FFmpegOperation) => {},
  deleteVideoSource: (_source: Source) => {},
  setVideoSource: (_source: Source, _file: File) => {},
  setTransformedFile: (_source: Source, _file: Blob | File) => {},
  setAudioSource: (_source: Source, _file: Blob) => {},
  setFFmpeg: (_ffmpeg: FFmpeg) => {},
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

  const setVideoSource = useCallback(
    (source: Source, file: File) =>
      setMixcutState((prevMixcutState) => ({
        ...prevMixcutState,
        [source]: {
          file,
          audioFile: undefined,
          hasError: false,
          errorMessage: ''
        }
      })),
    []
  )

  const setTransformedFile = useCallback(
    (source: Source, file: Blob | File) =>
      setMixcutState((prevMixcutState) => ({
        ...prevMixcutState,
        [source]: {
          ...prevMixcutState[source],
          transformedFile: file
        }
      })),
    []
  )

  const setAudioSource = useCallback(
    (source: Source, audioFile: Blob) =>
      setMixcutState((prevMixcutState) => ({
        ...prevMixcutState,
        [source]: {
          ...prevMixcutState[source],
          audioFile
        }
      })),
    []
  )

  const setFFmpeg = useCallback((ffmpeg: FFmpeg) => {
    setMixcutState((prevMixcutState) => ({ ...prevMixcutState, ffmpeg }))
  }, [])

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

  const value = {
    ...mixcutState,
    addToQueue,
    isFFmpegRunning: isRunningRef.current,
    deleteVideoSource,
    setVideoSource,
    setTransformedFile,
    setAudioSource,
    setFFmpeg,
    setRemote,
    setPlayerState
  }

  return <MixcutContext.Provider value={value}>{children}</MixcutContext.Provider>
}

export const useMixcutContext = () => {
  return useContext(MixcutContext)
}
