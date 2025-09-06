"use client";
import React, { useState, useMemo } from "react";
import { useTranslations } from "use-intl";
import {
  useFilterReviewsByProduct,
  useGetReviewSummary,
  useAddReview,
} from "@/service/reviewService.js";
import { useAuth } from "@/app/context/AuthContext.jsx"; // Hypothetical auth context
import LoadingSpinner from "../../ReusableComponents/LoadingSpinner/LoadingSpinner.jsx";
import toast, { Toaster } from "react-hot-toast";
import { useLocale } from "use-intl";
function ReviewsSection({ productId }) {
  const t = useTranslations("productreview");
  const { user } = useAuth(); // Get authenticated user
  const [sortBy, setSortBy] = useState("newest");
  const [filterRating, setFilterRating] = useState("all");
  const [page, setPage] = useState(1);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 1,
    comment: "",
  });
  const limit = 4;
  const isArabic = useLocale() === "ar";
  const {
    data: reviewsData,
    isLoading,
    error,
  } = useFilterReviewsByProduct(productId, page, limit);
  const { data: summaryData } = useGetReviewSummary(productId, "Product");
  const addReviewMutation = useAddReview(productId);

  const reviews = useMemo(() => {
    let result = reviewsData?.data?.review || [];
    if (filterRating !== "all") {
      result = result.filter(
        (review) => review.rating === parseInt(filterRating)
      );
    }
    return result.sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === "highest") return b.rating - a.rating;
      if (sortBy === "lowest") return a.rating - b.rating;
      if (sortBy === "helpful") return (b.helpful || 0) - (a.helpful || 0);
      return 0;
    });
  }, [reviewsData, filterRating, sortBy]);

  const ratingDistribution = useMemo(() => {
    const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    (reviewsData?.data?.review || []).forEach((review) => {
      counts[review.rating] = (counts[review.rating] || 0) + 1;
    });
    const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
    return Object.entries(counts).map(([stars, count]) => ({
      stars: parseInt(stars),
      count,
      percentage: total ? ((count / total) * 100).toFixed(0) : 0,
    }));
  }, [reviewsData]);

  const pagination = reviewsData?.data?.pagination || {
    totalReviews: reviews.length,
    currentPage: page,
    totalPages: Math.ceil(reviews.length / limit),
  };

  const handleAddReview = () => {
    if (!user) return;
    addReviewMutation.mutate(
      {
        entityId: productId,
        entityType: "Product",
        rating: reviewData.rating,
        comment: reviewData.comment,
      },
      {
        onSuccess: () => {
          toast.success(t("successreview"));
          setReviewData({ rating: 1, comment: "" });
          setShowReviewForm(false);
          setPage(1); // Reset to first page to show new review
        },
        onError: (error) => {
          toast.error(
            t("errorreview") +
              ": " +
              (error.response?.data?.data?.message || error.message)
          );
        },
      }
    );
  };

  const StarRating = ({ rating, size = "w-4 h-4" }) => (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <svg
          key={i}
          className={`${size} ${
            i < rating ? "fill-amber-400" : "fill-slate-300"
          }`}
          viewBox="0 0 14 13"
        >
          <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
        </svg>
      ))}
    </div>
  );

  const EditableStarRating = ({ rating, onChange }) => (
    <div className="flex items-center space-x-1">
      {[...Array(5)].map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i + 1)}
          className="focus:outline-none"
        >
          <svg
            className={`w-6 h-6 transition-colors ${
              i < rating
                ? "fill-amber-400 text-amber-400"
                : "fill-slate-300 text-slate-300 hover:fill-amber-200"
            }`}
            viewBox="0 0 14 13"
          >
            <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
          </svg>
        </button>
      ))}
      <span className="ml-2 text-sm font-medium text-slate-700">
        {rating}/5
      </span>
    </div>
  );

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return (
      <div>
        {t("error_loading_reviews")}: {error.message}
      </div>
    );

  return (
    <div className="mt-16 border-t border-slate-200 pt-16">
      <div className="max-w-6xl mx-auto px-4">
        {/* Reviews Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-6">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              {t("customer_reviews")}
            </h2>
            <p className="text-slate-600">{t("see_what_customers_say")}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex gap-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="newest">{t("new")}</option>
                <option value="oldest">{t("old")}</option>
                <option value="highest">{t("high")}</option>
                <option value="lowest">{t("low")}</option>
                <option value="helpful">{t("helpful")}</option>
              </select>

              <select
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">{t("all")}</option>
                <option value="5">{t("5")}</option>
                <option value="4">{t("4")}</option>
                <option value="3">{t("3")}</option>
                <option value="2">{t("2")}</option>
                <option value="1">{t("1")}</option>
              </select>
            </div>

            {user ? (
              <button
                onClick={() => setShowReviewForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {t("write")}
              </button>
            ) : (
              <button
                disabled
                className="px-6 py-3 bg-gray-400 text-white font-semibold rounded-xl opacity-50 cursor-not-allowed"
              >
                {t("login")}
              </button>
            )}
          </div>
        </div>

        {/* Review Form Modal */}
        {showReviewForm && user && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                {t("write")}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t("rating")}
                  </label>
                  <EditableStarRating
                    rating={reviewData.rating}
                    onChange={(rating) =>
                      setReviewData((prev) => ({ ...prev, rating }))
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {t("comment")}
                  </label>
                  <textarea
                    value={reviewData.comment}
                    onChange={(e) =>
                      setReviewData((prev) => ({
                        ...prev,
                        comment: e.target.value,
                      }))
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder={t("reviewplaceholder")}
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={handleAddReview}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={addReviewMutation.isLoading}
                >
                  {addReviewMutation.isLoading ? t("submitting") : t("submit")}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Rating Summary */}
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-8 mb-12 border border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-6xl font-bold text-slate-900 mb-2">
                {summaryData?.data?.averageRating?.toFixed(1) || "N/A"}
              </div>
              <StarRating
                rating={Math.floor(summaryData?.data?.averageRating || 0)}
                size="w-6 h-6"
              />
              <p className="text-slate-600 mt-2">
                {t("based_on")} {summaryData?.data?.reviewCount || 0}{" "}
                {t("reviews")}
              </p>
            </div>

            <div className="lg:col-span-2 space-y-3">
              {ratingDistribution.map((rating) => (
                <div key={rating.stars} className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-slate-700 w-12">
                    {rating.stars} {t("star")}
                  </span>
                  <div className="flex-1 bg-slate-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-orange-400 h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${rating.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-slate-600 w-12 text-right">
                    {rating.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Individual Reviews */}
        {/* {console.log(reviews[0].user.userName)} */}
        <div className="space-y-8">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div
                key={review._id}
                className="bg-white rounded-2xl p-8 border border-slate-200 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                    {review.user?.userName
                      ? review.user.userName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)
                      : "AN"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                      <div className="flex items-center space-x-3 flex-wrap">
                        <h4 className="font-semibold text-slate-900">
                          {review.user?.userName || "Anonymous"}
                        </h4>
                        {review.verifiedPurchase && (
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
                            <span>{t("verified_purchase")}</span>
                          </div>
                        )}
                      </div>
                      <span className="text-sm text-slate-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="mb-3">
                      <StarRating rating={review.rating} />
                    </div>

                    <p className="text-slate-600 leading-relaxed mb-4">
                      {review.comment || t("no")}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6">
                        <button className="flex items-center space-x-2 text-slate-500 hover:text-blue-600 transition-colors group">
                          <svg
                            className="w-4 h-4 group-hover:scale-110 transition-transform"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V9a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                            />
                          </svg>
                          <span className="text-sm font-medium">
                            {t("helpfulr")} ({review.helpful || 0})
                          </span>
                        </button>
                        <button className="text-slate-500 hover:text-blue-600 transition-colors text-sm font-medium">
                          {t("reply")}
                        </button>
                        <button className="text-slate-500 hover:text-red-600 transition-colors text-sm font-medium">
                          {t("report")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">
                {t("noreviews")}
              </h3>
              <p className="text-slate-600">{t("no_reviews_product")}</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="text-center mt-12 flex justify-center space-x-4">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-8 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
            >
              {t("previous")}
            </button>
            <span className="px-4 py-3 text-slate-700">
              {t("page")} {pagination.currentPage} {t("of")}{" "}
              {pagination.totalPages}
            </span>
            <button
              onClick={() =>
                setPage((prev) => Math.min(prev + 1, pagination.totalPages))
              }
              disabled={page >= pagination.totalPages}
              className="px-8 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50"
            >
              {t("next")}
            </button>
          </div>
        )}

        {/* Review Summary Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {summaryData?.data?.recommendPercentage?.toFixed(0) || 0}%
            </div>
            <div className="text-slate-600 font-medium">
              {t("recommend_product")}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {summaryData?.data?.averageRating?.toFixed(1) || "0.0"}
            </div>
            <div className="text-slate-600 font-medium">
              {t("average_quality_rating")}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-6 border border-slate-200 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {(summaryData?.data?.averageRating || 0).toFixed(1)}
            </div>
            <div className="text-slate-600 font-medium">
              {t("average_fit_rating")}
            </div>
          </div>
        </div>

        {/* Most Mentioned Keywords */}
      </div>
    </div>
  );
}

export default ReviewsSection;
