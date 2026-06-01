import { useParams, useSearchParams } from "react-router-dom";
import { ProductGrid } from "../components/product/ProductGrid.jsx";
import { Breadcrumbs } from "../components/ui/Breadcrumbs.jsx";
import { Pagination } from "../components/ui/Pagination.jsx";
import { Select } from "../components/ui/Select.jsx";
import { useGetProductsQuery } from "../store/api/productsApi.js";
import { fallbackProducts } from "../utils/fallbackData.js";

export default function CategoryPage() {
  const { slug } = useParams();
  const [params, setParams] = useSearchParams();
  const page = Number(params.get("page") || 1);
  const sort = params.get("sort") || "newest";
  const { data, isLoading } = useGetProductsQuery({ category: slug, page, sort });
  const products = data?.products?.length ? data.products : fallbackProducts;

  const setParam = (key, value) => {
    const next = new URLSearchParams(params);
    next.set(key, value);
    if (key !== "page") next.set("page", "1");
    setParams(next);
  };

  return (
    <div>
      <Breadcrumbs items={[{ label: slug }]} />
      <div className="mb-8 flex flex-col justify-between gap-4 rounded-[2.5rem] bg-white/80 p-6 shadow-card md:flex-row md:items-end">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-tealx">Category</p>
          <h1 className="font-display text-5xl font-black capitalize">{slug.replaceAll("-", " ")}</h1>
        </div>
        <Select className="min-w-56" onChange={(event) => setParam("sort", event.target.value)} value={sort}>
          <option value="newest">Newest</option>
          <option value="popular">Popular</option>
          <option value="rating">Top rated</option>
          <option value="price_asc">Price low to high</option>
          <option value="price_desc">Price high to low</option>
        </Select>
      </div>
      <ProductGrid isLoading={isLoading} products={products} />
      <Pagination page={data?.page || page} pages={data?.pages || 1} onChange={(next) => setParam("page", String(next))} />
    </div>
  );
}
