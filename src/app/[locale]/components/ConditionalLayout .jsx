"use client";
import { usePathname } from "next/navigation";
// import Header from "./Header";
import Header from "./Navbar";
import Footer from "./footer";

export default function ConditionalLayout({ locale, children }) {
  const pathname = usePathname();
  
  const excludedRoutes = [
    `/${locale}/signin`,
    `/${locale}/signup`,
    `/${locale}/vendor-profile`,
    // Add other routes as needed
  ];
  
  const showHeaderFooter = !excludedRoutes.includes(pathname);
  
  return (
    <>
      {showHeaderFooter && <Header />}
      <div className="min-h-screen">
        {children}
      </div>
      {showHeaderFooter && <Footer />}
    </>
  );
}