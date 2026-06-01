import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Breadcrumbs } from "../components/ui/Breadcrumbs.jsx";
import { Button } from "../components/ui/Button.jsx";
import { Input } from "../components/ui/Input.jsx";
import { PriceDisplay } from "../components/ui/PriceDisplay.jsx";
import { StarRating } from "../components/ui/StarRating.jsx";
import { ImageGallery } from "../components/product/ImageGallery.jsx";
import { ProductCarousel } from "../components/product/ProductCarousel.jsx";
import { RatingSummary } from "../components/product/RatingSummary.jsx";
import { ReviewForm } from "../components/product/ReviewForm.jsx";
import { ReviewList } from "../components/product/ReviewList.jsx";
import { useAddToCartMutation } from "../store/api/cartApi.js";
import { useGetProductBySlugQuery, useGetProductsQuery } from "../store/api/productsApi.js";
import { deliveryEstimate } from "../utils/order.js";

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { data, isLoading } = useGetProductBySlugQuery(slug);
  const product = data?.product;
  const reviews = data?.reviews || [];
  const { data: relatedData } = useGetProductsQuery({ category: product?.category?.slug, limit: 8 }, { skip: !product?.category?.slug });
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("Standard");
  const [color, setColor] = useState("Charcoal");
  const [pincode, setPincode] = useState("");
  const [addToCart, { isLoading: adding }] = useAddToCartMutation();

  if (isLoading) {
    return <div className="h-96 animate-pulse rounded-[2rem] bg-white/70" />;
  }

  if (!product) {
    return <div className="rounded-[2rem] bg-white/80 p-8 font-bold shadow-card">Product not found.</div>;
  }

  const handleAdd = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    await addToCart({ productId: product._id, qty }).unwrap();
    toast.success("Added to cart");
  };

  return (
    <div>
      <Breadcrumbs items={[{ label: product.category?.name || "Products", to: `/category/${product.category?.slug}` }, { label: product.name }]} />
      <section className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <ImageGallery images={product.images} name={product.name} />
        <div className="rounded-[2.5rem] bg-white/80 p-6 shadow-card">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-tealx">{product.brand}</p>
          <h1 className="mt-2 font-display text-4xl font-black leading-tight md:text-5xl">{product.name}</h1>
          <div className="mt-4 flex items-center gap-3">
            <StarRating value={product.ratings} />
            <span className="text-sm font-bold text-graphite">{product.numReviews} reviews</span>
          </div>
          <PriceDisplay className="mt-5" discount={product.discount} mrp={product.mrp} price={product.price} />
          <p className="mt-5 leading-7 text-graphite">{product.description}</p>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-bold">Size</span>
              <select className="w-full rounded-2xl border border-ink/10 bg-linen px-4 py-3 font-semibold" onChange={(event) => setSize(event.target.value)} value={size}>
                {["Standard", "Large", "XL"].map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-bold">Color</span>
              <select className="w-full rounded-2xl border border-ink/10 bg-linen px-4 py-3 font-semibold" onChange={(event) => setColor(event.target.value)} value={color}>
                {["Charcoal", "Amber", "Teal"].map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="flex items-center rounded-full bg-linen">
              <button className="p-3 disabled:opacity-40" disabled={qty <= 1} onClick={() => setQty((value) => value - 1)} type="button">
                <Minus size={16} />
              </button>
              <span className="min-w-10 text-center font-bold">{qty}</span>
              <button className="p-3 disabled:opacity-40" disabled={qty >= product.stock} onClick={() => setQty((value) => value + 1)} type="button">
                <Plus size={16} />
              </button>
            </div>
            <Button disabled={adding || product.stock === 0} onClick={handleAdd} type="button" variant="secondary">
              <ShoppingCart size={18} /> Add to cart
            </Button>
          </div>

          <div className="mt-6 rounded-[1.5rem] bg-linen p-4">
            <Input label="Check delivery pincode" onChange={(event) => setPincode(event.target.value)} placeholder="560001" value={pincode} />
            <p className="mt-2 text-sm font-bold text-tealx">{deliveryEstimate(pincode)}</p>
          </div>

          <p className="mt-4 text-xs font-semibold text-graphite/70">
            Selected variant: {size} / {color}
          </p>
        </div>
      </section>

      <section className="mt-14 grid gap-8 lg:grid-cols-[280px_1fr]">
        <RatingSummary rating={product.ratings} reviews={reviews} />
        <div className="space-y-5">
          <ReviewList reviews={reviews} />
          {isAuthenticated ? <ReviewForm productId={product._id} /> : null}
        </div>
      </section>

      <section className="mt-14">
        <h2 className="mb-5 font-display text-4xl font-black">Customers also bought</h2>
        <ProductCarousel products={relatedData?.products || []} />
      </section>
    </div>
  );
}
