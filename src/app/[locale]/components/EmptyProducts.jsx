"use client";

import Link from "next/link";
import { PackageOpen, LayoutGrid, FilterX } from "lucide-react";
import { useTranslations } from "next-intl";

/**
 * Shown when a filter leaves the catalogue empty. It is not a 404 -- the
 * page exists, there is just nothing in this slice yet -- so it says so and
 * offers a way out: drop the filters, or go back to browsing.
 */
export default function EmptyProducts({ categoryName, onClear }) {
  const t = useTranslations("emptyProducts");

  return (
    <div className="col-span-full flex justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 to-amber-50 p-10 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-md shadow-orange-100">
          <PackageOpen className="h-10 w-10 text-orange-500" aria-hidden="true" />
        </div>

        <h2 className="text-2xl font-bold text-gray-900">
          {categoryName ? t("titleCategory", { category: categoryName }) : t("title")}
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-gray-600">
          {categoryName ? t("descCategory") : t("desc")}
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          {onClear && (
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-orange-300 bg-white px-5 py-2.5 text-sm font-semibold text-orange-700 transition-colors hover:border-orange-400 hover:bg-orange-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
            >
              <FilterX className="h-4 w-4" aria-hidden="true" />
              {t("clear")}
            </button>
          )}
          <Link
            href="/categories"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-orange-200 transition-colors hover:bg-orange-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2"
          >
            <LayoutGrid className="h-4 w-4" aria-hidden="true" />
            {t("browse")}
          </Link>
        </div>
      </div>
    </div>
  );
}
