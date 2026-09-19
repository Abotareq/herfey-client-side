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
              className="btn btn-sm btn-primary"
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
            className="group grid overflow-hidden rounded-[2rem] bg-white shadow-xs transition duration-500 ease-out-soft hover:shadow-xl md:grid-cols-2"
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
                  className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.04]"
                />
              ) : null}
            </Link>

            <div className="flex flex-col justify-center gap-5 p-6 sm:p-10 lg:p-14">
              <div>
                <h2 className="text-4xl leading-tight text-gray-900 sm:text-5xl">
                  {item.name || "Unnamed Category"}
                </h2>
              </div>

              {blurb ? (
                <p className="max-w-prose text-base leading-relaxed text-gray-600 sm:text-lg">
                  {blurb}
                </p>
              ) : null}

              <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <div>
                  <dt className="sr-only">{t("productcount")}</dt>
                  <dd className="font-medium tabular-nums text-gray-700">
                    {t("pieces", { count: item.productCount ?? 0 })}
                  </dd>
                </div>
                <div className="border-s border-gray-900/10 ps-6">
                  <dt className="sr-only">{t("storecount")}</dt>
                  <dd className="font-medium tabular-nums text-gray-700">
                    {t("stores", { count: item.storesCount ?? 0 })}
                  </dd>
                </div>
              </dl>

              <div>
                <Link
                  href="/products"
                  onClick={() => setCategory(item)}
                  className="btn btn-primary"
                >
                  {t("shopCraft", { name: item.name })}
                  <span className="btn-disc" aria-hidden="true">
                    <ArrowUpRight />
                  </span>
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
      <section className="w-full px-4 pb-24 pt-10 md:px-8 md:pb-32 md:pt-16">
        <div className="mx-auto max-w-7xl">
          <header className="mb-12 max-w-3xl md:mb-16">
            <h1 className="text-5xl leading-[1.05] text-gray-900 sm:text-6xl">
              {t("pageTitle")}
            </h1>
            <p className="mt-5 max-w-prose text-base text-gray-600 sm:text-lg">{t("pageIntro")}</p>
          </header>

          <div className="space-y-6 md:space-y-8">{children}</div>
        </div>
      </section>
    </div>
  );
}

function CraftRowSkeleton({ flip }) {
  return (
    <div
      className="grid overflow-hidden rounded-[2rem] bg-white shadow-xs md:grid-cols-2"
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
