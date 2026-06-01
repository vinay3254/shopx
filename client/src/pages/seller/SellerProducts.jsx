import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/Button.jsx";
import { PriceDisplay } from "../../components/ui/PriceDisplay.jsx";
import { useDeleteProductMutation, useGetMyProductsQuery } from "../../store/api/productsApi.js";

export default function SellerProducts() {
  const { data, isLoading } = useGetMyProductsQuery();
  const [deleteProduct] = useDeleteProductMutation();
  const products = data?.products || [];

  const remove = async (id) => {
    await deleteProduct(id).unwrap();
    toast.success("Product removed");
  };

  return (
    <div>
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-tealx">Seller</p>
          <h1 className="font-display text-5xl font-black">Products</h1>
        </div>
        <Button as={Link} to="/seller/products/new" variant="secondary">
          New product
        </Button>
      </div>
      {isLoading ? <div className="h-80 animate-pulse rounded-[2rem] bg-white/70" /> : null}
      <div className="space-y-4">
        {products.map((product) => (
          <article className="grid gap-4 rounded-[2rem] bg-white/80 p-4 shadow-card md:grid-cols-[96px_1fr_auto]" key={product._id}>
            <img alt={product.name} className="aspect-square rounded-2xl object-cover" src={product.images?.[0]} />
            <div>
              <h2 className="font-bold">{product.name}</h2>
              <p className="mt-1 text-sm text-graphite">{product.category?.name} - Stock {product.stock}</p>
              <PriceDisplay className="mt-2" discount={product.discount} mrp={product.mrp} price={product.price} />
            </div>
            <div className="flex items-center gap-2">
              <Button as={Link} to={`/product/${product.slug}`} variant="outline">
                View
              </Button>
              <Button onClick={() => remove(product._id)} type="button" variant="ghost">
                Remove
              </Button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
