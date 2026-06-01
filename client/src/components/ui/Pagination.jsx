import { Button } from "./Button.jsx";

export const Pagination = ({ page = 1, pages = 1, onChange }) => {
  if (pages <= 1) return null;

  return (
    <div className="mt-8 flex items-center justify-center gap-3">
      <Button disabled={page <= 1} onClick={() => onChange(page - 1)} type="button" variant="outline">
        Previous
      </Button>
      <span className="rounded-full bg-white/80 px-4 py-2 text-sm font-bold">
        Page {page} of {pages}
      </span>
      <Button disabled={page >= pages} onClick={() => onChange(page + 1)} type="button" variant="outline">
        Next
      </Button>
    </div>
  );
};
