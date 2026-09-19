'use client';

import React from 'react';

function OrderSectionSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Section Skeleton */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="skeleton h-8 rounded-lg w-48 mb-2"></div>
          <div className="skeleton h-4 rounded-lg w-64"></div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="skeleton h-10 rounded-lg w-40"></div>
        </div>
      </div>

      {/* Order Cards Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((index) => (
          <div key={index} className="bg-white rounded-2xl p-6 shadow-xs">
            {/* Order Header Skeleton */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <div>
                <div className="skeleton h-4 rounded w-32 mb-1"></div>
                <div className="skeleton h-4 rounded w-24"></div>
              </div>
              <div className="flex items-center gap-4 mt-2 sm:mt-0">
                <div className="skeleton h-6 rounded-full w-20"></div>
                <div className="skeleton h-6 rounded w-16"></div>
              </div>
            </div>

            {/* Product Images Skeleton */}
            <div className="flex -space-x-4 mb-4">
              {[1, 2, 3, 4].map((imgIndex) => (
                <div key={imgIndex} className="skeleton w-12 h-12 rounded-full border-2 border-white"></div>
              ))}
              <div className="skeleton w-12 h-12 rounded-full flex items-center justify-center border-2 border-white">
                <div className="h-3 bg-gray-300 rounded w-4"></div>
              </div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="skeleton h-10 rounded-lg w-32"></div>
              <div className="skeleton h-10 rounded-lg w-28"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <div className="skeleton h-10 rounded-lg w-20"></div>
        <div className="skeleton h-4 rounded w-24"></div>
        <div className="skeleton h-10 rounded-lg w-16"></div>
      </div>
    </div>
  );
}

export default OrderSectionSkeleton;