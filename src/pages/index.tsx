import styles from '../styles/home.module.scss';
import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>Home | Ig.News</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>Hey, welcome 👏</span>
          <h1>News about the <span>React</span> world</h1>
          <p>
            Get access to publications <br />
            <span>For $9.90</span>
          </p>

        </section>
        <img src="/images/avatar.svg" alt="Girl code"/>
      </main>
    </>
  )
}
