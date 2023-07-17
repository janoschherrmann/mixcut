import { useState } from 'react'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'

import Dropzone from '@/lib/components/Dropzone'
import VideoPlayer from '@/lib/components/VideoPlayer'
import { useVideoContext } from '@/lib/contexts/VideoContext'

const ffmpeg = createFFmpeg({
  log: true,
  corePath: 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js'
})

const Home = () => {
  const videoState = useVideoContext()

  const [outputFile, setOutputFile] = useState<string>('')

  // const doTransformation = async () => {
  //   // Load ffmpeg core
  //   await ffmpeg.load()

  //   // Transcode the video file to AVI format
  //   ffmpeg.FS('writeFile', 'input.mp4', await fetchFile(videos[0]))
  //   await ffmpeg.run('-i', 'input.mp4', 'output.mov')

  //   // Read the result
  //   const data = ffmpeg.FS('readFile', 'output.mov')

  //   // Create a URL for the transcoded video file
  //   const url = URL.createObjectURL(new Blob([data.buffer], { type: 'video/avi' }))

  //   setOutputFile(url)

  //   // Create a download link and click it
  //   const link = document.createElement('a')
  //   link.href = url
  //   link.download = 'output.mov'
  //   document.body.appendChild(link)
  //   link.click()

  //   // Cleanup
  //   URL.revokeObjectURL(url)
  //   document.body.removeChild(link)
  // }

  return (
    <main className='h-screen overflow-hidden border border-red-500'>
      <div className='grid grid-cols-12 border border-green-500'>
        <div className='col-span-4'></div>
        <div className='col-span-4'>
          <div className='border border-zinc-800 p-2 m-1 rounded-md'>
            {videoState.firstSource.file && (
              <VideoPlayer
                src={URL.createObjectURL(videoState.firstSource.file)}
                videoIndex='firstSource'
              />
            )}
            {!videoState.firstSource.file && <Dropzone videoId='firstSource' />}
          </div>
        </div>
        <div className='col-span-4'>
          <div className='border border-zinc-800 p-2 m-1 rounded-md'>
            {!videoState.secondSource.file && <Dropzone videoId='secondSource' />}
            <div>
              {videoState.secondSource.file && (
                <VideoPlayer
                  src={URL.createObjectURL(videoState.secondSource.file)}
                  videoIndex='secondSource'
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* <button onClick={doTransformation} className='text-white'>
          Do transformation
        </button>
        {outputFile && <video src={outputFile} controls />} */}
    </main>
  )
}

export default Home
