import { Swiper, SwiperSlide } from "swiper/react";
import { ProductCard } from "./ProductCard.jsx";

export const ProductCarousel = ({ products = [] }) => (
  <Swiper breakpoints={{ 320: { slidesPerView: 1.2 }, 640: { slidesPerView: 2.2 }, 1024: { slidesPerView: 4.2 } }} spaceBetween={18}>
    {products.map((product) => (
      <SwiperSlide key={product._id}>
        <ProductCard product={product} />
      </SwiperSlide>
    ))}
  </Swiper>
);
