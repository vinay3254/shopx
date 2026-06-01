import { Star } from "lucide-react";

export const StarRating = ({ value = 0, onChange, size = "text-base" }) => {
  const rounded = Math.round(value);

  return (
    <div className={`flex items-center gap-0.5 ${size}`} aria-label={`${value} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          className={onChange ? "cursor-pointer" : "cursor-default"}
          disabled={!onChange}
          key={star}
          onClick={() => onChange?.(star)}
          type="button"
        >
          <Star className={star <= rounded ? "fill-amberx text-amberx" : "text-ink/20"} size="1em" />
        </button>
      ))}
    </div>
  );
};
