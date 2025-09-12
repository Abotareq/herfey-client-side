"use client";
import React, { useState } from "react";
// import Image from "next.js";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import "swiper/css/effect-fade";

// import required modules
import {
  FreeMode,
  Navigation,
  Thumbs,
  Autoplay,
  EffectFade,
} from "swiper/modules";

// Import your images here
import swip1a from "@public/swipper/swip1 ar 2.jpg";
import swip1e from "@public/swipper/swip1 en.jpg";

import swip2a from "@public/swipper/swip2 ar 2.jpg";
import swip2e from "@public/swipper/swip2 en.jpg";

import swip3a from "@public/swipper/swip3 ar.jpg";
import swip3e from "@public/swipper/swip3 en.jpg";

import swip4a from "@public/swipper/swip4 ar.jpg";
import swip4e from "@public/swipper/swip4 en.jpg";

// Each variable contains two images
const swip1 = [swip1a, swip1e];
const swip2 = [swip2a, swip2e];
const swip3 = [swip3a, swip3e];
const swip4 = [swip4a, swip4e];
import Image from "next/image";
import { useLocale } from "next-intl";

// A custom CSS style to enhance the navigation arrows
const swiperNavStyle = `
  .swiper-button-prev, .swiper-button-next {
    color: #fff;
    background-color: rgba(0, 0, 0, 0.3);
    width: 44px;
    height: 44px;
    border-radius: 50%;
    transition: background-color 0.3s;
  }
  .swiper-button-prev:hover, .swiper-button-next:hover {
    background-color: rgba(0, 0, 0, 0.6);
  }
  .swiper-button-prev::after, .swiper-button-next::after {
    font-size: 1.2rem;
    font-weight: 800;
  }
  
  /* Custom styles for full height display */
  .main-swiper-slide {
    height: auto !important;
  }
  
  .main-swiper-slide img {
    width: 100%;
    height: auto;
    max-height: 80vh; /* Prevents images from being too tall on very large screens */
  }
`;

export default function ModernImageSwiper() {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const isArabic = useLocale() === "ar";
  const swiperImages = [swip1, swip2, swip3, swip4];

  return (
    <section className="mx-12 my-8">
      <style>{swiperNavStyle}</style>

      {/* Main Swiper */}
      <Swiper
        effect={"fade"}
        loop={true}
        spaceBetween={10}
        navigation={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        modules={[FreeMode, Navigation, Thumbs, Autoplay, EffectFade]}
        // Remove aspect-video constraint and use h-auto for natural height
        className="mySwiper2 w-full h-auto rounded-2xl shadow-lg overflow-hidden"
      >
        {swiperImages.map((src, index) => (
          <SwiperSlide key={`main-${index}`} className="main-swiper-slide">
            <div className="relative w-full">
              <Image
                src={src[isArabic ? 0 : 1]} // Choose image based on locale
                alt={`Main gallery image ${index + 1}`}
                // Remove fill prop and use width/height for natural dimensions
                width={1920}
                height={1080}
                className="w-full h-auto object-contain" // object-contain preserves aspect ratio
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Thumbnail Swiper */}
      <Swiper
        onSwiper={setThumbsSwiper}
        loop={true}
        spaceBetween={12}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="mySwiper mt-4"
        breakpoints={{
          480: {
            slidesPerView: 2,
            spaceBetween: 8,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 10,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 12,
          },
        }}
      >
        {swiperImages.map((src, index) => (
          <SwiperSlide
            key={`thumb-${index}`}
            className="opacity-50 transition-opacity duration-300 rounded-lg overflow-hidden cursor-pointer aspect-video"
          >
            <div className="relative w-full h-full">
              <Image
                src={src[isArabic ? 0 : 1]} // Choose image based on locale
                alt={`Thumbnail image ${index + 1}`}
                fill
                className="object-cover"
                sizes="25vw"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
