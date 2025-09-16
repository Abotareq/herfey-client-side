"use client";
import { usePathname } from "next/navigation";
// import Header from "./Header";
import Header from "./Navbar";
import Footer from "./footer";
import Nav from"./Header";
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
      {showHeaderFooter && <Nav />}
      <div className="min-h-screen">
        {children}
      </div>
      {showHeaderFooter && <Footer />}
    </>
  );
}