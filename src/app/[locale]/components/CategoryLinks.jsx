"use client";
import Link from "next/link";
import Image from "next/image";
import { useGetAllCategories } from "@/service/category";
import { useCategoryContext } from "@/app/context/categoryContext";
import { useTranslations } from "next-intl";
import { ArrowUpRight, RefreshCw } from "lucide-react";
import NotFoundPage from "./NotFoundComponent";

import { craftImage } from "../constants/crafts";

const TILE_COUNT = 6;

// Bento layout on a 3-column grid: the first tile takes a 2x2 block, two
// tiles stack beside it and three sit underneath. On phones the grid is two
// columns wide, so the last tile stretches to avoid an orphan.
const TILE_SPAN = [
  "col-span-2 row-span-2",
  "",
  "",
  "",
  "",
  "max-md:col-span-2",
];

function CategoryLinks() {
  const t = useTranslations("category");
  const tp = useTranslations("products");
  const { setCategory } = useCategoryContext();
  const {
    data: categories,
    isPending: loadingList,
    error: categoriesError,
    refetch,
  } = useGetAllCategories();

  if (loadingList) {
    return (
      <CraftFrame t={t}>
        {Array.from({ length: TILE_COUNT }, (_, i) => (
          <div
            key={i}
            className={`skeleton rounded-2xl ${TILE_SPAN[i]}`}
            aria-hidden="true"
          />
        ))}
      </CraftFrame>
    );
  }

  // keep the grid shape, say what happened
  if (categoriesError) {
    return (
      <CraftFrame t={t}>
        <div className="relative col-span-2 row-span-3 md:col-span-3">
          <div
            className="grid h-full grid-cols-2 gap-4 opacity-40 md:grid-cols-3"
            aria-hidden="true"
          >
            {Array.from({ length: TILE_COUNT }, (_, i) => (
              <div key={i} className={`skeleton rounded-2xl ${TILE_SPAN[i]}`} />
            ))}
          </div>
          <div
            role="status"
            className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center"
          >
            <p className="rounded-xl bg-white/90 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm">
              {t("error")}
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-700"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              {tp("retry")}
            </button>
          </div>
        </div>
      </CraftFrame>
    );
  }

  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    return <NotFoundPage />;
  }

  return (
    <CraftFrame t={t}>
      {categories.slice(0, TILE_COUNT).map((item, i) => {
        const photo = craftImage(item);
        return (
          <Link
            key={item._id}
            href="/products"
            onClick={() => setCategory(item)}
            className={`group relative isolate block overflow-hidden rounded-2xl bg-orange-950 shadow-md outline-none transition-shadow hover:shadow-xl focus-visible:ring-4 focus-visible:ring-orange-500/60 ${TILE_SPAN[i]}`}
          >
            {photo ? (
              <Image
                src={photo}
                alt=""
                fill
                sizes={i === 0 ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 50vw, 33vw"}
                placeholder={typeof photo === "string" ? "empty" : "blur"}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white sm:p-5">
              <div className="min-w-0">
                <h3
                  className={`font-bold leading-tight drop-shadow ${
                    i === 0 ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"
                  }`}
                >
                  {item.name || "Unnamed Category"}
                </h3>
                <p className="mt-1 text-xs text-white/80 sm:text-sm">
                  {t("pieces", { count: item.productCount ?? 0 })}
                </p>
              </div>
              <span
                aria-hidden="true"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/90 text-gray-900 transition-colors group-hover:bg-orange-600 group-hover:text-white"
              >
                <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" />
              </span>
            </div>
          </Link>
        );
      })}
    </CraftFrame>
  );
}

export default CategoryLinks;

function CraftFrame({ t, children }) {
  return (
    <section className="w-full bg-white px-4 py-14 md:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-orange-600">
              {t("eyebrow")}
            </p>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {t("shopByCraft")}
            </h2>
            <p className="mt-2 max-w-xl text-gray-600">{t("shopByCraftDesc")}</p>
          </div>
          <Link
            href="/categories"
            className="inline-flex items-center gap-1 text-sm font-semibold text-orange-600 hover:text-orange-700"
          >
            {t("allCategories")}
            <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid auto-rows-[170px] grid-cols-2 gap-4 sm:auto-rows-[200px] md:grid-cols-3 md:auto-rows-[220px]">
          {children}
        </div>
      </div>
    </section>
  );
}
