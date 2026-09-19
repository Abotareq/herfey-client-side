import React from 'react';

const StoreDetailsSkeleton = () => {
  return (
    <div className="min-h-screen">
      {/* Breadcrumbs Skeleton */}
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="skeleton h-4 rounded w-64"></div>
      </div>

      {/* Back / actions row */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="skeleton h-4 w-28 rounded"></div>
        <div className="flex items-center gap-2">
          <div className="skeleton h-9 w-9 rounded-full"></div>
          <div className="skeleton h-9 w-9 rounded-full"></div>
          <div className="skeleton h-8 w-24 rounded-full"></div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section Skeleton */}
        <div className="bg-white rounded-[2rem] shadow-xs overflow-hidden mb-8">
          {/* Orange Header */}
          <div className="skeleton h-36 rounded-none"></div>
          
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Store Logo Skeleton */}
              <div className="relative -mt-20">
                <div className="skeleton w-24 h-24 rounded-xl shadow-xs border-4 border-white"></div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-300 rounded-full border-2 border-white"></div>
              </div>
              
              {/* Store Info Skeleton */}
              <div className="flex-1 space-y-4">
                {/* Store Name */}
                <div className="skeleton h-8 rounded w-3/4"></div>
                
                {/* Description */}
                <div className="space-y-2">
                  <div className="skeleton h-5 rounded w-full"></div>
                  <div className="skeleton h-5 rounded w-4/5"></div>
                </div>
                
                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="skeleton h-4 rounded w-20"></div>
                  <div className="skeleton h-4 rounded w-24"></div>
                  <div className="skeleton h-4 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white rounded-2xl shadow-xs p-5">
              <div className="flex items-center gap-2">
                <div className="skeleton h-4 w-4 rounded"></div>
                <div className="skeleton h-4 w-16 rounded"></div>
              </div>
              <div className="skeleton mt-3 h-8 w-10 rounded"></div>
            </div>
          ))}
        </div>

        {/* Main Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Store Policies Skeleton */}
          <div className="bg-white rounded-2xl shadow-xs p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="skeleton w-5 h-5 rounded"></div>
              <div className="skeleton h-6 rounded w-32"></div>
            </div>
            
            <div className="space-y-4">
              {[1, 2].map((item) => (
                <div key={item} className="border border-gray-900/8 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="skeleton w-8 h-8 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="skeleton h-5 rounded w-24"></div>
                      <div className="space-y-1">
                        <div className="skeleton h-4 rounded w-full"></div>
                        <div className="skeleton h-4 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location Details Skeleton */}
          <div className="bg-white rounded-2xl shadow-xs p-6">
            <div className="skeleton h-6 rounded w-24 mb-6"></div>
            
            <div className="space-y-4">
              {/* Full Address */}
              <div className="border border-gray-900/8 rounded-lg p-4">
                <div className="skeleton h-3 rounded w-20 mb-2"></div>
                <div className="flex items-center justify-between">
                  <div className="skeleton h-5 rounded w-48"></div>
                  <div className="skeleton h-4 rounded w-12"></div>
                </div>
              </div>
              
              {/* City and Postal Code */}
              <div className="grid grid-cols-2 gap-4">
                {[1, 2].map((item) => (
                  <div key={item} className="border border-gray-900/8 rounded-lg p-4">
                    <div className="skeleton h-3 rounded w-16 mb-2"></div>
                    <div className="skeleton h-5 rounded w-20"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Store Information Skeleton */}
        <div className="bg-white rounded-2xl shadow-xs p-6 mb-8">
          <div className="skeleton h-6 rounded w-32 mb-6"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((item) => (
              <div key={item} className="border border-gray-900/8 rounded-lg p-4">
                <div className="skeleton h-3 rounded w-20 mb-2"></div>
                <div className="skeleton h-5 rounded w-32"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Skeleton */}
        <div className="rounded-[2rem] bg-orange-950 p-8 sm:p-10">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div className="space-y-3">
              <div className="h-8 w-64 rounded bg-white/15"></div>
              <div className="h-4 w-80 max-w-full rounded bg-white/10"></div>
            </div>
            <div className="h-12 w-40 rounded-full bg-white/20"></div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default StoreDetailsSkeleton;