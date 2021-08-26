import { GetStaticProps } from 'next'
import Head from 'next/head'
import { RichText } from 'prismic-dom' //RichText é conversor de text html
import { getPrismicClient } from '../../services/prismic'
import style from './styles.module.scss'
import Prismic from '@prismicio/client'

type Post ={
    slug: string;
    title: string;
    excerpt: string;
    updatedAt: string;
};

interface PostProps {
    posts: Post[],
}

export default function Posts({ posts }: PostProps) {
    return (
        <>
        <Head>
            <title>Posts | IgNews</title>
        </Head>
        
        <main className={style.container}>
            <div className={style.posts}>
                { posts.map(post => (
                    <a key={post.slug} href="#">
                    <time>{post.updatedAt}</time>
                    <strong> {post.title} </strong>
                    <p>{post.excerpt}</p>
                </a>                
                )) }
            </div>
        </main>
        </>
    );
}

//sempre que puder fazer a formatação de dados (preço, hora, data e etc) logo após consumir os dados(na API)

export const getStaticProps: GetStaticProps = async () => {
    const prismic = getPrismicClient()

    const response = await prismic.query([
        Prismic.predicates.at('document.type', 'publication')
    ], {
        fetch: ['publication.title', 'publication.content'],
        pageSize: 100,
    })


    //map = percorrer cada conteudo
    const posts = response.results.map(post =>{
        return {
            slug: post.uid,
            title: RichText.asText(post.data.title),
            excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '', //find = procurar
            updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-Br',{
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            })
        };
    })
       

    return {
        props: { posts }
    }
}