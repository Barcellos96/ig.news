import { AppProps } from 'next/app'
import { Header } from '../components/Header'
import { Provider as NexAuthProvider } from 'next-auth/client'

import '../styles/global.scss'

//fica por volta de tudo(repete em todas paginas) e é recarregado sempre que mudar de pagina
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <NexAuthProvider session={pageProps.session}>
    <Header/>  
    <Component {...pageProps} />
    </NexAuthProvider>
  )
}

export default MyApp
