"use client";  

import React from "react";
import Link from "next/link";  
import { useTranslations } from "use-intl";

function ProductCard({ product }) {
  const t = useTranslations("products");  

  const displayPrice = product.discountPrice > 0 ? product.discountPrice : product.basePrice;
  const originalPrice = product.basePrice;
  const hasDiscount = product.discountPrice > 0 && product.discountPrice < product.basePrice;
  const discountPercentage = hasDiscount 
    ? Math.round(((originalPrice - displayPrice) / originalPrice) * 100) 
    : 0;

  const averageRating = product.averageRating || 0;

  return (
    <div className="group  relative flex w-full max-w-xs flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-md shadow-orange-300/30  hover:shadow-orange-400/1">
      {/* Use Link component for product image and title to ensure proper Next.js client-side navigation */}
      <Link className="relative mx-3 mt-3 flex h-80 overflow-hidden rounded-xl" href={`/products/${product._id}`}>
        <img 
          className="object-cover w-full h-full group-hover:opacity-70 transition-opacity duration-300 " 
          src={product.images?.[0] || "/placeholder.png"} 
          alt={product.name} 
        />
        {/* Category Name - Top Left */}
        {product.category?.name && (
          <span className="opacity-0 absolute top-0 left-0 m-2 rounded-full bg-orange-500 px-2 text-center text-sm font-medium text-white group-hover:opacity-100 transition-opacity duration-300">
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

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;