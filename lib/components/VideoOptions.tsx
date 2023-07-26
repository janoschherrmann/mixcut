import { useState } from 'react'
import { useMixcutContext } from '../contexts/MixcutContext'
import { Separator } from '@radix-ui/react-separator'
import { Source } from '../types'
import { Button } from './Button'
import {
  filterBlackAndWhite,
  filterBlur,
  filterSepia,
  speedUp,
  invertColors
} from '../utils/ffmpeg'
import { Toast } from './Toast'
import { ToastProps } from '../types'

export const VideoOptions = ({ videoIndex }: { videoIndex: Source }) => {
  const mixcutContext = useMixcutContext()
  const [toast, setToast] = useState<ToastProps>({
    title: '',
    description: '',
    open: false
  })

  const handleOpenToast = () => {
    setToast({
      title: 'Processing video',
      description: 'This might take a bit...',
      open: true
    })
  }

  const handleCloseToast = () => {
    setToast({
      title: '',
      description: '',
      open: false
    })
  }

  const handleAddBlackAndWhiteFilter = () => {
    if (mixcutContext.ffmpeg) {
      handleOpenToast()

      mixcutContext.addToQueue(async () =>
        filterBlackAndWhite(mixcutContext.ffmpeg!, mixcutContext[videoIndex].file!)
          .then((processedFile) => {
            mixcutContext.setVideoSource(videoIndex, processedFile)
          })
          .catch((error) => {
            alert(error)
          })
          .finally(() => {
            handleCloseToast()
          })
      )
    }
  }

  const handleAddSepiaFilter = () => {
    if (mixcutContext.ffmpeg) {
      handleOpenToast()

      mixcutContext.addToQueue(async () =>
        filterSepia(mixcutContext.ffmpeg!, mixcutContext[videoIndex].file!)
          .then((processedFile) => {
            mixcutContext.setVideoSource(videoIndex, processedFile)
          })
          .catch((error) => {
            alert(error)
          })
          .finally(() => {
            handleCloseToast()
          })
      )
    }
  }

  const handleInvertColors = () => {
    if (mixcutContext.ffmpeg) {
      handleOpenToast()

      mixcutContext.addToQueue(async () =>
        invertColors(mixcutContext.ffmpeg!, mixcutContext[videoIndex].file!)
          .then((processedFile) => {
            mixcutContext.setVideoSource(videoIndex, processedFile)
          })
          .catch((error) => {
            alert(error)
          })
          .finally(() => {
            handleCloseToast()
          })
      )
    }
  }

  const handleSpeedUp = () => {
    if (mixcutContext.ffmpeg) {
      handleOpenToast()

      mixcutContext.addToQueue(async () =>
        speedUp(mixcutContext.ffmpeg!, mixcutContext[videoIndex].file!)
          .then((processedFile) => {
            mixcutContext.setVideoSource(videoIndex, processedFile)
          })
          .catch((error) => {
            alert(error)
          })
          .finally(() => {
            handleCloseToast()
          })
      )
    }
  }

  const handleAddBlurFilter = () => {
    if (mixcutContext.ffmpeg) {
      handleOpenToast()

      mixcutContext.addToQueue(async () =>
        filterBlur(mixcutContext.ffmpeg!, mixcutContext[videoIndex].file!)
          .then((processedFile) => {
            mixcutContext.setVideoSource(videoIndex, processedFile)
          })
          .catch((error) => {
            alert(error)
          })
          .finally(() => {
            handleCloseToast()
          })
      )
    }
  }

  return (
    <div>
      <div className='pt-8'>
        <h3 className='font-semibold'>Video {videoIndex === Source.FIRST_SOURCE ? '1' : '2'} </h3>
        <Separator className='my-2 bg-zinc-800 h-[1px] mb-4' />
        <div className='flex flex-col gap-y-1'>
          <Button className='w-full' onClick={handleAddBlackAndWhiteFilter}>
            Add black & white filter
          </Button>

          <Button className='w-full' onClick={handleAddSepiaFilter}>
            Sepia filter
          </Button>

          <Button className='w-full' onClick={handleAddBlurFilter}>
            Blur filter
          </Button>

          <Button className='w-full' onClick={handleSpeedUp}>
            Speed up (x2)
          </Button>

          <Button className='w-full' onClick={handleInvertColors}>
            Invert colors
          </Button>
        </div>
      </div>
      <Toast
        title={toast.title}
        description={toast.description}
        open={toast.open}
        setOpen={setToast}
      />
    </div>
  )
}
