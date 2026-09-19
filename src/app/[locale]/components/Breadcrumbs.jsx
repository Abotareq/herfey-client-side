"use client";

import { usePathname } from "@/i18n/navigation";
import { useGetProductById } from "@/service/product";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useStore } from "@/service/store";

function Breadcrumbs() {
  const pathName = usePathname();
  const t = useTranslations("breadcrumbs");

  // split path
  let pathSegments = pathName.split("/").filter((e) => e);

  // // filter out IDs (numbers or long hashes)
  // pathSegments = pathSegments.filter(
  //   (seg) => !/^\d+$/.test(seg) && !/^[a-f0-9]{10,}$/i.test(seg) // adjust regex to your case
  // );
  const entityType = pathSegments[0]; // store and product ids
  const entityId = pathSegments.length > 1 ? pathSegments[1] : null;

  // fetch the product details
  const { data: productRes } = useGetProductById(
    entityType === "products" ? entityId : null,
    {
      enabled: entityType === "products" && !!entityId,
    }
  );
  // fetch the store details
  const { data: storeRes } = useStore(
    entityType === "store" ? entityId : null,
    entityType === "store" && !!entityId
  );

  const product = productRes?.data || null;
  const store = storeRes || null;
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    let label;
    if (entityType === "products" && segment === entityId && product) {
      label = product.name;
    } else if (entityType === "store" && segment === entityId && store) {
      label = store.name;
    } else {
      label = t(segment, {
        default: segment.charAt(0).toUpperCase() + segment.slice(1),
      });
    }
    return { href, label };
  });

  return (
    <nav className="mx-auto max-w-7xl px-4 py-4 text-sm text-gray-500 md:px-8" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
        <li>
          <Link href="/" className="transition-colors hover:text-gray-900 hover:underline">
            {t("home")}
          </Link>
        </li>

        {breadcrumbs.map((crumb, index) => (
          <li key={index} className="flex items-center gap-2">
            <span aria-hidden="true" className="text-gray-300 rtl:-scale-x-100">/</span>
            {index === breadcrumbs.length - 1 ? (
              <span className="font-medium text-gray-900" aria-current="page">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="transition-colors hover:text-gray-900 hover:underline">
                {crumb.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumbs;
