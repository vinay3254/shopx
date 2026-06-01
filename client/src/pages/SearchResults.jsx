import { useDeferredValue } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductGrid } from "../components/product/ProductGrid.jsx";
import { Breadcrumbs } from "../components/ui/Breadcrumbs.jsx";
import { Input } from "../components/ui/Input.jsx";
import { Pagination } from "../components/ui/Pagination.jsx";
import { Select } from "../components/ui/Select.jsx";
import { useGetProductsQuery } from "../store/api/productsApi.js";
import { fallbackProducts } from "../utils/fallbackData.js";

const brands = ["SoundPro", "NovaTech", "CasaCraft", "TrailFlex", "Northstar Press"];

export default function SearchResults() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const page = Number(params.get("page") || 1);
  const deferredQuery = useDeferredValue(q);
  const queryArgs = {
    q: deferredQuery,
    brand: params.get("brand") || undefined,
    minPrice: params.get("minPrice") || undefined,
    maxPrice: params.get("maxPrice") || undefined,
    rating: params.get("rating") || undefined,
    sort: params.get("sort") || "newest",
    page
  };
  const { data, isLoading } = useGetProductsQuery(queryArgs);
  const products = data?.products?.length ? data.products : fallbackProducts;

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.set("page", "1");
    setParams(next);
  };

  return (
    <div>
      <Breadcrumbs items={[{ label: "Search" }]} />
      <div className="mb-8 rounded-[2.5rem] bg-white/80 p-6 shadow-card">
        <h1 className="font-display text-4xl font-black">Search results for "{q || "all products"}"</h1>
        <p className="mt-2 text-sm font-semibold text-graphite">{data?.total || products.length} products found</p>
      </div>
      <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-[2rem] bg-white/80 p-5 shadow-card">
          <h2 className="font-display text-2xl font-bold">Filters</h2>
          <div className="mt-5 space-y-4">
            <Select label="Brand" onChange={(event) => setParam("brand", event.target.value)} value={params.get("brand") || ""}>
              <option value="">All brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </Select>
            <Input label="Min price" min="0" onChange={(event) => setParam("minPrice", event.target.value)} type="number" value={params.get("minPrice") || ""} />
            <Input label="Max price" min="0" onChange={(event) => setParam("maxPrice", event.target.value)} type="number" value={params.get("maxPrice") || ""} />
            <Select label="Rating" onChange={(event) => setParam("rating", event.target.value)} value={params.get("rating") || ""}>
              <option value="">Any rating</option>
              <option value="4">4+ stars</option>
              <option value="3">3+ stars</option>
            </Select>
            <Select label="Sort" onChange={(event) => setParam("sort", event.target.value)} value={params.get("sort") || "newest"}>
              <option value="newest">Newest</option>
              <option value="popular">Popular</option>
              <option value="rating">Top rated</option>
              <option value="price_asc">Price: low to high</option>
              <option value="price_desc">Price: high to low</option>
            </Select>
          </div>
        </aside>
        <section>
          <ProductGrid isLoading={isLoading} products={products} />
          <Pagination page={data?.page || page} pages={data?.pages || 1} onChange={(next) => setParam("page", String(next))} />
        </section>
      </div>
    </div>
  );
}
