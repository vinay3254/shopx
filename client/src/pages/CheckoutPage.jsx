import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { AddressForm } from "../components/checkout/AddressForm.jsx";
import { CheckoutStepper } from "../components/checkout/CheckoutStepper.jsx";
import { OrderConfirmation } from "../components/checkout/OrderConfirmation.jsx";
import { StripePaymentForm } from "../components/checkout/StripePaymentForm.jsx";
import { CartSummary } from "../components/cart/CartSummary.jsx";
import { Breadcrumbs } from "../components/ui/Breadcrumbs.jsx";
import { Button } from "../components/ui/Button.jsx";
import { useCreateOrderMutation, usePayOrderMutation } from "../store/api/ordersApi.js";

const stripePromise = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ? loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY) : null;

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [address, setAddress] = useState(null);
  const [order, setOrder] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const cartItems = useSelector((state) => state.cart.items.filter((item) => !item.savedForLater));
  const [createOrder, { isLoading: creating }] = useCreateOrderMutation();
  const [payOrder, { isLoading: paying }] = usePayOrderMutation();
  const elementsOptions = useMemo(() => (clientSecret ? { clientSecret, appearance: { theme: "stripe" } } : null), [clientSecret]);

  const submitAddress = (values) => {
    setAddress(values);
    setStep(1);
  };

  const startPayment = async () => {
    const data = await createOrder({ shippingAddress: address, paymentMethod: "stripe" }).unwrap();
    setOrder(data.order);
    setClientSecret(data.clientSecret || "");
    if (!data.clientSecret) {
      toast("Stripe is not configured. Use test completion for local flow.");
    }
  };

  const completeTestPayment = async () => {
    await payOrder({ id: order._id, body: { status: "succeeded", stripeId: "local_test_payment" } }).unwrap();
    setStep(2);
  };

  return (
    <div>
      <Breadcrumbs items={[{ label: "Checkout" }]} />
      <CheckoutStepper step={step} />
      {step === 0 ? (
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <AddressForm onSubmit={submitAddress} />
          <CartSummary />
        </div>
      ) : null}
      {step === 1 ? (
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <section className="space-y-5">
            <div className="rounded-[2rem] bg-white/80 p-5 shadow-card">
              <h1 className="font-display text-3xl font-bold">Payment</h1>
              <p className="mt-2 text-sm text-graphite">Review address, create a secure payment, then complete the order.</p>
              <p className="mt-4 rounded-2xl bg-linen p-4 text-sm font-semibold">
                {address?.fullName}, {address?.line1}, {address?.city} - {address?.postalCode}
              </p>
              {!order ? (
                <Button className="mt-4" disabled={creating || cartItems.length === 0} onClick={startPayment} type="button" variant="secondary">
                  Create secure payment
                </Button>
              ) : null}
            </div>
            {order && clientSecret && stripePromise && elementsOptions ? (
              <Elements options={elementsOptions} stripe={stripePromise}>
                <StripePaymentForm orderId={order._id} onPaid={() => setStep(2)} />
              </Elements>
            ) : null}
            {order && (!clientSecret || !stripePromise) ? (
              <div className="rounded-[2rem] bg-white/80 p-5 shadow-card">
                <p className="text-sm font-semibold text-graphite">Local test mode fallback. Configure Stripe keys to use PaymentElement.</p>
                <Button className="mt-4" disabled={paying} onClick={completeTestPayment} type="button" variant="secondary">
                  Complete test payment
                </Button>
              </div>
            ) : null}
          </section>
          <CartSummary />
        </div>
      ) : null}
      {step === 2 ? <OrderConfirmation order={order} /> : null}
    </div>
  );
}
