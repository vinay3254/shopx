import { StarRating } from "../ui/StarRating.jsx";

export const RatingSummary = ({ rating = 0, reviews = [] }) => {
  const total = reviews.length || 1;
  const counts = [5, 4, 3, 2, 1].map((star) => reviews.filter((review) => Math.round(review.rating) === star).length);

  return (
    <div className="rounded-[2rem] bg-white/80 p-5 shadow-card">
      <p className="font-display text-3xl font-black">{rating.toFixed?.(1) || rating}</p>
      <StarRating value={rating} />
      <div className="mt-5 space-y-2">
        {[5, 4, 3, 2, 1].map((star, index) => (
          <div className="grid grid-cols-[2rem_1fr_2rem] items-center gap-2 text-xs font-bold" key={star}>
            <span>{star}</span>
            <div className="h-2 rounded-full bg-ink/10">
              <div className="h-2 rounded-full bg-amberx" style={{ width: `${(counts[index] / total) * 100}%` }} />
            </div>
            <span>{counts[index]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
