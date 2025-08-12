"use client";
import { Search, Heart, ShoppingCart, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState(routing.defaultLocale);
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Navbar");

  useEffect(() => {
    const pathLocale = pathname?.split("/")[1];
    if (routing.locales.includes(pathLocale)) {
      setCurrentLocale(pathLocale);
    }
  }, [pathname]);

  const handleLocaleChange = (newLocale) => {
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "");
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  const navigation = [
    { name: "home", href: "" },
    { name: "articles", href: "/articles" },
    { name: "categories", href: "/categories" },
    { name: "contact", href: "/contact" },
    { name: "store", href: "/store" },
  ];

  const isActive = (path) => pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Upper Section */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-3 items-center py-2 sm:py-3">
            {/* Left Side - Action Icons */}
            <div className="flex justify-start items-center gap-2 sm:gap-4">
              <button className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
              <button className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
              <button className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
            </div>
            {/* Center - Logo (Hidden on sm and below) */}
            <div className="hidden sm:flex justify-center">
              <div className="text-xl sm:text-2xl font-bold text-orange-500">
                حرفي
                <div className="w-10 sm:w-12 h-1 bg-orange-500 mx-auto mt-1"></div>
              </div>
            </div>
            {/* Right Side - Social Media Icons */}
            <div className="flex justify-end items-center gap-2 sm:gap-3">
              {/* Social icons here */}
            </div>
          </div>
        </div>
      </div>

      {/* Lower Section - Navigation */}
      <div className="bg-white">
        <div className="container mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-2 sm:grid-cols-1 items-center py-2 sm:py-4">
            {/* Mobile Menu Button */}
            <div className="sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-1 sm:p-2 hover:bg-gray-100 rounded-md transition-colors"
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                ) : (
                  <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                )}
              </button>
            </div>
            {/* Language Selector - Mobile */}
            <div className="sm:hidden justify-self-end">
              <select
                onChange={(e) => handleLocaleChange(e.target.value)}
                value={currentLocale}
                className="px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {routing.locales.map((locale) => (
                  <option key={locale} value={locale}>
                    {locale.toUpperCase()}
                  </option>
                ))}
              </select>
            </div>
            {/* Logo - Mobile */}
            <div className="sm:hidden col-span-2 flex justify-center py-2">
              <div className="text-xl font-bold text-orange-500">
                حرفي
                <div className="w-10 h-1 bg-orange-500 mx-auto mt-1"></div>
              </div>
            </div>
            {/* Desktop Navigation */}
            
            <nav className="hidden md:block">
              <div className="flex items-center justify-between space-x-4">
                {/* Nav items */}
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={`/${currentLocale}${item.href}`}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                      isActive(`/${currentLocale}${item.href}`)
                        ? "bg-emerald-600 text-white"
                        : "text-gray-700 hover:bg-emerald-100 hover:text-emerald-600"
                    }`}
                  >
                    {t(item.name)}
                  </Link>
                ))}

                {/* Language Switcher */}
                <select
                  onChange={(e) => handleLocaleChange(e.target.value)}
                  value={currentLocale}
                  className="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 text-black cursor-pointer shadow-sm hover:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  {routing.locales.map((locale) => (
                    <option key={locale} value={locale}>
                      {locale.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </nav>

          </div>

          {/* Mobile Navigation Menu */}
          <div
            className={`sm:hidden transition-all duration-300 ease-in-out ${
              isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            <nav className="py-3 border-t border-gray-200">
              <div className="grid grid-cols-1 gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={`/${currentLocale}${item.href}`}
                    className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                      isActive(`/${currentLocale}${item.href}`)
                        ? "bg-emerald-600 text-white"
                        : "text-gray-700 hover:bg-emerald-100 hover:text-emerald-600"
                    }`}
                  >
                    {t(item.name)}
                  </Link>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
