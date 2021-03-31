import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';

import Prismic from '@prismicio/client';

import styles from '../../styles/posts.module.scss';

import { getPrismicClient } from '../../services/prismic';
import { RichText } from 'prismic-dom';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';


type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updated_at: string;
}

interface PostsProps {
  posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link href={`/posts/${post.slug}`}>
              <a key={post.slug}>
                <time>{post.updated_at}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const response = await prismic.query(
    [Prismic.predicates.at('document.type', 'post')],
    {
      fetch: ['post.title', 'post.content'],
      pageSize: 100
    }
  );

  const posts = response.results.map(post => ({
    slug: post.uid,
    title: RichText.asText(post.data.title),
    excerpt: post.data.content.find(
      content => content.type === 'paragraph'
    )?.text ?? "",
    updated_at: format(parseISO(post.last_publication_date), "dd 'de' MMMM 'de' yyyy", {
      locale: ptBR
    }),
  }))

  return {
    props: { posts }
  }
}