import { ButtonHTMLAttributes } from 'react'

export const Button = ({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => {
	return (
		<button
			className='bg-zinc-800 hover:bg-zinc-700 rounded-sm text-gray-300 px-2 py-1 text-xs'
			{...props}>
			{children}
		</button>
	)
}
