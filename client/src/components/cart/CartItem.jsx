import { Minus, Plus, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useRemoveCartItemMutation, useUpdateCartItemMutation } from "../../store/api/cartApi.js";
import { currency } from "../../utils/format.js";

export const CartItem = ({ item, compact = false }) => {
  const product = item.product;
  const [updateCartItem, { isLoading }] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();

  const update = async (body) => {
    await updateCartItem({ productId: product._id, body }).unwrap();
  };

  const remove = async () => {
    await removeCartItem(product._id).unwrap();
    toast.success("Item removed");
  };

  return (
    <article className="grid grid-cols-[88px_1fr] gap-4 rounded-[1.5rem] bg-white/80 p-4 shadow-card">
      <Link to={`/product/${product.slug}`}>
        <img alt={product.name} className="aspect-square rounded-2xl object-cover" src={product.images?.[0]} />
      </Link>
      <div className="min-w-0">
        <Link className="line-clamp-2 font-bold hover:text-clay" to={`/product/${product.slug}`}>
          {product.name}
        </Link>
        <p className="mt-1 text-sm font-extrabold">{currency(product.price)}</p>
        {!compact ? <p className="text-xs font-semibold text-graphite/70">Stock: {product.stock}</p> : null}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="flex items-center rounded-full bg-linen">
            <button
              className="p-2 disabled:opacity-40"
              disabled={isLoading || item.qty <= 1}
              onClick={() => update({ qty: item.qty - 1 })}
              type="button"
              aria-label="Decrease quantity"
            >
              <Minus size={14} />
            </button>
            <span className="min-w-8 text-center text-sm font-bold">{item.qty}</span>
            <button
              className="p-2 disabled:opacity-40"
              disabled={isLoading || item.qty >= product.stock}
              onClick={() => update({ qty: item.qty + 1 })}
              type="button"
              aria-label="Increase quantity"
            >
              <Plus size={14} />
            </button>
          </div>
          <button className="rounded-full bg-linen px-3 py-2 text-xs font-bold" onClick={() => update({ savedForLater: !item.savedForLater })} type="button">
            {item.savedForLater ? "Move to cart" : "Save for later"}
          </button>
          <button className="rounded-full bg-red-50 p-2 text-red-600" onClick={remove} type="button" aria-label="Remove item">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </article>
  );
};
