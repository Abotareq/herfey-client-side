
"use client";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs, Autoplay } from "swiper/modules";
import { useGetAllCategories } from "@/service/category";

export default function SwiperComponent() {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  // Fetch categories
  const { data: categories, isLoading, error } = useGetAllCategories();

  // Debug log for categories
  console.log('Swiper categories:', categories);

  // Handle loading and error states
  if (isLoading) return <p>Loading categories...</p>;
  if (error) return <p>Error loading categories: {error.message}</p>;
  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    return <p>No categories available</p>;
  }

  // Base URL for images (adjust if images are served from a different source)
  const BASE_IMAGE_URL = "http://localhost:5000"; // Update if needed

  return (
    <>
      <Swiper
        style={{
          "--swiper-navigation-color": "#f70",
          "--swiper-pagination-color": "#f70",
        }}
        loop={true}
        spaceBetween={10}
        navigation={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        thumbs={{ swiper: thumbsSwiper }}
        modules={[FreeMode, Navigation, Thumbs, Autoplay]}
        className="mySwiper2"
      >
        {categories.map((item) => (
          <SwiperSlide key={item._id}>
            <img
              src={item.image}
              alt={item.name || "Category"}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        onSwiper={setThumbsSwiper}
        loop={true}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        {categories.map((item) => (
          <SwiperSlide key={item._id}>
            <img
              src={item.image}
              alt={item.name || "Category"}
              className="w-full h-full object-cover"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  );
}

{
  /* <Swiper
        onSwiper={setThumbsSwiper}
        loop={true}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper"
      >
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-1.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-2.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-3.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-4.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-5.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-6.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-7.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-8.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-9.jpg" />
        </SwiperSlide>
        <SwiperSlide>
          <img src="https://swiperjs.com/demos/images/nature-10.jpg" />
        </SwiperSlide>
      </Swiper> */
}
