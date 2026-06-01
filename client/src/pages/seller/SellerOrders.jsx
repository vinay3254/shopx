import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button.jsx";
import { useGetSellerOrdersQuery } from "../../store/api/ordersApi.js";
import { currency, statusLabel } from "../../utils/format.js";

export default function SellerOrders() {
  const { data, isLoading } = useGetSellerOrdersQuery();
  const orders = data?.orders || [];

  return (
    <div>
      <h1 className="mb-8 font-display text-5xl font-black">Seller orders</h1>
      {isLoading ? <div className="h-80 animate-pulse rounded-[2rem] bg-white/70" /> : null}
      <div className="space-y-4">
        {orders.map((order) => (
          <article className="grid gap-4 rounded-[2rem] bg-white/80 p-5 shadow-card md:grid-cols-[1fr_auto]" key={order._id}>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-tealx">{statusLabel(order.orderStatus)}</p>
              <h2 className="mt-1 font-bold">Order #{order._id.slice(-8)}</h2>
              <p className="mt-1 text-sm text-graphite">{order.items.length} items - {currency(order.totalPrice)}</p>
            </div>
            <Button as={Link} to={`/orders/${order._id}`} variant="outline">
              Details
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
