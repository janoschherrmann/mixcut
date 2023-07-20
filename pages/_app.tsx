import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { VideoProvider } from '@/lib/contexts/VideoContext'

const inter = Inter({ subsets: ['latin'] })

const App = ({ Component, pageProps }: AppProps) => {
	return (
		<VideoProvider>
			<main className={inter.className}>
				<Component {...pageProps} />{' '}
			</main>
		</VideoProvider>
	)
}

export default App
