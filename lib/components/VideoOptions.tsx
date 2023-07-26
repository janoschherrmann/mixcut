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

export const VideoOptions = ({ videoIndex }: { videoIndex: Source }) => {
  const mixcutContext = useMixcutContext()
  const [showToast, setShowToast] = useState(false)

  const handleTransformation = () => {
    setShowToast(true)

    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  const handleAddBlackAndWhiteFilter = () => {
    if (mixcutContext.ffmpeg) {
      handleTransformation()

      mixcutContext.addToQueue(async () =>
        filterBlackAndWhite(mixcutContext.ffmpeg!, mixcutContext[videoIndex].file!)
          .then((processedFile) => {
            mixcutContext.setVideoSource(videoIndex, processedFile)
          })
          .catch((error) => {
            alert(error)
          })
          .finally(() => {
            // handle unsetting the processing state
          })
      )
    }
  }

  const handleAddSepiaFilter = () => {
    if (mixcutContext.ffmpeg) {
      handleTransformation()

      mixcutContext.addToQueue(async () =>
        filterSepia(mixcutContext.ffmpeg!, mixcutContext[videoIndex].file!)
          .then((processedFile) => {
            mixcutContext.setVideoSource(videoIndex, processedFile)
          })
          .catch((error) => {
            alert(error)
          })
          .finally(() => {
            // handle unsetting the processing state
          })
      )
    }
  }

  const handleInvertColors = () => {
    if (mixcutContext.ffmpeg) {
      handleTransformation()

      mixcutContext.addToQueue(async () =>
        invertColors(mixcutContext.ffmpeg!, mixcutContext[videoIndex].file!)
          .then((processedFile) => {
            mixcutContext.setVideoSource(videoIndex, processedFile)
          })
          .catch((error) => {
            alert(error)
          })
          .finally(() => {
            // handle unsetting the processing state
          })
      )
    }
  }

  const handleSpeedUp = () => {
    if (mixcutContext.ffmpeg) {
      handleTransformation()

      mixcutContext.addToQueue(async () =>
        speedUp(mixcutContext.ffmpeg!, mixcutContext[videoIndex].file!)
          .then((processedFile) => {
            mixcutContext.setVideoSource(videoIndex, processedFile)
          })
          .catch((error) => {
            alert(error)
          })
          .finally(() => {
            // handle unsetting the processing state
          })
      )
    }
  }

  const handleAddBlurFilter = () => {
    if (mixcutContext.ffmpeg) {
      handleTransformation()

      mixcutContext.addToQueue(async () =>
        filterBlur(mixcutContext.ffmpeg!, mixcutContext[videoIndex].file!)
          .then((processedFile) => {
            mixcutContext.setVideoSource(videoIndex, processedFile)
          })
          .catch((error) => {
            alert(error)
          })
          .finally(() => {
            // handle unsetting the processing state
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
            Sepia Filter
          </Button>

          <Button className='w-full' onClick={handleAddBlurFilter}>
            Blur Filter
          </Button>

          <Button className='w-full' onClick={handleSpeedUp}>
            Speed Up (x2)
          </Button>

          <Button className='w-full' onClick={handleInvertColors}>
            Invert colors
          </Button>
        </div>
      </div>
      <Toast
        title='Processing video'
        description='This might take a bit...'
        open={showToast}
        setOpen={setShowToast}
      />
    </div>
  )
}
