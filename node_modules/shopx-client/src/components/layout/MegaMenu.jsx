import { Link } from "react-router-dom";
import { useGetCategoriesQuery } from "../../store/api/categoriesApi.js";
import { fallbackCategories } from "../../utils/fallbackData.js";

export const MegaMenu = () => {
  const { data } = useGetCategoriesQuery();
  const categories = data?.categories?.length ? data.categories : fallbackCategories;

  return (
    <div className="hidden border-y border-ink/10 bg-white/70 backdrop-blur lg:block">
      <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 py-3">
        {categories.map((category) => (
          <div className="group relative" key={category._id}>
            <Link
              className="whitespace-nowrap rounded-full px-4 py-2 text-sm font-bold text-graphite transition hover:bg-amberx hover:text-ink"
              to={`/category/${category.slug}`}
            >
              {category.name}
            </Link>
            {category.children?.length ? (
              <div className="invisible absolute left-0 top-10 z-40 min-w-64 rounded-3xl bg-cream p-4 opacity-0 shadow-soft transition group-hover:visible group-hover:opacity-100">
                {category.children.map((child) => (
                  <Link className="block rounded-2xl px-4 py-3 text-sm font-semibold hover:bg-white" key={child._id} to={`/category/${child.slug}`}>
                    {child.name}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
};
