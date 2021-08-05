import { GetStaticProps } from 'next'
import { stripe } from '../services/stripe'

import styles from './home.module.scss'
import Head from 'next/head'
import { SubscribeButton } from '../components/SubscribeButton'

//Client-side-rendering = outros casos, ação carregada através de ações do usuário, ações que surgem após ter entrado na pagina (após a pagina ter carregado)
//Server-side-rendering = precisa de indexação, mas precisa de dados dinamicos do usuário, contexto da requisição (demora mais processamento que CSR)
//static site Generation = casos que html fique igual para todos usuários (home do blog, post do blog, pagina de um produto, categoria)

interface Homeprops {
  product: {
    priceId: string;
    amount: number;
  }
}
export default function Home({product}: Homeprops) {
  return (
   <>
    <Head>
        <title>Home | ig.news</title>
    </Head>
   
   <main className={styles.contentContainer}>
     <section className={styles.hero}>
        <span>👏 Hey, welcome </span>
        <h1>News about the <span>React</span> world.</h1>
        <p>
          Get acess to all the publications <br/>
          <span> for {product.amount}/month</span>
        </p>
        <SubscribeButton priceId={product.priceId}/>
     </section>

     <img src="/images/avatar.svg" alt= "girl coding" />
   </main>
   </>
  )
}

//o nome precisar necessariamente ser getServerSideProps | sempre assincrona mesmo que nao use await
//tipagem
//chamada API do stripe
export const getStaticProps: GetStaticProps = async() => {
  const price = await stripe.prices.retrieve('price_1J36v8HtAsL3HzLBpP3xBpRF')

  const product = {
    priceId: price.id,
    
    amount: new Intl.NumberFormat('en-US',{
      style:'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  }

  return { 
    props: {
     product,
    },
    revalidate: 60 * 60 * 24, //24 hours
  }
}