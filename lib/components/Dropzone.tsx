'use client'
import { useCallback } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import clsx from 'clsx'
import { VideoIcon } from '@radix-ui/react-icons'
import { useVideoContext } from '../contexts/VideoContext'

type DropzoneProps = {
	videoIndex: 'firstSource' | 'secondSource'
	idleText?: string
	activeDropText?: string
}

const MAX_FILES = 1
const MAX_FILE_SIZE = 50000000 // 50MB

export const Dropzone = ({
	videoIndex,
	idleText = 'Drag and drop your video here, or click to select a video',
	activeDropText = 'Drop the videos here ...'
}: DropzoneProps) => {
	const videoContext = useVideoContext()

	const onDrop = useCallback((acceptedFile: File, fileRejections: FileRejection[]) => {
		// Handle rejected files, by showing an error toast or something
		if (fileRejections.length > 0) {
			console.log(fileRejections)
		}

		videoContext.setSource(videoIndex, acceptedFile)
	}, [])

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop: (acceptedFiles, fileRejections) => onDrop(acceptedFiles[0], fileRejections),
		maxFiles: MAX_FILES,
		maxSize: MAX_FILE_SIZE,
		accept: { 'video/*': ['.mp4'] }
	})

	return (
		<div className='relative w-full aspect-[16/9]'>
			<div
				{...getRootProps({
					className: clsx(
						'border border-dotted rounded-md p-4 text-center bg-zinc-900 flex flex-col inset h-full w-full justify-center items-center',
						isDragActive ? 'border-zinc-400' : 'border-zinc-700'
					)
				})}>
				<input {...getInputProps()} />
				<div className=''>
					<VideoIcon className='mx-auto h-8 w-8 text-white decoration-white' />
					<p className='pt-2 text-sm max-w-xs'>{isDragActive ? activeDropText : idleText}</p>
				</div>
			</div>
		</div>
	)
}

export default Dropzone
