"use client";
import { useTranslations } from "use-intl";
import EmptyProducts from "./EmptyProducts";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  CataloguePageSkeleton,
  FilterDivider,
  FilterField,
  FilterLayout,
  FilterSidebar,
  FilterToolbar,
  Pagination,
  ResultsGrid,
  ResultsSummary,
} from "./Filters";
import { useGetAllProducts } from "../../../service/product";
import Breadcrumbs from "./Breadcrumbs";
import { useStoreContext } from "@/app/context/StoreContext";
import { useCategoryContext } from "@/app/context/categoryContext";
import ProductCard, { ProductCardSkeleton, ProductsPlaceholder } from "./PrductCard";

const GRID =
  "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6 md:gap-10 items-start";

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

  // Previous results stay on screen (dimmed) while a filter change loads
  const { data, isPending: isLoading, isPlaceholderData, isError, refetch } = useGetAllProducts({
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
      <CataloguePageSkeleton
        gridClassName={GRID}
        card={<ProductCardSkeleton />}
      />
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

    products.forEach((product) => {
      if (product.store && product.store._id && product.store.name) {
        if (!storeMap.has(product.store._id)) {
          storeMap.set(product.store._id, product.store.name);
        }
      }
    });

    const storeList = Array.from(storeMap.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));

    return storeList;
  };

  // Helper function to get all unique categories from products
  const getCategoryFilters = (products) => {
    const categoryMap = new Map();

    products.forEach((product) => {
      if (product.category && product.category._id && product.category.name) {
        if (!categoryMap.has(product.category._id)) {
          categoryMap.set(product.category._id, product.category.name);
        }
      }
    });

    const categoryList = Array.from(categoryMap.entries())
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name));

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

  const results = (
    <ResultsSummary updating={isPlaceholderData}>
      {t1("results", { count: data?.totalProducts ?? displayedProducts.length })}
    </ResultsSummary>
  );

  return (
    <div>
      <Breadcrumbs className="text-center" />
      <FilterLayout>
        <FilterSidebar
          id="product-filters"
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          onClear={clearAllFilters}
        >
          <FilterField id="filter-sort" label={t1("sort")}>
            <select
              id="filter-sort"
              className="field"
              value={sortBy || ""}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="">{t1("default")}</option>
              <option value="price-high">{t1("highestprice")}</option>
              <option value="price-low">{t1("lowestprice")}</option>
              <option value="rating">{t1("highestrate")}</option>
              <option value="sold">{t1("mostsold")}</option>
            </select>
          </FilterField>

          <FilterDivider />

          <FilterField id="filter-store" label={t1("store")}>
            <select
              id="filter-store"
              className="field"
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
          </FilterField>

          <FilterField id="filter-category" label={t1("category")}>
            <select
              id="filter-category"
              className="field"
              value={selectedFilters.category || ""}
              onChange={(e) => handleFilter("category", e.target.value)}
            >
              <option value="">{t1("allcategories")}</option>
              {categoryOptions.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </FilterField>

          {/* Dynamic Variant Filters */}
          {Object.entries(getVariantFilters(products)).map(
            ([variantName, options]) => (
              <FilterField
                key={variantName}
                id={`filter-${variantName}`}
                label={variantName}
              >
                <select
                  id={`filter-${variantName}`}
                  className="field"
                  value={selectedFilters[variantName] || ""}
                  onChange={(e) => handleFilter(variantName, e.target.value)}
                >
                  <option value="">{t1("all", { name: variantName })}</option>
                  {options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </FilterField>
            )
          )}
        </FilterSidebar>

        <section className="min-w-0 flex-1">
          <div className="section-head mb-6">
            <div>
              <h1 className="page-title">{category?.name || t("allProducts")}</h1>
              <p className="section-lede hidden lg:block">{results}</p>
            </div>
          </div>

          <FilterToolbar
            open={filtersOpen}
            onToggle={() => setFiltersOpen((open) => !open)}
            controls="product-filters"
            activeCount={activeFilterCount}
          >
            {results}
          </FilterToolbar>

          <ResultsGrid updating={isPlaceholderData} className={GRID}>
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
          </ResultsGrid>

          <Pagination page={page} totalPages={totalPages} onChange={setPage} />
        </section>
      </FilterLayout>
    </div>
  );
}

export default ProductsList;
