import { Container } from './Container'
import { Button } from './Button'
import { useState } from 'react'
import { ResetIcon } from '@radix-ui/react-icons'
import { DownloadDialog } from './DownloadDialog'
import { useMixcutContext } from '../contexts/MixcutContext'
import { Toast } from './Toast'

export const Header = () => {
  return (
    <header className='h-[60px]'>
      <Container className='flex justify-between items-center'>
        <h1 className='text-2xl font-bold'>Mixcut</h1>
        <div className='flex items-center gap-x-2'>
          <DownloadDialog />
        </div>
      </Container>
    </header>
  )
}
