import Order from "../models/Order.js";
import Product from "../models/Product.js";
import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { getStripe } from "../utils/stripe.js";

/**
 * Create a standalone Stripe PaymentIntent for a client-side PaymentElement.
 */
export const createPaymentIntent = asyncHandler(async (req, res) => {
  const stripe = getStripe();

  if (!stripe) {
    throw new ApiError(500, "Stripe is not configured");
  }

  const amount = Math.round(Number(req.body.amount) * 100);

  if (!amount || amount < 50) {
    throw new ApiError(400, "A valid amount is required");
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: req.body.currency || "inr",
    metadata: req.body.metadata || {},
    automatic_payment_methods: { enabled: true }
  });

  res.status(201).json({ success: true, clientSecret: paymentIntent.client_secret, paymentIntentId: paymentIntent.id });
});

/**
 * Verify Stripe webhook signatures and synchronize order payment state.
 */
export const stripeWebhook = asyncHandler(async (req, res) => {
  const stripe = getStripe();

  if (!stripe) {
    throw new ApiError(500, "Stripe is not configured");
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, req.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET);
  } catch (error) {
    throw new ApiError(400, `Webhook signature verification failed: ${error.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const intent = event.data.object;
    const orderId = intent.metadata?.orderId;

    if (orderId) {
      const order = await Order.findById(orderId);
      if (order && !order.isPaid) {
        order.isPaid = true;
        order.paidAt = new Date();
        order.orderStatus = "confirmed";
        order.paymentResult = { stripeId: intent.id, status: intent.status };
        await Promise.all(
          order.items.map((item) =>
            Product.findByIdAndUpdate(item.product, {
              $inc: { stock: -item.qty, sold: item.qty }
            })
          )
        );
        await order.save();
      }
    }
  }

  res.json({ received: true });
});
