import { Link } from "react-router-dom";
import { Button } from "../ui/Button.jsx";

export const OrderConfirmation = ({ order }) => (
  <section className="rounded-[2.5rem] bg-ink p-8 text-center text-cream shadow-soft">
    <p className="text-sm font-extrabold uppercase tracking-[0.25em] text-amberx">Order placed</p>
    <h1 className="mt-3 font-display text-4xl font-black">Your ShopX order is confirmed.</h1>
    <p className="mx-auto mt-3 max-w-xl text-cream/75">Order ID: {order?._id}. Track delivery status from your orders page.</p>
    <div className="mt-6 flex justify-center gap-3">
      <Button as={Link} to={`/orders/${order?._id}`} variant="secondary">
        Track order
      </Button>
      <Button as={Link} to="/" variant="outline">
        Continue shopping
      </Button>
    </div>
  </section>
);
