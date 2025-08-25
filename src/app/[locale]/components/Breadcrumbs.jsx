'use client';

import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";

function Breadcrumbs() {
  const pathName = usePathname();
  const t = useTranslations("breadcrumbs");

  // split path
  let pathSegments = pathName.split("/").filter((e) => e);

  // filter out IDs (numbers or long hashes)
  pathSegments = pathSegments.filter(
    (seg) => !/^\d+$/.test(seg) && !/^[a-f0-9]{10,}$/i.test(seg) // adjust regex to your case
  );

  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = "/" + pathSegments.slice(0, index + 1).join("/");
    const label = t(segment, {
      default: segment.charAt(0).toUpperCase() + segment.slice(1),
    });
    return { href, label };
  });

  return (
    <nav className="text-sm text-gray-600 my-4">
      <ol className="flex items-center space-x-2">
        <li>
          <Link href="/" className="text-orange-600 hover:underline">
            {t("home")}
          </Link>
        </li>

        {breadcrumbs.map((crumb, index) => (
          <li key={index} className="flex items-center space-x-2">
            <span>{">"}</span>
            {index === breadcrumbs.length - 1 ? (
              <span className="font-medium text-gray-800">{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className="text-blue-600 hover:underline">
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
