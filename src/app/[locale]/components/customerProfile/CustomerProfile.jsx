"use client";

import { useEffect, useState } from "react";
import Customer from "./customercomponents/Profile";
import AddressesSection from "./customercomponents/AdressSection";
import { useTranslations } from "next-intl";
import { useGetUserById } from "@/service/user";
import { useAuth } from "@/app/context/AuthContext";
import OrderSection from "./customercomponents/OrderSection.jsx";
import ReviewsSectionInProfile from "./customercomponents/ReviewSectionInProfile";

function CustomerProfile() {
  const [activeTab, setActiveTab] = useState("profile");

  const [userId, setUserId] = useState(null);
  const { user, loading: authLoading } = useAuth();
  const t = useTranslations("customerpage");

  const {
    data: userDataResponse,
    isLoading: userLoading,
    error: userError,
  } = useGetUserById(userId);

  // Safely get user data, providing a default empty object
  const userData = userDataResponse?.data?.user || {};

  // This effect gets the user's ID from the authentication context
  useEffect(() => {
    if (!authLoading && user?.id) {
      setUserId(user.id);
    }
  }, [authLoading, user]);

  // Combined loading state for the main profile
  if (userLoading || authLoading) {
    return (
      <>
        {" "}
        <div className="min-h-screen">
          <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header Skeleton */}
            <div className="mb-8">
              <div className="flex items-center space-x-4 mb-4">
                <div className="skeleton w-16 h-16 rounded-full"></div>
                <div className="space-y-2">
                  <div className="skeleton h-8 w-48 rounded"></div>
                  <div className="skeleton h-5 w-32 rounded"></div>
                  <div className="skeleton h-4 w-40 rounded"></div>
                </div>
              </div>
            </div>

            {/* Navigation Tabs Skeleton */}
            <div className="mb-8">
              <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 max-w-lg">
                {Array(3)
                  .fill()
                  .map((_, index) => (
                    <div
                      key={index}
                      className="skeleton flex-1 h-10 rounded-md"
                    ></div>
                  ))}
              </div>
            </div>

            {/* Content Skeleton */}
            <div className="skeleton min-h-[400px] rounded-lg"></div>
          </div>
        </div>
      </>
    );
  }

  if (userError) {
    return <div>Error loading profile: {userError.message}</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="bg-orange-600 w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {userData.firstName?.charAt(0)}
              {userData.lastName?.charAt(0)}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {userData.firstName} {userData.lastName}
              </h1>
              <p className="text-gray-600">@{userData.userName}</p>
              <p className="text-sm text-gray-500">
                {t("date")} {new Date(userData.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1  bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-gray-900/8 rounded-lg p-1 max-w-lg">
            <button
              onClick={() => setActiveTab("profile")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "profile"
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-orange-700 hover:bg-gray-900/5"
              }`}
            >
              {t("profile")}
            </button>
            <button
              onClick={() => setActiveTab("addresses")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "addresses"
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-orange-700 hover:bg-gray-900/5"
              }`}
            >
              {t("address")}
            </button>
            <button
              onClick={() => setActiveTab("orders")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "orders"
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-orange-700 hover:bg-gray-900/5"
              }`}
            >
              {t("order")}
            </button>
            <button
              onClick={() => setActiveTab("reviews")}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === "reviews"
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                  : "text-gray-600 hover:text-orange-700 hover:bg-gray-900/5"
              }`}
            >
              {t("review")}
            </button>
          </div>
        </div>

        {/* Content */}

        {activeTab === "profile" && <Customer />}
        {activeTab === "addresses" && <AddressesSection userData={userData} />}
        {activeTab === "orders" && <OrderSection  />}
        {activeTab === "reviews" && <ReviewsSectionInProfile userId={userId} />}
      </div>
    </div>
  );
}

export default CustomerProfile;
