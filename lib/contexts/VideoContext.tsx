import { createContext, useContext, ReactNode, useState, RefObject } from 'react'
import { MediaPlayerElement, MediaRemoteControl, MediaState } from 'vidstack'

type VideoState = {
	file?: File
	remote?: MediaRemoteControl
	playerState?: Readonly<MediaState>
	hasError: boolean
	errorMessage: string
}

export type MixcutState = {
	firstSource: VideoState
	secondSource: VideoState
	deleteSource: (source: 'firstSource' | 'secondSource') => void
	setSource: (source: 'firstSource' | 'secondSource', file: File) => void
	setRemote: (source: 'firstSource' | 'secondSource', remote: MediaRemoteControl) => void
	setPlayerState: (
		source: 'firstSource' | 'secondSource',
		playerState: Readonly<MediaState>
	) => void
}

export const initialVideoState: MixcutState = {
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
	deleteSource: (_source: 'firstSource' | 'secondSource') => {},
	setSource: (_source: 'firstSource' | 'secondSource', _file: File) => {},
	setRemote: (_source: 'firstSource' | 'secondSource', _remote: MediaRemoteControl) => {},
	setPlayerState: (
		_source: 'firstSource' | 'secondSource',
		_playerState: Readonly<MediaState>
	) => {}
}

const VideoContext = createContext<MixcutState>(initialVideoState)

export const VideoProvider = ({ children }: { children: ReactNode }) => {
	const [videoState, setVideoState] = useState<MixcutState>(initialVideoState)

	const deleteSource = (source: 'firstSource' | 'secondSource') =>
		setVideoState((prevVideos) => ({
			...prevVideos,
			[source]: {
				...prevVideos[source],
				file: undefined
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

	const setRemote = (source: 'firstSource' | 'secondSource', remote: MediaRemoteControl) =>
		setVideoState((prevVideos) => ({
			...prevVideos,
			[source]: {
				...prevVideos[source],
				remote
			}
		}))

	const setPlayerState = (
		source: 'firstSource' | 'secondSource',
		playerState: Readonly<MediaState>
	) =>
		setVideoState((prevVideos) => ({
			...prevVideos,
			[source]: {
				...prevVideos[source],
				playerState
			}
		}))

	const value = {
		...videoState,
		deleteSource,
		setSource,
		setRemote,
		setPlayerState
	}

	return <VideoContext.Provider value={value}>{children}</VideoContext.Provider>
}

export const useVideoContext = () => {
	return useContext(VideoContext)
}
