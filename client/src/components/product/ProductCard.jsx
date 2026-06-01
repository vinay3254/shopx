import { Heart, ShoppingCart } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useAddToCartMutation } from "../../store/api/cartApi.js";
import { useToggleWishlistMutation } from "../../store/api/usersApi.js";
import { Button } from "../ui/Button.jsx";
import { PriceDisplay } from "../ui/PriceDisplay.jsx";
import { StarRating } from "../ui/StarRating.jsx";

export const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const wishlistIds = useSelector((state) => state.wishlist.productIds);
  const [addToCart, { isLoading }] = useAddToCartMutation();
  const [toggleWishlist] = useToggleWishlistMutation();
  const demoProduct = product._id?.startsWith?.("demo");
  const inWishlist = wishlistIds.includes(product._id);

  const handleAdd = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (demoProduct) {
      toast.error("Seed the API before adding demo products");
      return;
    }
    await addToCart({ productId: product._id, qty: 1 }).unwrap();
    toast.success("Added to cart");
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    if (demoProduct) return;
    await toggleWishlist(product._id).unwrap();
  };

  return (
    <article className="group overflow-hidden rounded-[1.75rem] border border-ink/10 bg-white/80 shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-soft">
      <Link className="block overflow-hidden bg-linen" to={`/product/${product.slug}`}>
        <img
          alt={product.name}
          className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
          src={product.images?.[0]}
        />
      </Link>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-tealx">{product.brand}</p>
            <Link className="mt-1 line-clamp-2 min-h-11 font-bold text-ink hover:text-clay" to={`/product/${product.slug}`}>
              {product.name}
            </Link>
          </div>
          <button
            className={`rounded-full p-2 ${inWishlist ? "bg-amberx text-ink" : "bg-linen text-graphite"}`}
            onClick={handleWishlist}
            type="button"
            aria-label="Toggle wishlist"
          >
            <Heart size={17} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <StarRating value={product.ratings} />
          <span className="text-xs font-bold text-graphite/70">({product.numReviews || 0})</span>
        </div>
        <PriceDisplay discount={product.discount} mrp={product.mrp} price={product.price} />
        <Button className="w-full" disabled={isLoading || product.stock === 0} onClick={handleAdd} type="button" variant="secondary">
          <ShoppingCart size={17} /> {product.stock === 0 ? "Out of stock" : "Add to cart"}
        </Button>
      </div>
    </article>
  );
};
