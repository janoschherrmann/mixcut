import { useState, Fragment } from 'react'
import { useMixcutContext } from '../contexts/MixcutContext'
import { Dialog, Transition } from '@headlessui/react'
import { DownloadIcon, CheckIcon } from '@radix-ui/react-icons'
import { Button } from './Button'
import { Source } from '../types'
import { downloadFile } from '../utils/general'
import { combineVideos } from '../utils/ffmpeg'

type RequestedDownload =
  | Source
  | [Source.FIRST_SOURCE, Source.SECOND_SOURCE]
  | [Source.SECOND_SOURCE, Source.FIRST_SOURCE]

export const DownloadDialog = () => {
  const mixcutContext = useMixcutContext()
  const [open, setOpen] = useState(false)

  const handleDownloadRequest = async (requestedDownload: RequestedDownload) => {
    if (Array.isArray(requestedDownload)) {
      mixcutContext.addToQueue(async () => {
        combineVideos(mixcutContext.ffmpeg!, [
          mixcutContext[requestedDownload[0]].transformedFile!,
          mixcutContext[requestedDownload[1]].transformedFile!
        ])
          .then((outputFile) => {
            downloadFile(outputFile)
          })
          .catch((error) => {
            alert(error)
          })
      })
    } else {
      downloadFile(
        requestedDownload === Source.FIRST_SOURCE
          ? mixcutContext.firstSource.transformedFile!
          : mixcutContext.secondSource.transformedFile!
      )
    }

    setOpen(false)
  }

  return (
    <>
      <Button className='flex gap-x-1 text-white items-center' onClick={() => setOpen(true)}>
        <DownloadIcon className='w-3 h-3' />
        Download
      </Button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'>
            <div className='fixed inset-0 bg-zinc-900 bg-opacity-80 transition-opacity' />
          </Transition.Child>

          <div className='fixed inset-0 z-10 overflow-y-auto'>
            <div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
                enterTo='opacity-100 translate-y-0 sm:scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 translate-y-0 sm:scale-100'
                leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'>
                <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-zinc-900 px-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6'>
                  <div>
                    <div className='mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-indigo-500/20'>
                      <CheckIcon className='h-6 w-6 text-indigo-500' aria-hidden='true' />
                    </div>
                    <div className='mt-3 text-center sm:mt-5'>
                      <Dialog.Title as='h3' className='text-base font-semibold'>
                        Download videos
                      </Dialog.Title>
                      <div className='mt-2'>
                        <p className='text-sm'>Choose what you want to download.</p>
                      </div>
                    </div>
                  </div>
                  <div className='mt-5 sm:mt-6 flex gap-y-2 flex-col'>
                    <div className='grid grid-cols-2 gap-x-2 gap-y-2'>
                      <Button
                        className='text-sm font-semibold bg-zinc-700 text-white hover:bg-zinc-600'
                        onClick={() => handleDownloadRequest(Source.FIRST_SOURCE)}>
                        First video
                      </Button>
                      <Button
                        className=' text-sm font-semibold bg-zinc-700 text-white hover:bg-zinc-600'
                        onClick={() => handleDownloadRequest(Source.SECOND_SOURCE)}>
                        Second video
                      </Button>
                      <Button
                        className='text-sm font-semibold bg-zinc-700 text-white hover:bg-zinc-600'
                        onClick={() =>
                          handleDownloadRequest([Source.FIRST_SOURCE, Source.SECOND_SOURCE])
                        }>
                        Combined video <br /> (First + Second)
                      </Button>
                      <Button
                        className='text-sm font-semibold bg-zinc-700 text-white hover:bg-zinc-600'
                        onClick={() =>
                          handleDownloadRequest([Source.SECOND_SOURCE, Source.FIRST_SOURCE])
                        }>
                        Combined video <br /> (Second + First)
                      </Button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
