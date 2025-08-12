import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gray-50 py-8 px-4 border-t border-gray-200">
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 mb-4 items-start">
          {/* Column 5: Logo and Contact Info */}
          <div className="space-y-4">
            {/* Logo */}
            <div className="mb-4">
              <div className="text-2xl font-bold text-orange-400">حرفي</div>
            </div>

            {/* Contact Information */}
            <div className="space-y-2 text-sm text-gray-700">
              <div>01507975526+ / 01507975527+</div>
              <div>info@herafy.net</div>
              <div>support@herafy.net</div>
              <div>sales@herafy.net</div>
              <div className="font-semibold">herafy.net</div>
            </div>

            {/* Social Media Icons */}
          </div>
          {/* Column 1: Opening Hours */}
          <div className="space-y-3">
            <div className="space-y-2 text-sm text-gray-700">
              <div className="flex justify-between">
                <span>18:00 - 09:00</span>
                <span>Sunday-Thursday</span>
              </div>
              <div className="flex justify-between">
                <span>18:00 - 13:00</span>
                <span>Friday</span>
              </div>
              <div className="flex justify-between">
                <span>18:00 - 10:00</span>
                <span>Saturday</span>
              </div>
            </div>
          </div>

          {/* Column 2: Terms and Links */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Link
                href="/terms"
                className="block text-sm text-gray-700 hover:text-gray-900"
              >
                Terms of Sale and Packaging
              </Link>
              <Link
                href="/faq"
                className="block text-sm text-gray-700 hover:text-gray-900"
              >
                Frequently Asked Questions
              </Link>
              <Link
                href="/contact"
                className="block text-sm text-gray-700 hover:text-gray-900"
              >
                Contact us
              </Link>
            </div>
          </div>

          {/* Column 3: More Links */}
          <div className="space-y-3">
            <div className="space-y-2">
              <Link
                href="/faq"
                className="block text-sm text-gray-700 hover:text-gray-900"
              >
                Frequently Asked Questions
              </Link>
              <Link
                href="/return-policy"
                className="block text-sm text-gray-700 hover:text-gray-900"
              >
                Exchange and Return Policy
              </Link>
              <Link
                href="/terms-conditions"
                className="block text-sm text-gray-700 hover:text-gray-900"
              >
                terms and conditions
              </Link>
              <Link
                href="/privacy"
                className="block text-sm text-gray-700 hover:text-gray-900"
              >
                privacy policy
              </Link>
            </div>
          </div>

          {/* Column 4: Payment Methods */}
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {/* Visa */}
              <div className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-semibold">
                VISA
              </div>
              {/* Mastercard */}
              <div className="bg-red-500 text-white px-3 py-1 rounded text-xs font-semibold">
                MC
              </div>
              {/* Discover */}
              <div className="bg-orange-500 text-white px-3 py-1 rounded text-xs font-semibold">
                DISCOVER
              </div>
              {/* PayPal */}
              <div className="bg-blue-500 text-white px-3 py-1 rounded text-xs font-semibold flex items-center gap-1">
                <svg
                  className="w-3 h-3"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106zm14.146-14.42a.16.16 0 0 0-.1-.04.16.16 0 0 0-.153.12c-.943 4.814-4.17 6.335-8.18 6.335h-2.19c-.524 0-.968.382-1.05.9L8.43 20.338a.641.641 0 0 0 .633.74h4.606c.524 0 .968-.382 1.05-.9l.442-2.797h1.901c3.681 0 6.551-1.293 7.389-5.464z" />
                </svg>
                PayPal
              </div>
            </div>
            <div className="flex gap-3 mt-4">
              {/* WhatsApp */}
              <Link href="#" className="text-green-500 hover:text-green-600">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.891 3.488" />
                </svg>
              </Link>
              {/* Instagram */}
              <Link href="#" className="text-pink-500 hover:text-pink-600">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </Link>
              {/* Facebook */}
              <Link href="#" className="text-blue-600 hover:text-blue-700">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
