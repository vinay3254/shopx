import { ReviewCard } from "./ReviewCard.jsx";

export const ReviewList = ({ reviews = [] }) => (
  <div className="space-y-4">
    {reviews.length ? reviews.map((review) => <ReviewCard key={review._id} review={review} />) : <p className="rounded-[1.5rem] bg-white/80 p-5 text-sm font-semibold">No reviews yet. Be the first to review this product.</p>}
  </div>
);
