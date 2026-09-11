"use client";

import Link from "next/link";
import { Star, ImageOff, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * The one product card. Used by the catalogue grid and every home-page
 * section, so they all get the same size, spacing, badges and hover.
 *
 * `badge` is an optional label pinned to the top-left corner ("Best Deal",
 * "New", ...). The category chip and discount badge come from the product.
 */
export default function ProductCard({ product, badge }) {
  const t = useTranslations("products");

  const hasDiscount =
    product.discountPrice > 0 && product.discountPrice < product.basePrice;
  const price = hasDiscount ? product.discountPrice : product.basePrice;
  const percentOff = hasDiscount
    ? Math.round(((product.basePrice - price) / product.basePrice) * 100)
    : 0;

  const rating = Number(product.averageRating) || 0;
  const reviewCount = Number(product.reviewCount) || 0;
  const image = product.images?.[0];

  return (
    <Link
      href={`/products/${product._id}`}
      className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
    >
      {/* image */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-gray-100">
        {image ? (
          <img
            src={image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gray-300">
            <ImageOff className="h-10 w-10" aria-hidden="true" />
          </div>
        )}

        {badge && (
          <span className="absolute left-3 top-3 rounded-full bg-orange-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            {badge}
          </span>
        )}

        {hasDiscount && (
          <span className="absolute right-3 top-3 rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white shadow-sm">
            -{percentOff}%
          </span>
        )}

        {product.category?.name && (
          <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-gray-700 backdrop-blur-sm">
            {product.category.name}
          </span>
        )}
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="line-clamp-2 min-h-[2.75rem] text-base font-semibold leading-snug text-gray-900 transition-colors group-hover:text-orange-700">
          {product.name}
        </h3>

        {product.store?.name && (
          <p className="truncate text-xs text-gray-500">{product.store.name}</p>
        )}

        <div className="flex items-center gap-1.5">
          <Stars value={rating} />
          <span className="text-xs text-gray-500">
            {rating > 0 ? rating.toFixed(1) : "–"}
            {reviewCount > 0 && ` (${reviewCount})`}
          </span>
        </div>

        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="text-lg font-bold text-orange-600">
            <span className="mr-1 text-xs font-medium text-gray-500">
              {t("currency")}
            </span>
            {formatPrice(price)}
          </span>
          {hasDiscount && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.basePrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function formatPrice(n) {
  return Number(n).toLocaleString("en-EG", { maximumFractionDigits: 0 });
}

function Stars({ value }) {
  return (
    <span className="flex items-center" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i <= Math.round(value)
              ? "fill-amber-400 text-amber-400"
              : "fill-gray-200 text-gray-200"
          }`}
          aria-hidden="true"
        />
      ))}
    </span>
  );
}

/** Same box as ProductCard, so the grid does not shift when data lands. */
export function ProductCardSkeleton() {
  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white"
      aria-hidden="true"
    >
      <div className="skeleton aspect-[4/5] w-full rounded-none" />
      <div className="flex flex-col gap-2.5 p-4">
        <div className="skeleton h-4 w-11/12" />
        <div className="skeleton h-4 w-2/3" />
        <div className="skeleton h-3 w-1/3" />
        <div className="skeleton mt-1 h-5 w-1/2" />
      </div>
    </div>
  );
}

/**
 * Shown when the backend gave no usable answer: a dimmed row of skeleton
 * cards keeps the layout in place, with a message and retry on top.
 */
export function ProductsPlaceholder({
  message,
  onRetry,
  count = 3,
  gridClassName = "grid grid-cols-1 gap-6",
}) {
  const t = useTranslations("products");
  return (
    <div className="relative">
      <div
        className={`${gridClassName} opacity-40`}
        aria-hidden="true"
      >
        {Array.from({ length: count }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
      <div
        role="status"
        className="absolute inset-x-0 top-0 flex flex-col items-center gap-3 px-4 pt-24 text-center"
      >
        <p className="rounded-xl bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm">
          {message || t("error")}
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            {t("retry")}
          </button>
        )}
      </div>
    </div>
  );
}
