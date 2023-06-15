'use client'
import { useState } from 'react'
import Dropzone from '@/lib/components/Dropzone'
import VideoPlayer from '@/lib/components/VideoPlayer'
//Test
const Home = () => {
  const [videos, setVideos] = useState<File[]>([])

  return (
    <main>
      <div className='max-w-3xl pt-8 mx-auto'>
        <Dropzone
          handleDropVideos={(videos) =>
            setVideos((prevVideos) => [...prevVideos, ...videos].slice(0, 2))
          }
        />
        <div className='w-3xl'>
          {videos.length > 0 &&
            videos.map((video, id) => {
              const src = URL.createObjectURL(video)
              const type = video.type
              console.log(type)

              return <VideoPlayer src={src} type={type} key={id} />
            })}
        </div>
      </div>
    </main>
  )
}

export default Home
