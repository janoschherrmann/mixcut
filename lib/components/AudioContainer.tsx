import { Source } from '../types'
import { Container } from './Container'
import { Button } from './Button'
import * as Separator from '@radix-ui/react-separator'
import { useMixcutContext } from '../contexts/MixcutContext'
import { DownloadIcon, GearIcon, SpeakerLoudIcon } from '@radix-ui/react-icons'
import Waveform from './Waveform'
import { downloadFile } from '../utils/general'

export const AudioContainer = ({ source }: { source: Source }) => {
  const mixcutContext = useMixcutContext()

  const audioFile = mixcutContext[source].audioFile
  const videoFile = mixcutContext[source].transformedFile

  const isIdleState = !videoFile && !audioFile
  const isProcessingAudio = videoFile && !audioFile

  const handleDownloadAudio = () => {
    if (audioFile) {
      downloadFile(audioFile!, 'mp3')
    }
  }

  return (
    <Container>
      <div>
        <div className='flex justify-between items-center'>
          <span className='text-xs font-semibold text-indigo-500 flex bg-indigo-400/10 rounded-md px-4 py-0.5 self-stretch place-items-center'>
            Video {source === Source.FIRST_SOURCE ? '1' : '2'}
          </span>
          <Button disabled={!audioFile} onClick={handleDownloadAudio}>
            <DownloadIcon className='w-3 h-3' />
            Download audio
          </Button>
        </div>
        <Separator.Root className='my-2 bg-zinc-800 h-[1px]' />
      </div>
      {isIdleState && (
        <div className='h-40 bg-zinc-800 rounded-md  p-4 flex items-center flex-col justify-center'>
          <SpeakerLoudIcon className='w-8 h-8 bg-indigo-500/20 text-indigo-300 rounded-full p-2' />
          <span className='text-white font-semibold pt-2'>No audio file...</span>
          <p className='text-sm'>Upload a video file to see the waveform</p>
        </div>
      )}
      {isProcessingAudio && (
        <div className='h-40 bg-zinc-800 rounded-md  p-4 flex items-center flex-col justify-center'>
          <GearIcon className='w-8 h-8 bg-indigo-500/20 text-indigo-300 rounded-full p-2 animate-spin' />
          <span className='text-white font-semibold pt-2'>Processing audio file..</span>
          <p className='text-sm'>This might take a bit</p>
        </div>
      )}

      {audioFile && <Waveform audioBlob={audioFile} videoIndex={source} />}
    </Container>
  )
}
