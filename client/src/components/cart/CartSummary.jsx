import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { currency } from "../../utils/format.js";
import { Button } from "../ui/Button.jsx";

export const CartSummary = ({ compact = false }) => {
  const { itemCount, total } = useSelector((state) => state.cart);
  const savings = Math.round(total * 0.08);
  const shipping = total > 499 || total === 0 ? 0 : 49;
  const tax = Math.round(total * 0.18);
  const payable = total + shipping + tax;

  return (
    <aside className="rounded-[2rem] bg-ink p-5 text-cream shadow-soft">
      <h2 className="font-display text-2xl font-bold">Cart Summary</h2>
      <div className="mt-5 space-y-3 text-sm">
        <div className="flex justify-between">
          <span>Items ({itemCount})</span>
          <span>{currency(total)}</span>
        </div>
        <div className="flex justify-between text-teal-200">
          <span>Estimated savings</span>
          <span>{currency(savings)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{shipping ? currency(shipping) : "Free"}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>{currency(tax)}</span>
        </div>
        <div className="flex justify-between border-t border-cream/15 pt-4 text-lg font-extrabold">
          <span>Total</span>
          <span>{currency(payable)}</span>
        </div>
      </div>
      {!compact ? (
        <Button as={Link} className="mt-6 w-full" to="/checkout" variant="secondary">
          Proceed to checkout
        </Button>
      ) : (
        <Button as={Link} className="mt-6 w-full" to="/cart" variant="secondary">
          View full cart
        </Button>
      )}
    </aside>
  );
};
