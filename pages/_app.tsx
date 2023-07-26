import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { MixcutProvider } from '@/lib/contexts/MixcutContext'
import { Provider as ToastProvider } from '@radix-ui/react-toast'

const inter = Inter({ subsets: ['latin'] })

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <MixcutProvider>
      <ToastProvider duration={100000}>
        <main className={inter.className}>
          <Component {...pageProps} />
        </main>
      </ToastProvider>
    </MixcutProvider>
  )
}

export default App
