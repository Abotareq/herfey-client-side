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
      <div className="w-full max-w-lg rounded-[2rem] bg-white p-10 text-center shadow-xs">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-orange-600">
          <PackageOpen className="h-8 w-8" strokeWidth={1.5} aria-hidden="true" />
        </div>

        <h2 className="text-3xl text-gray-900">
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
              className="btn btn-secondary"
            >
              <FilterX className="h-4 w-4" aria-hidden="true" />
              {t("clear")}
            </button>
          )}
          <Link
            href="/categories"
            className="btn btn-primary"
          >
            <LayoutGrid className="h-4 w-4" aria-hidden="true" />
            {t("browse")}
          </Link>
        </div>
      </div>
    </div>
  );
}
