"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "use-intl";
import {
  useGetVendorCoupons,
  useCreateCoupon,
  useUpdateCoupon,
  useDeleteCoupon,
} from "@/service/coupon";

function CouponsSection() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [newCoupon, setNewCoupon] = useState({
    code: "",
    type: "percentage",
    value: 0,
    minCartTotal: 0,
    maxDiscount: "",
    expiryDate: "",
    usageLimit: 1,
    active: true,
  });

  const t = useTranslations("vendorCoupons");

  // API hooks
  const {
    data: couponsData,
    isLoading: couponsLoading,
    error: couponsError,
  } = useGetVendorCoupons();
  const createCoupon = useCreateCoupon();
  const updateCoupon = useUpdateCoupon();
  const deleteCoupon = useDeleteCoupon();

  // Extract coupons from API response
  const userCoupons = couponsData?.data?.coupons || [];

  const filteredCoupons = userCoupons.filter((coupon) => {
    if (filterStatus === "all") return true;
    if (filterStatus === "active")
      return coupon.active && new Date(coupon.expiryDate) > new Date();
    if (filterStatus === "expired")
      return new Date(coupon.expiryDate) <= new Date();
    if (filterStatus === "inactive") return !coupon.active;
    return true;
  });

  const sortedCoupons = [...filteredCoupons].sort((a, b) => {
    switch (sortBy) {
      case "newest":
        return (
          new Date(b.createdAt || b.expiryDate) -
          new Date(a.createdAt || a.expiryDate)
        );
      case "oldest":
        return (
          new Date(a.createdAt || a.expiryDate) -
          new Date(b.createdAt || b.expiryDate)
        );
      case "mostUsed":
        return b.usedCount - a.usedCount;
      case "leastUsed":
        return a.usedCount - b.usedCount;
      default:
        return 0;
    }
  });

  const handleAddCoupon = async () => {
    try {
      // Prepare coupon data
      const couponData = {
        ...newCoupon,
        maxDiscount:
          newCoupon.maxDiscount === "" ? null : Number(newCoupon.maxDiscount),
        value: Number(newCoupon.value),
        minCartTotal: Number(newCoupon.minCartTotal),
        usageLimit: Number(newCoupon.usageLimit),
      };

      await createCoupon.mutateAsync(couponData);

      // Reset form
      setNewCoupon({
        code: "",
        type: "percentage",
        value: 0,
        minCartTotal: 0,
        maxDiscount: "",
        expiryDate: "",
        usageLimit: 1,
        active: true,
      });
      setShowCouponForm(false);
    } catch (error) {
      console.error("Failed to create coupon:", error);
    }
  };

  const handleEditCoupon = (coupon) => {
    setEditingCoupon(coupon);
    setNewCoupon({
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      minCartTotal: coupon.minCartTotal,
      maxDiscount:
        coupon.maxDiscount === null ? "" : coupon.maxDiscount.toString(),
      expiryDate: coupon.expiryDate
        ? coupon.expiryDate.split("T")[0] + "T23:59:59Z"
        : "",
      usageLimit: coupon.usageLimit,
      active: coupon.active,
    });
  };

  const handleUpdateCoupon = async () => {
    try {
      const couponData = {
        code: editingCoupon.code, // Keep original code for API call
        type: newCoupon.type,
        value: Number(newCoupon.value),
        minCartTotal: Number(newCoupon.minCartTotal),
        maxDiscount:
          newCoupon.maxDiscount === "" ? null : Number(newCoupon.maxDiscount),
        expiryDate: newCoupon.expiryDate,
        usageLimit: Number(newCoupon.usageLimit),
        active: newCoupon.active,
      };

      await updateCoupon.mutateAsync(couponData);

      // Reset form
      setNewCoupon({
        code: "",
        type: "percentage",
        value: 0,
        minCartTotal: 0,
        maxDiscount: "",
        expiryDate: "",
        usageLimit: 1,
        active: true,
      });
      setEditingCoupon(null);
    } catch (error) {
      console.error("Failed to update coupon:", error);
    }
  };

  const handleDeleteCoupon = async (couponCode) => {
    if (
      window.confirm(`Are you sure you want to delete coupon ${couponCode}?`)
    ) {
      try {
        await deleteCoupon.mutateAsync(couponCode);
      } catch (error) {
        console.error("Failed to delete coupon:", error);
      }
    }
  };

  const handleCancelCouponEdit = () => {
    setEditingCoupon(null);
    setShowCouponForm(false);
    setNewCoupon({
      code: "",
      type: "percentage",
      value: 0,
      minCartTotal: 0,
      maxDiscount: "",
      expiryDate: "",
      usageLimit: 1,
      active: true,
    });
  };

  // Loading state
  if (couponsLoading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="h-8 w-48 bg-slate-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-slate-200 rounded animate-pulse"></div>
          </div>
          <div className="flex gap-3">
            <div className="h-10 w-32 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-slate-200 rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-slate-200 rounded animate-pulse"></div>
          </div>
        </div>

        {/* Statistics skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Array(4)
            .fill()
            .map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl p-4 border border-slate-200"
              >
                <div className="h-8 w-16 bg-slate-200 rounded animate-pulse mb-2"></div>
                <div className="h-4 w-20 bg-slate-200 rounded animate-pulse"></div>
              </div>
            ))}
        </div>

        {/* Coupons skeleton */}
        <div className="space-y-4">
          {Array(3)
            .fill()
            .map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 border border-slate-200"
              >
                <div className="h-6 w-32 bg-slate-200 rounded animate-pulse mb-4"></div>
                <div className="h-4 w-full bg-slate-100 rounded animate-pulse"></div>
              </div>
            ))}
        </div>
      </div>
    );
  }

  // Error state
  if (couponsError) {
    return (
      <div className="text-center py-12">
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
        <h3 className="text-lg font-semibold text-slate-900 mb-2">
          Failed to load coupons
        </h3>
        <p className="text-slate-600">
          {couponsError?.message || "Something went wrong"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">{t("title")}</h3>
          <p className="text-slate-600">{t("desc")}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">{t("coupons")}</option>
            <option value="active">{t("active")}</option>
            <option value="expired">{t("expired")}</option>
            <option value="inactive">{t("inactive")}</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="newest">{t("new")}</option>
            <option value="oldest">{t("old")}</option>
            <option value="mostUsed">{t("most")}</option>
            <option value="leastUsed">{t("lease")}</option>
          </select>

          <button
            onClick={() => setShowCouponForm(true)}
            disabled={createCoupon.isLoading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors"
          >
            {createCoupon.isLoading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
            )}
            <span>{t("add")}</span>
          </button>
        </div>
      </div>

      {/* Coupon Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {userCoupons.length}
          </p>
          <p className="text-slate-600 text-sm">{t("total")}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
          <p className="text-2xl font-bold text-green-600">
            {
              userCoupons.filter(
                (c) => c.active && new Date(c.expiryDate) > new Date()
              ).length
            }
          </p>
          <p className="text-slate-600 text-sm">{t("tactive")}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
          <p className="text-2xl font-bold text-red-600">
            {
              userCoupons.filter((c) => new Date(c.expiryDate) <= new Date())
                .length
            }
          </p>
          <p className="text-slate-600 text-sm">{t("texpired")}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
          <p className="text-2xl font-bold text-amber-600">
            {userCoupons.reduce((acc, c) => acc + c.usedCount, 0)}
          </p>
          <p className="text-slate-600 text-sm">{t("tusage")}</p>
        </div>
      </div>

      {/* Add/Edit Coupon Form */}
      {(showCouponForm || editingCoupon) && (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">
            {editingCoupon ? "Edit Coupon" : "Add New Coupon"}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t("code")}
              </label>
              <input
                type="text"
                value={newCoupon.code}
                onChange={(e) =>
                  setNewCoupon((prev) => ({
                    ...prev,
                    code: e.target.value.toUpperCase(),
                  }))
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., SAVE20"
                disabled={editingCoupon} // Disable code editing when updating
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t("discount")}
              </label>
              <select
                value={newCoupon.type}
                onChange={(e) =>
                  setNewCoupon((prev) => ({ ...prev, type: e.target.value }))
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="percentage">{t("percent")}</option>
                <option value="fixed">{t("fixed")}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Discount Value {newCoupon.type === "percentage" ? "(%)" : "($)"}
              </label>
              <input
                type="number"
                value={newCoupon.value}
                onChange={(e) =>
                  setNewCoupon((prev) => ({
                    ...prev,
                    value: Number(e.target.value),
                  }))
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                max={newCoupon.type === "percentage" ? "100" : undefined}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t("mincart")} ($)
              </label>
              <input
                type="number"
                value={newCoupon.minCartTotal}
                onChange={(e) =>
                  setNewCoupon((prev) => ({
                    ...prev,
                    minCartTotal: Number(e.target.value),
                  }))
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t("maxd")}
              </label>
              <input
                type="number"
                value={newCoupon.maxDiscount}
                onChange={(e) =>
                  setNewCoupon((prev) => ({
                    ...prev,
                    maxDiscount: e.target.value,
                  }))
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                placeholder={t("empty")}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t("limit")}
              </label>
              <input
                type="number"
                value={newCoupon.usageLimit}
                onChange={(e) =>
                  setNewCoupon((prev) => ({
                    ...prev,
                    usageLimit: Number(e.target.value),
                  }))
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                {t("expire")}
              </label>
              <input
                type="date"
                value={
                  newCoupon.expiryDate ? newCoupon.expiryDate.split("T")[0] : ""
                }
                onChange={(e) =>
                  setNewCoupon((prev) => ({
                    ...prev,
                    expiryDate: e.target.value + "T23:59:59Z",
                  }))
                }
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={newCoupon.active}
                onChange={(e) =>
                  setNewCoupon((prev) => ({
                    ...prev,
                    active: e.target.checked,
                  }))
                }
                className="mr-2"
              />
              <label className="text-sm font-medium text-slate-700">
                {t("cactive")}
              </label>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={handleCancelCouponEdit}
              disabled={createCoupon.isLoading || updateCoupon.isLoading}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 disabled:bg-slate-100 disabled:cursor-not-allowed transition-colors"
            >
              {t("cancel")}
            </button>
            <button
              onClick={editingCoupon ? handleUpdateCoupon : handleAddCoupon}
              disabled={createCoupon.isLoading || updateCoupon.isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {(createCoupon.isLoading || updateCoupon.isLoading) && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              <span>{editingCoupon ? t("update") : t("addc")}</span>
            </button>
          </div>
        </div>
      )}

      {/* Coupons List */}
      <div className="space-y-4">
        {sortedCoupons.length > 0 ? (
          sortedCoupons.map((coupon) => {
            const isExpired = new Date(coupon.expiryDate) <= new Date();
            const usagePercentage =
              (coupon.usedCount / coupon.usageLimit) * 100;

            return (
              <div
                key={coupon._id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-mono font-bold text-lg">
                        {coupon.code}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            coupon.active && !isExpired
                              ? "bg-green-100 text-green-700"
                              : isExpired
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {isExpired
                            ? t("expired")
                            : coupon.active
                            ? t("active")
                            : t("inactive")}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {coupon.type === "percentage"
                            ? `${coupon.value}% OFF`
                            : `${coupon.value} OFF`}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
                      <div>
                        <span className="font-medium">{t("minc")}:</span> $
                        {coupon.minCartTotal}
                      </div>
                      {coupon.maxDiscount && (
                        <div>
                          <span className="font-medium">{t("maxd")}:</span> $
                          {coupon.maxDiscount}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">{t("expiredc")}:</span>{" "}
                        {new Date(coupon.expiryDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditCoupon(coupon)}
                      disabled={updateCoupon.isLoading}
                      className="text-slate-400 hover:text-blue-600 disabled:cursor-not-allowed transition-colors"
                      title={t("edit")}
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
                    </button>
                    <button
                      onClick={() => handleDeleteCoupon(coupon.code)}
                      disabled={deleteCoupon.isLoading}
                      className="text-slate-400 hover:text-red-600 disabled:cursor-not-allowed transition-colors"
                      title={t("deletec")}
                    >
                      {deleteCoupon.isLoading ? (
                        <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                      ) : (
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Usage Progress */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-slate-600 mb-2">
                    <span>
                      {t("usage")}: {coupon.usedCount}/{coupon.usageLimit}
                    </span>
                    <span>{Math.round(usagePercentage)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a1 1 0 001 1h1a1 1 0 001-1V7a2 2 0 00-2-2H5zM5 14a2 2 0 00-2 2v3a1 1 0 001 1h1a1 1 0 001-1v-3a2 2 0 00-2-2H5zM19 5a2 2 0 012 2v3a1 1 0 01-1 1h-1a1 1 0 01-1-1V7a2 2 0 012-2h1zM19 14a2 2 0 012 2v3a1 1 0 01-1 1h-1a1 1 0 01-1-1v-3a2 2 0 012-2h1z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {t("noc")}
            </h3>
            <p className="text-slate-600">
              {filterStatus === "all"
                ? t("error")
                : `No ${filterStatus} coupons found.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CouponsSection;
