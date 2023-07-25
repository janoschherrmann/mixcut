import { Container } from './Container'
import { Button } from './Button'
import { useState } from 'react'
import { ResetIcon } from '@radix-ui/react-icons'
import { DownloadDialog } from './DownloadDialog'
import { useMixcutContext } from '../contexts/MixcutContext'
import { Toast } from './Toast'

export const Header = () => {
  const mixcutContext = useMixcutContext()
  const [showToast, setShowToast] = useState(false)

  const handleResetVideos = () => {
    mixcutContext.resetVideos()
    setShowToast(true)

    setTimeout(() => {
      setShowToast(false)
    }, 3000)
  }

  return (
    <header className='h-[60px]'>
      <Container className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Mixcut</h1>
        <div className='flex items-center gap-x-2'>
          <Button onClick={handleResetVideos}>
            <ResetIcon className='w-3 h-3' />
            Reset videos
          </Button>
          <Toast
            title='Reset successful'
            description='Videos were reset to their original state'
            open={showToast}
            setOpen={setShowToast}
          />
          <DownloadDialog />
        </div>
      </Container>
    </header>
  )
}
