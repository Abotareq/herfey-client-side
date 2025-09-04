"use client";
import React from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "use-intl";

const Footer = () => {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const t = useTranslations("Footer");
  const t2 = useTranslations("workingHours");
  const t3 = useTranslations("Terms");
  const t4 = useTranslations("Payment");

  return (
    <footer className="bg-gray-50 py-8 px-4 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-4 items-start">
          {/* Column 5: Logo and Contact Info */}
          <div className="space-y-4">
            {/* Logo */}
            <div className="mb-4">
              <div className="text-2xl font-bold text-orange-400 transition-transform duration-300 hover:scale-105">
                {t("herafy")}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-2 text-sm text-gray-700 cursor-pointer">
              <div
                className={`hover:text-orange-400 transition-transform duration-300 hover:scale-105 ${isArabic ? "text-right" : "text-left"} ${
                  isArabic ? "rtl" : ""
                }`}
              >
                {t("phone")}
              </div>
              <div className="hover:text-orange-400 transition-transform duration-300 hover:scale-105">{t("sales")}</div>
              <div className="font-semibold hover:text-orange-400 transition-transform duration-300 hover:scale-105">{t("web")}</div>
            </div>
          </div>

          {/* Column 1: Opening Hours */}
          <div className="space-y-3 cursor-pointer">
            <div className="space-y-2 text-sm text-gray-700">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex justify-between transition-colors duration-300 hover:text-orange-500"
                >
                  <span>{t2(`day${i}`)}</span>
                  <span>{t2(`time${i}`)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Terms and Links */}
          <div className="space-y-3">
            <div className="space-y-2">
              {[
                { key: "termsofuse", href: "/packging" },
                { key: "frequentQuetsions", href: "/faq" },
                { key: "contact", href: "/contact" },
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="block text-sm text-gray-700 hover:text-gray-900 transition-all duration-300 hover:translate-x-1"
                >
                  {t3(item.key)}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 3: More Links */}
          <div className="space-y-3">
            <div className="space-y-2">
              {[
                {key: "excahnge", href: '/exchange'}, 
                {key: "terms", href: '/term'},
                {key: "privacy", href: '/privacy'}
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href={item.href}
                  className="block text-sm text-gray-700 hover:text-gray-900 transition-all duration-300 hover:translate-x-1"
                >
                  {t3(item.key)}
                </Link>
              ))}
            </div>
          </div>

          {/* Column 4: Payment Methods */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {[
                { key: "visa", color: "bg-blue-600" },
                { key: "mastercard", color: "bg-red-500" },
                { key: "discover", color: "bg-orange-500" },
                { key: "paypal", color: "bg-blue-500" },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`${item.color} text-white px-3 py-1 rounded text-xs font-semibold cursor-pointer transition-transform duration-300 hover:scale-110`}
                >
                  {t4(item.key)}
                </div>
              ))}
            </div>

            {/* Social Media Icons */}
            <div className="flex gap-3 mt-4">
              {[
                { color: "text-green-500 hover:text-green-600", icon: "whatsapp" },
                { color: "text-pink-500 hover:text-pink-600", icon: "instagram" },
                { color: "text-blue-600 hover:text-blue-700", icon: "facebook" },
              ].map((item, idx) => (
                <Link
                  key={idx}
                  href="#"
                  className={`${item.color} transition-transform duration-300 hover:scale-125`}
                >
                  {/* You can keep your existing SVG icons here */}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
       <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            &copy; {t('copy')}
          </p>
        </div>
    </footer>
  );
};

export default Footer;
