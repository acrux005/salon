import Stripe from "stripe";
import { getPrisma } from "@/lib/db";
import { getRandkiSiteUrl } from "@/lib/randkiHost";

/**
 * Stripe Premium — konfiguracja produkcyjna (.env):
 *
 * STRIPE_SECRET_KEY=sk_live_...
 * STRIPE_PRICE_PREMIUM=price_...        ← Price ID subskrypcji miesięcznej
 * STRIPE_WEBHOOK_SECRET=whsec_...       ← Dashboard → Webhooks → endpoint:
 *   URL: https://randka.odart.pl/api/randki/stripe/webhook
 *   Events: checkout.session.completed, customer.subscription.updated,
 *           customer.subscription.deleted, invoice.paid
 */

function getStripe(): Stripe {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("Stripe nie jest skonfigurowany.");
  return new Stripe(key);
}

export function isStripeConfigured(): boolean {
  return !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_PREMIUM);
}

export async function createPremiumCheckoutSession(accountId: string, email: string, host: string) {
  const priceId = process.env.STRIPE_PRICE_PREMIUM;
  if (!priceId) throw new Error("Brak STRIPE_PRICE_PREMIUM w konfiguracji.");

  const stripe = getStripe();
  const prisma = getPrisma();
  const account = await prisma.datingAccount.findUnique({ where: { id: accountId } });
  if (!account) throw new Error("Brak konta.");

  let customerId = account.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({ email, metadata: { datingAccountId: accountId } });
    customerId = customer.id;
    await prisma.datingAccount.update({
      where: { id: accountId },
      data: { stripeCustomerId: customerId },
    });
  }

  const siteUrl = getRandkiSiteUrl(host);
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${siteUrl}/ustawienia?premium=success`,
    cancel_url: `${siteUrl}/ustawienia?premium=cancel`,
    metadata: { datingAccountId: accountId },
    subscription_data: { metadata: { datingAccountId: accountId } },
    allow_promotion_codes: true,
  });

  if (!session.url) throw new Error("Nie udało się utworzyć sesji Stripe.");
  return session.url;
}

async function syncPremiumFromSubscription(sub: Stripe.Subscription) {
  const accountId = sub.metadata?.datingAccountId;
  if (!accountId) return;

  const active = sub.status === "active" || sub.status === "trialing";
  const periodEnd = sub.current_period_end ? new Date(sub.current_period_end * 1000) : null;

  await getPrisma().datingAccount.update({
    where: { id: accountId },
    data: {
      isPremium: active,
      premiumUntil: active ? periodEnd : null,
      stripeSubscriptionId: active ? sub.id : null,
    },
  });
}

export async function handleStripeWebhook(rawBody: string, signature: string) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) throw new Error("Brak STRIPE_WEBHOOK_SECRET.");

  const stripe = getStripe();
  const event = stripe.webhooks.constructEvent(rawBody, signature, secret);

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const accountId = session.metadata?.datingAccountId;
      const subId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;
      if (accountId && subId) {
        const sub = await stripe.subscriptions.retrieve(subId);
        await syncPremiumFromSubscription(sub);
      }
      break;
    }
    case "customer.subscription.updated": {
      const sub = event.data.object as Stripe.Subscription;
      await syncPremiumFromSubscription(sub);
      break;
    }
    case "invoice.paid": {
      const invoice = event.data.object as Stripe.Invoice;
      const subId =
        typeof invoice.subscription === "string" ? invoice.subscription : invoice.subscription?.id ?? null;
      if (subId) {
        const sub = await stripe.subscriptions.retrieve(subId);
        await syncPremiumFromSubscription(sub);
      }
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      const accountId = sub.metadata?.datingAccountId;
      if (accountId) {
        await getPrisma().datingAccount.update({
          where: { id: accountId },
          data: { isPremium: false, premiumUntil: null, stripeSubscriptionId: null },
        });
      }
      break;
    }
  }

  return event.type;
}

export async function cancelStripeSubscription(subscriptionId: string): Promise<void> {
  const stripe = getStripe();
  await stripe.subscriptions.cancel(subscriptionId);
}

export function getStripeDashboardCustomerUrl(customerId: string): string {
  return `https://dashboard.stripe.com/customers/${customerId}`;
}
