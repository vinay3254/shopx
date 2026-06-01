const steps = ["Address", "Payment", "Review"];

export const CheckoutStepper = ({ step }) => (
  <div className="mb-8 grid gap-3 md:grid-cols-3">
    {steps.map((label, index) => (
      <div className={`rounded-full px-5 py-3 text-sm font-extrabold ${index <= step ? "bg-ink text-cream" : "bg-white/80 text-graphite"}`} key={label}>
        {index + 1}. {label}
      </div>
    ))}
  </div>
);
