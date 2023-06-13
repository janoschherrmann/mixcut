import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' })

export const metadata = {
  title: 'Mixcut',
  description: 'Mixcut is a tool for editing video and audio together.'
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang='en'>
      <body className={inter.variable}>{children}</body>
    </html>
  )
}

export default RootLayout
