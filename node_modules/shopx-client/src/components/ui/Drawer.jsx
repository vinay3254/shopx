import clsx from "clsx";

export const Drawer = ({ open, title, children, onClose }) => (
  <div className={clsx("fixed inset-0 z-50 transition", open ? "pointer-events-auto" : "pointer-events-none")}>
    <button
      aria-label="Close drawer"
      className={clsx("absolute inset-0 bg-ink/50 transition-opacity", open ? "opacity-100" : "opacity-0")}
      onClick={onClose}
      type="button"
    />
    <aside
      className={clsx(
        "absolute bottom-0 right-0 h-[82vh] w-full rounded-t-[2rem] bg-cream p-5 shadow-soft transition-transform md:h-full md:max-w-md md:rounded-l-[2rem] md:rounded-tr-none",
        open ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-x-full md:translate-y-0"
      )}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-2xl font-bold">{title}</h2>
        <button className="rounded-full bg-ink px-4 py-2 text-sm font-bold text-cream" onClick={onClose} type="button">
          Done
        </button>
      </div>
      {children}
    </aside>
  </div>
);
