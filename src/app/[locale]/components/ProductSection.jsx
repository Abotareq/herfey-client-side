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
  count = 3,
}) {
  return (
    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      <header className="mb-6 text-center">
        <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
        <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-orange-500" />
      </header>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6">
          {Array.from({ length: count }, (_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <ProductsPlaceholder
          message={errorMessage}
          onRetry={onRetry}
          count={count}
        />
      ) : products.length === 0 ? (
        <p className="py-10 text-center text-sm text-gray-500">{emptyMessage}</p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
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
