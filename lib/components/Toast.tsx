import { Dispatch, SetStateAction } from 'react'
import { Root, Viewport } from '@radix-ui/react-toast'
import { CheckIcon } from '@radix-ui/react-icons'

export const Toast = ({
  title,
  description,
  open,
  setOpen
}: {
  title: string
  description: string
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) => {
  return (
    <>
      <Root
        className='bg-zinc-800 border border-zinc-700 rounded-md p-2 flex items-center gap-x-2 mr-4 mb-4'
        open={open}
        onOpenChange={setOpen}>
        <div>
          <CheckIcon className='w-5 h-5 text-white bg-indigo-500/70 rounded-full p-0.5' />
        </div>
        <div>
          <span className='font-semibold text-base text-white'>{title}</span>
          <p className='text-xs font-zinc-400'>{description}</p>
        </div>
      </Root>
      <Viewport className='fixed bottom-0 right-0 flex flex-col  w-64 max-w-full m-0 list-none outline-none' />
    </>
  )
}
