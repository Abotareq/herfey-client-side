"use client";
import { useTranslations } from "use-intl";
import NotFoundPage from "./NotFoundComponent";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useGetAllProducts } from "../../../service/product";
import Breadcrumbs from "./Breadcrumbs";
import { useStoreContext } from "@/app/context/StoreContext";

function Products() {
  const [page, setPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [sortBy, setSortBy] = useState("");

  const { data, isLoading, isError } = useGetAllProducts({
    page,
    limit: 6,
    ...selectedFilters,
  });
 
  const { customerStoreId, setCustomerStoreId } = useStoreContext();
  const t = useTranslations("products");
  const router = useRouter();

  // useEffect to handle customerStoreId from context
  useEffect(() => {
    if (customerStoreId) {
      setSelectedFilters(prev => ({
        ...prev,
        storeId: customerStoreId
      }));
    }

    // Cleanup function to clear customerStoreId when component is destroyed
    return () => {
      setCustomerStoreId(null);
    };
  }, [customerStoreId, setCustomerStoreId]);

  if (isLoading) {
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

  if (isError) {
    return (
      <div className="flex justify-between">
        <div className="p-4 text-center">
          <p className="text-red-500">{t("error")}</p>
        </div>
      </div>
    );
  }

  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;
console.log("Fetched products:", products);
  const handleFilter = (item, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [item]: value,
    }));
    setPage(1);
  };

  // Helper function to get all unique stores from products
  const getStoreFilters = (products) => {
    const storeMap = new Map();
    
    products.forEach((product, index) => {
      // Debug logging
      console.log(`Product ${index}:`, {
        productName: product.name,
        storeId: product.store?._id,
        storeName: product.store?.name,
        hasStore: !!product.store
      });
      
      if (product.store && product.store._id && product.store.name) {
        if (!storeMap.has(product.store._id)) {
          storeMap.set(product.store._id, product.store.name);
          console.log(`Added store: ${product.store.name} (ID: ${product.store._id})`);
        }
      }
    });
    
    const storeList = Array.from(storeMap.entries()).map(([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name));
    console.log('Final store list:', storeList);
    
    return storeList;
  };

  // Helper function to get all unique variant names and their options from ALL products
  const getVariantFilters = (products) => {
    const variantMap = new Map();

    products.forEach((product) => {
      product.variants?.forEach((variant) => {
        if (!variant.isDeleted && variant.name) {
          const variantName = variant.name.toLowerCase();

          if (!variantMap.has(variantName)) {
            variantMap.set(variantName, new Set());
          }

          variant.options?.forEach((option) => {
            if (option.value) {
              variantMap.get(variantName).add(option.value);
            }
          });
        }
      });
    });

    // Convert Sets to Arrays for easier rendering
    const variantFilters = {};
    variantMap.forEach((options, variantName) => {
      variantFilters[variantName] = Array.from(options).sort();
    });

    return variantFilters;
  };

  // Sort function
  const sortProducts = (products, sortBy) => {
    const sortedProducts = [...products];

    switch (sortBy) {
      case "price-high":
        return sortedProducts.sort((a, b) => {
          const priceA = a.discountPrice > 0 ? a.discountPrice : a.basePrice;
          const priceB = b.discountPrice > 0 ? b.discountPrice : b.basePrice;
          return priceB - priceA;
        });

      case "price-low":
        return sortedProducts.sort((a, b) => {
          const priceA = a.discountPrice > 0 ? a.discountPrice : a.basePrice;
          const priceB = b.discountPrice > 0 ? b.discountPrice : b.basePrice;
          return priceA - priceB;
        });

      case "rating":
        return sortedProducts.sort((a, b) => {
          return (b.averageRating || 0) - (a.averageRating || 0);
        });

      case "sold":
        return sortedProducts.sort((a, b) => {
          return (
            (b.soldCount || b.reviewCount || 0) -
            (a.soldCount || a.reviewCount || 0)
          );
        });

      default:
        return sortedProducts;
    }
  };

  // Get filtered and sorted products
  const getFilteredAndSortedProducts = (products, filters, sortBy) => {
    // First apply filters
    const filteredProducts = products.filter((product) => {
      // Check store filter
      if (filters.storeId && product.store?._id !== filters.storeId) {
        return false;
      }

      // Check variant filters
      for (const [filterKey, filterValue] of Object.entries(filters)) {
        if (!filterValue || filterKey === 'storeId') continue;

        const hasMatchingVariant = product.variants?.some((variant) => {
          if (variant.isDeleted) return false;

          const variantName = variant.name?.toLowerCase();
          if (variantName === filterKey) {
            return variant.options?.some(
              (option) =>
                option.value?.toLowerCase() === filterValue.toLowerCase()
            );
          }
          return false;
        });

        if (!hasMatchingVariant) return false;
      }

      return true;
    });

    // Then apply sorting
    return sortProducts(filteredProducts, sortBy);
  };

  // Get the displayed products (filtered and sorted)
  const displayedProducts = getFilteredAndSortedProducts(
    products,
    selectedFilters,
    sortBy
  );

  // Get store options for dropdown
  const storeOptions = getStoreFilters(products);

  return (
    <div className="">
      <Breadcrumbs className="text-center" />
      <div className="flex">
        <aside className="w-64 p-4 border-r border-gray-200">
          <h3 className="font-semibold mb-4">Filter & Sort</h3>

          {/* Sort Options */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Sort By</label>
            <select
              className="w-full border rounded-md p-2 text-sm"
              value={sortBy || ""}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">Default</option>
              <option value="price-high">Highest Price</option>
              <option value="price-low">Lowest Price</option>
              <option value="rating">Highest Rating</option>
              <option value="sold">Most Sold</option>
            </select>
          </div>

          <hr className="my-4" />

          {/* Store Filter */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">Store</label>
            <select
              className="w-full border rounded-md p-2 text-sm"
              value={selectedFilters.storeId || ""}
              onChange={(e) => handleFilter("storeId", e.target.value)}
            >
              <option value="">All Stores</option>
              {storeOptions.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>

          {/* Dynamic Variant Filters */}
          {Object.entries(getVariantFilters(products)).map(
            ([variantName, options]) => (
              <div key={variantName} className="mb-4">
                <label className="block mb-1 font-medium capitalize">
                  {variantName}
                </label>
                <select
                  className="w-full border rounded-md p-2 text-sm"
                  value={selectedFilters[variantName] || ""}
                  onChange={(e) => handleFilter(variantName, e.target.value)}
                >
                  <option value="">All {variantName}</option>
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            )
          )}

          {/* Clear Filters Button */}
          <button
            className="w-full bg-gray-100 hover:bg-gray-200 border rounded-md p-2 text-sm transition-colors mt-4"
            onClick={() => {
              setSelectedFilters({});
              setSortBy("");
              // Clear the customerStoreId context
              setCustomerStoreId(null);
            }}
          >
            Clear All Filters
          </button>
        </aside>

        <section className="container mx-auto p-10 md:py-12 md:p-8">
          {/* Product Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10 items-start">
            {displayedProducts.length > 0 ? (
              displayedProducts.map((product) => (
                <div
                  key={product._id}
                  className="group relative rounded-lg overflow-hidden shadow-lg cursor-pointer"
                  onClick={() => router.push(`/products/${product._id}`)}
                >
                  {/* Product image */}
                  <img
                    src={product.images || "/placeholder.png"}
                    alt={product.name}
                    className="w-full h-72 object-cover transform group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 hover:bg-black/50 flex flex-col justify-between p-4">
                    {/* Category & Store tags */}
                    <div className="flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                        {t("category")}: {product.category?.name || "N/A"}
                      </span>
                      {product.store?.name && (
                        <span className="bg-orange-500/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                          {product.store.name}
                        </span>
                      )}
                    </div>

                    {/* Center Button */}
                    <div className="flex-grow flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
                      <button
                        className="bg-blue-600 text-white rounded-full px-6 py-3 shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/products/${product._id}`);
                        }}
                      >
                        {t("details")}
                      </button>
                    </div>

                    {/* Price */}
                    <div className="flex justify-center opacity-0 group-hover:opacity-100 mb-6 transition-opacity duration-300">
                      <div className="bg-white/70 px-5 py-2 rounded-full text-lg font-bold shadow-lg">
                        $
                        {product.discountPrice > 0
                          ? product.discountPrice
                          : product.basePrice}
                      </div>
                    </div>
                  </div>

                  {/* Bottom gradient info */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="text-white text-lg font-bold text-center">
                      {product.name}
                    </h3>
                  </div>
                </div>
              ))
            ) : (
              <NotFoundPage />
            )}
          </section>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 mt-10">
            {/* Previous */}
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
            >
              {t("Previous")}
            </button>

            {/* Page Numbers */}
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    page === i + 1
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Next */}
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
            >
              {t("next")}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Products;