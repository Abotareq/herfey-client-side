"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useSignOut } from "@/service/auth";
import { Search, Heart, ShoppingCart, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState(routing.defaultLocale);
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Navbar");
  const t2 = useTranslations("Herafy");
  const { mutate: signOut, isLoading } = useSignOut();

  const handleSignOut = () => {
    console.log("Signing out...");
    signOut(
      {},
      {
        onSuccess: () => {

          window.location.reload();

        },
      }
    );
  };
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
  const { user, loading } = useAuth();
  const navigation = [
    { name: "home", href: "" },
    ...(user ? [{ name: "favourite", href: "/fav" }] : []),
    { name: "categories", href: "/categories" },
    { name: "contact", href: "/contact" },
    { name: "store", href: "/store" },
    { name: "products", href: '/products' }
  ];
  const isActive = (path) => pathname === path;
  const locale = useLocale()
  const isArabic = locale === 'ar';
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Upper Section */}
      <div className="border-b border-gray-200">
        <div className="mx-auto px-2 sm:px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 items-center py-2 sm:py-3 justify-between">
            {/* Left Side - Action Icons */}
            <div className="flex justify-start items-center gap-2 sm:gap-4">
              <button className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
              {user &&
                <button className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
                  onClick={() => router.push(`/${currentLocale}/fav`)}
                >
                  <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </button>
              }
              <button onClick={() => router.push(`/${currentLocale}/cart`)}
                className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors">
                <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
            </div>
            {/* Center - Logo (Hidden on sm and below) */}
            <div className="hidden sm:flex justify-center">
              <div className="text-xl sm:text-2xl font-bold text-orange-500 cursor-pointer" onClick={() => router.push(`/${currentLocale}`)}>
                {t2("herafy")}
                <div className="w-10 sm:w-12 h-1 bg-orange-500 mx-auto mt-1"></div>
              </div>
            </div>

            {/* Right Side - Social Media Icons */}
            <div className='flex justify-end gap-2 max-w-full sm:gap-3'>
              <select
                onChange={(e) => handleLocaleChange(e.target.value)}
                value={currentLocale}
                className="appearance-none bg-orange-500 border rounded-md px-4 py-2 pr-8 text-white cursor-pointer shadow-sm hover:border-orange-500 "
              >
                {routing.locales.map((locale) => (
                  <option key={locale} value={locale} >
                    {locale.toUpperCase()}
                  </option>
                ))}
              </select>
              {!user && !loading && (

                <Link
                  href={`/${currentLocale}/signin`}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${isActive(`/${currentLocale}/signin`)
                      ? "bg-orange-600 text-white"
                      : "text-gray-700 hover:bg-orange-100 hover:text-orange-600"
                    }`}
                >
                  {t("signin")}
                </Link>
              )}
              {user && !loading && (
                <div className="flex flex-start max-w-fit ">
                  <button
                    onClick={handleSignOut}
                    disabled={isLoading}
                    className={`cursor-pointer px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 max-w-fit text-gray-700 hover:bg-red-600 hover:text-white ${isLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                  >
                    {isLoading ? t("signing") : t("signout")}
                  </button>
                </div>
              )}
              {user && !loading && <Link
                href={`/${currentLocale}/customer-profile`}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 max-w-fit`}
              >
                <Image src="/1.10.svg" alt="customer" width={20} height={20} />
              </Link>}
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
              <div className="text-xl font-bold text-orange-500 cursor-pointer" onClick={() => router.push(`/${currentLocale}`)}>
                {t2("herafy")}
                <div className="w-10 h-1 bg-orange-500 mx-auto mt-1"></div>
              </div>
            </div>
            {/* Desktop Navigation */}

            <nav className="hidden sm:block">
              <div className="flex items-center justify-between mx-40 ">
                {/* Nav items */}
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={`/${currentLocale}${item.href}`}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${isActive(`/${currentLocale}${item.href}`)
                        ? "bg-orange-600 text-white"
                        : "text-gray-700 hover:bg-orange-500 hover:text-white"
                      }`}
                  >
                    {t(item.name)}
                  </Link>
                ))}

                {/* Language Switcher */}

              </div>
            </nav>
          </div>

          {/* Mobile Navigation Menu */}
          <div
            className={`sm:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
              } overflow-hidden`}
          >
            <nav className="py-3 border-t border-gray-200">
              <div className="grid grid-cols-1 gap-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={`/${currentLocale}${item.href}`}
                    className={`py-2 px-3 rounded-md text-sm font-medium transition-colors ${isActive(`/${currentLocale}${item.href}`)
                        ? "bg-orange-600 text-white"
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
