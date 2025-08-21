import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// ===== Axios instance =====
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ===== Helper functions =====
const getRequest = async (endpoint) => (await apiClient.get(endpoint)).data;
const postRequest = async (endpoint, data) => (await apiClient.post(endpoint, data)).data;
const patchRequest = async (endpoint, data) => (await apiClient.patch(endpoint, data)).data;
const deleteRequest = async (endpoint) => (await apiClient.delete(endpoint)).data;

// ====== Review Hooks ======
export const useGetReviews = (page = 1, limit = 10) =>
  useQuery({
    queryKey: ["reviews", page, limit],
    queryFn: () => getRequest(`/review?page=${page}&limit=${limit}`),
  });

export const useGetUserReviews = (userId) => {
  return useQuery({
    queryKey: ["userReviews", userId],
    queryFn: () => getRequest(`/review/user/${userId}`),
    enabled: !!userId,  
  });
};

export const useAddReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewData) => postRequest("/review", reviewData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["userReviews"] });
    },
  });
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ entityId, entityType, rating, comment }) =>
      patchRequest("/review", { entityId, entityType, rating, comment }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["userReviews"] });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ entityId, entityType }) =>
      deleteRequest(`/review?entityId=${entityId}&entityType=${entityType}`),  
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["userReviews"] });
    },
  });
};

export const useGetReviewSummary = (entityId, entityType) =>
  useQuery({
    queryKey: ["reviewSummary", entityId, entityType],
    queryFn: () => getRequest(`/review/summary/${entityId}/${entityType}`),
    enabled: !!entityId && !!entityType,
  });
 
export const useFilterReviewsByProduct = (productId, page = 1, limit = 10) =>
  useQuery({
    queryKey: ["filterReviews", productId, page, limit],
    queryFn: () =>
      getRequest(
        `/review/filter/products?productId=${productId}&page=${page}&limit=${limit}`
      ),
    enabled: !!productId,
  });

export const useFilterReviewsByStore = (shopId, page = 1, limit = 10) =>
  useQuery({
    queryKey: ["filterReviewsShop", shopId, page, limit],
    queryFn: () =>
      getRequest(
        `/review/filter/shops?shopId=${shopId}&page=${page}&limit=${limit}`
      ),
    enabled: !!shopId,
  });

export const useFilteredReviews = (filters) => {
  const cleanFilters = Object.fromEntries(
    Object.entries(filters).filter(([_, v]) => v != null)
  );
  const queryString = new URLSearchParams(cleanFilters).toString();
  return useQuery({
    queryKey: ["reviews", cleanFilters], 
    queryFn: () => getRequest(`/review/filter?${queryString}`),
    enabled: !!filters.userId, 
  });
};