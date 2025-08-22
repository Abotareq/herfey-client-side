import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// ===== Axios instance =====
const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE}/api`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true, // Required for authentication cookies
});

// ===== Helper functions =====
const getRequest = async (endpoint) => (await apiClient.get(endpoint)).data;
const postRequest = async (endpoint, data) =>
  (await apiClient.post(endpoint, data)).data;
const patchRequest = async (endpoint, data) =>
  (await apiClient.patch(endpoint, data)).data;
const deleteRequest = async (endpoint, data) =>
  (await apiClient.delete(endpoint, { data })).data;

// ====== User Review Hooks =====

// Fetch reviews by the logged-in user with optional filters
export const useGetUserReviews = (
  userId,
  { page = 1, limit = 10, entityType, sortBy, order } = {}
) => {
  const queryParams = new URLSearchParams({
    page,
    limit,
    ...(entityType && entityType !== "all" && { entityType }),
    ...(sortBy && { sortBy }),
    ...(order && { order }),
  }).toString();

  return useQuery({
    queryKey: ["userReviews", userId, page, limit, entityType, sortBy, order],
    queryFn: () => getRequest(`/review/user?${queryParams}`),
    enabled: !!userId,
  });
};

// Add a new review (customer only)


// Update a review (customer only)
export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ entityId, entityType, rating, comment }) =>
      patchRequest("/review", { entityId, entityType, rating, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userReviews"] });
    },
  });
};

// Delete a review (customer only)
export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ entityId, entityType }) =>
      deleteRequest("/review", { entityId, entityType }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userReviews"] });
    },
  });
};

// Fetch review summary for a product or shop
export const useGetReviewSummary = (entityId, entityType) =>
  useQuery({
    queryKey: ["reviewSummary", entityId, entityType],
    queryFn: () => getRequest(`/review/summary/${entityId}/${entityType}`),
    enabled: !!entityId && !!entityType,
  });

// Fetch reviews for a specific product
export const useFilterReviewsByProduct = (productId, page = 1, limit = 10) =>
  useQuery({
    queryKey: ["filterReviews", "product", productId, page, limit],
    queryFn: () =>
      getRequest(
        `/review/filter/products?productId=${productId}&page=${page}&limit=${limit}`
      ),
    enabled: !!productId,
  });

// Fetch reviews for a specific shop
export const useFilterReviewsByStore = (shopId, page = 1, limit = 10) =>
  useQuery({
    queryKey: ["filterReviews", "shop", shopId, page, limit],
    queryFn: () =>
      getRequest(
        `/review/filter/shops?shopId=${shopId}&page=${page}&limit=${limit}`
      ),
    enabled: !!shopId,
  });
// Add a new review (customer only)
export const useAddReview = (productId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewData) => postRequest("/review", reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["filterReviews", "product", productId],
      });
      queryClient.invalidateQueries({
        queryKey: ["reviewSummary", productId, "Product"],
      });
    },
    onError: (error) => {
      console.error("Error adding review:", error);
    },
  });
};
