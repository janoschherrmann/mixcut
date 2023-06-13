'use client'
import { useCallback } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import clsx from 'clsx'
import { VideoIcon } from '@radix-ui/react-icons'

const Dropzone = ({ handleDropVideos }: { handleDropVideos: (videos: File[]) => void }) => {
  const MAX_FILES = 2
  const MAX_FILE_SIZE = 50000000 // 50MB

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    // Handle rejected files, by showing an error toast or something
    console.log(fileRejections)
    if (fileRejections.length > 0) {
    }

    // Do something with the files

    console.log(acceptedFiles)
    handleDropVideos(acceptedFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: MAX_FILES,
    maxSize: MAX_FILE_SIZE,
    accept: { 'video/*': ['.mp4', '.mov'] }
  })

  return (
    <div
      {...getRootProps({
        className: clsx(
          'border border-dotted rounded-md p-4 text-center bg-zinc-50 flex flex-col',
          isDragActive ? 'border-zinc-600' : 'border-zinc-200'
        )
      })}>
      <input {...getInputProps()} />
      <VideoIcon className='mx-auto h-6 w-6' />
      {isDragActive ? (
        <p>Drop the videos here ...</p>
      ) : (
        <p>Drag 'n' drop your videos here, or click to select videos</p>
      )}
    </div>
  )
}

export default Dropzone
