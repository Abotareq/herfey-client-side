import React from "react";

const OrdersSkeleton = () => {
  // Create array for multiple skeleton cards
  const skeletonCards = Array.from({ length: 3 }, (_, i) => i);
  const statsCards = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-orange-10 to-orange-30 min-h-screen">
      {/* Header Skeleton */}
      <div className="mb-8 animate-pulse">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="h-8 bg-gradient-to-r from-orange-200 to-orange-300 rounded-lg w-80 mb-3"></div>
            <div className="h-4 bg-gradient-to-r from-orange-100 to-orange-200 rounded w-96"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 bg-gradient-to-r from-orange-200 to-orange-300 rounded-lg w-24"></div>
            <div className="h-10 bg-gradient-to-r from-orange-200 to-orange-300 rounded-lg w-24"></div>
          </div>
        </div>

        {/* Search and Filter Bar Skeleton */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="h-12 bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl"></div>
          </div>
          <div className="h-12 bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl w-40"></div>
          <div className="h-12 bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl w-48"></div>
        </div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statsCards.map((index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm p-4 animate-pulse"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-3 bg-gradient-to-r from-orange-200 to-orange-300 rounded w-16 mb-2"></div>
                <div className="h-8 bg-gradient-to-r from-orange-300 to-orange-400 rounded w-12"></div>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Method Stats Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-4 bg-gradient-to-r from-orange-200 to-orange-300 rounded w-32 mb-2"></div>
              <div className="h-9 bg-gradient-to-r from-orange-300 to-orange-400 rounded w-16"></div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl"></div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-4 bg-gradient-to-r from-orange-200 to-orange-300 rounded w-36 mb-2"></div>
              <div className="h-9 bg-gradient-to-r from-orange-300 to-orange-400 rounded w-16"></div>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl"></div>
          </div>
        </div>
      </div>

      {/* Orders List Skeleton */}
      <div className="space-y-6">
        {skeletonCards.map((index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse"
            style={{ animationDelay: `${index * 150}ms` }}
          >
            <div className="p-6">
              {/* Order Header Skeleton */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-200 to-orange-300 rounded-xl"></div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-6 bg-gradient-to-r from-orange-300 to-orange-400 rounded w-48"></div>
                      <div className="h-5 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full w-12"></div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="h-4 bg-gradient-to-r from-orange-200 to-orange-300 rounded w-24"></div>
                      <div className="h-4 bg-gradient-to-r from-orange-200 to-orange-300 rounded w-32"></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-8 bg-gradient-to-r from-orange-200 to-orange-300 rounded-full w-20"></div>
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-100 to-orange-200 rounded"></div>
                </div>
              </div>

              {/* Order Details Grid Skeleton */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Summary Skeleton */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-4 h-4 bg-gradient-to-r from-orange-300 to-orange-400 rounded"></div>
                    <div className="h-5 bg-gradient-to-r from-orange-300 to-orange-400 rounded w-32"></div>
                  </div>
                  <div className="space-y-3">
                    {Array.from({ length: 5 }, (_, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-center"
                      >
                        <div className="h-4 bg-gradient-to-r from-orange-200 to-orange-300 rounded w-16"></div>
                        <div className="h-4 bg-gradient-to-r from-orange-200 to-orange-300 rounded w-20"></div>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-2 border-t border-orange-200">
                      <div className="h-4 bg-gradient-to-r from-orange-300 to-orange-400 rounded w-24"></div>
                      <div className="h-6 bg-gradient-to-r from-orange-400 to-orange-500 rounded w-24"></div>
                    </div>
                  </div>
                </div>

                {/* Products Skeleton */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-4 h-4 bg-gradient-to-r from-orange-300 to-orange-400 rounded"></div>
                    <div className="h-5 bg-gradient-to-r from-orange-300 to-orange-400 rounded w-20"></div>
                  </div>
                  <div className="flex gap-2">
                    {Array.from({ length: 3 }, (_, i) => (
                      <div key={i} className="relative flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-r from-orange-200 to-orange-300 rounded-lg"></div>
                        <div className="absolute -top-1 -right-1 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full w-6 h-6"></div>
                      </div>
                    ))}
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg border-2 border-dashed border-orange-300"></div>
                  </div>
                </div>

                {/* Actions Skeleton */}
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-4 h-4 bg-gradient-to-r from-orange-300 to-orange-400 rounded"></div>
                    <div className="h-5 bg-gradient-to-r from-orange-300 to-orange-400 rounded w-28"></div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="h-9 bg-gradient-to-r from-orange-200 to-orange-300 rounded-lg"></div>
                    <div className="h-9 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg"></div>
                    <div className="p-2 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg">
                      <div className="h-4 bg-gradient-to-r from-orange-300 to-orange-400 rounded w-32"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Skeleton */}
      <div className="bg-white rounded-xl shadow-sm mt-8 p-6 animate-pulse">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="h-4 bg-gradient-to-r from-orange-200 to-orange-300 rounded w-48"></div>
          <div className="flex items-center gap-2">
            <div className="h-8 bg-gradient-to-r from-orange-200 to-orange-300 rounded w-12"></div>
            <div className="h-8 bg-gradient-to-r from-orange-200 to-orange-300 rounded w-20"></div>
            <div className="flex gap-1">
              {Array.from({ length: 3 }, (_, i) => (
                <div
                  key={i}
                  className="w-8 h-8 bg-gradient-to-r from-orange-300 to-orange-400 rounded"
                ></div>
              ))}
            </div>
            <div className="h-8 bg-gradient-to-r from-orange-200 to-orange-300 rounded w-16"></div>
            <div className="h-8 bg-gradient-to-r from-orange-200 to-orange-300 rounded w-12"></div>
          </div>
        </div>
      </div>

      {/* Floating Loading Indicator */}
      <div className="fixed bottom-6 right-6 bg-gradient-to-r from-orange-400 to-orange-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 animate-bounce">
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
        <span className="text-sm font-medium">Loading orders...</span>
      </div>
    </div>
  );
};

export default OrdersSkeleton;
