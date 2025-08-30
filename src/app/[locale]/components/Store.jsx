"use client";
import { useStores, useVendorStores } from "@/service/store";
import Link from "next/link";
import { useState } from "react";
import Breadcrumbs from "./Breadcrumbs";
import { useLocale, useTranslations } from "use-intl";
import Image from "next/image";
// Helper function to check if store is new (created within last 7 days)
const isNewStore = (createdAt) => {
  if (!createdAt) return false;
  const storeDate = new Date(createdAt);
  const now = new Date();
  const diffTime = now - storeDate;
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays <= 7;
};
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
    limit: 9,
  });
  const locale = useLocale();
  const isArabic = locale === "ar";
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
    // Scroll to top when filters change
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 🔹 toggle brand
  const toggleBrand = (brand) => {
    setFilters((prev) => {
      const updated = prev.brand.includes(brand)
        ? prev.brand.filter((b) => b !== brand)
        : [...prev.brand, brand];
      return { ...prev, brand: updated, page: 1 };
    });
    // Scroll to top when filters change
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    // Scroll to top when filters are cleared
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 🔹 Pagination helper with scroll to top
  const goToPage = (page) => {

    setFilters((prev) => ({ ...prev, page }));
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 🔹 Generate pagination numbers
  const generatePaginationNumbers = () => {
    const totalPages = pagination?.totalPages || 1;
    const currentPage = filters.page;
    const pages = [];
    
    if (totalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Complex pagination logic
      if (currentPage <= 4) {
        // Show first 5 pages + ... + last page
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Show first page + ... + last 5 pages
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Show first + ... + current-1, current, current+1 + ... + last
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumbs Skeleton */}
        <div className="text-center py-4">
          <div className="h-4 bg-gray-200 rounded w-64 mx-auto animate-pulse"></div>
        </div>

        <div className="flex">
          {/* Sidebar Skeleton */}
          <aside className="w-64 p-4 border-r border-gray-200 bg-white">
            {/* Filter & Sort Title */}
            <div className="h-6 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>

            {/* Sort Options */}
            <div className="mb-4">
              <div className="h-4 bg-gray-200 rounded w-16 mb-1 animate-pulse"></div>
              <div className="h-10 bg-gray-100 border border-gray-200 rounded-md animate-pulse"></div>
            </div>

            <hr className="my-4" />

            {/* Filter Options Skeleton */}
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="mb-4">
                <div className="h-4 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
                <div className="h-10 bg-gray-100 border border-gray-200 rounded-md animate-pulse"></div>
              </div>
            ))}

            {/* Clear Button Skeleton */}
            <div className="h-10 bg-gray-100 border border-gray-200 rounded-md mt-4 animate-pulse"></div>
          </aside>

          {/* Main Content */}
          <section className="container mx-auto p-10 md:py-12 md:p-8 flex-1">
            {/* Products Grid Skeleton */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10 items-start">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div
                  key={item}
                  className="relative rounded-lg overflow-hidden shadow-lg bg-white"
                >
                  {/* Product Image Skeleton */}
                  <div className="w-full h-72 bg-gray-200 animate-pulse"></div>

                  {/* Product Info Skeleton */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="h-5 bg-gray-300/50 rounded w-3/4 mx-auto animate-pulse"></div>
                  </div>

                  {/* Overlay Content Skeleton */}
                  <div className="absolute inset-0 bg-black/50 flex flex-col justify-between p-4 opacity-0 hover:opacity-100 transition-opacity duration-300">
                    {/* Top Tags */}
                    <div className="flex justify-between">
                      <div className="h-6 bg-white/20 rounded-full w-20 animate-pulse"></div>
                    </div>

                    {/* Center Button */}
                    <div className="flex-grow flex items-center justify-center">
                      <div className="h-12 bg-blue-600/50 rounded-full w-24 animate-pulse"></div>
                    </div>

                    {/* Price */}
                    <div className="flex justify-center mb-6">
                      <div className="h-10 bg-white/70 rounded-full w-20 animate-pulse"></div>
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Pagination Skeleton */}
            <div className="flex justify-center items-center gap-2 mt-10">
              {/* Previous Button */}
              <div className="h-10 bg-gray-100 border border-gray-200 rounded-lg w-20 animate-pulse"></div>

              {/* Page Numbers */}
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((page) => (
                  <div
                    key={page}
                    className="h-10 w-10 bg-gray-100 border border-gray-200 rounded-lg animate-pulse"
                  ></div>
                ))}
              </div>

              {/* Next Button */}
              <div className="h-10 bg-gray-100 border border-gray-200 rounded-lg w-16 animate-pulse"></div>
            </div>
          </section>
        </div>
      </div>
    );
  }
  // 🔹 Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-2">{t('error')}</h2>
          <p className="text-gray-600">{error.message || "Something went wrong"}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
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

                  className={`w-full border border-gray-300 rounded-lg px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-400 
                    ${isArabic ? 'pr-10' : 'pl-2'}`}
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

                  className= {`w-full appearance-none border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-400 cursor-pointer
                    ${isArabic ? 'pr-10' : 'pl-2'}`}                >
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
                  className={`w-full appearance-none border border-gray-300 rounded-lg px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 shadow-sm hover:border-gray-400 cursor-pointer
                    ${isArabic ? 'pr-10': 'pl-2'}`}
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
              <div className="space-y-3 max-h-64 overflow-y-auto scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
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
                        className="w-4 h-4 text-blue-500 bg-white border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 transition-all duration-200 cursor-pointer hover:border-blue-400"
                      />
                    </div>
                    <label
                      htmlFor={brand.toLowerCase()}
                      className={`ml-3 text-slate-600 font-medium text-sm cursor-pointer group-hover:text-slate-800 transition-colors duration-200 select-none
                        ${isArabic ? 'mr-2' : ''}`}
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-blue-500 mb-4"></div>
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
                    className="group relative border border-orange-200 rounded-2xl p-4 bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 w-full max-w-sm mx-auto animate-[fadeInUp_0.6s_ease-out_both]"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {/* New Badge */}
                    {isNewStore(store.createdAt) && (
                      <div className="absolute top-3 left-3 z-10">
                        <div className="bg-gradient-to-r from-purple-400 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                          NEW
                        </div>
                      </div>
                    )}

                    {/* Store Image/Logo */}
                    <div className="relative overflow-hidden rounded-lg mb-4 h-40 group">
                      <Image
                        src={store.logoUrl || "/placeholder.jpg"}
                        alt={store.name}
                        width={400}
                        height={160}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-white-900/90 to-orange-700/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                        <Link href={`/store/${store._id || store.id}`} className="transform scale-90 group-hover:scale-100 transition-transform duration-300">
                          <button className="bg-white text-orange-600 rounded-full px-6 py-3 shadow-lg font-semibold hover:bg-blue-50 transition-all duration-200">
                            View Details
                          </button>
                        </Link>
                      </div>
                    </div>

                    {/* Store Info */}
                    <div className="space-y-2 h-16">
                      <h4 className="text-lg font-semibold text-gray-900 group-hover:text-orange-500 transition-colors duration-200 line-clamp-2 leading-tight">
                        {store.name}
                      </h4>
                    </div>

                    {/* Store Stats Badge */}
                    {store.productCount && (
                      <div className="absolute top-3 right-3">
                        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg">
                          {store.productCount} Products
                        </div>
                      </div>
                    )}

                    {/* Status Badge */}
                    {store.status && (
                      <div className="absolute bottom-16 right-4">
                        <div className={`px-2 py-1 rounded-full text-xs font-bold shadow-sm ${
                          store.status === 'approved' ? 'bg-green-100 text-green-800' :
                          store.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          store.status === 'rejected' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {store.status.toUpperCase()}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Enhanced Pagination */}
            {pagination?.totalPages > 1 && (
              <div className="mt-12 flex flex-col items-center space-y-4">
                {/* Pagination Info */}
                <div className="text-sm text-gray-600 text-center">
                  Showing page {filters.page} of {pagination.totalPages} 
                  {pagination.total && ` (${pagination.total} total stores)`}
                </div>
                
                {/* Pagination Controls */}
                <div className="flex items-center space-x-1">
                  {/* Previous Button */}
                  <button
                    onClick={() => goToPage(Math.max(1, filters.page - 1))}
                    disabled={filters.page === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  {/* Page Numbers */}
                  {generatePaginationNumbers().map((page, index) => (
                    <div key={index}>
                      {page === '...' ? (
                        <span className="px-3 py-2 text-sm text-gray-400 select-none">...</span>
                      ) : (
                        <button
                          onClick={() => goToPage(page)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                            filters.page === page
                              ? 'bg-blue-500 text-white shadow-lg'
                              : 'text-gray-600 bg-white border border-gray-300 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300'
                          }`}
                        >
                          {page}
                        </button>
                      )}
                    </div>
                  ))}

                  {/* Next Button */}
                  <button
                    onClick={() => goToPage(Math.min(pagination.totalPages, filters.page + 1))}
                    disabled={filters.page === pagination.totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600 transition-all duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Quick Jump (for large page counts) */}
                {pagination.totalPages > 10 && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <span>Go to page:</span>
                    <input
                      type="number"
                      min="1"
                      max={pagination.totalPages}
                      value={filters.page}
                      onChange={(e) => {
                        const page = parseInt(e.target.value);
                        if (page >= 1 && page <= pagination.totalPages) {
                          goToPage(page);
                        }
                      }}
                      className="w-16 px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <span>of {pagination.totalPages}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}