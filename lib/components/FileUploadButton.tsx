import { useCallback } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { useMixcutContext } from '../contexts/MixcutContext'
import { Button } from './Button'
import { Source } from '../types'
import { extractAudio } from '../utils/ffmpeg'
import { UploadIcon } from '@radix-ui/react-icons'

type DropzoneProps = {
  videoIndex: Source
  idleText?: string
  activeDropText?: string
}

const MAX_FILES = 1
const MAX_FILE_SIZE = 50000000 // 50MB

export const FileUploadButton = ({ videoIndex }: DropzoneProps) => {
  const mixcutContext = useMixcutContext()

  const onDrop = useCallback((acceptedFile: File, fileRejections: FileRejection[]) => {
    // Handle rejected files, by showing an error toast or something
    if (fileRejections.length > 0) {
      alert(
        fileRejections.map((fileRejection) => fileRejection.errors.map((error) => error.message))
      )
    }

    mixcutContext.setVideoSource(videoIndex, acceptedFile)
    mixcutContext.setTransformedFile(videoIndex, acceptedFile)

    if (mixcutContext.ffmpeg) {
      mixcutContext.addToQueue(async () =>
        extractAudio(mixcutContext.ffmpeg!, acceptedFile)
          .then((audioFile) => {
            mixcutContext.setAudioSource(videoIndex, audioFile)
          })
          .catch((error) => {
            alert(error)
          })
      )
    }
  }, [])

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles, fileRejections) => onDrop(acceptedFiles[0], fileRejections),
    maxFiles: MAX_FILES,
    maxSize: MAX_FILE_SIZE,
    accept: { 'video/*': ['.mp4'] }
  })

  return (
    <Button className='flex-grow'>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div className='flex gap-x-2 text-white items-center'>
          <UploadIcon className='w-3 h-3' />
          Switch video
        </div>
      </div>
    </Button>
  )
}
