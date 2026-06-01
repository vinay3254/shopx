import clsx from "clsx";

export const Input = ({ label, error, className, ...props }) => (
  <label className="block">
    {label ? <span className="mb-2 block text-sm font-bold text-graphite">{label}</span> : null}
    <input
      className={clsx(
        "w-full rounded-2xl border border-ink/10 bg-white/80 px-4 py-3 text-sm text-ink outline-none transition focus:border-amberx focus:ring-4 focus:ring-amberx/15",
        className
      )}
      {...props}
    />
    {error ? <span className="mt-1 block text-xs font-semibold text-red-600">{error}</span> : null}
  </label>
);
