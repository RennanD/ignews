import { query } from 'faunadb'

import { fauna } from "../../services/fauna";
import { stripe } from '../../services/stripe';

interface SubscriptionProps {
  subscriptionId: string;
  customerId: string;
  createAction?: boolean
}

export async function saveSubscription({
  subscriptionId, customerId, createAction = false
}: SubscriptionProps) {
  const userRef = await fauna.query(
    query.Select(
      'ref',
      query.Get(
        query.Match(
          query.Index('user_by_stripe_customer_id'),
          customerId
        )
      )
    )
  );

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);

  const subscriptionData = {
    id: subscription.id,
    userId: userRef,
    status: subscription.status,
    price_id: subscription.items.data[0].price.id,
  }

  if(createAction) {
    await fauna.query(
      query.Create(
        query.Collection('subscriptions'),
        { data: subscriptionData }
      )
    )
  } else {
    await fauna.query(
      query.Replace(
        query.Select(
          "ref",
          query.Get(
            query.Match(
              query.Index('subscription_by_id'),
              subscription.id
            )
          )
        ),
        { data: subscriptionData }
      )
    )
  }
}