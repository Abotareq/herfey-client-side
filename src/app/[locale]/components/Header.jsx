"use client";
import { Search, Heart, ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
            <div className="flex  justify-end items-center gap-2 sm:gap-3">
              <a
                href="#"
                className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.515" />
                </svg>
              </a>
              <a
                href="#"
                className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </a>
              <a
                href="#"
                className="p-1 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874

 v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                  />
                </svg>
              </a>
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
              <button className="px-2 py-1 sm:px-3 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                English
              </button>
            </div>
            {/* Logo - Mobile (sm and below) */}
            <div className="sm:hidden col-span-2 flex justify-center py-2">
              <div className="text-xl font-bold text-orange-500">
                حرفي
                <div className="w-10 h-1 bg-orange-500 mx-auto mt-1"></div>
              </div>
            </div>
            {/* Desktop Navigation */}
            <nav className="hidden sm:block">
              <div className="grid grid-cols-6 items-center py-3 sm:py-4">
                <a
                  href="#"
                  className="text-gray-700 hover:text-orange-500 transition-colors text-center text-sm sm:text-base font-medium"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-orange-500 transition-colors text-center text-sm sm:text-base font-medium"
                >
                  Articles
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-orange-500 transition-colors text-center text-sm sm:text-base font-medium"
                >
                  Categories
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-orange-500 transition-colors text-center text-sm sm:text-base font-medium"
                >
                  Contact us
                </a>
                <a
                  href="#"
                  className="text-gray-700 hover:text-orange-500 transition-colors text-center text-sm sm:text-base font-medium"
                >
                  The store
                </a>
                <div className="justify-self-end">
                  <button className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                    English
                  </button>
                </div>
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
                <a
                  href="#"
                  className="py-2 px-3 text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-colors rounded-md text-sm font-medium"
                >
                  Home
                </a>
                <a
                  href="#"
                  className="py-2 px-3 text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-colors rounded-md text-sm font-medium"
                >
                  Articles
                </a>
                <a
                  href="#"
                  className="py-2 px-3 text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-colors rounded-md text-sm font-medium"
                >
                  Categories
                </a>
                <a
                  href="#"
                  className="py-2 px-3 text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-colors rounded-md text-sm font-medium"
                >
                  Contact us
                </a>
                <a
                  href="#"
                  className="py-2 px-3 text-gray-700 hover:text-orange-500 hover:bg-orange-50 transition-colors rounded-md text-sm font-medium"
                >
                  The store
                </a>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
