"use client";
import { useGetAllProducts } from "@/service/product.js";
import { useFilterReviewsByStore } from "@/service/reviewService";
import { useEffect, useState } from "react";

// Store Details View Component
export default function StoreDetailsView({ store, onClose, onEdit }) {
  const [activeSection, setActiveSection] = useState("overview");

  const sections = [
    {
      id: "overview",
      label: "Overview",
      icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z",
    },
    {
      id: "products",
      label: "Products",
      icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    },
    {
      id: "reviews",
      label: "Reviews",
      icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
    },
  ];

  // Mock data for demo purposes
  const mockStore = {
    name: "Ahmed's Books & Stationery",
    description: "Your trusted local bookstore in Sohag",
    logoUrl:
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=100&h=100&fit=crop&crop=center",
    status: "approved",
    slug: "ahmeds-books-stationery",
    updatedAt: "2025-08-18T10:30:00Z",
    _id: "66c1234567890abcdef12345",
    productCount: 156,
    ordersCount: 89,
    categorieCount: 12,
    couponsUsed: 5,
    address: {
      street: "15 El-Mahatta Street, Downtown",
      city: "sohag",
      postalCode: "82511",
    },
    policies: {
      shipping:
        "Free shipping on orders over EGP 200. Standard delivery takes 2-3 business days within Sohag.",
      returns:
        "30-day return policy for books in original condition. Educational materials are non-returnable.",
    },
  };
  const currentStore = store || mockStore;
  
  // API calls
  const { data: productsRes, isLoading: productsLoading } = useGetAllProducts({
    storeId: currentStore?._id,
  });
  
  const { data: reviewsRes, isLoading: reviewsLoading } = useFilterReviewsByStore(
    currentStore?._id,
    1,
    20
  );
  console.log(" review is " , reviewsRes);
  const averageRating = reviewsRes?.data.review.reduce((acc, curr) => acc + curr.rating, 0) / reviewsRes?.data.review.length;
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-4 h-4 ${
          index < rating ? "text-orange-400" : "text-gray-300"
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Hero Header */}
        <div className="relative h-48 bg-gradient-to-r from-orange-500 via-orange-600 to-red-600 overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-4 right-4">
            <button
              onClick={onClose}
              className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="absolute bottom-6 left-8 flex items-end gap-4">
            <div className="w-24 h-24 bg-white rounded-2xl shadow-lg border-4 border-white overflow-hidden transform transition-all duration-500 hover:scale-110">
              <img
                src={
                  currentStore?.logoUrl ||
                  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=100&fit=crop&crop=center"
                }
                alt={currentStore?.name}
                className="w-full h-full object-cover"
                width={100}
                height={100}
                onError={() => {
                  return "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=100&h=100&fit=crop&crop=center";
                }}
              />
            </div>
            <div className="text-white pb-2">
              <h2 className="text-3xl font-bold mb-1">{currentStore?.name}</h2>
              <p className="text-white/80 text-lg">
                {currentStore?.description}
              </p>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(90vh-240px)]">
          {/* Navigation Sidebar */}
          <div className="w-56 bg-gray-50 border-r border-gray-200 p-4">
            <div className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    activeSection === section.id
                      ? "bg-orange-600 text-white shadow-lg"
                      : "text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-md"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d={section.icon}
                    />
                  </svg>
                  <span className="font-medium">{section.label}</span>
                </button>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-gray-200">
              <button
                onClick={() => onEdit && onEdit(currentStore)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all duration-300 transform hover:scale-105"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span className="font-medium">Edit Store</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            {activeSection === "overview" && (
              <div className="p-8 space-y-8">
                {/* Store Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {[
                    {
                      label: "Total Products",
                      value: currentStore?.productCount || 0,
                      color: "orange",
                      icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
                    },
                    {
                      label: "Total Orders",
                      value: currentStore?.ordersCount || 0,
                      color: "red",
                      icon: "M16 11V7a4 4 0 00-8 0v4M8 11v6a2 2 0 002 2h4a2 2 0 002-2v-6M8 11h8",
                    },
                    {
                      label: "Categories",
                      value: currentStore?.categorieCount || 0,
                      color: "yellow",
                      icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10",
                    },
                    {
                      label: "Coupons Used",
                      value: currentStore?.couponsUsed || 0,
                      color: "orange",
                      icon: "M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z",
                    },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className={`bg-gradient-to-br ${
                        stat.color === 'orange' ? 'from-orange-50 to-orange-100' :
                        stat.color === 'red' ? 'from-red-50 to-red-100' :
                        stat.color === 'yellow' ? 'from-yellow-50 to-yellow-100' :
                        'from-orange-50 to-orange-100'
                      } rounded-2xl p-6 transform transition-all duration-500 hover:scale-105 hover:shadow-lg`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className={`${
                            stat.color === 'orange' ? 'text-orange-600' :
                            stat.color === 'red' ? 'text-red-600' :
                            stat.color === 'yellow' ? 'text-yellow-600' :
                            'text-orange-600'
                          } text-sm font-semibold uppercase tracking-wide`}>
                            {stat.label}
                          </p>
                          <p className="text-3xl font-bold text-gray-900">
                            {stat.value}
                          </p>
                        </div>
                        <div
                          className={`w-12 h-12 ${
                            stat.color === 'orange' ? 'bg-orange-600' :
                            stat.color === 'red' ? 'bg-red-600' :
                            stat.color === 'yellow' ? 'bg-yellow-600' :
                            'bg-orange-600'
                          } rounded-2xl flex items-center justify-center`}
                        >
                          <svg
                            className="w-6 h-6 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d={stat.icon}
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Store Information */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <svg
                        className="w-6 h-6 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Store Information
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">
                          Status
                        </span>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                            currentStore?.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : currentStore?.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : currentStore?.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${
                              currentStore?.status === "approved"
                                ? "bg-green-500"
                                : currentStore?.status === "pending"
                                ? "bg-yellow-500 animate-pulse"
                                : currentStore?.status === "rejected"
                                ? "bg-red-500"
                                : "bg-gray-500"
                            }`}
                          ></div>
                          {currentStore?.status?.charAt(0).toUpperCase() +
                            currentStore?.status?.slice(1)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">
                          Store Slug
                        </span>
                        <span className="text-gray-900 font-mono text-sm bg-gray-50 px-2 py-1 rounded">
                          {currentStore?.slug}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <span className="text-gray-600 font-medium">
                          Last Updated
                        </span>
                        <span className="text-gray-900">
                          {formatDate(currentStore?.updatedAt)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-3">
                        <span className="text-gray-600 font-medium">
                          Store ID
                        </span>
                        <span className="text-gray-900 font-mono text-sm">
                          {currentStore?._id?.slice(-8)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                      <svg
                        className="w-6 h-6 text-orange-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                      </svg>
                      Location & Address
                    </h3>
                    <div className="space-y-4">
                      <div className="p-4 bg-orange-50 rounded-xl">
                        <div className="flex items-start gap-3">
                          <svg
                            className="w-5 h-5 text-orange-600 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                          </svg>
                          <div>
                            <p className="font-semibold text-gray-900">
                              Street Address
                            </p>
                            <p className="text-gray-700">
                              {currentStore?.address?.street}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-orange-50 rounded-xl">
                          <p className="font-semibold text-gray-900 mb-1">
                            City
                          </p>
                          <p className="text-gray-700 capitalize">
                            {currentStore?.address?.city}
                          </p>
                        </div>
                        <div className="p-4 bg-red-50 rounded-xl">
                          <p className="font-semibold text-gray-900 mb-1">
                            Postal Code
                          </p>
                          <p className="text-gray-700">
                            {currentStore?.address?.postalCode}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Store Policies */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <svg
                      className="w-6 h-6 text-orange-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                    Store Policies
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-orange-50 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Shipping Policy
                          </h4>
                          <p className="text-gray-700">
                            {currentStore?.policies?.shipping}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-red-50 rounded-xl">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 10h10a8 8 0 018 8v2M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m6 0l-5 5-3-3"
                            />
                          </svg>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Return Policy
                          </h4>
                          <p className="text-gray-700">
                            {currentStore?.policies?.returns}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "products" && (
              <div className="flex-1 overflow-y-auto p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Store Products
                  </h3>
                  <span className="text-sm text-gray-600">
                    Showing{" "}
                    {Array.isArray(productsRes?.products)
                      ? productsRes.products.length
                      : 0}{" "}
                    products
                  </span>
                </div>

                {productsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                  </div>
                ) : Array.isArray(productsRes?.products) &&
                  productsRes.products.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {productsRes.products.map((product) => {
                      // Calculate current price based on discount
                      const now = new Date();
                      const isDiscountActive =
                        product.discountPrice > 0 &&
                        product.discountStart &&
                        product.discountEnd &&
                        now >= new Date(product.discountStart) &&
                        now <= new Date(product.discountEnd);

                      const currentPrice = isDiscountActive
                        ? product.discountPrice
                        : product.basePrice;
                      const hasDiscount =
                        isDiscountActive &&
                        product.discountPrice < product.basePrice;

                      return (
                        <div
                          key={product._id}
                          className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300"
                        >
                          {/* Product Image */}
                          <div className="aspect-square bg-gray-100 relative">
                            {product.images && product.images.length > 0 ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextSibling.style.display = "flex";
                                }}
                              />
                            ) : null}
                            <div
                              className="w-full h-full flex items-center justify-center"
                              style={{
                                display: product.images?.length ? "none" : "flex",
                              }}
                            >
                              <svg
                                className="w-16 h-16 text-gray-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1}
                                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                            </div>

                            {/* Status Badge */}
                            <div className="absolute top-3 left-3">
                              <span
                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                  product.status === "approved"
                                    ? "bg-green-100 text-green-800"
                                    : product.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : product.status === "rejected"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                                }`}
                              >
                                {product.status?.charAt(0).toUpperCase() +
                                  product.status?.slice(1) || "Unknown"}
                              </span>
                            </div>

                            {/* Discount Badge */}
                            {hasDiscount && (
                              <div className="absolute top-3 right-3">
                                <span className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded-full">
                                  -
                                  {Math.round(
                                    ((product.basePrice - product.discountPrice) /
                                      product.basePrice) *
                                      100
                                  )}
                                  %
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Product Details */}
                          <div className="p-4">
                            <div className="mb-2">
                              <h4 className="font-semibold text-gray-900 text-lg line-clamp-1">
                                {product.name}
                              </h4>
                              <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                                {product.description}
                              </p>
                            </div>

                            {/* Price */}
                            <div className="mb-3">
                              <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-gray-900">
                                  ${currentPrice?.toFixed(2)}
                                </span>
                                {hasDiscount && (
                                  <span className="text-sm text-gray-500 line-through">
                                    ${product.basePrice?.toFixed(2)}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Rating */}
                            {product.averageRating > 0 && (
                              <div className="flex items-center gap-2 mb-3">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <svg
                                      key={i}
                                      className={`w-4 h-4 ${
                                        i < Math.floor(product.averageRating)
                                          ? "text-orange-400"
                                          : "text-gray-300"
                                      }`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                                <span className="text-sm text-gray-600">
                                  {product.averageRating?.toFixed(1)} (
                                  {product.reviewCount || 0} reviews)
                                </span>
                              </div>
                            )}

                            {/* Variants Info */}
                            {product.variants && product.variants.length > 0 && (
                              <div className="mb-3">
                                <div className="flex flex-wrap gap-1">
                                  {product.variants
                                    .slice(0, 2)
                                    .map((variant, index) => (
                                      <span
                                        key={index}
                                        className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded"
                                      >
                                        {variant.name}:{" "}
                                        {variant.options?.length || 0} options
                                      </span>
                                    ))}
                                  {product.variants.length > 2 && (
                                    <span className="text-xs text-gray-500">
                                      +{product.variants.length - 2} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Stock Status */}
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`w-2 h-2 rounded-full ${
                                    product.variants?.some((v) =>
                                      v.options?.some(
                                        (o) => o.stock > 0 || o.stock === -1
                                      )
                                    )
                                      ? "bg-green-500"
                                      : "bg-red-500"
                                  }`}
                                />
                                <span className="text-gray-600">
                                  {product.variants?.some((v) =>
                                    v.options?.some(
                                      (o) => o.stock > 0 || o.stock === -1
                                    )
                                  )
                                    ? "In Stock"
                                    : "Out of Stock"}
                                </span>
                              </div>
                              <span className="text-gray-500">
                                {new Date(product.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  // Empty State
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                          />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        No Products Available
                      </h4>
                      <p className="text-gray-600">
                        Products will appear here once they are added to the
                        store.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeSection === "reviews" && (
              <div className="flex-1 overflow-y-auto p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Customer Reviews
                  </h3>
                  {reviewsRes?.data.review && reviewsRes.data.review.length > 0 && (
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-gray-900">
                        {averageRating?.toFixed(1) || "0.0"}
                      </span>
                      <div className="flex">{renderStars(Math.floor(averageRating || 0))}</div>
                      <span className="text-sm text-gray-600">
                        ({reviewsRes.data.review.length} reviews)
                      </span>
                    </div>
                  )}
                </div>

                {reviewsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                  </div>
                ) : reviewsRes?.data.review && reviewsRes.data.review.length > 0 ? (
                  <div className="space-y-6">
                    {reviewsRes.data.review.map((review) => (
                      <div
                        key={review._id}
                        className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {review.user?.userName?.split(" ")
                                  .map((n) => n[0])
                                  .join("") || "U"}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">
                                {review.user?.userName || "Anonymous User"}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {formatDate(review.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {renderStars(review.rating)}
                          </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {review.comment}
                        </p>
                        {review?.product && (
                          <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                            <svg
                              className="w-4 h-4 text-orange-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                              />
                            </svg>
                            <span className="text-sm text-gray-700">
                              Product: <span className="font-medium">{review.product.name}</span>
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                    {/* Review Summary */}
                    <div className="mt-8 bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">
                        Review Summary
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        {[5, 4, 3, 2, 1].map((stars) => {
                          const count = reviewsRes.data.review.filter(
                            (r) => r.rating === stars
                          ).length;
                          const percentage = reviewsRes.data.review.length > 0 ? (count / reviewsRes.data.review.length) * 100 : 0;

                          return (
                            <div key={stars} className="flex items-center gap-2">
                              <span className="text-sm font-medium text-gray-700">
                                {stars}
                              </span>
                              <svg
                                className="w-4 h-4 text-orange-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                              </svg>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-orange-400 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-600">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Empty State
                  <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg
                          className="w-8 h-8 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      </div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-2">
                        No Reviews Available
                      </h4>
                      <p className="text-gray-600">
                        Customer reviews will appear here once products receive feedback.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}