import { currency } from "../../utils/format.js";

export const PriceDisplay = ({ price, mrp, discount, className = "" }) => (
  <div className={className}>
    <div className="flex flex-wrap items-baseline gap-2">
      <span className="text-xl font-extrabold text-ink">{currency(price)}</span>
      {mrp && mrp > price ? <span className="text-sm font-semibold text-graphite/60 line-through">{currency(mrp)}</span> : null}
      {discount ? <span className="rounded-full bg-tealx/10 px-2 py-1 text-xs font-extrabold text-tealx">{discount}% off</span> : null}
    </div>
  </div>
);
