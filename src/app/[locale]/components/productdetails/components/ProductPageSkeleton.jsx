import React from 'react';

const ProductPageSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex flex-wrap">
            {/* Image Section Skeleton */}
            <div className="w-full lg:w-1/2 p-6">
              <div className="relative">
                {/* Main Image Skeleton */}
                <div className="w-full max-w-md mx-auto aspect-square rounded-2xl overflow-hidden bg-gray-200 shadow-lg mb-6 animate-pulse">
                  <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300"></div>
                </div>

                {/* Thumbnail Images Skeleton */}
                <div className="flex gap-4 justify-center">
                  {[...Array(4)].map((_, index) => (
                    <div
                      key={index}
                      className="w-20 h-20 rounded-xl overflow-hidden border-4 border-gray-200 animate-pulse"
                    >
                      <div className="w-full h-full bg-gray-200"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Info Section Skeleton */}
            <div className="w-full lg:w-1/2 p-6 lg:p-8">
              <div className="space-y-6">
                {/* Category & Title Skeleton */}
                <div>
                  <div className="inline-block w-24 h-8 bg-gray-200 rounded-full mb-4 animate-pulse"></div>
                  <div className="space-y-3">
                    <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="h-6 bg-gray-200 rounded-lg w-3/4 animate-pulse"></div>
                  </div>
                </div>

                {/* Variant Dropdowns Skeleton */}
                <div className="space-y-4">
                  <div>
                    <div className="w-16 h-5 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="w-full h-10 bg-gray-200 rounded-md animate-pulse"></div>
                  </div>
                  <div>
                    <div className="w-12 h-5 bg-gray-200 rounded mb-2 animate-pulse"></div>
                    <div className="w-full h-10 bg-gray-200 rounded-md animate-pulse"></div>
                  </div>
                </div>

                {/* Rating Skeleton */}
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, index) => (
                      <div
                        key={index}
                        className="w-6 h-6 bg-gray-200 rounded animate-pulse"
                      ></div>
                    ))}
                  </div>
                  <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
                </div>

                {/* Price Skeleton */}
                <div className="flex items-center space-x-4">
                  <div className="w-32 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                  <div className="w-24 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
                </div>

                {/* Description Skeleton */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <div className="w-28 h-6 bg-gray-200 rounded mb-3 animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                  </div>
                </div>

                {/* Status Skeleton */}
                <div className="flex items-center space-x-3">
                  <div className="w-16 h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-24 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                </div>

                {/* Quantity Selector Skeleton */}
                <div className="space-y-3">
                  <div className="w-20 h-6 bg-gray-200 rounded animate-pulse"></div>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="w-16 h-8 bg-gray-200 rounded animate-pulse"></div>
                    <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Action Buttons Skeleton */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <div className="flex-1 h-16 bg-gray-200 rounded-2xl animate-pulse"></div>
                  <div className="flex-1 h-16 bg-gray-200 rounded-2xl animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Reviews Section Skeleton */}
        <div className="mt-8 bg-white rounded-3xl shadow-2xl overflow-hidden p-8">
          <div className="w-48 h-8 bg-gray-200 rounded-lg mb-6 animate-pulse"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="border-b border-gray-100 pb-4">
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
                  <div>
                    <div className="w-24 h-4 bg-gray-200 rounded mb-1 animate-pulse"></div>
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, starIndex) => (
                        <div
                          key={starIndex}
                          className="w-4 h-4 bg-gray-200 rounded animate-pulse"
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/5 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPageSkeleton;