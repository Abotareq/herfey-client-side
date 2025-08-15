"use client";
import React, { useState } from "react";
import ReviewsSection from "./components/ReviewData";
import ProductDesc from "./components/ProductDesc";

function ProductDetails() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState("M");

  const images = [
    "https://readymadeui.com/images/product6.webp",
    "https://readymadeui.com/images/product3.webp",
    "https://readymadeui.com/images/product5.webp",
    "https://readymadeui.com/images/product2.webp",
  ];

  const Variants = ["Osama", "Mina", "Refaat", "Ali"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid items-start grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
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

          {/* Product Info */}
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4">
              <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                In Stock
              </div>
              <h1 className="text-4xl font-bold text-slate-900 leading-tight">
                Adjective Attire
                <span className="block text-2xl font-medium text-slate-600 mt-1">
                  Premium T-shirt
                </span>
              </h1>
              <p className="text-slate-500 font-medium">Well-Versed Commerce</p>
            </div>

            {/* Rating */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${
                      i < 4 ? "fill-amber-400" : "fill-slate-300"
                    }`}
                    viewBox="0 0 14 13"
                  >
                    <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
                  </svg>
                ))}
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <span className="font-semibold text-slate-700">4.2</span>
                <span className="text-slate-500">•</span>
                <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                  87 Reviews
                </button>
              </div>
            </div>

            {/* Pricing */}
            <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200">
              <div className="flex items-baseline space-x-4">
                <span className="text-5xl font-bold text-slate-900">$30</span>
                <div className="flex flex-col">
                  <span className="text-slate-400 text-lg line-through">
                    $42
                  </span>
                  <span className="text-green-600 text-sm font-semibold">
                    Save 29%
                  </span>
                </div>
              </div>
              <p className="text-slate-500 text-sm mt-2">
                Tax included • Free shipping over $50
              </p>
            </div>

            {/* Size Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Variants</h3>
              <div className="flex flex-wrap gap-3">
                {Variants.map((variant) => (
                  <button
                    key={variant}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 ${
                      selectedVariant === variant
                        ? "border-blue-500 bg-blue-500 text-white shadow-lg scale-105"
                        : "border-slate-300 text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    {variant}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-900">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border-2 border-slate-300 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                  >
                    −
                  </button>
                  <span className="px-6 py-2 bg-white font-semibold text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 pt-4">
              <button className="w-full px-6 py-4 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200">
                Add to Cart
              </button>
              <button className="w-full px-6 py-4 border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white font-semibold rounded-xl transition-all duration-200">
                Buy Now
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-200">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <span className="text-sm font-medium text-slate-700">
                  Free Returns
                </span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-slate-200">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-slate-700">
                  Fast Delivery
                </span>
              </div>
            </div>

            {/* Product Description */}
            <ProductDesc />
          </div>
        </div>
        <ReviewsSection />
      </div>
    </div>
  );
}

export default ProductDetails;
