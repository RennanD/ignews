import { GetServerSideProps } from "next"
import { getSession } from "next-auth/client";
import Head from "next/head";
import { RichText } from "prismic-dom";
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import styles from '../../styles/post.module.scss';

import { getPrismicClient } from "../../services/prismic";
import { Session } from "next-auth";

type Post = {
  slug: string;
  title: string;
  content: string;
  updated_at: string;
}

interface PostProps {
  post: Post;
}

interface UserSession extends Session {
  activeSubscription: object;
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post.title} | IgNews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updated_at}</time>

          <div 
            className={styles.postContent}
            dangerouslySetInnerHTML={{__html: post.content}} 
          />
        </article>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const session = await getSession({ req }) as UserSession;
  const { slug } = params;

  if(!session?.activeSubscription) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const prismic = getPrismicClient(req);

  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    updated_at: format(parseISO(response.last_publication_date), "dd 'de' MMMM 'de' yyyy", {
      locale: ptBR
    }),
  }

  return {
    props: {
      post
    }
  }
} 