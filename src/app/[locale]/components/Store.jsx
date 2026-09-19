"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ImageOff, Search, Store as StoreIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useStores, useVendorStores } from "@/service/store";
import Breadcrumbs from "./Breadcrumbs";
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

const GRID =
  "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-10 items-start";

const DEFAULT_SORT = "newest";

// A store counts as new for its first week
const isNewStore = (createdAt) => {
  if (!createdAt) return false;
  const days = (Date.now() - new Date(createdAt)) / (1000 * 60 * 60 * 24);
  return days <= 7;
};

/** One store card, on the product card's proportions and hover. */
function StoreCard({ store }) {
  const t = useTranslations("Store");
  const id = store._id || store.id;
  return (
    <Link
      href={`/store/${id}`}
      className="group flex h-full w-full flex-col overflow-hidden rounded-2xl bg-white shadow-xs transition duration-500 ease-out-soft hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/40"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
        {store.logoUrl ? (
          <Image
            src={store.logoUrl}
            alt=""
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300">
            <ImageOff className="h-10 w-10" aria-hidden="true" />
          </div>
        )}
        {isNewStore(store.createdAt) && (
          <span className="absolute start-3 top-3 rounded-md bg-orange-600 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-white">
            {t("newBadge")}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="row-title line-clamp-2 text-lg transition-colors group-hover:text-orange-700 sm:text-lg">
          {store.name}
        </h3>
        {store.productCount > 0 && (
          <p className="text-sm tabular-nums text-gray-500">
            {t("productCount", { count: store.productCount })}
          </p>
        )}
      </div>
    </Link>
  );
}

function StoreCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-xs">
      <div className="skeleton aspect-[4/3] w-full" />
      <div className="p-4">
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton mt-2 h-4 w-1/3 rounded" />
      </div>
    </div>
  );
}

export default function HerafyStorePage({ vendorOnly = false }) {
  const t = useTranslations("Store");
  const tf = useTranslations("filters");

  const [filters, setFilters] = useState({
    search: "",
    sort: DEFAULT_SORT,
    page: 1,
    limit: 9,
  });
  // The box updates on every keystroke; the query waits for a pause
  const [searchInput, setSearchInput] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const term = searchInput.trim();
    if (term === filters.search) return;
    const id = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: term, page: 1 }));
    }, 300);
    return () => clearTimeout(id);
  }, [searchInput, filters.search]);

  const useList = vendorOnly ? useVendorStores : useStores;
  const {
    data: storeData,
    isPending,
    isPlaceholderData,
    error,
    refetch,
  } = useList(filters);

  const stores = storeData?.stores || storeData?.data?.stores || [];
  const pagination = storeData?.pagination || {};
  const totalPages = pagination.totalPages || 1;
  const total = pagination.total ?? stores.length;

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setSearchInput("");
    setFilters((prev) => ({ ...prev, search: "", sort: DEFAULT_SORT, page: 1 }));
  };

  const goToPage = (page) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeFilterCount =
    (filters.search ? 1 : 0) + (filters.sort !== DEFAULT_SORT ? 1 : 0);

  if (isPending) {
    return (
      <CataloguePageSkeleton gridClassName={GRID} cards={6} card={<StoreCardSkeleton />} />
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center md:px-8">
        <h2 className="section-title">{t("error")}</h2>
        <p className="section-lede mx-auto">{error.message || t("nodesc")}</p>
        <button type="button" onClick={() => refetch()} className="btn btn-primary mt-6">
          {t("retry")}
        </button>
      </div>
    );
  }

  const results = (
    <ResultsSummary updating={isPlaceholderData}>
      {t("results", { count: total })}
    </ResultsSummary>
  );

  return (
    <div>
      <Breadcrumbs className="text-center" />
      <FilterLayout>
        <FilterSidebar
          id="store-filters"
          open={filtersOpen}
          onClose={() => setFiltersOpen(false)}
          onClear={clearFilters}
        >
          <FilterField id="store-sort" label={t("sort")}>
            <select
              id="store-sort"
              className="field"
              value={filters.sort}
              onChange={(e) => updateFilter("sort", e.target.value)}
            >
              <option value="newest">{t("new")}</option>
              <option value="oldest">{t("old")}</option>
              <option value="name">{t("name")}</option>
              <option value="products">{t("mostproduct")}</option>
              <option value="orders">{t("mostorders")}</option>
            </select>
          </FilterField>

          <FilterDivider />

          <FilterField id="store-search" label={t("searchstore")}>
            <div className="relative">
              <Search
                className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500"
                aria-hidden="true"
              />
              <input
                id="store-search"
                type="search"
                className="field ps-9"
                placeholder={t("searchstoreplace")}
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </FilterField>
        </FilterSidebar>

        <section className="min-w-0 flex-1">
          <div className="section-head mb-6">
            <div>
              <h1 className="page-title">
                {vendorOnly ? t("mystore") : t("allstores")}
              </h1>
              <p className="section-lede hidden lg:block">{results}</p>
            </div>
          </div>

          <FilterToolbar
            open={filtersOpen}
            onToggle={() => setFiltersOpen((open) => !open)}
            controls="store-filters"
            activeCount={activeFilterCount}
          >
            {results}
          </FilterToolbar>

          {stores.length === 0 ? (
            <div className="rounded-2xl bg-white px-6 py-16 text-center shadow-xs">
              <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-gray-100 text-gray-400">
                <StoreIcon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h2 className="row-title">{t("no")}</h2>
              <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">{t("nodesc")}</p>
              {activeFilterCount > 0 && (
                <button type="button" onClick={clearFilters} className="btn btn-sm btn-secondary mt-6">
                  {tf("clear")}
                </button>
              )}
            </div>
          ) : (
            <ResultsGrid updating={isPlaceholderData} className={GRID}>
              {stores.map((store) => (
                <StoreCard key={store._id || store.id} store={store} />
              ))}
            </ResultsGrid>
          )}

          <Pagination page={filters.page} totalPages={totalPages} onChange={goToPage} />
        </section>
      </FilterLayout>
    </div>
  );
}
