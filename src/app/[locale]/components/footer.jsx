"use client";
import React from "react";
import Link from "next/link";
import { useTranslations } from "use-intl";

const Footer = () => {
  const t = useTranslations("Footer");
  const t2 = useTranslations("workingHours");
  const t3 = useTranslations("Terms");
  const t4 = useTranslations("Payment");

  const help = [
    { key: "frequentQuetsions", href: "/faq" },
    { key: "contact", href: "/contact" },
    { key: "excahnge", href: "/exchange" },
  ];
  const legal = [
    { key: "termsofuse", href: "/packging" },
    { key: "terms", href: "/term" },
    { key: "privacy", href: "/privacy" },
  ];
  const linkClass =
    "inline-block py-1 text-sm text-gray-600 transition-colors duration-300 hover:text-gray-900 hover:underline";

  return (
    <footer className="border-t border-gray-900/8 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-16 md:px-8">
        <div className="grid gap-12 md:grid-cols-12">
          {/* wordmark + contact */}
          <div className="md:col-span-5">
            <p className="font-display text-3xl text-orange-700">{t("herafy")}</p>
            <address className="mt-5 space-y-1.5 text-sm not-italic text-gray-600">
              <p dir="ltr" className="text-start tabular-nums">
                {t("phone")}
              </p>
              <p>
                <a href={`mailto:${t("email")}`} className="inline-block py-1 hover:text-gray-900 hover:underline">
                  {t("email")}
                </a>
              </p>
              <p className="font-medium text-gray-900">{t("web")}</p>
            </address>
          </div>

          {/* hours */}
          <dl className="space-y-2 text-sm md:col-span-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-baseline justify-between gap-4">
                <dt className="text-gray-600">{t2(`day${i}`)}</dt>
                <dd dir="ltr" className="tabular-nums text-gray-900">
                  {t2(`time${i}`)}
                </dd>
              </div>
            ))}
          </dl>

          {/* help + legal */}
          <ul className="space-y-2 md:col-span-2">
            {help.map((item) => (
              <li key={item.key}>
                <Link href={item.href} className={linkClass}>
                  {t3(item.key)}
                </Link>
              </li>
            ))}
          </ul>
          <ul className="space-y-2 md:col-span-2">
            {legal.map((item) => (
              <li key={item.key}>
                <Link href={item.href} className={linkClass}>
                  {t3(item.key)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-gray-900/8 pt-6">
          <p className="text-sm text-gray-500">&copy; {t("copy")}</p>
          <ul className="flex flex-wrap gap-2" aria-label="Payment methods">
            {["visa", "mastercard", "discover", "paypal"].map((key) => (
              <li
                key={key}
                className="rounded-md bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-gray-600 ring-1 ring-gray-900/10 ring-inset"
              >
                {t4(key)}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
