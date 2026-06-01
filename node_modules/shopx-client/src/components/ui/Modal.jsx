import clsx from "clsx";

export const Modal = ({ open, title, children, onClose, className }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/50 p-4 backdrop-blur-sm">
      <div className={clsx("w-full max-w-lg rounded-[2rem] bg-cream p-6 shadow-soft", className)}>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl font-bold text-ink">{title}</h2>
          <button className="rounded-full bg-ink/10 px-3 py-1 text-sm font-bold" onClick={onClose} type="button">
            Close
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
