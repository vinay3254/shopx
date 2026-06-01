import { CartItem } from "../components/cart/CartItem.jsx";
import { CartSummary } from "../components/cart/CartSummary.jsx";
import { Breadcrumbs } from "../components/ui/Breadcrumbs.jsx";
import { useGetCartQuery } from "../store/api/cartApi.js";

export default function CartPage() {
  const { data, isLoading } = useGetCartQuery();
  const items = data?.cart?.items || [];
  const activeItems = items.filter((item) => !item.savedForLater);
  const savedItems = items.filter((item) => item.savedForLater);

  if (isLoading) {
    return <div className="h-96 animate-pulse rounded-[2rem] bg-white/70" />;
  }

  return (
    <div>
      <Breadcrumbs items={[{ label: "Cart" }]} />
      <h1 className="mb-8 font-display text-5xl font-black">Shopping cart</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <section className="space-y-4">
          {activeItems.length ? activeItems.map((item) => <CartItem item={item} key={item.product._id} />) : <p className="rounded-[2rem] bg-white/80 p-8 font-bold shadow-card">Your cart is empty.</p>}
          {savedItems.length ? (
            <div className="pt-6">
              <h2 className="mb-4 font-display text-3xl font-bold">Saved for later</h2>
              <div className="space-y-4">
                {savedItems.map((item) => (
                  <CartItem item={item} key={item.product._id} />
                ))}
              </div>
            </div>
          ) : null}
        </section>
        <CartSummary />
      </div>
    </div>
  );
}
