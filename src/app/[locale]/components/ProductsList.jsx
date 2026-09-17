"use client";
import { useTranslations } from "use-intl";
import EmptyProducts from "./EmptyProducts";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { useGetAllProducts } from "../../../service/product";
import Breadcrumbs from "./Breadcrumbs";
import { useStoreContext } from "@/app/context/StoreContext";
import { useCategoryContext } from "@/app/context/categoryContext";
import ProductCard, { ProductCardSkeleton, ProductsPlaceholder } from "./PrductCard";

function ProductsList() {
  const [page, setPage] = useState(1);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [sortBy, setSortBy] = useState("");
  // Below lg the filters live in a panel the user opens from a toolbar
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Sort is done by the server so it spans every page, not just the current one
  const SORT_PARAM = {
    "price-high": "price_desc",
    "price-low": "price_asc",
    rating: "rating_desc",
    sold: "popularity_desc",
  };

  const { data, isPending: isLoading, isError, refetch } = useGetAllProducts({
    page,
    limit: 6,
    ...(SORT_PARAM[sortBy] ? { sort: SORT_PARAM[sortBy] } : {}),
    ...selectedFilters,
  });

  const { customerStoreId, setCustomerStoreId } = useStoreContext();
  const { category, setCategory } = useCategoryContext(); // Use category context
  const t = useTranslations("products");
  const router = useRouter();
  const t1 = useTranslations("productFilter");

  // useEffect to handle customerStoreId from context
  useEffect(() => {
    if (customerStoreId) {
      setSelectedFilters((prev) => ({
        ...prev,
        storeId: customerStoreId,
      }));
      setPage(1);
    }
  }, [customerStoreId]);

  // useEffect to handle category from context
  // The backend filters on `category`, not `categoryId`
  useEffect(() => {
    if (category) {
      setSelectedFilters((prev) => ({
        ...prev,
        category: category._id,
      }));
      setPage(1);
    }
  }, [category]);

  // Clear both contexts when the component is destroyed
  useEffect(() => {
    return () => {
      setCustomerStoreId(null);
      setCategory(null);
    };
  }, [setCustomerStoreId, setCategory]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumbs Skeleton */}
        <div className="text-center py-4">
          <div className="h-4 bg-gray-200 rounded w-64 mx-auto animate-pulse"></div>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Sidebar Skeleton */}
          <aside className="hidden w-64 shrink-0 p-4 border-r border-gray-200 bg-white lg:block">
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
          <section className="container mx-auto min-w-0 flex-1 p-4 sm:p-6 lg:p-8 md:py-12">
            {/* Toolbar Skeleton */}
            <div className="mb-6 h-10 w-28 rounded-lg bg-gray-100 border border-gray-200 animate-pulse lg:hidden"></div>
            {/* Products Grid Skeleton */}
            <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-10 items-start">
              {Array.from({ length: 8 }, (_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </section>

            {/* Pagination Skeleton */}
            <div className="flex flex-wrap justify-center items-center gap-2 mt-10">
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
      <div className="container mx-auto p-10 md:py-12 md:p-8">
        <ProductsPlaceholder
          message={t("error")}
          onRetry={refetch}
          count={8}
          gridClassName="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10"
        />
      </div>
    );
  }

  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;
 // console.log("Fetched products:", products);
  const clearAllFilters = () => {
    setSelectedFilters({});
    setSortBy("");
    setPage(1);
    // Clear both contexts
    setCustomerStoreId(null);
    setCategory(null);
  };

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
        hasStore: !!product.store,
      });

      if (product.store && product.store._id && product.store.name) {
        if (!storeMap.has(product.store._id)) {
          storeMap.set(product.store._id, product.store.name);
          console.log(
            `Added store: ${product.store.name} (ID: ${product.store._id})`
          );
        }
      }
    });

    const storeList = Array.from(storeMap.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
    console.log("Final store list:", storeList);

    return storeList;
  };

  // Helper function to get all unique categories from products
  const getCategoryFilters = (products) => {
    const categoryMap = new Map();

    products.forEach((product, index) => {
      // Debug logging
      console.log(`Product ${index}:`, {
        productName: product.name,
        categoryId: product.category?._id,
        categoryName: product.category?.name,
        hasCategory: !!product.category,
      });

      if (product.category && product.category._id && product.category.name) {
        if (!categoryMap.has(product.category._id)) {
          categoryMap.set(product.category._id, product.category.name);
          console.log(
            `Added category: ${product.category.name} (ID: ${product.category._id})`
          );
        }
      }
    });

    const categoryList = Array.from(categoryMap.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));
    console.log("Final category list:", categoryList);

    return categoryList;
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

  // Store, category and sort are applied by the server. Variant filters the
  // server doesn't know about are still narrowed down here.
  const getFilteredProducts = (products, filters) => {
    return products.filter((product) => {
      for (const [filterKey, filterValue] of Object.entries(filters)) {
        if (
          !filterValue ||
          filterKey === "storeId" ||
          filterKey === "category"
        )
          continue;

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
  };

  const displayedProducts = getFilteredProducts(products, selectedFilters);

  const activeFilterCount =
    Object.values(selectedFilters).filter(Boolean).length + (sortBy ? 1 : 0);

  // Get store options for dropdown
  const storeOptions = getStoreFilters(products);

  // Get category options for dropdown
  const categoryOptions = getCategoryFilters(products);

  return (
    <div className="">
      <Breadcrumbs className="text-center" />
      <div className="flex flex-col lg:flex-row">
        <aside
          id="product-filters"
          className={`${
            filtersOpen ? "block" : "hidden"
          } w-full border-b border-gray-200 bg-white p-4 lg:block lg:w-64 lg:shrink-0 lg:self-start lg:sticky lg:top-24 lg:border-b-0 lg:border-r`}
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold">{t1("filter")}</h3>
            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              aria-label={t1("close")}
              className="grid h-8 w-8 place-items-center rounded-full text-gray-500 hover:bg-gray-100 lg:hidden"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          {/* Sort Options */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">{t1("sort")}</label>
            <select
              className="w-full border rounded-md p-2 text-sm"
              value={sortBy || ""}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">{t1("default")}</option>
              <option value="price-high">{t1("highestprice")}</option>
              <option value="price-low">{t1("lowestprice")}</option>
              <option value="rating">{t1("highestrate")}</option>
              <option value="sold">{t1("mostsold")}</option>
            </select>
          </div>

          <hr className="my-4" />

          {/* Store Filter */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">{t1("store")}</label>
            <select
              className="w-full border rounded-md p-2 text-sm"
              value={selectedFilters.storeId || ""}
              onChange={(e) => handleFilter("storeId", e.target.value)}
            >
              <option value="">{t1("allstores")}</option>
              {storeOptions.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div className="mb-4">
            <label className="block mb-1 font-medium">{"Category"}</label>
            <select
              className="w-full border rounded-md p-2 text-sm"
              value={selectedFilters.category || ""}
              onChange={(e) => handleFilter("category", e.target.value)}
            >
              <option value="">{"All Categories"}</option>
              {categoryOptions.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
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
            onClick={clearAllFilters}
          >
            {t1("clear")}
          </button>
        </aside>

        <section className="container mx-auto min-w-0 flex-1 p-4 sm:p-6 lg:p-8 md:py-12">
          {/* Toolbar (below lg): open the filters panel */}
          <div className="mb-6 flex items-center justify-between gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setFiltersOpen((open) => !open)}
              aria-expanded={filtersOpen}
              aria-controls="product-filters"
              className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              {t1("filter")}
              {activeFilterCount > 0 && (
                <span className="rounded-full bg-orange-600 px-2 py-0.5 text-xs font-semibold text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
            <p className="text-sm text-gray-500">
              {t1("results", { count: data?.totalProducts ?? displayedProducts.length })}
            </p>
          </div>

          {/* Product Grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-10 items-start">
            {displayedProducts.length > 0 ? (
              displayedProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <EmptyProducts
                categoryName={category?.name}
                onClear={
                  Object.keys(selectedFilters).length > 0 || category || customerStoreId
                    ? clearAllFilters
                    : undefined
                }
              />
            )}
          </section>

          {/* Pagination */}
          <div className="flex flex-wrap justify-center items-center gap-2 mt-10">
            {/* Previous */}
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
            >
              {t("Previous")}
            </button>

            {/* Page Numbers */}
            <div className="flex flex-wrap justify-center gap-1">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    page === i + 1
                      ? "bg-orange-600 text-white shadow-sm"
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

export default ProductsList;
