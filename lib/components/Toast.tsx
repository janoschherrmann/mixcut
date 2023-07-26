import { Dispatch, SetStateAction } from 'react'
import { Root, Viewport } from '@radix-ui/react-toast'
import { GearIcon } from '@radix-ui/react-icons'
import { ToastProps } from '../types'

export const Toast = ({
  title,
  description,
  open,
  setOpen
}: {
  title: string
  description: string
  open: boolean
  setOpen: Dispatch<SetStateAction<ToastProps>>
}) => {
  return (
    <>
      <Root
        className='bg-zinc-800 border border-zinc-700 rounded-md py-2 px-4 flex items-center gap-x-3 mr-4 mb-4'
        open={open}
        onOpenChange={(open) => setOpen((prev) => ({ ...prev, open }))}>
        <div>
          <GearIcon className='w-8 h-8 bg-indigo-500/20 text-indigo-300 rounded-full p-2 animate-spin' />
        </div>
        <div>
          <span className='font-semibold text-base text-white'>{title}</span>
          <p className='text-xs font-zinc-400'>{description}</p>
        </div>
      </Root>
      <Viewport className='fixed bottom-0 right-0 flex flex-col max-w-full m-0 list-none outline-none' />
    </>
  )
}
