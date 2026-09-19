"use client";
import {
  BadgePercent,
  ShieldCheck,
  RotateCcw,
  Headset,
  Truck,
} from "lucide-react";
import { useTranslations } from "next-intl";

// The promises strip: five short reasons to trust the shop, read as one
// line across the page rather than five boxes.
function Services() {
  const t = useTranslations("Services");
  const services = [
    { title: t("t1"), desc: t("desc1"), icon: BadgePercent },
    { title: t("t2"), desc: t("desc2"), icon: ShieldCheck },
    { title: t("t3"), desc: t("desc3"), icon: RotateCcw },
    { title: t("t4"), desc: t("desc4"), icon: Headset },
    { title: t("t5"), desc: t("desc5"), icon: Truck },
  ];
  return (
    <section className="px-4 py-16 md:px-8 md:py-20" aria-label={t("t4")}>
      <ul className="mx-auto grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-5 lg:divide-x lg:divide-gray-900/8">
        {services.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.title} className="lg:px-6 lg:first:ps-0 lg:last:pe-0">
              <Icon
                className="h-6 w-6 text-orange-600"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <h3 className="mt-4 text-base font-semibold text-gray-900">
                {item.title}
              </h3>
              <p className="mt-1.5 max-w-[28ch] text-sm leading-relaxed text-gray-600">
                {item.desc}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default Services;
