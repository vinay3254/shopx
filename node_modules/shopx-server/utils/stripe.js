import Stripe from "stripe";

/**
 * Lazily create a Stripe client only when credentials exist.
 * @returns {Stripe|null} Stripe client or null in unconfigured environments.
 */
export const getStripe = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    return null;
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2026-02-25.clover"
  });
};
