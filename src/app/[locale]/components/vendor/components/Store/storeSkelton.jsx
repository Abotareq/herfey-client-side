import React from "react";
import { Loader2 } from "lucide-react";

function StoreSkeleton() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Skeleton */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 pb-8 border-b border-orange-200">
        <div className="space-y-3">
          <div className="h-10 bg-gradient-to-r from-orange-200 to-orange-300 rounded-lg w-64 animate-pulse"></div>
          <div className="h-6 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg w-80 animate-pulse"></div>
        </div>
        <div className="h-14 bg-gradient-to-r from-orange-300 to-orange-400 rounded-2xl w-48 animate-pulse"></div>
      </div>

      {/* Stores Grid Skeleton */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {[1, 2, 3, 4].map((index) => (
          <div
            key={index}
            className="bg-white rounded-3xl border border-orange-200 shadow-lg overflow-hidden animate-pulse"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Store Header Skeleton */}
            <div className="bg-gradient-to-br from-orange-100 to-orange-200 p-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-5">
                  {/* Logo Skeleton */}
                  <div className="w-20 h-20 bg-gradient-to-r from-orange-300 to-orange-400 rounded-2xl"></div>
                  
                  {/* Store Name and Status */}
                  <div className="space-y-3">
                    <div className="h-6 bg-gradient-to-r from-orange-400 to-orange-500 rounded w-32"></div>
                    <div className="h-6 bg-gradient-to-r from-orange-300 to-orange-400 rounded-full w-20"></div>
                  </div>
                </div>

                {/* Action Buttons Skeleton */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-gradient-to-r from-orange-300 to-orange-400 rounded-xl"></div>
                  <div className="w-11 h-11 bg-gradient-to-r from-orange-300 to-orange-400 rounded-xl"></div>
                </div>
              </div>
            </div>

            {/* Store Content Skeleton */}
            <div className="p-8">
              {/* Description Skeleton */}
              <div className="space-y-2 mb-8">
                <div className="h-4 bg-gradient-to-r from-orange-100 to-orange-200 rounded w-full"></div>
                <div className="h-4 bg-gradient-to-r from-orange-100 to-orange-200 rounded w-3/4"></div>
                <div className="h-4 bg-gradient-to-r from-orange-100 to-orange-200 rounded w-1/2"></div>
              </div>

              {/* Stats Grid Skeleton */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {[1, 2, 3, 4].map((statIndex) => (
                  <div
                    key={statIndex}
                    className="bg-orange-50 rounded-2xl p-5 text-center border border-orange-100"
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-200 to-orange-300 rounded-2xl mx-auto mb-3 animate-pulse"></div>
                    <div className="h-8 bg-gradient-to-r from-orange-300 to-orange-400 rounded w-8 mx-auto mb-2 animate-pulse"></div>
                    <div className="h-3 bg-gradient-to-r from-orange-200 to-orange-300 rounded w-16 mx-auto animate-pulse"></div>
                  </div>
                ))}
              </div>

              {/* Store Details Skeleton */}
              <div className="space-y-4 mb-8">
                {/* Address Skeleton */}
                <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-200 to-orange-300 rounded-xl animate-pulse"></div>
                  <div className="h-4 bg-gradient-to-r from-orange-200 to-orange-300 rounded w-48 animate-pulse"></div>
                </div>

                {/* Shipping Policy Skeleton */}
                <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-200 to-orange-300 rounded-xl animate-pulse"></div>
                  <div className="h-4 bg-gradient-to-r from-orange-200 to-orange-300 rounded w-40 animate-pulse"></div>
                </div>

                {/* Returns Policy Skeleton */}
                <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                  <div className="w-10 h-10 bg-gradient-to-r from-orange-200 to-orange-300 rounded-xl animate-pulse"></div>
                  <div className="h-4 bg-gradient-to-r from-orange-200 to-orange-300 rounded w-36 animate-pulse"></div>
                </div>
              </div>

              {/* Action Buttons Skeleton */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-orange-100">
                <div className="flex-1 h-14 bg-gradient-to-r from-orange-200 to-orange-300 rounded-2xl animate-pulse"></div>
                <div className="flex-1 h-14 bg-gradient-to-r from-orange-200 to-orange-300 rounded-2xl animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading Indicator */}
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-4" />
        <p className="text-orange-600 font-medium">Loading your stores...</p>
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

// Alternative minimal skeleton for cases where you want a simpler loading state
export function StoreSkeletonSimple() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center pb-6 border-b border-orange-200">
        <div className="space-y-2">
          <div className="h-8 bg-gradient-to-r from-orange-200 to-orange-300 rounded-lg w-48 animate-pulse"></div>
          <div className="h-4 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg w-64 animate-pulse"></div>
        </div>
        <div className="h-12 bg-gradient-to-r from-orange-300 to-orange-400 rounded-2xl w-40 animate-pulse"></div>
      </div>

      {/* Simple Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl border border-orange-200 p-6 animate-pulse"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-200 to-orange-300 rounded-xl"></div>
              <div className="flex-1">
                <div className="h-5 bg-gradient-to-r from-orange-200 to-orange-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gradient-to-r from-orange-100 to-orange-200 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-gradient-to-r from-orange-100 to-orange-200 rounded w-full"></div>
              <div className="h-3 bg-gradient-to-r from-orange-100 to-orange-200 rounded w-2/3"></div>
            </div>
            <div className="flex gap-2 mt-4">
              <div className="flex-1 h-8 bg-gradient-to-r from-orange-200 to-orange-300 rounded"></div>
              <div className="flex-1 h-8 bg-gradient-to-r from-orange-200 to-orange-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StoreSkeleton;