'use client';

import React from 'react';

function OrderSectionSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Section Skeleton */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="h-8 bg-slate-200 rounded-lg w-48 mb-2 animate-pulse"></div>
          <div className="h-4 bg-slate-200 rounded-lg w-64 animate-pulse"></div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="h-10 bg-slate-200 rounded-lg w-40 animate-pulse"></div>
        </div>
      </div>

      {/* Order Cards Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((index) => (
          <div key={index} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            {/* Order Header Skeleton */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
              <div>
                <div className="h-4 bg-slate-200 rounded w-32 mb-1 animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded w-24 animate-pulse"></div>
              </div>
              <div className="flex items-center gap-4 mt-2 sm:mt-0">
                <div className="h-6 bg-slate-200 rounded-full w-20 animate-pulse"></div>
                <div className="h-6 bg-slate-200 rounded w-16 animate-pulse"></div>
              </div>
            </div>

            {/* Product Images Skeleton */}
            <div className="flex -space-x-4 mb-4">
              {[1, 2, 3, 4].map((imgIndex) => (
                <div key={imgIndex} className="w-12 h-12 rounded-full bg-slate-200 border-2 border-white animate-pulse"></div>
              ))}
              <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center border-2 border-white animate-pulse">
                <div className="h-3 bg-slate-300 rounded w-4"></div>
              </div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="h-10 bg-slate-200 rounded-lg w-32 animate-pulse"></div>
              <div className="h-10 bg-slate-200 rounded-lg w-28 animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <div className="h-10 bg-slate-200 rounded-lg w-20 animate-pulse"></div>
        <div className="h-4 bg-slate-200 rounded w-24 animate-pulse"></div>
        <div className="h-10 bg-slate-200 rounded-lg w-16 animate-pulse"></div>
      </div>
    </div>
  );
}

export default OrderSectionSkeleton;