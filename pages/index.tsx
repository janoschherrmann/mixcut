import { Dropzone } from '@/lib/components/Dropzone'
import { VideoPlayer } from '@/lib/components/VideoPlayer'
import { useMixcutContext } from '@/lib/contexts/MixcutContext'
import { Source } from '@/lib/types'
import { Button } from '@/lib/components/Button'
import { ResetIcon } from '@radix-ui/react-icons'
import { Container } from '@/lib/components/Container'
import { DownloadDialog } from '@/lib/components/DownloadDialog'
import { AudioContainer } from '@/lib/components/AudioContainer'

const Home = () => {
  const mixcutContext = useMixcutContext()

  return (
    <main className='h-screen overflow-hidden flex flex-col'>
      <header className='h-[60px]'>
        <Container className='flex justify-between items-center'>
          <h1 className='text-xl font-bold'>Mixcut</h1>
          <div className='flex items-center gap-x-2'>
            <Button>
              <ResetIcon className='w-3 h-3' />
              Reset videos
            </Button>
            <DownloadDialog />
          </div>
        </Container>
      </header>
      <div className='grid grid-cols-3 flex-grow'>
        <div className='col-span-1'>
          <Container>
            <h2 className='text-md font-semibold'>Video options</h2>
          </Container>
        </div>
        <div className='col-span-2 flex flex-col'>
          <div className='grid grid-cols-2'>
            <div className='col-span-1'>
              <Container>
                {mixcutContext.firstSource.file && (
                  <VideoPlayer
                    src={URL.createObjectURL(mixcutContext.firstSource.file)}
                    videoIndex={Source.FIRST_SOURCE}
                  />
                )}

                {!mixcutContext.firstSource.file && <Dropzone videoIndex={Source.FIRST_SOURCE} />}
              </Container>
            </div>
            <div className='col-span-1'>
              <Container>
                {!mixcutContext.secondSource.file && <Dropzone videoIndex={Source.SECOND_SOURCE} />}
                <div>
                  {mixcutContext.secondSource.file && (
                    <VideoPlayer
                      src={URL.createObjectURL(mixcutContext.secondSource.file)}
                      videoIndex={Source.SECOND_SOURCE}
                    />
                  )}
                </div>
              </Container>
            </div>
          </div>
          <div className='flex-grow'>
            <AudioContainer source={Source.FIRST_SOURCE} />
            <AudioContainer source={Source.SECOND_SOURCE} />
          </div>
        </div>
      </div>
    </main>
  )
}

export default Home
