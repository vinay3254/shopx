import { Outlet } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Drawer } from "../ui/Drawer.jsx";
import { CartItem } from "../cart/CartItem.jsx";
import { CartSummary } from "../cart/CartSummary.jsx";
import { closeCartDrawer } from "../../store/uiSlice.js";
import { Footer } from "./Footer.jsx";
import { MegaMenu } from "./MegaMenu.jsx";
import { Navbar } from "./Navbar.jsx";

export const Layout = () => {
  const dispatch = useDispatch();
  const { cartDrawerOpen } = useSelector((state) => state.ui);
  const cartItems = useSelector((state) => state.cart.items);

  return (
    <div className="min-h-screen">
      <Navbar />
      <MegaMenu />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <Outlet />
      </main>
      <Footer />
      <Drawer open={cartDrawerOpen} title="Cart" onClose={() => dispatch(closeCartDrawer())}>
        <div className="space-y-4 overflow-y-auto pb-4">
          {cartItems.length ? cartItems.map((item) => <CartItem compact item={item} key={item.product._id} />) : <p className="rounded-3xl bg-white p-6 text-sm font-semibold">Your cart is empty.</p>}
          <CartSummary compact />
        </div>
      </Drawer>
    </div>
  );
};
