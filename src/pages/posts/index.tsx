import { GetStaticProps } from 'next';
import Head from 'next/head';

import Prismic from '@prismicio/client';

import styles from '../../styles/posts.module.scss';

import { getPrismicClient } from '../../services/prismic';

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          <a href="#">
            <time>29 de março de 2021</time>
            <strong>Best Practices With React Hooks</strong>
            <p>
              React Hooks are a new addition in React 16.8 that let you use 
              state and other React features without writing a class component. 
              In other words, 
              Hooks are functions that let you “hook into” React state and 
              lifecycle features from function components.
            </p>
          </a>

          <a href="#">
            <time>29 de março de 2021</time>
            <strong>Best Practices With React Hooks</strong>
            <p>
              React Hooks are a new addition in React 16.8 that let you use 
              state and other React features without writing a class component. 
              In other words, 
              Hooks are functions that let you “hook into” React state and 
              lifecycle features from function components.
            </p>
          </a>

          <a href="#">
            <time>29 de março de 2021</time>
            <strong>Best Practices With React Hooks</strong>
            <p>
              React Hooks are a new addition in React 16.8 that let you use 
              state and other React features without writing a class component. 
              In other words, 
              Hooks are functions that let you “hook into” React state and 
              lifecycle features from function components.
            </p>
          </a>
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

  console.log(response)

  return {
    props: {}
  }
}