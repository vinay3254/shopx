import { Link } from "react-router-dom";
import { ArrowRight, Truck, ShieldCheck, Sparkles } from "lucide-react";
import { ProductCarousel } from "../components/product/ProductCarousel.jsx";
import { ProductGrid } from "../components/product/ProductGrid.jsx";
import { Button } from "../components/ui/Button.jsx";
import { useGetCategoriesQuery } from "../store/api/categoriesApi.js";
import { useGetFeaturedProductsQuery, useGetProductsQuery } from "../store/api/productsApi.js";
import { fallbackCategories, fallbackProducts } from "../utils/fallbackData.js";

export default function Home() {
  const { data: featuredData, isLoading: featuredLoading } = useGetFeaturedProductsQuery();
  const { data: trendingData, isLoading: trendingLoading } = useGetProductsQuery({ sort: "popular", limit: 8 });
  const { data: categoryData } = useGetCategoriesQuery();
  const featured = featuredData?.products?.length ? featuredData.products : fallbackProducts;
  const trending = trendingData?.products?.length ? trendingData.products : fallbackProducts;
  const categories = categoryData?.categories?.length ? categoryData.categories : fallbackCategories;

  return (
    <div className="space-y-14">
      <section className="relative overflow-hidden rounded-[3rem] bg-ink p-6 text-cream shadow-soft md:p-10">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-amberx/25 blur-3xl" />
        <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative z-10">
            <p className="mb-4 inline-flex rounded-full bg-cream/10 px-4 py-2 text-sm font-bold text-amberx">
              Today&apos;s Deals
            </p>
            <h1 className="font-display text-5xl font-black leading-[0.95] md:text-7xl">Everyday deals, delivered fast.</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-cream/75">
              ShopX combines search-first discovery, trusted sellers, and secure checkout for a fast marketplace experience.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button as={Link} to="/search?q=deals" variant="secondary">
                Shop deals <ArrowRight size={18} />
              </Button>
              <Button as={Link} to="/category/electronics" variant="outline">
                Browse electronics
              </Button>
            </div>
          </div>
          <div className="relative grid grid-cols-2 gap-4">
            {featured.slice(0, 4).map((product, index) => (
              <Link
                className={`overflow-hidden rounded-[2rem] bg-cream/10 p-3 shadow-card transition hover:-translate-y-1 ${index === 0 ? "col-span-2" : ""}`}
                key={product._id}
                to={`/product/${product.slug}`}
              >
                <img alt={product.name} className="aspect-[4/3] w-full rounded-[1.5rem] object-cover" src={product.images?.[0]} />
                <p className="mt-3 line-clamp-2 text-sm font-bold">{product.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          [Truck, "Fast delivery", "Pincode-aware shipping estimates"],
          [ShieldCheck, "Secure payments", "Stripe test mode PaymentElement"],
          [Sparkles, "Curated deals", "Featured and trending products"],
          [ArrowRight, "Seller tools", "Product, order, and status workflows"]
        ].map(([Icon, title, text]) => (
          <div className="rounded-[2rem] bg-white/80 p-5 shadow-card" key={title}>
            <Icon className="text-tealx" />
            <h3 className="mt-3 font-bold">{title}</h3>
            <p className="mt-1 text-sm text-graphite">{text}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-tealx">Shop by category</p>
            <h2 className="font-display text-4xl font-black">Category strip</h2>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          {categories.slice(0, 6).map((category) => (
            <Link className="rounded-[1.5rem] bg-white/80 p-5 text-center font-extrabold shadow-card transition hover:bg-amberx" key={category._id} to={`/category/${category.slug}`}>
              {category.name}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-tealx">Featured Picks</p>
            <h2 className="font-display text-4xl font-black">Handpicked products</h2>
          </div>
          <Link className="font-bold text-clay" to="/search?q=featured">
            View all
          </Link>
        </div>
        <ProductCarousel products={featured} />
      </section>

      <section>
        <div className="mb-5">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-tealx">Trending</p>
          <h2 className="font-display text-4xl font-black">Popular right now</h2>
        </div>
        <ProductGrid isLoading={featuredLoading || trendingLoading} products={trending} />
      </section>
    </div>
  );
}
