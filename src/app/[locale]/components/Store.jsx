"use client";
import { useStores, useVendorStores } from "@/service/store";
import Link from "next/link";
import { useState } from "react";
import SkeletonLoader from "./SkeltonLoader";
import NotFoundPage from "./NotFoundComponent";
import Breadcrumbs from "./Breadcrumbs";
import { useTranslations } from "use-intl";
import Image from "next/image";
// Main component for Herafy Store Page

export default function HerafyStorePage({ vendorOnly = false }) {
  const t = useTranslations('Store')
  // 🔹 filter + sort state
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    brand: [],
    sort: "newest", // default
    page: 1,
    limit: 12,
  });

  // 🔹 Use React Query hooks based on vendorOnly prop
  const {
    data: storeData,
    isLoading: loading,
    error,
  } = vendorOnly
    ? useVendorStores(filters)
    : useStores(filters);

  // Extract stores from the response (handle different response structures)
  const stores = storeData?.stores || storeData?.data?.stores || [];
  const pagination = storeData?.pagination || {};

  // 🔹 update filter helper
  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  // 🔹 toggle brand
  const toggleBrand = (brand) => {
    setFilters((prev) => {
      const updated = prev.brand.includes(brand)
        ? prev.brand.filter((b) => b !== brand)
        : [...prev.brand, brand];
      return { ...prev, brand: updated, page: 1 };
    });
  };

  // 🔹 clear all
  const clearFilters = () => {
    setFilters({
      search: "",
      status: "",
      brand: [],
      sort: "newest",
      page: 1,
      limit: 12,
    });
  };

    // if(loading){
    //   return(
    //     <SkeletonLoader />
    //   )
    // }
  
    // if(error){
    //   return(
    //     <NotFoundPage />
    //   )
    // }
  // 🔹 Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">{t('error')}</h2>
          <p className="text-gray-600">{error.message || "Something went wrong"}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            {t('retry')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs />
      <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        {/* Sidebar Filter */}
        <div className="w-full lg:w-80 lg:min-w-80 bg-white border-r border-gray-200 shadow-sm">
          <div className="sticky top-0 px-6 py-8 lg:min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-8">
              <h3 className="text-slate-900 text-xl font-bold tracking-tight">
                {t('filters')}
              </h3>
              <button
                type="button"
                onClick={clearFilters}
                className="text-sm text-red-500 hover:text-red-600 font-semibold transition-colors duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-red-200 rounded px-2 py-1"
              >
                {t('clearall')}
              </button>
            </div>

            {/* Search Filter */}
            <div className="mb-8">
              <label className="block text-slate-900 text-sm font-semibold mb-3">
                {t('searchstore')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('searchstoreplace')}
                  value={filters.search}
                  onChange={(e) => updateFilter("search", e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-400"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Status Filter */}
            <div className="mb-8">
              <label className="block text-slate-900 text-sm font-semibold mb-3">
                {t('storestatus')}
              </label>
              <div className="relative">
                <select
                  value={filters.status}
                  onChange={(e) => updateFilter("status", e.target.value)}
                  className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-400 cursor-pointer"
                >
                  <option value="">{t('all')}</option>
                  <option value="approved">{t('approved')}</option>
                  <option value="pending">{t('pending')}</option>
                  <option value="rejected">{t('rejected')}</option>
                  <option value="suspended">{t('suspended')}</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Sort Filter */}
            <div className="mb-6">
              <label className="block text-slate-900 text-sm font-semibold mb-3">
                {t('sort')}
              </label>
              <div className="relative">
                <select
                  value={filters.sort}
                  onChange={(e) => updateFilter("sort", e.target.value)}
                  className="w-full appearance-none border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-400 cursor-pointer"
                >
                  <option value="newest">{t('new')}</option>
                  <option value="oldest">{t('old')}</option>
                  <option value="name">{t('name')}</option>
                  <option value="products">{t('mostproduct')}</option>
                  <option value="orders">{t('mostorders')}</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Brand Filter */}
            <div className="mb-8">
              <label className="block text-slate-900 text-sm font-semibold mb-4">
                {t('brand')}
              </label>
              <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
                {[
                  "Zara",
                  "H&M",
                  "Uniqlo",
                  "Levi's",
                  "Nike",
                  "Adidas",
                  "Puma",
                ].map((brand, index) => (
                  <div key={index} className="flex items-center group">
                    <div className="relative flex items-center">
                      <input
                        id={brand.toLowerCase()}
                        type="checkbox"
                        checked={filters.brand.includes(brand)}
                        onChange={() => toggleBrand(brand)}
                        className="w-4 h-4 text-orange-500 bg-white border-2 border-gray-300 rounded focus:ring-orange-500 focus:ring-2 transition-all duration-200 cursor-pointer hover:border-orange-400"
                      />
                    </div>
                    <label
                      htmlFor={brand.toLowerCase()}
                      className="ml-3 text-slate-600 font-medium text-sm cursor-pointer group-hover:text-slate-800 transition-colors duration-200 select-none"
                    >
                      {brand}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Store Cards Section */}
        <div className="flex-1 bg-gray-50">
          <div className="p-6 lg:p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-2">
                {vendorOnly ? t("mystore") : t("allstores")}
              </h1>
              <p className="text-slate-600 text-sm lg:text-base">
                {t('desc')}
              </p>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-orange-500 mb-4"></div>
                <p className="text-center text-gray-500 text-lg font-medium">
                  {t('loading')}
                </p>
                <p className="text-center text-gray-400 text-sm mt-1">
                  {t('waiting')}
                </p>
              </div>
            ) : stores.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-md mx-auto">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {t('no')}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    {t('nodesc')}
                  </p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                {stores.map((store, index) => (
                  <div
                    key={store._id || store.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300 transform hover:-translate-y-1 group"
                    style={{
                      animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`,
                    }}
                  >
                    {/* Image Container */}
                    <div className="relative overflow-hidden bg-gray-100">
                      <Image
                        src={store.logoUrl || "/placeholder.jpg"}
                        alt={store.name}
                        fill
                        className="w-full h-48 lg:h-52 object-cover group-hover:scale-110 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="text-lg lg:text-xl font-semibold text-slate-900 mb-2 group-hover:text-orange-600 transition-colors duration-200 line-clamp-1">
                        {store.name}
                      </h3>
                      <p className="text-sm text-slate-600 mb-6 line-clamp-2 leading-relaxed">
                        {store.description}
                      </p>

                      <Link
                        href={`/store/${store._id || store.id}`}
                        className="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-700 rounded-xl transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
                      >
                        <span>{t('view')}</span>
                        <svg
                          className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination (if needed) */}
            {pagination?.totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <div className="flex space-x-2">
                  <button
                    onClick={() => updateFilter("page", Math.max(1, filters.page - 1))}
                    disabled={filters.page === 1}
                    className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('prev')}
                  </button>
                  <span className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg">
                    {filters.page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => updateFilter("page", Math.min(pagination.totalPages, filters.page + 1))}
                    disabled={filters.page === pagination.totalPages}
                    className="px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {t('next')}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #cbd5e0 #f7fafc;
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f7fafc;
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }

        .border-b-3 {
          border-bottom-width: 3px;
        }
      `}</style>
    </div>
    </div>
  );
}
