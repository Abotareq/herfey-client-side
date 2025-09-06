import React from 'react';

const StoreDetailsSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
      {/* Breadcrumbs Skeleton */}
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="h-4 bg-orange-200 rounded w-64 animate-pulse"></div>
      </div>

      {/* Header Skeleton */}
      <div className="sticky top-0 z-40 bg-white border-b border-orange-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Back Button Skeleton */}
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 bg-orange-200 rounded animate-pulse"></div>
              <div className="h-4 bg-orange-200 rounded w-24 animate-pulse"></div>
            </div>
            
            {/* Action Buttons Skeleton */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-orange-100 rounded-lg animate-pulse"></div>
              <div className="w-9 h-9 bg-orange-100 rounded-lg animate-pulse"></div>
              <div className="h-8 bg-orange-200 rounded-full w-20 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section Skeleton */}
        <div className="bg-white rounded-2xl shadow-sm border border-orange-200 overflow-hidden mb-8">
          {/* Orange Header */}
          <div className="h-32 bg-gradient-to-r from-orange-300 to-orange-400 animate-pulse"></div>
          
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Store Logo Skeleton */}
              <div className="relative -mt-20">
                <div className="w-24 h-24 bg-orange-200 rounded-xl shadow-lg border-4 border-white animate-pulse"></div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-orange-300 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              
              {/* Store Info Skeleton */}
              <div className="flex-1 space-y-4">
                {/* Store Name */}
                <div className="h-8 bg-orange-200 rounded w-3/4 animate-pulse"></div>
                
                {/* Description */}
                <div className="space-y-2">
                  <div className="h-5 bg-orange-150 rounded w-full animate-pulse"></div>
                  <div className="h-5 bg-orange-150 rounded w-4/5 animate-pulse"></div>
                </div>
                
                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-4">
                  <div className="h-4 bg-orange-150 rounded w-20 animate-pulse"></div>
                  <div className="h-4 bg-orange-150 rounded w-24 animate-pulse"></div>
                  <div className="h-4 bg-orange-150 rounded w-32 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map((item) => (
            <div key={item} className="bg-white rounded-xl shadow-sm border border-orange-200 p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-lg animate-pulse"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-orange-150 rounded w-16 animate-pulse"></div>
                  <div className="h-6 bg-orange-200 rounded w-12 animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Store Policies Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-5 h-5 bg-orange-200 rounded animate-pulse"></div>
              <div className="h-6 bg-orange-200 rounded w-32 animate-pulse"></div>
            </div>
            
            <div className="space-y-4">
              {[1, 2].map((item) => (
                <div key={item} className="border border-orange-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg animate-pulse"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-5 bg-orange-200 rounded w-24 animate-pulse"></div>
                      <div className="space-y-1">
                        <div className="h-4 bg-orange-150 rounded w-full animate-pulse"></div>
                        <div className="h-4 bg-orange-150 rounded w-3/4 animate-pulse"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Location Details Skeleton */}
          <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-6">
            <div className="h-6 bg-orange-200 rounded w-24 mb-6 animate-pulse"></div>
            
            <div className="space-y-4">
              {/* Full Address */}
              <div className="border border-orange-200 rounded-lg p-4">
                <div className="h-3 bg-orange-150 rounded w-20 mb-2 animate-pulse"></div>
                <div className="flex items-center justify-between">
                  <div className="h-5 bg-orange-200 rounded w-48 animate-pulse"></div>
                  <div className="h-4 bg-orange-200 rounded w-12 animate-pulse"></div>
                </div>
              </div>
              
              {/* City and Postal Code */}
              <div className="grid grid-cols-2 gap-4">
                {[1, 2].map((item) => (
                  <div key={item} className="border border-orange-200 rounded-lg p-4">
                    <div className="h-3 bg-orange-150 rounded w-16 mb-2 animate-pulse"></div>
                    <div className="h-5 bg-orange-200 rounded w-20 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Store Information Skeleton */}
        <div className="bg-white rounded-xl shadow-sm border border-orange-200 p-6 mb-8">
          <div className="h-6 bg-orange-200 rounded w-32 mb-6 animate-pulse"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((item) => (
              <div key={item} className="border border-orange-200 rounded-lg p-4">
                <div className="h-3 bg-orange-150 rounded w-20 mb-2 animate-pulse"></div>
                <div className="h-5 bg-orange-200 rounded w-32 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Skeleton */}
        <div className="bg-gradient-to-r from-orange-300 to-orange-400 rounded-xl shadow-lg p-8 text-center">
          <div className="h-8 bg-orange-100/50 rounded w-64 mx-auto mb-2 animate-pulse"></div>
          <div className="h-5 bg-orange-100/30 rounded w-80 mx-auto mb-6 animate-pulse"></div>
          <div className="h-12 bg-white/50 rounded-lg w-40 mx-auto animate-pulse"></div>
        </div>
      </div>

      {/* Loading Indicator */}
      <div className="fixed bottom-8 right-8 z-50">
        <div className="flex items-center gap-3 bg-white/90 backdrop-blur-sm border border-orange-200 rounded-full px-4 py-2 shadow-lg">
          <div className="w-4 h-4 bg-orange-400 rounded-full animate-pulse"></div>
          <span className="text-orange-600 text-sm font-medium">Loading store details...</span>
        </div>
      </div>
    </div>
  );
};

export default StoreDetailsSkeleton;