import { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
}

const Button = ({ children }): ButtonProps => <button {...props}>{children}</button>

export default Button
