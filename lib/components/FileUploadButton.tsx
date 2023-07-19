'use client'
import { useCallback } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { useVideoContext } from '../contexts/VideoContext'
import { Button } from './Button'

type DropzoneProps = {
  videoIndex: 'firstSource' | 'secondSource'
  idleText?: string
  activeDropText?: string
}

const MAX_FILES = 1
const MAX_FILE_SIZE = 50000000 // 50MB

export const FileUploadButton = ({ videoIndex }: DropzoneProps) => {
  const videoContext = useVideoContext()

  const onDrop = useCallback((acceptedFile: File, fileRejections: FileRejection[]) => {
    // Handle rejected files, by showing an error toast or something
    if (fileRejections.length > 0) {
      console.log(fileRejections)
    }

    videoContext.setSource(videoIndex, acceptedFile)
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles, fileRejections) => onDrop(acceptedFiles[0], fileRejections),
    maxFiles: MAX_FILES,
    maxSize: MAX_FILE_SIZE,
    accept: { 'video/*': ['.mp4'] }
  })

  return (
    <Button>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        Switch video
      </div>
    </Button>
  )
}
