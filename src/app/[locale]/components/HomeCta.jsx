"use client";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { ArrowUpRight } from "lucide-react";
import makersImg from "@public/crafts/makers.jpg";
import shoppersImg from "@public/crafts/shoppers.jpg";

// Two doors at the end of the home page: one for the people who make
// things, one for the people who buy them.
export default function HomeCta() {
  const t = useTranslations("HomeCta");
  const panels = [
    {
      key: "makers",
      image: makersImg,
      href: "/contact",
      eyebrow: t("makersEyebrow"),
      title: t("makersTitle"),
      text: t("makersText"),
      cta: t("makersCta"),
    },
    {
      key: "shoppers",
      image: shoppersImg,
      href: "/products",
      eyebrow: t("shoppersEyebrow"),
      title: t("shoppersTitle"),
      text: t("shoppersText"),
      cta: t("shoppersCta"),
    },
  ];

  return (
    <div className="mt-16 grid gap-4 md:grid-cols-2">
      {panels.map((p) => (
        <Link
          key={p.key}
          href={p.href}
          className="group relative isolate block min-h-[320px] overflow-hidden rounded-3xl bg-orange-950 text-start text-white shadow-lg outline-none transition-shadow hover:shadow-2xl focus-visible:ring-4 focus-visible:ring-orange-500/60 md:min-h-[380px]"
        >
          <Image
            src={p.image}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            placeholder="blur"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />

          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-orange-300">
              {p.eyebrow}
            </p>
            <h3 className="text-2xl font-bold leading-tight drop-shadow sm:text-3xl">
              {p.title}
            </h3>
            <p className="mt-2 max-w-md text-sm text-white/85 sm:text-base">
              {p.text}
            </p>
            <span className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm transition-colors group-hover:bg-orange-600 group-hover:text-white">
              {p.cta}
              <ArrowUpRight className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
