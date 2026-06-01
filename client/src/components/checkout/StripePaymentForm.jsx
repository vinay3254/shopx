import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { usePayOrderMutation } from "../../store/api/ordersApi.js";
import { Button } from "../ui/Button.jsx";

export const StripePaymentForm = ({ orderId, onPaid }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [payOrder, { isLoading }] = usePayOrderMutation();

  const submit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    const result = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/orders/${orderId}`
      },
      redirect: "if_required"
    });

    if (result.error) {
      toast.error(result.error.message);
      return;
    }

    await payOrder({ id: orderId, body: { stripeId: result.paymentIntent?.id, status: result.paymentIntent?.status } }).unwrap();
    toast.success("Payment confirmed");
    onPaid?.();
  };

  return (
    <form className="rounded-[2rem] bg-white/80 p-5 shadow-card" onSubmit={submit}>
      <PaymentElement />
      <Button className="mt-5 w-full" disabled={!stripe || isLoading} type="submit" variant="secondary">
        Pay securely
      </Button>
    </form>
  );
};
