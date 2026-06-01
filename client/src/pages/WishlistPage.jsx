import { ProductGrid } from "../components/product/ProductGrid.jsx";
import { Breadcrumbs } from "../components/ui/Breadcrumbs.jsx";
import { useGetWishlistQuery } from "../store/api/usersApi.js";

export default function WishlistPage() {
  const { data, isLoading } = useGetWishlistQuery();

  return (
    <div>
      <Breadcrumbs items={[{ label: "Wishlist" }]} />
      <h1 className="mb-8 font-display text-5xl font-black">Wishlist</h1>
      <ProductGrid isLoading={isLoading} products={data?.wishlist || []} />
    </div>
  );
}
