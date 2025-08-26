"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useSignOut } from "@/service/auth";
import { Search, Heart, ShoppingCart, Menu, X, User, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState(routing.defaultLocale);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
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
    setIsUserMenuOpen(false);
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
  const locale = useLocale();
  const isArabic = locale === 'ar';

  return (
    <header className="my-5 sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Left Section - Logo */}
          <div className="flex items-center flex-shrink-0">
            <div 
              className="cursor-pointer group"
              onClick={() => router.push(`/${currentLocale}`)}
            >
              <div className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                {t2("herafy")}
              </div>
              <div className="w-12 lg:w-16 h-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mt-1 group-hover:scale-110 transition-transform duration-300"></div>
            </div>
          </div>

          {/* Center Section - Navigation (Desktop) */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={`/${currentLocale}${item.href}`}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  isActive(`/${currentLocale}${item.href}`)
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-200"
                    : "text-gray-700 hover:bg-gray-50 hover:text-orange-600"
                }`}
              >
                {t(item.name)}
              </Link>
            ))}
          </nav>

          {/* Right Section - Actions */}
          <div className="flex items-center space-x-2 lg:space-x-4">
            
            {/* Action Icons */}
            <div className="flex items-center space-x-1 lg:space-x-2">
              <button className="p-2 lg:p-2.5 hover:bg-gray-50 rounded-xl transition-all duration-300 hover:scale-110 group">
                <Search className="w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors" />
              </button>
              
              {user && (
                <button 
                  className="p-2 lg:p-2.5 hover:bg-gray-50 rounded-xl transition-all duration-300 hover:scale-110 group relative"
                  onClick={() => router.push(`/${currentLocale}/fav`)}
                >
                  <Heart className="w-5 h-5 text-gray-600 group-hover:text-red-500 transition-colors" />
                </button>
              )}
              
              <button 
                onClick={() => router.push(`/${currentLocale}/cart`)}
                className="p-2 lg:p-2.5 hover:bg-gray-50 rounded-xl transition-all duration-300 hover:scale-110 group relative"
              >
                <ShoppingCart className="w-5 h-5 text-gray-600 group-hover:text-orange-600 transition-colors" />
                {/* Cart badge could go here */}
              </button>
            </div>

            {/* Language Selector */}
            <div className="relative">
              <select
                onChange={(e) => handleLocaleChange(e.target.value)}
                value={currentLocale}
                className="appearance-none bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-2 pr-8 rounded-xl text-sm font-medium cursor-pointer hover:from-orange-600 hover:to-orange-700 transition-all duration-300 shadow-lg shadow-orange-200"
              >
                {routing.locales.map((locale) => (
                  <option key={locale} value={locale} className="bg-white text-gray-900">
                    {locale.toUpperCase()}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white pointer-events-none" />
            </div>

            {/* User Section */}
            {!user && !loading && (
              <Link
                href={`/${currentLocale}/signin`}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-900 text-white hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                {t("signin")}
              </Link>
            )}

            {user && !loading && (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-50 transition-all duration-300 group"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown */}
                <div className={`absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 transition-all duration-300 ${
                  isUserMenuOpen ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
                }`}>
                  <div className="p-2">
                    <Link
                      href={`/${currentLocale}/customer-profile`}
                      className="flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors group"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4 text-gray-600 group-hover:text-orange-600" />
                      <span className="text-sm font-medium text-gray-700 group-hover:text-orange-600">Profile</span>
                    </Link>
                    <button
                      onClick={handleSignOut}
                      disabled={isLoading}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl hover:bg-red-50 transition-colors group ${
                        isLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    >
                      <div className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-200">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-red-600">
                        {isLoading ? t("signing") : t("signout")}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-gray-50 rounded-xl transition-all duration-300"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`lg:hidden transition-all duration-500 ease-in-out ${
          isMenuOpen ? "max-h-96 opacity-100 pb-6" : "max-h-0 opacity-0 pb-0"
        } overflow-hidden`}>
          <div className="pt-4 border-t border-gray-100">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={`/${currentLocale}${item.href}`}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive(`/${currentLocale}${item.href}`)
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-50 hover:text-orange-600 hover:translate-x-2"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t(item.name)}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Click outside to close dropdowns */}
      {(isMenuOpen || isUserMenuOpen) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setIsMenuOpen(false);
            setIsUserMenuOpen(false);
          }}
        />
      )}
    </header>
  );
}