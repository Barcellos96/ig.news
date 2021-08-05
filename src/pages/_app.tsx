import { AppProps } from 'next/app'
import { Header } from '../components/Header'

import '../styles/global.scss'

//fica por volta de tudo(repete em todas paginas) e é recarregado sempre que mudar de pagina
function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
    <Header/>  
    <Component {...pageProps} />
    </>
  )
}

export default MyApp
