import { Link } from "react-router-dom";
import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";

export const Footer = () => (
  <footer className="mt-16 border-t border-ink/10 bg-ink text-cream">
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
      <div>
        <div className="mb-4 flex items-center gap-2">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-amberx font-display text-xl font-black text-ink">S</span>
          <span className="font-display text-3xl font-black">ShopX</span>
        </div>
        <p className="max-w-sm text-sm leading-6 text-cream/75">
          A full-stack marketplace with fast search, trusted sellers, secure checkout, and practical account tools.
        </p>
      </div>
      {[
        ["Shop", "Deals", "Featured", "Categories"],
        ["Account", "Orders", "Wishlist", "Addresses"],
        ["Company", "About", "Careers", "Support"]
      ].map(([title, ...links]) => (
        <div key={title}>
          <h3 className="mb-4 text-sm font-extrabold uppercase tracking-[0.2em] text-amberx">{title}</h3>
          <div className="space-y-3">
            {links.map((link) => (
              <Link className="block text-sm font-semibold text-cream/75 hover:text-cream" key={link} to="/">
                {link}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
    <div className="mx-auto flex max-w-7xl flex-col gap-3 border-t border-cream/10 px-4 py-6 md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-cream/60">&copy; 2026 ShopX. Test-mode demo marketplace.</p>
      <form className="flex max-w-md gap-2">
        <Input className="bg-white/10 text-cream placeholder:text-cream/50" placeholder="Newsletter email" type="email" />
        <Button type="submit" variant="secondary">
          Join
        </Button>
      </form>
    </div>
  </footer>
);
