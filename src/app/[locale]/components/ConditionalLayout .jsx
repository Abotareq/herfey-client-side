"use client";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import Footer from "./footer";
import Nav from "./Header";

// Sections of the site that stand on their own, without the storefront
// header and footer. Matched by prefix so nested pages are covered too.
const BARE_SECTIONS = ["/signin", "/signup", "/vendor-profile"];

export default function ConditionalLayout({ locale, children }) {
  const pathname = usePathname();
  const { user } = useAuth();

  // Drop the locale prefix and any trailing slash: "/en/vendor-profile/orders/1" -> "/vendor-profile/orders/1"
  const route = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), "").replace(/\/+$/, "") || "/";
  const inBareSection = BARE_SECTIONS.some(
    (section) => route === section || route.startsWith(`${section}/`)
  );

  // Vendors only ever see their own dashboard; RouteGuard sends them there,
  // but never show the storefront chrome in the meantime.
  const isVendor = user?.role === "VENDOR";

  const showHeaderFooter = !inBareSection && !isVendor;

  return (
    <>
      {showHeaderFooter && <Nav />}
      <div className="min-h-screen">{children}</div>
      {showHeaderFooter && <Footer />}
    </>
  );
}
