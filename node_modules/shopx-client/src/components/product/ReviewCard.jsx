import { ThumbsUp } from "lucide-react";
import { useMarkHelpfulMutation } from "../../store/api/reviewsApi.js";
import { date } from "../../utils/format.js";
import { StarRating } from "../ui/StarRating.jsx";

export const ReviewCard = ({ review }) => {
  const [markHelpful] = useMarkHelpfulMutation();

  return (
    <article className="rounded-[1.5rem] bg-white/80 p-5 shadow-card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-bold">{review.user?.name || "ShopX customer"}</p>
          <StarRating value={review.rating} />
        </div>
        {review.verified ? <span className="rounded-full bg-tealx/10 px-3 py-1 text-xs font-extrabold text-tealx">Verified</span> : null}
      </div>
      <h4 className="mt-4 font-bold">{review.title}</h4>
      <p className="mt-2 text-sm leading-6 text-graphite">{review.body}</p>
      <div className="mt-4 flex items-center justify-between text-xs font-bold text-graphite/70">
        <span>{date(review.createdAt)}</span>
        <button className="flex items-center gap-1 rounded-full bg-linen px-3 py-2" onClick={() => markHelpful(review._id)} type="button">
          <ThumbsUp size={14} /> Helpful ({review.helpful || 0})
        </button>
      </div>
    </article>
  );
};
