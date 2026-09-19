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
    <div className="mt-20 grid gap-4 md:grid-cols-2 md:gap-6">
      {panels.map((p) => (
        <Link
          key={p.key}
          href={p.href}
          className="group relative isolate block min-h-[340px] overflow-hidden rounded-[2rem] bg-orange-950 text-start text-white shadow-md outline-none transition duration-500 ease-out-soft hover:shadow-2xl focus-visible:ring-4 focus-visible:ring-orange-500/60 md:min-h-[420px]"
        >
          <Image
            src={p.image}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            placeholder="blur"
            className="object-cover transition-transform duration-700 ease-out-soft group-hover:scale-[1.04]"
          />
          <div className="bg-orange-600 absolute inset-0" />

          <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
            <h3 className="font-display text-3xl leading-tight sm:text-4xl">
              {p.title}
            </h3>
            <p className="mt-3 max-w-md text-sm text-orange-50/90 sm:text-base">
              {p.text}
            </p>
            <span className="btn btn-on-dark mt-6">
              {p.cta}
              <span className="btn-disc" aria-hidden="true">
                <ArrowUpRight />
              </span>
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
