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
              className="btn btn-sm btn-primary"
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
            className={`group relative isolate block overflow-hidden rounded-2xl bg-orange-950 shadow-sm outline-none transition duration-500 ease-out-soft hover:shadow-xl focus-visible:ring-4 focus-visible:ring-orange-500/60 ${TILE_SPAN[i]}`}
          >
            {photo ? (
              <Image
                src={photo}
                alt=""
                fill
                sizes={i === 0 ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 50vw, 33vw"}
                placeholder={typeof photo === "string" ? "empty" : "blur"}
                className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.04]"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-t from-orange-950/85 via-orange-950/20 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-white sm:p-5">
              <div className="min-w-0">
                <h3
                  className={`font-display leading-tight ${
                    i === 0 ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl"
                  }`}
                >
                  {item.name || "Unnamed Category"}
                </h3>
                <p className="mt-1 text-xs tabular-nums text-orange-100/85 sm:text-sm">
                  {t("pieces", { count: item.productCount ?? 0 })}
                </p>
              </div>
              <span
                aria-hidden="true"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/15 text-white ring-1 ring-white/25 ring-inset backdrop-blur-md transition duration-300 ease-out-soft group-hover:bg-white group-hover:text-gray-900"
              >
                <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" strokeWidth={1.75} />
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
    <section className="w-full px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="section-head">
          <div>
            <h2 className="section-title">{t("shopByCraft")}</h2>
            <p className="section-lede">{t("shopByCraftDesc")}</p>
          </div>
          <Link href="/categories" className="btn btn-sm btn-secondary">
            {t("allCategories")}
            <span className="btn-disc" aria-hidden="true">
              <ArrowUpRight />
            </span>
          </Link>
        </div>

        <div className="stagger grid auto-rows-[170px] grid-cols-2 gap-4 sm:auto-rows-[200px] md:grid-cols-3 md:auto-rows-[220px]">
          {children}
        </div>
      </div>
    </section>
  );
}
