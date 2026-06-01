import { ProductCard } from "./ProductCard.jsx";
import { Skeleton } from "../ui/Skeleton.jsx";

export const ProductGrid = ({ products = [], isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton className="h-96 rounded-[1.75rem]" key={index} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return <div className="rounded-[2rem] bg-white/75 p-10 text-center font-bold text-graphite shadow-card">No products found.</div>;
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
};
