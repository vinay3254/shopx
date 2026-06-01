import { Link } from "react-router-dom";

export const Breadcrumbs = ({ items = [] }) => (
  <nav className="mb-5 flex flex-wrap items-center gap-2 text-sm text-graphite" aria-label="Breadcrumb">
    <Link className="font-semibold hover:text-ink" to="/">
      Home
    </Link>
    {items.map((item) => (
      <span className="flex items-center gap-2" key={item.label}>
        <span>/</span>
        {item.to ? (
          <Link className="font-semibold hover:text-ink" to={item.to}>
            {item.label}
          </Link>
        ) : (
          <span>{item.label}</span>
        )}
      </span>
    ))}
  </nav>
);
