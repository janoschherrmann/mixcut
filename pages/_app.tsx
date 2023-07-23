import type { AppProps } from 'next/app'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { MixcutProvider } from '@/lib/contexts/MixcutContext'

const inter = Inter({ subsets: ['latin'] })

const App = ({ Component, pageProps }: AppProps) => {
	return (
		<MixcutProvider>
			<main className={inter.className}>
				<Component {...pageProps} />{' '}
			</main>
		</MixcutProvider>
	)
}

export default App
