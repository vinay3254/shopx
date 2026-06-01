import { useState } from "react";

export const ImageGallery = ({ images = [], name }) => {
  const [active, setActive] = useState(images[0]);

  return (
    <div className="grid gap-4 md:grid-cols-[90px_1fr]">
      <div className="order-2 flex gap-3 overflow-x-auto md:order-1 md:flex-col">
        {images.map((image) => (
          <button
            className={`overflow-hidden rounded-2xl border-2 ${active === image ? "border-amberx" : "border-transparent"}`}
            key={image}
            onClick={() => setActive(image)}
            type="button"
          >
            <img alt={name} className="h-20 w-20 object-cover" src={image} />
          </button>
        ))}
      </div>
      <div className="group order-1 overflow-hidden rounded-[2rem] bg-linen shadow-card md:order-2">
        <img alt={name} className="aspect-square w-full object-cover transition duration-500 group-hover:scale-110" src={active} />
      </div>
    </div>
  );
};
