import  { GetServerSideProps } from 'next'

import styles from '../styles/home.module.scss';
import Head from 'next/head'
import { SubscribeButton } from '../components/SubscribeButton';
import { stripe } from '../services/stripe';
import { formatPrice } from '../utils/formatPrice';

interface HomeProps {
  product: {
    priceId: string;
    amount: number
  }
}

export default function Home({ product }: HomeProps) {
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
            <span>For {product.amount}</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <img src="/images/avatar.svg" alt="Girl code"/>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {

  const price = await stripe.prices.retrieve('price_1IYg7MAxvcIhZogcb5AWzLWB');

  const product = {
    priceId: price.id,
    amount: formatPrice(price.unit_amount / 100)
  }

  return {
    props: {
      product
    }
  }
};
