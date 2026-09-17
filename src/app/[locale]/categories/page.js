"use client";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowUpRight, RefreshCw } from "lucide-react";
import { useGetAllCategories } from "@/service/category";
import { useCategoryContext } from "@/app/context/categoryContext";
import Breadcrumbs from "../components/Breadcrumbs";
import NotFoundPage from "../components/NotFoundComponent";
import { craftImage } from "../constants/crafts";

// The categories page reads as an index of crafts: one editorial row per
// craft, photo on one side, the story and a way in on the other.
function CategoriesPage() {
  const t = useTranslations("category");
  const tp = useTranslations("products");
  const { setCategory } = useCategoryContext();
  const {
    data: categories,
    isPending: loading,
    error,
    refetch,
  } = useGetAllCategories();

  if (loading) {
    return (
      <CraftIndexFrame t={t}>
        {[0, 1, 2].map((i) => (
          <CraftRowSkeleton key={i} flip={i % 2 === 1} />
        ))}
      </CraftIndexFrame>
    );
  }

  if (error) {
    return (
      <CraftIndexFrame t={t}>
        <div className="relative">
          <div className="space-y-6 opacity-40" aria-hidden="true">
            {[0, 1].map((i) => (
              <CraftRowSkeleton key={i} flip={i % 2 === 1} />
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
      </CraftIndexFrame>
    );
  }

  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    return <NotFoundPage />;
  }

  return (
    <CraftIndexFrame t={t}>
      {categories.map((item, i) => {
        const photo = craftImage(item);
        const blurbKey = `crafts.${item.slug}`;
        const blurb = t.has(blurbKey) ? t(blurbKey) : null;
        const flip = i % 2 === 1;
        return (
          <article
            key={item._id}
            className="group grid overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-xl md:grid-cols-2"
          >
            <Link
              href="/products"
              onClick={() => setCategory(item)}
              aria-label={t("shopCraft", { name: item.name })}
              className={`relative block aspect-[4/3] bg-orange-950 md:aspect-auto md:min-h-[360px] ${
                flip ? "md:order-2" : ""
              }`}
            >
              {photo ? (
                <Image
                  src={photo}
                  alt=""
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  placeholder={typeof photo === "string" ? "empty" : "blur"}
                  priority={i === 0}
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : null}
              <span className="absolute start-5 top-5 rounded-full bg-white/90 px-3 py-1 font-mono text-xs font-semibold tracking-widest text-gray-900">
                {String(i + 1).padStart(2, "0")}
              </span>
            </Link>

            <div className="flex flex-col justify-center gap-5 p-6 sm:p-10 lg:p-14">
              <div>
                <h2 className="text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
                  {item.name || "Unnamed Category"}
                </h2>
                <div className="mt-3 h-1 w-12 rounded-full bg-orange-600 transition-all duration-500 group-hover:w-24" />
              </div>

              {blurb ? (
                <p className="max-w-prose text-base leading-relaxed text-gray-600 sm:text-lg">
                  {blurb}
                </p>
              ) : null}

              <dl className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-gray-500">
                <div>
                  <dt className="sr-only">{t("productcount")}</dt>
                  <dd className="font-semibold text-gray-900">
                    {t("pieces", { count: item.productCount ?? 0 })}
                  </dd>
                </div>
                <div>
                  <dt className="sr-only">{t("storecount")}</dt>
                  <dd className="font-semibold text-gray-900">
                    {t("stores", { count: item.storesCount ?? 0 })}
                  </dd>
                </div>
              </dl>

              <div>
                <Link
                  href="/products"
                  onClick={() => setCategory(item)}
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-orange-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-orange-500/60"
                >
                  {t("shopCraft", { name: item.name })}
                  <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </article>
        );
      })}
    </CraftIndexFrame>
  );
}

export default CategoriesPage;

function CraftIndexFrame({ t, children }) {
  return (
    <div>
      <Breadcrumbs />
      <section className="w-full bg-gray-50 px-4 py-12 md:px-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <header className="mb-10 max-w-3xl md:mb-14">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-orange-600">
              {t("pageEyebrow")}
            </p>
            <h1 className="text-4xl font-bold leading-tight text-gray-900 sm:text-5xl">
              {t("pageTitle")}
            </h1>
            <p className="mt-4 text-base text-gray-600 sm:text-lg">{t("pageIntro")}</p>
          </header>

          <div className="space-y-6">{children}</div>
        </div>
      </section>
    </div>
  );
}

function CraftRowSkeleton({ flip }) {
  return (
    <div
      className="grid overflow-hidden rounded-3xl border border-gray-200 bg-white md:grid-cols-2"
      aria-hidden="true"
    >
      <div
        className={`skeleton aspect-[4/3] rounded-none md:aspect-auto md:min-h-[360px] ${
          flip ? "md:order-2" : ""
        }`}
      />
      <div className="flex flex-col justify-center gap-5 p-6 sm:p-10 lg:p-14">
        <div className="skeleton h-9 w-2/3" />
        <div className="space-y-2">
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-11/12" />
          <div className="skeleton h-4 w-3/4" />
        </div>
        <div className="flex gap-8">
          <div className="skeleton h-4 w-20" />
          <div className="skeleton h-4 w-24" />
        </div>
        <div className="skeleton h-10 w-40 rounded-xl" />
      </div>
    </div>
  );
}
