import { Heart, Menu, Search, ShoppingCart, UserRound } from "lucide-react";
import { useState, useTransition } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useLogoutMutation } from "../../store/api/authApi.js";
import { useGetCartQuery } from "../../store/api/cartApi.js";
import { openCartDrawer, toggleMobileMenu } from "../../store/uiSlice.js";
import { useDebounce } from "../../hooks/useDebounce.js";
import { useRecentSearches } from "../../hooks/useRecentSearches.js";
import { Button } from "../ui/Button.jsx";

export const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const { searches, addSearch } = useRecentSearches();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const mobileMenuOpen = useSelector((state) => state.ui.mobileMenuOpen);
  const cartCount = useSelector((state) => state.cart.itemCount);
  const [logout] = useLogoutMutation();
  useGetCartQuery(undefined, { skip: !isAuthenticated });

  const submitSearch = (event) => {
    event.preventDefault();
    if (!query.trim()) return;
    addSearch(query);
    startTransition(() => navigate(`/search?q=${encodeURIComponent(query.trim())}`));
  };

  const handleLogout = async () => {
    await logout();
    toast.success("Signed out");
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-cream/90 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-4">
        <button className="rounded-full bg-white p-3 lg:hidden" onClick={() => dispatch(toggleMobileMenu())} type="button" aria-label="Menu">
          <Menu size={20} />
        </button>
        <Link className="flex items-center gap-2" to="/">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ink font-display text-xl font-black text-amberx">S</span>
          <span className="font-display text-3xl font-black tracking-tight text-ink">ShopX</span>
        </Link>

        <form className="relative mx-0 hidden flex-1 md:block" onSubmit={submitSearch}>
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-graphite/60" size={18} />
          <input
            aria-label="Search products"
            className="w-full rounded-full border border-ink/10 bg-white px-12 py-3 text-sm font-semibold outline-none transition focus:border-amberx focus:ring-4 focus:ring-amberx/15"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products, brands and categories"
            value={query}
          />
          {(debouncedQuery || searches.length > 0) && query ? (
            <div className="absolute left-0 right-0 top-14 rounded-3xl bg-white p-3 shadow-soft">
              <p className="px-3 pb-2 text-xs font-bold uppercase tracking-[0.2em] text-graphite/60">Suggestions</p>
              {[debouncedQuery, ...searches.filter((item) => item !== debouncedQuery)].filter(Boolean).slice(0, 5).map((item) => (
                <button
                  className="block w-full rounded-2xl px-3 py-2 text-left text-sm font-semibold hover:bg-linen"
                  key={item}
                  onClick={() => {
                    setQuery(item);
                    addSearch(item);
                    navigate(`/search?q=${encodeURIComponent(item)}`);
                  }}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>
          ) : null}
        </form>

        <nav className="ml-auto hidden items-center gap-2 lg:flex">
          <NavLink className="rounded-full px-4 py-2 text-sm font-bold hover:bg-white" to="/wishlist">
            <Heart className="inline" size={17} /> Wishlist
          </NavLink>
          <button className="relative rounded-full px-4 py-2 text-sm font-bold hover:bg-white" onClick={() => dispatch(openCartDrawer())} type="button">
            <ShoppingCart className="inline" size={17} /> Cart
            {cartCount ? <span className="absolute -right-1 -top-1 rounded-full bg-amberx px-2 py-0.5 text-xs text-ink">{cartCount}</span> : null}
          </button>
          {isAuthenticated ? (
            <div className="group relative">
              <button className="rounded-full bg-white px-4 py-2 text-sm font-bold" type="button">
                <UserRound className="inline" size={17} /> {user?.name?.split(" ")[0]}
              </button>
              <div className="invisible absolute right-0 top-11 min-w-56 rounded-3xl bg-cream p-3 opacity-0 shadow-soft transition group-hover:visible group-hover:opacity-100">
                <Link className="block rounded-2xl px-4 py-3 text-sm font-semibold hover:bg-white" to="/account">
                  Account
                </Link>
                <Link className="block rounded-2xl px-4 py-3 text-sm font-semibold hover:bg-white" to="/orders">
                  Orders
                </Link>
                {["seller", "admin"].includes(user?.role) ? (
                  <Link className="block rounded-2xl px-4 py-3 text-sm font-semibold hover:bg-white" to="/seller/dashboard">
                    Seller dashboard
                  </Link>
                ) : null}
                {user?.role === "admin" ? (
                  <Link className="block rounded-2xl px-4 py-3 text-sm font-semibold hover:bg-white" to="/admin/orders">
                    Admin
                  </Link>
                ) : null}
                <button className="block w-full rounded-2xl px-4 py-3 text-left text-sm font-semibold hover:bg-white" onClick={handleLogout} type="button">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Button as={Link} to="/login" variant="secondary">
              Login
            </Button>
          )}
        </nav>
      </div>
      <div className="px-4 pb-4 md:hidden">
        <form className="relative" onSubmit={submitSearch}>
          <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-graphite/60" size={18} />
          <input
            className="w-full rounded-full border border-ink/10 bg-white px-12 py-3 text-sm font-semibold outline-none"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search products"
            value={query}
          />
        </form>
      </div>
      {mobileMenuOpen ? (
        <div className="border-t border-ink/10 px-4 pb-4 lg:hidden">
          <div className="grid gap-2 rounded-[1.5rem] bg-white/80 p-3 shadow-card">
            {[
              ["Cart", "/cart"],
              ["Wishlist", "/wishlist"],
              ["Orders", "/orders"],
              ["Account", "/account"]
            ].map(([label, to]) => (
              <Link className="rounded-2xl px-4 py-3 text-sm font-bold hover:bg-linen" key={label} to={to}>
                {label}
              </Link>
            ))}
            {["seller", "admin"].includes(user?.role) ? (
              <Link className="rounded-2xl px-4 py-3 text-sm font-bold hover:bg-linen" to="/seller/dashboard">
                Seller dashboard
              </Link>
            ) : null}
            {user?.role === "admin" ? (
              <Link className="rounded-2xl px-4 py-3 text-sm font-bold hover:bg-linen" to="/admin/orders">
                Admin
              </Link>
            ) : null}
            {!isAuthenticated ? (
              <Link className="rounded-2xl px-4 py-3 text-sm font-bold hover:bg-linen" to="/login">
                Login
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
      {isPending ? <div className="h-1 animate-pulse bg-amberx" /> : null}
    </header>
  );
};
