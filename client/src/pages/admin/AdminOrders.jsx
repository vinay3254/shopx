import toast from "react-hot-toast";
import { Select } from "../../components/ui/Select.jsx";
import { useGetAdminOrdersQuery, useUpdateOrderStatusMutation } from "../../store/api/ordersApi.js";
import { currency, statusLabel } from "../../utils/format.js";

export default function AdminOrders() {
  const { data } = useGetAdminOrdersQuery();
  const [updateOrderStatus] = useUpdateOrderStatusMutation();
  const orders = data?.orders || [];

  const updateStatus = async (id, orderStatus) => {
    await updateOrderStatus({ id, body: { orderStatus } }).unwrap();
    toast.success("Order status updated");
  };

  return (
    <div>
      <h1 className="mb-8 font-display text-5xl font-black">All orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <article className="grid gap-4 rounded-[2rem] bg-white/80 p-5 shadow-card md:grid-cols-[1fr_180px]" key={order._id}>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-tealx">{statusLabel(order.orderStatus)}</p>
              <h2 className="font-bold">Order #{order._id.slice(-8)}</h2>
              <p className="text-sm text-graphite">{order.user?.email} - {currency(order.totalPrice)}</p>
            </div>
            <Select onChange={(event) => updateStatus(order._id, event.target.value)} value={order.orderStatus}>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </article>
        ))}
      </div>
    </div>
  );
}
