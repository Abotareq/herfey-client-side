"use client";
import { useEffect, useState } from "react";
import CouponsSection from "./components/Coupon/Coupon";
import ProfileSection from "./components/PersonalInfo/PersonalInfo";
import StoresSection from "./components/Store/Store";
import { useTranslations } from "next-intl";
import OrdersSection from "./components/orders/order";
import { useAuth } from "@/app/context/AuthContext";
import { useGetUserById } from "@/service/user";
import { useSignOut } from "@/service/auth";

function VendorProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const { user, loading: authLoading } = useAuth();
  const t = useTranslations("vendorProfile");
  const { mutate: signOut, isLoading } = useSignOut();

  // Fetch user data
  const {
    data: fetchedUserData,
    isLoading: userLoading,
    error,
  } = useGetUserById(user?.id);

  const handleLogout = () => {
    signOut(
      {},
      {
        onSuccess: () => {
          window.location.reload();
        },
      }
    );
  };
  const profileData = fetchedUserData?.data?.user ?? null;

  // Log for debugging
  useEffect(() => {
    console.log("Auth state:", {
      user,
      authLoading,
      userLoading,
      fetchedUserData,
      error,
    });
  }, [user, authLoading, userLoading, fetchedUserData, error]);

  // Loading state: wait for both auth and user data
  if (authLoading || userLoading || !user?.id || !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-orange-300/30 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-orange-200/30 to-orange-300/30 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-8">
          {/* Header skeleton */}
          <div className="mb-8">
            <div className="flex items-center space-x-6 mb-6">
              <div className="relative">
                <div className="w-20 h-20 bg-slate-200 rounded-2xl animate-pulse"></div>
              </div>
              <div className="flex-1 space-y-3">
                <div className="h-9 w-64 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-5 w-32 bg-slate-200 rounded animate-pulse"></div>
                <div className="flex flex-wrap items-center space-x-6">
                  <div className="h-8 w-48 bg-slate-200 rounded-full animate-pulse"></div>
                  <div className="h-8 w-32 bg-slate-200 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs skeleton */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-orange-100 max-w-2xl">
              {Array(4)
                .fill()
                .map((_, i) => (
                  <div
                    key={i}
                    className="h-10 w-32 bg-slate-200 rounded-xl animate-pulse"
                  ></div>
                ))}
            </div>
          </div>

          {/* Content skeleton (for profile tab) */}
          <div className="space-y-8">
            {/* Personal Information Card skeleton */}
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="h-8 w-40 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-10 w-24 bg-slate-200 rounded-lg animate-pulse"></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array(6)
                  .fill()
                  .map((_, index) => (
                    <div key={index} className="space-y-2">
                      <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
                      <div className="h-12 w-full bg-slate-100 rounded-lg animate-pulse"></div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Business Statistics skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {Array(4)
                .fill()
                .map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
                        <div className="h-8 w-16 bg-slate-200 rounded animate-pulse"></div>
                      </div>
                      <div className="w-12 h-12 bg-slate-200 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p className="text-red-700 font-medium">{t("error")}</p>
        </div>
      </div>
    );
  }

  // Safely access userData properties with fallbacks
  const firstName = profileData?.firstName || "";
  const lastName = profileData?.lastName || "";
  const userName = profileData?.userName || "";
  const createdAt = profileData?.createdAt
    ? new Date(profileData.createdAt).toLocaleDateString()
    : "";
  const storesCount = profileData?.storesCount || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 relative overflow-hidden">
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 bg-orange-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-orange-700 transition-colors"
      >
        sign out
      </button>
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-orange-200/30 to-orange-300/30 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-orange-200/30 to-orange-300/30 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-6 mb-6">
            <div className="relative group">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg group-hover:shadow-xl transition-all duration-300 hover:scale-105">
                {firstName[0] || "U"}
                {lastName[0] || ""}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent mb-2">
                {firstName} {lastName}
              </h1>
              <p className="text-orange-600 font-medium text-lg mb-3">
                @{userName || "user"}
              </p>
              <div className="flex flex-wrap items-center space-x-6 text-sm text-gray-600">
                <span className="flex items-center space-x-2 bg-white/80 px-3 py-2 rounded-full border border-orange-200 hover:bg-white transition-colors">
                  <svg
                    className="w-4 h-4 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0h6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V9a2 2 0 012-2z"
                    />
                  </svg>
                  <span>
                    {t("vendorsince")}: {createdAt || "-"}
                  </span>
                </span>
                <span className="flex items-center space-x-2 bg-white/80 px-3 py-2 rounded-full border border-orange-200 hover:bg-white transition-colors">
                  <svg
                    className="w-4 h-4 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                  <span>
                    {storesCount} {t("store")}
                    {storesCount !== 1 ? "s" : ""}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-orange-100 max-w-2xl">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 ${
                activeTab === "profile"
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span>{t("profilelabel")}</span>
            </button>
            <button
              onClick={() => setActiveTab("stores")}
              className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 ${
                activeTab === "stores"
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
              <span>{t("storeslabel")}</span>
            </button>
            <button
              onClick={() => setActiveTab("coupons")}
              className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 ${
                activeTab === "coupons"
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 4V2a1 1 0 011-1h4a1 1 0 011 1v2h4a1 1 0 011 1v2a1 1 0 01-1 1h-1v10a2 2 0 01-2 2H8a2 2 0 01-2-2V8H5a1 1 0 01-1-1V5a1 1 0 011-1h2z"
                />
              </svg>
              <span>{t("couponslabel")}</span>
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium rounded-xl transition-all duration-300 hover:scale-105 ${
                activeTab === "orders"
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-orange-600 hover:bg-orange-50"
              }`}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v1a2 2 0 002 2h2m0-4h6a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-5a2 2 0 002-2z"
                />
              </svg>
              <span>{t("orderslabel")}</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="transition-all duration-500 ease-in-out">
          {activeTab === "profile" && (
            <div className="animate-fade-in">
              <ProfileSection userData={profileData} />
            </div>
          )}
          {activeTab === "stores" && (
            <div className="animate-fade-in">
              <StoresSection />
            </div>
          )}
          {activeTab === "coupons" && (
            <div className="animate-fade-in">
              <CouponsSection />
            </div>
          )}
          {activeTab === "orders" && (
            <div className="animate-fade-in">
              <OrdersSection />
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}

export default VendorProfile;
