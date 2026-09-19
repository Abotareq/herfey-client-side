"use client";
import { useAuth } from "@/app/context/AuthContext";
import { useSignOut } from "@/service/auth";
import { Heart, ShoppingBag, UserRound } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { routing } from "@/i18n/routing";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useCartCount, useWishlistCount } from "@/hooks/useNavCounts";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentLocale, setCurrentLocale] = useState(routing.defaultLocale);
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Navbar");
  const t2 = useTranslations("Herafy");
  const { mutate: signOut, isLoading } = useSignOut();
  const cartCount = useCartCount();
  const wishlistCount = useWishlistCount();
  const { user, loading } = useAuth();

  const handleSignOut = () => {
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
    setIsMenuOpen(false);
  }, [pathname]);

  const handleLocaleChange = (newLocale) => {
    const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "");
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  const navigation = [
    { name: "home", href: "" },
    { name: "categories", href: "/categories" },
    { name: "products", href: "/products" },
    { name: "store", href: "/store" },
    { name: "contact", href: "/contact" },
  ];
  const isActive = (path) => pathname === path;

  const iconButton =
    "relative grid h-10 w-10 place-items-center rounded-full text-gray-700 transition duration-300 ease-out-soft hover:bg-gray-900/5 hover:text-gray-900 active:scale-95";

  return (
    <header className="sticky top-0 z-40 border-b border-gray-900/8 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 md:px-8">
        {/* mobile: menu button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-expanded={isMenuOpen}
          aria-controls="site-menu"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className={`${iconButton} md:hidden`}
        >
          <span className="relative block h-3.5 w-5" aria-hidden="true">
            <span
              className={`absolute inset-x-0 top-0 h-0.5 rounded-full bg-current transition duration-300 ease-out-soft ${
                isMenuOpen ? "translate-y-1.5 rotate-45" : ""
              }`}
            />
            <span
              className={`absolute inset-x-0 top-1.5 h-0.5 rounded-full bg-current transition duration-200 ${
                isMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-current transition duration-300 ease-out-soft ${
                isMenuOpen ? "-translate-y-1.5 -rotate-45" : ""
              }`}
            />
          </span>
        </button>

        {/* wordmark */}
        <Link
          href={`/${currentLocale}`}
          className="font-display text-2xl text-orange-700 transition-colors hover:text-orange-800 md:text-[1.75rem]"
          aria-label={t2("herafy")}
        >
          {t2("herafy")}
        </Link>

        {/* primary nav */}
        <nav className="ms-6 hidden md:flex md:items-center md:gap-1" aria-label="Primary">
          {navigation.map((item) => {
            const active = isActive(`/${currentLocale}${item.href}`);
            return (
              <Link
                key={item.name}
                href={`/${currentLocale}${item.href}`}
                aria-current={active ? "page" : undefined}
                className={`relative rounded-full px-3.5 py-2 text-sm font-medium transition duration-300 ease-out-soft after:absolute after:inset-x-3.5 after:-bottom-px after:h-0.5 after:origin-center after:scale-x-0 after:rounded-full after:bg-orange-600 after:transition-transform after:duration-300 after:ease-out-soft hover:text-gray-900 ${
                  active
                    ? "text-gray-900 after:scale-x-100"
                    : "text-gray-600 hover:after:scale-x-100"
                }`}
              >
                {t(item.name)}
              </Link>
            );
          })}
        </nav>

        {/* actions */}
        <div className="ms-auto flex items-center gap-1">
          {/* language: a two-way switch, not a select */}
          <div
            className="me-1 hidden items-center rounded-full bg-gray-900/5 p-0.5 text-xs font-semibold sm:flex"
            role="group"
            aria-label="Language"
          >
            {routing.locales.map((locale) => (
              <button
                key={locale}
                type="button"
                onClick={() => handleLocaleChange(locale)}
                aria-pressed={locale === currentLocale}
                className={`rounded-full px-2.5 py-1.5 transition duration-300 ease-out-soft ${
                  locale === currentLocale
                    ? "bg-white text-gray-900 shadow-xs"
                    : "text-gray-500 hover:text-gray-900"
                }`}
              >
                {locale.toUpperCase()}
              </button>
            ))}
          </div>

          {user && (
            <button
              type="button"
              className={iconButton}
              onClick={() => router.push(`/${currentLocale}/fav`)}
              aria-label={`${t("favourite")}, ${wishlistCount}`}
            >
              <Heart
                className={`h-5 w-5 transition-colors ${
                  wishlistCount > 0 ? "fill-orange-600 text-orange-600" : ""
                }`}
                strokeWidth={1.75}
              />
              {wishlistCount > 0 && <CountBadge count={wishlistCount} />}
            </button>
          )}

          <button
            type="button"
            className={iconButton}
            onClick={() => router.push(`/${currentLocale}/cart`)}
            aria-label={`Cart, ${cartCount} items`}
          >
            <ShoppingBag className="h-5 w-5" strokeWidth={1.75} />
            {cartCount > 0 && <CountBadge count={cartCount} />}
          </button>

          {!user && !loading && (
            <Link
              href={`/${currentLocale}/signin`}
              className="btn btn-sm btn-primary ms-1 hidden sm:inline-flex"
            >
              {t("signin")}
            </Link>
          )}

          {user && !loading && (
            <>
              <Link
                href={`/${currentLocale}/customer-profile`}
                className={iconButton}
                aria-label="Account"
              >
                <UserRound className="h-5 w-5" strokeWidth={1.75} />
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isLoading}
                className="btn btn-sm btn-ghost hidden sm:inline-flex"
              >
                {isLoading ? t("signing") : t("signout")}
              </button>
            </>
          )}
        </div>
      </div>

      {/* mobile menu */}
      <div
        id="site-menu"
        className={`grid transition-[grid-template-rows] duration-400 ease-out-soft md:hidden ${
          isMenuOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <nav
            className="border-t border-gray-900/8 px-4 pb-5 pt-3"
            aria-label="Primary"
          >
            {navigation.map((item, i) => {
              const active = isActive(`/${currentLocale}${item.href}`);
              return (
                <Link
                  key={item.name}
                  href={`/${currentLocale}${item.href}`}
                  aria-current={active ? "page" : undefined}
                  style={{ transitionDelay: isMenuOpen ? `${60 + i * 40}ms` : "0ms" }}
                  className={`block rounded-xl px-3 py-3 text-lg transition duration-400 ease-out-soft ${
                    isMenuOpen ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
                  } ${active ? "font-display text-orange-700" : "text-gray-800 hover:bg-gray-900/5"}`}
                >
                  {t(item.name)}
                </Link>
              );
            })}

            <div className="mt-3 flex items-center justify-between gap-3 border-t border-gray-900/8 pt-4">
              <div
                className="flex items-center rounded-full bg-gray-900/5 p-0.5 text-xs font-semibold"
                role="group"
                aria-label="Language"
              >
                {routing.locales.map((locale) => (
                  <button
                    key={locale}
                    type="button"
                    onClick={() => handleLocaleChange(locale)}
                    aria-pressed={locale === currentLocale}
                    className={`rounded-full px-3 py-1.5 transition duration-300 ${
                      locale === currentLocale
                        ? "bg-white text-gray-900 shadow-xs"
                        : "text-gray-500"
                    }`}
                  >
                    {locale.toUpperCase()}
                  </button>
                ))}
              </div>
              {!user && !loading && (
                <Link href={`/${currentLocale}/signin`} className="btn btn-sm btn-primary">
                  {t("signin")}
                </Link>
              )}
              {user && !loading && (
                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="btn btn-sm btn-secondary"
                >
                  {isLoading ? t("signing") : t("signout")}
                </button>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}

// small count in the icon's corner
function CountBadge({ count }) {
  return (
    <span
      className="absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-bold leading-none tabular-nums text-white ring-2 ring-background"
      aria-hidden="true"
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
