import React, { useEffect, useRef } from 'react'
import WaveSurfer from 'wavesurfer.js'
import { useMixcutContext } from '../contexts/MixcutContext'
import { Source } from '../types'

type WaveformProps = {
	audioBlob: Blob
	videoIndex: Source
}

const Waveform = ({ audioBlob, videoIndex }: WaveformProps) => {
	const mixcutContext = useMixcutContext()

	const waveformRef = useRef<HTMLDivElement>(null)
	const waveSurferRef = useRef<WaveSurfer | null>(null)

	const handleTogglePlay = () => {
		if (waveSurferRef.current) {
			waveSurferRef.current.playPause()
			mixcutContext[videoIndex].remote?.togglePaused()
		}
	}

	useEffect(() => {
		if (waveformRef.current) {
			waveSurferRef.current = WaveSurfer.create({
				container: waveformRef.current,
				waveColor: 'violet',
				progressColor: 'purple'
			})

			const objectUrl = URL.createObjectURL(audioBlob)
			waveSurferRef.current.load(objectUrl)

			// Clean up function
			return () => {
				waveSurferRef.current?.destroy()
				URL.revokeObjectURL(objectUrl) // Important to revoke the object URL to free memory
			}
		}
	}, [audioBlob])

	return <div onClick={handleTogglePlay} ref={waveformRef} />
}

export default Waveform
