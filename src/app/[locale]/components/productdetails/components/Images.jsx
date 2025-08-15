'use client';
import { useState } from "react";

function Images() {
    const [selectedImage, setSelectedImage] = useState(0);
    const images = [
    "https://readymadeui.com/images/product6.webp",
    "https://readymadeui.com/images/product3.webp",
    "https://readymadeui.com/images/product5.webp",
    "https://readymadeui.com/images/product2.webp",
  ];
  return (
    <div className="space-y-6">
            {/* Main Image */}
            <div className="relative group overflow-hidden rounded-2xl bg-white shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-white/10 pointer-events-none"></div>
              <img
                src={images[selectedImage]}
                alt="Product"
                className="w-full aspect-square object-cover object-center transform group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg">
                <svg
                  className="w-5 h-5 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex space-x-3">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative flex-1 group overflow-hidden rounded-xl transition-all duration-300 ${
                    selectedImage === index
                      ? "ring-3 ring-blue-500 ring-offset-2 shadow-lg scale-105"
                      : "hover:ring-2 hover:ring-blue-300 hover:ring-offset-1 hover:scale-102"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Product view ${index + 1}`}
                    className="w-full aspect-square object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  />
                  <div
                    className={`absolute inset-0 transition-opacity duration-300 ${
                      selectedImage === index
                        ? "bg-blue-500/10"
                        : "bg-black/0 group-hover:bg-black/5"
                    }`}
                  ></div>
                </button>
              ))}
            </div>
          </div>
  )
}

export default Images