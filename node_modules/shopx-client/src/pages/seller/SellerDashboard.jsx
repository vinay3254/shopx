import { Link } from "react-router-dom";
import { Button } from "../../components/ui/Button.jsx";
import { useGetSellerOrdersQuery } from "../../store/api/ordersApi.js";
import { useGetMyProductsQuery } from "../../store/api/productsApi.js";
import { currency } from "../../utils/format.js";

export default function SellerDashboard() {
  const { data: orderData } = useGetSellerOrdersQuery();
  const { data: productData } = useGetMyProductsQuery();
  const orders = orderData?.orders || [];
  const products = productData?.products || [];
  const sales = orders.reduce(
    (sum, order) =>
      sum +
      order.items
        .filter((item) => products.some((product) => product._id === item.product?._id))
        .reduce((lineSum, item) => lineSum + item.price * item.qty, 0),
    0
  );

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-tealx">Seller</p>
          <h1 className="font-display text-5xl font-black">Dashboard</h1>
        </div>
        <Button as={Link} to="/seller/products/new" variant="secondary">
          Add product
        </Button>
      </div>
      <section className="grid gap-4 md:grid-cols-3">
        {[
          ["Sales", currency(sales)],
          ["Products", products.length],
          ["Recent orders", orders.length]
        ].map(([label, value]) => (
          <div className="rounded-[2rem] bg-white/80 p-6 shadow-card" key={label}>
            <p className="text-sm font-bold text-graphite">{label}</p>
            <p className="mt-2 font-display text-4xl font-black">{value}</p>
          </div>
        ))}
      </section>
      <section className="mt-8 rounded-[2rem] bg-white/80 p-6 shadow-card">
        <h2 className="font-display text-3xl font-bold">Recent orders</h2>
        <div className="mt-4 space-y-3">
          {orders.slice(0, 5).map((order) => (
            <div className="flex items-center justify-between rounded-2xl bg-linen p-4" key={order._id}>
              <span className="font-bold">#{order._id.slice(-8)}</span>
              <span className="text-sm font-bold capitalize">{order.orderStatus}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
