import { Link } from "react-router-dom";
import { Breadcrumbs } from "../components/ui/Breadcrumbs.jsx";
import { Button } from "../components/ui/Button.jsx";
import { useGetMyOrdersQuery } from "../store/api/ordersApi.js";
import { currency, date, statusLabel } from "../utils/format.js";

export default function OrdersPage() {
  const { data, isLoading } = useGetMyOrdersQuery();
  const orders = data?.orders || [];

  if (isLoading) {
    return <div className="h-80 animate-pulse rounded-[2rem] bg-white/70" />;
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: "Orders" }]} />
      <h1 className="mb-8 font-display text-5xl font-black">Order history</h1>
      <div className="space-y-4">
        {orders.length ? orders.map((order) => (
          <article className="grid gap-4 rounded-[2rem] bg-white/80 p-5 shadow-card md:grid-cols-[1fr_auto]" key={order._id}>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-tealx">{statusLabel(order.orderStatus)}</p>
              <h2 className="mt-1 font-bold">Order #{order._id.slice(-8)}</h2>
              <p className="mt-1 text-sm text-graphite">{date(order.createdAt)} - {order.items.length} items - {currency(order.totalPrice)}</p>
            </div>
            <Button as={Link} to={`/orders/${order._id}`} variant="outline">
              View details
            </Button>
          </article>
        )) : <p className="rounded-[2rem] bg-white/80 p-8 font-bold shadow-card">No orders yet.</p>}
      </div>
    </div>
  );
}
