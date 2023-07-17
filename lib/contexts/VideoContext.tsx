import { createContext, useContext, ReactNode, useState } from 'react'

export type VideoState = {
  firstSource: {
    file?: File
    hasError: boolean
    errorMessage: string
  }
  secondSource: {
    file?: File
    hasError: boolean
    errorMessage: string
  }
  deleteSource: (source: 'firstSource' | 'secondSource') => void
  setSource: (source: 'firstSource' | 'secondSource', file: File) => void
}

export const initialVideoState: VideoState = {
  firstSource: {
    file: undefined,
    hasError: false,
    errorMessage: ''
  },
  secondSource: {
    file: undefined,
    hasError: false,
    errorMessage: ''
  },
  deleteSource: (_source: 'firstSource' | 'secondSource') => {},
  setSource: (_source: 'firstSource' | 'secondSource', _file: File) => {}
}

const VideoContext = createContext<VideoState>(initialVideoState)

export const VideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoState, setVideoState] = useState<VideoState>(initialVideoState)

  const deleteSource = (source: 'firstSource' | 'secondSource') =>
    setVideoState((prevVideos) => ({
      ...prevVideos,
      [source]: {
        file: undefined,
        hasError: false,
        errorMessage: ''
      }
    }))

  const setSource = (source: 'firstSource' | 'secondSource', file: File) =>
    setVideoState((prevVideos) => ({
      ...prevVideos,
      [source]: {
        file,
        hasError: false,
        errorMessage: ''
      }
    }))

  const value = {
    ...videoState,
    deleteSource,
    setSource
  }

  return <VideoContext.Provider value={value}>{children}</VideoContext.Provider>
}

export const useVideoContext = () => {
  return useContext(VideoContext)
}
