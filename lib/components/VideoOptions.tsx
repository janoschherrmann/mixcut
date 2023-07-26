import { useState } from 'react'
import { useMixcutContext } from '../contexts/MixcutContext'
import { Separator } from '@radix-ui/react-separator'
import { Source } from '../types'
import { Button } from './Button'
import { filterBlackAndWhite } from '../utils/ffmpeg'
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
          .then((bwVideoFile) => {
            mixcutContext.setVideoSource(videoIndex, bwVideoFile)
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
        <Button className='w-full' onClick={handleAddBlackAndWhiteFilter}>
          Add black & white filter
        </Button>
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
