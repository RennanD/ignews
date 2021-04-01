import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { Readable } from 'stream';

import { stripe } from "../../services/stripe";
import {saveSubscription} from "../../components/_lib/manageSubscription";

async function buffer(readable: Readable) {
  const chunks = [];
  
  for await (const chunk of readable) {
    chunks.push(
      typeof chunk === 'string' ? Buffer.from(chunk) : chunk
    );
  }

  return Buffer.concat(chunks);
}

export const config = {
  api: {
    bodyParser: false,
  }
}

const relevantEvents = new Set([
  'checkout.session.completed',
  'customer.subscription.updated',
  'customer.subscription.deleted',
])

export default async ( request: NextApiRequest, response: NextApiResponse) => {
  if(request.method === 'POST') {
    const buf = await buffer(request);
    const secret = request.headers['stripe-signature'];

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        buf, 
        secret, 
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return response.status(400).send(`Webhook error: ${err.message}`);
    }

    const { type } = event;

    if(relevantEvents.has(type)) {

      try {
        switch(type) {
          case 'customer.subscription.updated':
          case 'customer.subscription.deleted':

            const subscription = event.data.object as Stripe.Subscription;
            await saveSubscription({
              subscriptionId: subscription.id,
              customerId: subscription.customer.toString(),
            })
            break

          case 'checkout.session.completed':
            const checkoutSession = event.data.object as Stripe.Checkout.Session;
            await saveSubscription({ 
              subscriptionId: checkoutSession.subscription.toString(),
              customerId: checkoutSession.customer.toString(),
              createAction: true
            })
            break
          default:
            throw new Error('Unhandled evente')
        }

      } catch (err) {
        return response.json({ error: 'Webhook handler failed.' })
      }
    }

    return response.status(200).json({ ok: true });
  } else {
    response.setHeader('Allow', 'POST');
    response.status(405).end('Method not allowed');
  }
}