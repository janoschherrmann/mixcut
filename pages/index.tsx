import { VideoPlayer } from '@/lib/components/VideoPlayer'
import { Source } from '@/lib/types'
import { Container } from '@/lib/components/Container'
import { AudioContainer } from '@/lib/components/AudioContainer'
import { VideoOptions } from '@/lib/components/VideoOptions'
import { Header } from '@/lib/components/Header'

const Home = () => {
  return (
    <main className='h-screen overflow-hidden flex flex-col'>
      <Header />
      <div className='grid grid-cols-4 flex-grow'>
        <Container className='col-span-1'>
          <h2 className='text-lg font-semibold'>Video options</h2>
          <VideoOptions videoIndex={Source.FIRST_SOURCE} />
          <VideoOptions videoIndex={Source.SECOND_SOURCE} />
        </Container>

        <div className='col-span-3 flex flex-col'>
          <div className='grid grid-cols-2'>
            <Container className='col-span-1'>
              <VideoPlayer videoIndex={Source.FIRST_SOURCE} />
            </Container>

            <Container className='col-span-1'>
              <VideoPlayer videoIndex={Source.SECOND_SOURCE} />
            </Container>
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
