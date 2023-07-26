import { useState, Fragment } from 'react'
import { useMixcutContext } from '../contexts/MixcutContext'
import { Dialog, Transition } from '@headlessui/react'
import { DownloadIcon, CheckIcon } from '@radix-ui/react-icons'
import { Button } from './Button'
import { Source } from '../types'
import { downloadFile } from '../utils/general'
import { combineVideos } from '../utils/ffmpeg'
import { ToastProps } from '../types'
import { Toast } from './Toast'

type RequestedDownload =
  | Source
  | [Source.FIRST_SOURCE, Source.SECOND_SOURCE]
  | [Source.SECOND_SOURCE, Source.FIRST_SOURCE]

export const DownloadDialog = () => {
  const mixcutContext = useMixcutContext()
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast] = useState<ToastProps>({
    title: '',
    description: '',
    open: false
  })

  const handleOpenToast = () => {
    setToast({
      title: 'Processing video',
      description: 'This might take a bit...',
      open: true
    })
  }

  const handleCloseToast = () => {
    setToast({
      title: '',
      description: '',
      open: false
    })
  }

  const handleDownloadRequest = async (requestedDownload: RequestedDownload) => {
    if (Array.isArray(requestedDownload)) {
      handleOpenToast()

      mixcutContext.addToQueue(async () => {
        combineVideos(mixcutContext.ffmpeg!, [
          mixcutContext[requestedDownload[0]].file!,
          mixcutContext[requestedDownload[1]].file!
        ])
          .then((outputFile) => {
            downloadFile(outputFile)
          })
          .catch((error) => {
            alert(error)
          })
          .finally(() => {
            handleCloseToast()
          })
      })
    } else {
      downloadFile(
        requestedDownload === Source.FIRST_SOURCE
          ? mixcutContext.firstSource.file!
          : mixcutContext.secondSource.file!
      )
    }

    setShowModal(false)
  }

  return (
    <>
      <Button className='flex gap-x-1 text-white items-center' onClick={() => setShowModal(true)}>
        <DownloadIcon className='w-3 h-3' />
        Download
      </Button>
      <Transition.Root show={showModal} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={setShowModal}>
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
      <Toast
        title={toast.title}
        description={toast.description}
        open={toast.open}
        setOpen={setToast}
      />
    </>
  )
}
