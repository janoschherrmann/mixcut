import { ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

export const Button = ({
  children,
  className,
  disabled = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      className={clsx(
        'bg-zinc-800 hover:bg-zinc-700 rounded-sm px-2 py-2 text-xs flex gap-x-1 text-white items-center',
        disabled && 'text-zinc-600 hover:bg-zinc-800 cursor-not-allowed',
        className
      )}
      {...props}>
      {children}
    </button>
  )
}
