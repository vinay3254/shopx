import { useState } from "react";
import toast from "react-hot-toast";
import { useCreateReviewMutation } from "../../store/api/reviewsApi.js";
import { Button } from "../ui/Button.jsx";
import { Input } from "../ui/Input.jsx";
import { StarRating } from "../ui/StarRating.jsx";
import { Textarea } from "../ui/Textarea.jsx";

export const ReviewForm = ({ productId }) => {
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [createReview, { isLoading }] = useCreateReviewMutation();

  const submit = async (event) => {
    event.preventDefault();
    await createReview({ productId, body: { rating, title, body } }).unwrap();
    setTitle("");
    setBody("");
    toast.success("Review submitted");
  };

  return (
    <form className="rounded-[2rem] bg-white/80 p-5 shadow-card" onSubmit={submit}>
      <h3 className="font-display text-2xl font-bold">Write a review</h3>
      <div className="mt-4 space-y-4">
        <StarRating onChange={setRating} size="text-2xl" value={rating} />
        <Input label="Title" onChange={(event) => setTitle(event.target.value)} required value={title} />
        <Textarea label="Review" onChange={(event) => setBody(event.target.value)} required value={body} />
        <Button disabled={isLoading} type="submit" variant="secondary">
          Submit review
        </Button>
      </div>
    </form>
  );
};
