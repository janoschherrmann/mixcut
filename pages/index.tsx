import { useState } from 'react'
import { Dropzone } from '@/lib/components/Dropzone'
import { VideoPlayer } from '@/lib/components/VideoPlayer'
import { useMixcutContext } from '@/lib/contexts/MixcutContext'
import { Source } from '@/lib/types'
import Waveform from '@/lib/components/Waveform'

const Home = () => {
  const mixcutState = useMixcutContext()
  const [outputFile, setOutputFile] = useState<string>('')

  // useEffect(() => {
  //   // const isFFmpegReady = mixcutState.ffmpeg && !isFFmpegRunning
  //   // const needsAudioFirst = !mixcutState.firstSource.audioFile && mixcutState.firstSource.file
  //   // const needsAudioSecond = !mixcutState.secondSource.audioFile && mixcutState.secondSource.file

  //   // if (isFFmpegReady && needsAudioFirst) {
  //   //   ffmpegQueue.add(async () => {
  //   //     extractAudio(mixcutState.ffmpeg!, mixcutState.firstSource.file!)
  //   //       .then((audioFile) => {
  //   //         mixcutState.setAudioSource(Source.FIRST_SOURCE, audioFile)
  //   //       })
  //   //       .catch((error) => {
  //   //         alert(error)
  //   //       })
  //   //       .finally(() => {
  //   //         setIsFFmpegRunning(false)
  //   //       })
  //   //   })
  //   // }

  //   // if (isFFmpegReady && needsAudioSecond) {
  //   //   ffmpegQueue.add(async () => {
  //   //     extractAudio(mixcutState.ffmpeg!, mixcutState.secondSource.file!)
  //   //       .then((audioFile) => {
  //   //         mixcutState.setAudioSource(Source.SECOND_SOURCE, audioFile)
  //   //       })
  //   //       .catch((error) => {
  //   //         alert(error)
  //   //       })
  //   //       .finally(() => {
  //   //         setIsFFmpegRunning(false)
  //   //       })
  //   //   })
  //   // }

  //   // if (isFFmpegReady && needsAudioFirst) {
  //   //   setIsFFmpegRunning(true)
  //   //   extractAudio(mixcutState.ffmpeg!, mixcutState.firstSource.file!)
  //   //     .then((audioFile) => {
  //   //       mixcutState.setAudioSource(Source.FIRST_SOURCE, audioFile)
  //   //     })
  //   //     .catch((error) => {
  //   //       alert(error)
  //   //     })
  //   //     .finally(() => {
  //   //       setIsFFmpegRunning(false)
  //   //     })
  //   // }

  //   // if (isFFmpegReady && needsAudioSecond) {
  //   //   setIsFFmpegRunning(true)
  //   //   extractAudio(mixcutState.ffmpeg!, mixcutState.secondSource.file!)
  //   //     .then((audioFile) => {
  //   //       mixcutState.setAudioSource(Source.SECOND_SOURCE, audioFile)
  //   //     })
  //   //     .catch((error) => {
  //   //       alert(error)
  //   //     })
  //   //     .finally(() => {
  //   //       setIsFFmpegRunning(false)
  //   //     })
  //   // }
  // }, [mixcutState, isFFmpegRunning])

  // const doTransformation = async () => {
  //   // Load ffmpeg core
  //   await ffmpeg.load()
  // const doTransformation = async () => {

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
            {mixcutState.firstSource.transformedFile && (
              <VideoPlayer
                src={URL.createObjectURL(mixcutState.firstSource.transformedFile)}
                videoIndex={Source.FIRST_SOURCE}
              />
            )}
            {mixcutState.firstSource.audioFile && (
              <Waveform
                audioBlob={mixcutState.firstSource.audioFile}
                videoIndex={Source.FIRST_SOURCE}
              />
            )}
            {!mixcutState.firstSource.file && <Dropzone videoIndex={Source.FIRST_SOURCE} />}
          </div>
        </div>
        <div className='col-span-4'>
          <div className='border border-zinc-800 p-2 m-1 rounded-md'>
            {!mixcutState.secondSource.file && <Dropzone videoIndex={Source.SECOND_SOURCE} />}
            <div>
              {mixcutState.secondSource.transformedFile && (
                <VideoPlayer
                  src={URL.createObjectURL(mixcutState.secondSource.transformedFile)}
                  videoIndex={Source.SECOND_SOURCE}
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
