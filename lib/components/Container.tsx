import clsx from 'clsx'
import { ReactNode, HTMLProps } from 'react'

type ContainerProps = HTMLProps<HTMLDivElement> & {
  children: ReactNode
  className?: string
}

export const Container = ({ children, className, ...rest }: ContainerProps) => {
  return (
    <div
      className={clsx('border border-zinc-800 bg-zinc-900 p-2 m-2 rounded-md', className)}
      {...rest}>
      {children}
    </div>
  )
}
