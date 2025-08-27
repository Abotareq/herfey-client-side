"use client";  

import React from "react";
import Link from "next/link";  
import { useTranslations } from "use-intl";

function ProductCardRecommended({ product }) {
  const t = useTranslations("products");  

  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.basePrice;
  const originalPrice = product.basePrice;
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.basePrice;
  const discountPercentage = hasDiscount 
    ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) 
    : 0;

  const averageRating = product.averageRating || 0;
  const fullStars = Math.floor(averageRating);
  const hasHalfStar = averageRating % 1 !== 0;

  return (
    <div className="relative flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md">
      {/* Use Link component for product image and title to ensure proper Next.js client-side navigation */}
      <Link className="relative mx-3 mt-3 flex h-80 overflow-hidden rounded-xl" href={`/products/${product._id}`}>
        <img 
          className="object-cover w-full h-full" 
          src={product.images?.[0] || "/placeholder.png"} 
          alt={product.name} 
        />
        {/* Category Name - Top Left */}
        {product.category?.name && (
          <span className="absolute top-0 left-0 m-2 rounded-full bg-gray-700 px-2 text-center text-sm font-medium text-white">
            {product.category.name}
          </span>
        )}
        {/* Discount Percentage - Top Right */}
        {hasDiscount > 0 && ( // Only show if there's a discount
          <span className="absolute top-0 right-0 m-2 rounded-full bg-orange-500 px-2 text-center text-sm font-medium text-white">
            {discountPercentage}% OFF
          </span>
        )}
      </Link>
      <div className="mt-4 px-5 pb-5">
        <Link href={`/products/${product._id}`}>
          <h5 className="text-xl tracking-tight text-slate-900">{product.name}</h5>
        </Link>
        <div className="mt-2 mb-5 flex items-center justify-between">
          <p>
            <span className="text-3xl font-bold text-orange-500">${displayPrice}</span>
            {hasDiscount && (
              <span className="text-sm text-orange-500 line-through">${originalPrice}</span>
            )}
          </p>
          <div className="flex items-center">
            {/* Full Stars */}
            {[...Array(fullStars)].map((_, i) => (
              <svg key={`full-${i}`} aria-hidden="true" className="h-5 w-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            ))}
            {/* Half Star */}
            {hasHalfStar && (
              <svg key="half" className="h-5 w-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="half-star-gradient">
                    <stop offset="50%" stopColor="rgb(253 224 71)" /> {/* Yellow */}
                    <stop offset="50%" stopColor="rgb(209 213 219)" /> {/* Gray */}
                  </linearGradient>
                </defs>
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292zM10 3.466V16.534L7.548 14.73l-1.07 3.292c-.3.921-.755 1.688-1.54 1.118L2.13 15.01l-2.8 2.034c-.784.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" fill="url(#half-star-gradient)" />
              </svg>
            )}
            {/* Empty Stars */}
            {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
              <svg key={`empty-${i}`} aria-hidden="true" className="h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
              </svg>
            ))}
            <span className="mr-2 ml-3 rounded bg-yellow-200 px-2.5 py-0.5 text-xs font-semibold">{averageRating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCardRecommended;