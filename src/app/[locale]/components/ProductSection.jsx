"use client";

import ProductCard, {
  ProductCardSkeleton,
  ProductsPlaceholder,
} from "./PrductCard";

/**
 * A titled block of product cards with its loading, error and empty states
 * handled in one place. The home-page sections only decide which products
 * to show and what to call them.
 */
export default function ProductSection({
  title,
  products = [],
  isLoading = false,
  isError = false,
  onRetry,
  errorMessage,
  emptyMessage,
  badgeFor,
  count = 4,
}) {
  const grid = "grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4";
  return (
    <section>
      <header className="mb-5 flex items-end justify-between gap-4">
        <h3 className="font-display text-2xl text-gray-900 sm:text-3xl">{title}</h3>
      </header>

      {isLoading ? (
        <div className={grid}>
          {Array.from({ length: count }, (_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <ProductsPlaceholder
          message={errorMessage}
          onRetry={onRetry}
          count={count}
          gridClassName={grid}
        />
      ) : products.length === 0 ? (
        <p className="rounded-2xl bg-white px-6 py-10 text-center text-sm text-gray-500 shadow-xs">
          {emptyMessage}
        </p>
      ) : (
        <div className={grid}>
          {products.slice(0, count).map((product, index) => (
            <ProductCard
              key={product._id}
              product={product}
              badge={badgeFor?.(product, index)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
