import { useParams } from "react-router-dom";
import { Breadcrumbs } from "../components/ui/Breadcrumbs.jsx";
import { useGetOrderQuery } from "../store/api/ordersApi.js";
import { currency, date, statusLabel } from "../utils/format.js";
import { orderSteps, statusIndex } from "../utils/order.js";

export default function OrderDetailPage() {
  const { id } = useParams();
  const { data, isLoading } = useGetOrderQuery(id);
  const order = data?.order;

  if (isLoading) {
    return <div className="h-80 animate-pulse rounded-[2rem] bg-white/70" />;
  }

  if (!order) {
    return <p className="rounded-[2rem] bg-white/80 p-8 font-bold shadow-card">Order not found.</p>;
  }

  const activeIndex = statusIndex(order.orderStatus);

  return (
    <div>
      <Breadcrumbs items={[{ label: "Orders", to: "/orders" }, { label: order._id.slice(-8) }]} />
      <section className="rounded-[2.5rem] bg-white/80 p-6 shadow-card">
        <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-tealx">{statusLabel(order.orderStatus)}</p>
        <h1 className="mt-2 font-display text-5xl font-black">Order #{order._id.slice(-8)}</h1>
        <p className="mt-2 text-sm font-semibold text-graphite">Placed {date(order.createdAt)} - Total {currency(order.totalPrice)}</p>
      </section>

      <section className="mt-8 rounded-[2rem] bg-ink p-6 text-cream shadow-soft">
        <h2 className="font-display text-3xl font-bold">Tracking timeline</h2>
        {order.orderStatus === "cancelled" ? (
          <p className="mt-4 rounded-2xl bg-red-500/20 p-4 font-bold">This order has been cancelled.</p>
        ) : (
          <div className="mt-6 grid gap-3 md:grid-cols-4">
            {orderSteps.map((step, index) => (
              <div className={`rounded-2xl p-4 ${index <= activeIndex ? "bg-amberx text-ink" : "bg-cream/10 text-cream/60"}`} key={step}>
                <p className="text-sm font-extrabold capitalize">{step}</p>
                <p className="mt-1 text-xs font-semibold">{index <= activeIndex ? "Completed" : "Waiting"}</p>
              </div>
            ))}
          </div>
        )}
        {order.trackingNumber ? <p className="mt-4 text-sm font-bold">Tracking number: {order.trackingNumber}</p> : null}
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {order.items.map((item) => (
            <article className="grid grid-cols-[80px_1fr_auto] items-center gap-4 rounded-[1.5rem] bg-white/80 p-4 shadow-card" key={item.product?._id || item.name}>
              <img alt={item.name} className="aspect-square rounded-2xl object-cover" src={item.image || item.product?.images?.[0]} />
              <div>
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-sm text-graphite">Qty {item.qty}</p>
              </div>
              <p className="font-extrabold">{currency(item.price * item.qty)}</p>
            </article>
          ))}
        </div>
        <aside className="h-fit rounded-[2rem] bg-white/80 p-5 shadow-card">
          <h2 className="font-display text-2xl font-bold">Shipping</h2>
          <p className="mt-3 text-sm font-semibold text-graphite">
            {order.shippingAddress.fullName}
            <br />
            {order.shippingAddress.line1}
            <br />
            {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
          </p>
        </aside>
      </section>
    </div>
  );
}
