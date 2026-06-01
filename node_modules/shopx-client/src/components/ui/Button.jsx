import clsx from "clsx";

const variants = {
  primary: "bg-ink text-cream hover:bg-graphite shadow-card",
  secondary: "bg-amberx text-ink hover:bg-[#e89610] shadow-card",
  outline: "border border-ink/15 bg-white/70 text-ink hover:border-ink/30 hover:bg-white",
  ghost: "text-ink hover:bg-ink/5"
};

export const Button = ({ as: Component = "button", variant = "primary", className, ...props }) => (
  <Component
    className={clsx(
      "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-amberx focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
      variants[variant],
      className
    )}
    {...props}
  />
);
