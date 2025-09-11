"use client";
import React, { useState } from "react";
import { useTranslations } from "use-intl";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  useFilteredReviews,
  useDeleteReview,
  useUpdateReview,
} from "@/service/reviewService";
import LoadingSpinner from "../../ReusableComponents/LoadingSpinner/LoadingSpinner.jsx";
import toast from "react-hot-toast";
import { useLocale } from "use-intl";

function ReviewsSectionInProfile({ userId }) {
  const t = useTranslations("reviews");
  const queryClient = useQueryClient();
  const isArabic = useLocale() === "ar";

  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [editingReview, setEditingReview] = useState(null);
  const [editReviewData, setEditReviewData] = useState({
    rating: 1,
    comment: "",
  });
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(null);

  const filters = {
    userId,
    page,
    entityType: filterType === "all" ? undefined : filterType,
    sortBy:
      sortBy === "highest" || sortBy === "lowest" ? "rating" : "createdAt",
    order: sortBy === "newest" || sortBy === "highest" ? "desc" : "asc",
  };

  const { data, isLoading, error, refetch } = useFilteredReviews(filters);
  const userReviews = data?.data?.reviews || [];
  const pagination = data?.pagination || {};

  const deleteReviewMutation = useDeleteReview();
  const updateReviewMutation = useUpdateReview();

  const handleDeleteReview = (review) => {
    setDeleteConfirmDialog(review);
  };

  const confirmDeleteReview = () => {
    if (!deleteConfirmDialog) return;

    deleteReviewMutation.mutate(
      {
        entityId: deleteConfirmDialog.entityId,
        entityType: deleteConfirmDialog.entityType,
      },
      {
        onSuccess: () => {
          toast.success(t("successfully"));
          // Invalidate and refetch reviews query
          queryClient.invalidateQueries({
            queryKey: ["filteredReviews", filters],
          });
          // Alternative: Direct refetch
          refetch();
          setDeleteConfirmDialog(null);
        },
        onError: (error) => {
          toast.error(t("fail"));
          console.error("Delete error:", error);
          setDeleteConfirmDialog(null);
        },
      }
    );
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setEditReviewData({ rating: review.rating, comment: review.comment });
  };

  const handleUpdateReview = () => {
    if (!editingReview) return;

    updateReviewMutation.mutate(
      {
        entityId: editingReview.entityId,
        entityType: editingReview.entityType,
        rating: editReviewData.rating,
        comment: editReviewData.comment,
      },
      {
        onSuccess: () => {
          toast.success(t("updates"));
          setEditingReview(null);
          // Invalidate and refetch reviews query
          queryClient.invalidateQueries({
            queryKey: ["filteredReviews", filters],
          });
          // Alternative: Direct refetch
          refetch();
        },
        onError: (error) => {
          toast.error(t("updatee"));
          console.error("Update error:", error);
        },
      }
    );
  };

  const handleCancelEditReview = () => {
    setEditingReview(null);
  };

  // Skeleton Loading Component
  const ReviewSkeleton = () => (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="h-8 bg-slate-200 rounded-lg w-48 mb-2 animate-pulse"></div>
          <div className="h-5 bg-slate-200 rounded w-64 animate-pulse"></div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="h-10 bg-slate-200 rounded-lg w-32 animate-pulse"></div>
          <div className="h-10 bg-slate-200 rounded-lg w-32 animate-pulse"></div>
        </div>
      </div>

      {/* Statistics Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-xl p-4 border border-slate-200 text-center"
          >
            <div className="h-8 bg-slate-200 rounded w-16 mx-auto mb-2 animate-pulse"></div>
            <div className="h-4 bg-slate-200 rounded w-20 mx-auto animate-pulse"></div>
          </div>
        ))}
      </div>

      {/* Reviews List Skeleton */}
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm"
          >
            <div className="flex items-start space-x-4">
              {/* Image skeleton */}
              <div className="w-16 h-16 bg-slate-200 rounded-lg animate-pulse flex-shrink-0"></div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    {/* Title skeleton */}
                    <div className="h-6 bg-slate-200 rounded w-48 mb-2 animate-pulse"></div>
                    {/* Tags skeleton */}
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="h-6 bg-slate-200 rounded-full w-16 animate-pulse"></div>
                      <div className="h-4 bg-slate-200 rounded w-12 animate-pulse"></div>
                    </div>
                  </div>
                  {/* Action buttons skeleton */}
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse"></div>
                    <div className="w-8 h-8 bg-slate-200 rounded-full animate-pulse"></div>
                  </div>
                </div>

                {/* Stars skeleton */}
                <div className="flex items-center space-x-3 mb-3">
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, starIndex) => (
                      <div
                        key={starIndex}
                        className="w-4 h-4 bg-slate-200 animate-pulse"
                      ></div>
                    ))}
                  </div>
                  <div className="h-4 bg-slate-200 rounded w-8 animate-pulse"></div>
                </div>

                {/* Comment skeleton */}
                <div className="bg-slate-50 p-3 rounded-lg">
                  <div className="h-4 bg-slate-200 rounded w-full mb-2 animate-pulse"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (isLoading) return <ReviewSkeleton />;
  if (error) return <div>{t('error')}: {error.message}</div>;

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

  return (
    <div className="space-y-6 ">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">
            {t("myreviews")}
          </h3>
          <p className="text-slate-600">{t("desc")}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={filterType}
            onChange={(e) => {
              setFilterType(e.target.value);
              setPage(1); // Reset to first page when filter changes
            }}
            className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">{t("all")}</option>
            <option value="product">{t("products")}</option>
            <option value="store">{t("stores")}</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setPage(1); // Reset to first page when sort changes
            }}
            className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="newest">{t("new")}</option>
            <option value="oldest">{t("old")}</option>
            <option value="highest">{t("high")}</option>
            <option value="lowest">{t("low")}</option>
          </select>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
          <p className="text-2xl font-bold text-blue-600">
            {pagination.totalReviews || 0}
          </p>
          <p className="text-slate-600 text-sm">{t("total")}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
          <p className="text-2xl font-bold text-green-600">
            {
              userReviews.filter(
                (r) => r.entityType.toLowerCase() === "product"
              ).length
            }
          </p>
          <p className="text-slate-600 text-sm">{t("product")}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
          <p className="text-2xl font-bold text-purple-600">
            {
              userReviews.filter((r) => r.entityType.toLowerCase() === "store")
                .length
            }
          </p>
          <p className="text-slate-600 text-sm">{t("store")}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
          <p className="text-2xl font-bold text-amber-600">
            {(
              userReviews.reduce((acc, r) => acc + r.rating, 0) /
              (userReviews.length || 1)
            ).toFixed(1)}
          </p>
          <p className="text-slate-600 text-sm">{t("average")}</p>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirmDialog && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  {t("deleteReview") || t('deleteReview')}
                </h3>
                <p className="text-slate-600 text-sm">
                  {deleteConfirmDialog.entityDetails?.name || t('this')}
                </p>
              </div>
            </div>

            <p className="text-slate-700 mb-6">
              {t("deleteConfirmMessage") ||
                t('deletereviewMessage')}
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirmDialog(null)}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                disabled={deleteReviewMutation.isPending}
              >
                {t("cancel") || t("cancel")}
              </button>
              <button
                onClick={confirmDeleteReview}
                disabled={deleteReviewMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {deleteReviewMutation.isPending && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                )}
                <span>
                  {deleteReviewMutation.isPending
                    ? t("deleting") || t("deleting")
                    : t("delete") || t("delete")}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.5)] flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold text-slate-900 mb-4">
              {t("edit")}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t("rate")}
                </label>
                <EditableStarRating
                  rating={editReviewData.rating}
                  onChange={(rating) =>
                    setEditReviewData((prev) => ({ ...prev, rating }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {t("comment")}
                </label>
                <textarea
                  value={editReviewData.comment}
                  onChange={(e) =>
                    setEditReviewData((prev) => ({
                      ...prev,
                      comment: e.target.value,
                    }))
                  }
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  placeholder={t('share')}
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={handleCancelEditReview}
                className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                disabled={updateReviewMutation.isPending}
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleUpdateReview}
                disabled={updateReviewMutation.isPending}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updateReviewMutation.isPending ? t('Updating') : t("update")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {userReviews.length > 0 ? (
          userReviews.map((review) => {
            const entityUrl = review.entityDetails?.slug
              ? `/${review.entityType.toLowerCase()}s/${
                  review.entityDetails.slug
                }`
              : "#";

            return (
              <Link href={entityUrl} key={review._id} passHref>
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-500 transition-all duration-300 cursor-pointer">
                  <div className="flex items-start space-x-4">
                    {/* Entity image */}
                    {review.entityDetails?.images?.[0] && (
                      <img
                        src={review.entityDetails.images[0]}
                        alt={review.entityDetails.name}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                    )}
                    {review.entityDetails?.logoUrl && (
                      <img
                        src={review.entityDetails.logoUrl}
                        alt={review.entityDetails.name}
                        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      />
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-slate-900 mb-1 hover:text-blue-600">
                            {review.entityDetails?.name || t('itemreviewed')}
                          </h4>
                          <div className="flex items-center space-x-2 mb-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                review.entityType.toLowerCase() === "product"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-purple-100 text-purple-700"
                              }`}
                            >
                              {review.entityType}
                            </span>
                            {review.entityType.toLowerCase() === "product" &&
                              review.entityDetails?.basePrice && (
                                <span className="text-slate-500 text-sm">
                                  ${review.entityDetails.basePrice}
                                </span>
                              )}
                            {review.entityType.toLowerCase() === "store" &&
                              review.entityDetails?.productCount && (
                                <span className="text-slate-500 text-sm">
                                  {review.entityDetails.productCount}{" "}
                                  {t("products")}
                                </span>
                              )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 relative z-10">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleEditReview(review);
                            }}
                            title={t('edit')}
                            className="p-1 rounded-full hover:bg-slate-100"
                            disabled={
                              deleteReviewMutation.isPending ||
                              updateReviewMutation.isPending
                            }
                          >
                            <svg
                              className="w-5 h-5 text-slate-500 hover:text-blue-600"
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
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteReview(review);
                            }}
                            title={t('delete')}
                            className="p-1 rounded-full hover:bg-slate-100"
                            disabled={
                              deleteReviewMutation.isPending ||
                              updateReviewMutation.isPending
                            }
                          >
                            <svg
                              className="w-5 h-5 text-slate-500 hover:text-red-600"
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
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 mb-3">
                        <StarRating rating={review.rating} />
                        <span className="text-sm font-medium text-slate-700">
                          {review.rating}/5
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg">
                          "{review.comment}"
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              {t("noreview")}
            </h3>
            <p className="text-slate-600">{t("found")}</p>
          </div>
        )}
      </div>

      {/* Loading states */}
      {updateReviewMutation.isPending && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.3)] flex items-center justify-center z-40">
          <div className="bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-slate-700 font-medium">
                {t("Updating") || t("Updating")}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReviewsSectionInProfile;
