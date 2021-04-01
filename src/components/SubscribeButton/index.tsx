import { useSession, signIn } from 'next-auth/client';
import { useRouter } from 'next/router';
import { Session } from 'next-auth';

import styles from './styles.module.scss';

import { api } from '../../services/api';
import { getStripeJs } from '../../services/stripe-js';

interface SubscribeButtonProps {
  priceId: string
}

interface UserSession extends Session {
  activeSubscription: object;
}


export function SubscribeButton({ priceId }: SubscribeButtonProps) {

  const [session] = useSession();
  const router = useRouter();

  let userSession = session as UserSession;

  const handleSubscribre = async () => {
    if(!userSession) {
      signIn('github');
      return
    }

    if(userSession?.activeSubscription) {
      router.push('/posts');
      return
    }

    try {
      const response = await api.post('/subscribe');

      const { sessionId } = response.data;

      const stripe = await getStripeJs();

      stripe.redirectToCheckout({ sessionId });
    } catch (err) {
      alert(err.message);
    }
  }

  return(
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribre}
    >
      Subscribe now
    </button>
  )
}