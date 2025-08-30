import React from "react";

function CartSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="h-8 bg-gray-200 rounded-lg w-48 mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded-lg w-32 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded-lg w-48 animate-pulse"></div>
        </div>

        <div className="grid lg:grid-cols-3 lg:gap-8 gap-8">
          {/* Cart Items Skeleton */}
          <div className="lg:col-span-2 space-y-4">
            {/* Cart Item Skeleton 1 */}
            {[1, 2, 3].map((index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md border border-orange-100 p-6 animate-pulse"
              >
                <div className="flex gap-6">
                  {/* Product Image Skeleton */}
                  <div className="w-24 h-24 rounded-lg bg-gray-200"></div>

                  {/* Product Details Skeleton */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      {/* Product Title */}
                      <div className="flex-1">
                        <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
                      </div>

                      {/* Action Buttons Skeleton */}
                      <div className="flex items-center gap-2 ml-4">
                        <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
                        <div className="w-9 h-9 bg-gray-200 rounded-lg"></div>
                      </div>
                    </div>

                    {/* Color and Size Skeleton */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-4 bg-gray-200 rounded w-12"></div>
                        <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-4 bg-gray-200 rounded w-8"></div>
                        <div className="h-4 bg-gray-200 rounded w-6"></div>
                      </div>
                    </div>

                    {/* Price and Quantity Skeleton */}
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="h-8 bg-gray-200 rounded-lg w-20 mb-1"></div>
                        <div className="h-4 bg-gray-200 rounded-lg w-16"></div>
                      </div>

                      {/* Quantity Controls Skeleton */}
                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                        <div className="w-6 h-6 bg-gray-200 rounded"></div>
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Skeleton */}
          <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-6 h-fit sticky top-8">
            {/* Title */}
            <div className="h-6 bg-gray-200 rounded-lg w-32 mb-6 animate-pulse"></div>

            {/* Order Summary Items */}
            <div className="space-y-4 mb-6">
              {/* Subtotal */}
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
              </div>
              
              {/* Shipping */}
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-14 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
              </div>
              
              {/* Tax */}
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gray-200 rounded w-8 animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-12 animate-pulse"></div>
              </div>
              
              {/* Total */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <div className="h-5 bg-gray-200 rounded w-12 animate-pulse"></div>
                  <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Coupon Section Skeleton */}
            <div className="mb-6">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
              <div className="flex gap-2">
                <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="w-16 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className="space-y-3">
              <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-full h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>

            {/* Payment Icons Skeleton */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="h-4 bg-gray-200 rounded w-40 mx-auto mb-4 animate-pulse"></div>
              <div className="flex justify-center gap-4">
                <div className="w-10 h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-10 h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-10 h-8 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartSkeleton;