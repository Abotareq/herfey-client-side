"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "use-intl";
import { useAuth } from "@/app/context/AuthContext";
import { useUpdateUser } from "@/service/user";
import { useQueryClient } from "@tanstack/react-query";

function ProfileSection({ userData }) {
  const t = useTranslations("vendorProfile");
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({});
  const [errorMessage, setErrorMessage] = useState(null);
  const { user, loading: authLoading } = useAuth();
  const updateUserMutation = useUpdateUser();
  const queryClient = useQueryClient();

  // Initialize editedData with userData when entering edit mode
  useEffect(() => {
    if (userData && !isEditing) {
      setEditedData({
        userName: userData.userName || "",
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phone: userData.phone || "",
      });
    }
  }, [userData, isEditing]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setErrorMessage(null); // Clear error message on edit toggle
  };

  const handleSaveProfile = () => {
    if (!user?.id) {
      setErrorMessage(t("noUserId"));
      return;
    }

    // Basic email validation
    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValidEmail(editedData.email)) {
      setErrorMessage(t("invalidEmail"));
      return;
    }

    const queryKey = ["getUserById", user.id];
    const previous = queryClient.getQueryData(queryKey);

    // Optimistic update
    const updatedUser = { ...(previous?.data?.user || {}), ...editedData };
    queryClient.setQueryData(queryKey, {
      ...previous,
      data: { ...previous?.data, user: updatedUser },
    });

    setIsEditing(false);
    setErrorMessage(null);

    updateUserMutation.mutate(
      { userId: user.id, ...editedData },
      {
        onSuccess: (response) => {
          queryClient.setQueryData(queryKey, response);
          queryClient.invalidateQueries({ queryKey });
          console.log("Profile updated successfully");
        },
        onError: (error) => {
          queryClient.setQueryData(queryKey, previous);
          setIsEditing(true);
          setErrorMessage(t("updateError"));
          console.error("Error updating profile:", error);
        },
      }
    );
  };

  // Loading state for when userData or auth is not ready
  if (authLoading || !userData) {
    return (
      <div className="space-y-8">
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
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Personal Information Card */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-slate-900">{t("title")}</h3>
          <button
            onClick={handleEditToggle}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
            disabled={authLoading || !user?.id}
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
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <span>{isEditing ? t("cancel") : t("edit")}</span>
          </button>
        </div>

        {errorMessage && (
          <div className="mb-4 text-red-600 text-sm">{errorMessage}</div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t("name")}
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedData.userName || ""}
                onChange={(e) =>
                  setEditedData((prev) => ({
                    ...prev,
                    userName: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-slate-900 font-medium bg-slate-50 px-4 py-3 rounded-lg">
                {userData.userName || "-"}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t("fname")}
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedData.firstName || ""}
                onChange={(e) =>
                  setEditedData((prev) => ({
                    ...prev,
                    firstName: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-slate-900 font-medium bg-slate-50 px-4 py-3 rounded-lg">
                {userData.firstName || "-"}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t("lname")}
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editedData.lastName || ""}
                onChange={(e) =>
                  setEditedData((prev) => ({
                    ...prev,
                    lastName: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-slate-900 font-medium bg-slate-50 px-4 py-3 rounded-lg">
                {userData.lastName || "-"}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t("email")}
            </label>
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <input
                  type="email"
                  value={editedData.email || ""}
                  onChange={(e) =>
                    setEditedData((prev) => ({
                      ...prev,
                      email: e.target.value,
                    }))
                  }
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="flex-1 text-slate-900 font-medium bg-slate-50 px-4 py-3 rounded-lg">
                  {userData.email || "-"}
                </p>
              )}
              {userData.emailVerified && (
                <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                  <svg
                    className="w-3 h-3"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{t("verify")}</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t("phone")}
            </label>
            {isEditing ? (
              <input
                type="tel"
                value={editedData.phone || ""}
                onChange={(e) =>
                  setEditedData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-slate-900 font-medium bg-slate-50 px-4 py-3 rounded-lg">
                {userData.phone || "-"}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {t("role")}
            </label>
            <p className="text-slate-900 font-medium bg-gradient-to-r from-purple-100 to-blue-100 px-4 py-3 rounded-lg capitalize flex items-center">
              <svg
                className="w-4 h-4 mr-2 text-purple-600"
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
              {userData.role || "-"}
            </p>
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={handleEditToggle}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              {t("cancel")}
            </button>
            <button
              onClick={handleSaveProfile}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              disabled={updateUserMutation.isLoading || !user?.id}
            >
              {updateUserMutation.isLoading ? t("saving") : t("save")}
            </button>
          </div>
        )}
      </div>

      {/* Business Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">
                {t("stores")}
              </p>
              <p className="text-3xl font-bold text-purple-600">
                {userData.storesCount || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-purple-600"
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
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">
                {t("orders")}
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {userData.ordersCount || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M8 11v6h8v-6M8 11H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-2"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">
                {t("active")}
              </p>
              <p className="text-3xl font-bold text-green-600">
                {userData.activeOrders || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">
                {t("ocancel")}
              </p>
              <p className="text-3xl font-bold text-red-600">
                {userData.cancelledOrders || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSection;
