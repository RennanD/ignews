import { GetStaticProps } from "next"
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";

import { useSession } from "next-auth/client";

import { RichText } from "prismic-dom";

import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import styles from '../../../styles/post.module.scss';

import { getPrismicClient } from "../../../services/prismic";
import { Session } from "next-auth";
import { useEffect } from "react";

type Post = {
  slug: string;
  title: string;
  content: string;
  updated_at: string;
}

interface PostPreviewProps {
  post: Post;
}

interface UserSession extends Session {
  activeSubscription: object;
}

export default function Post({ post }: PostPreviewProps) {

  const [session] = useSession();
  const router = useRouter()

  let userSession = session as UserSession;

  useEffect(() => {
    if(userSession?.activeSubscription) {
      router.push(`/posts/${post.slug}`)
    }
  },[session, router])

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
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{__html: post.content}} 
          />

          <div className={styles.continueReading}>
            Wanna continue reading? 
            <Link href="/">
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}

export const getStaticProps: GetStaticProps = async ({  params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.splice(0, 3)),
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