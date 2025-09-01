import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE}`;

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Helper functions
const getRequest = async (endpoint) => {
  const response = await apiClient.get(endpoint);
  return response.data;
};

const postRequest = async (endpoint, data) => {
  const response = await apiClient.post(endpoint, data);
  return response.data;
};

const patchRequest = async (endpoint, data) => {
  const response = await apiClient.patch(endpoint, data);
  return response.data;
};

const deleteRequest = async (endpoint) => {
  const response = await apiClient.delete(endpoint);
  return response.data;
};

// ================== COUPON SERVICES ==================

// Get all vendor coupons
export const useGetVendorCoupons = (options = {}) => {
  return useQuery({
    queryKey: ["vendor-coupons"],
    queryFn: () => getRequest("/coupon/me"),
    ...options,
    onSuccess: (data) => {
      console.log("GetVendorCoupons success:", data);
    },
    onError: (error) => {
      console.error(
        "GetVendorCoupons error:",
        error.response?.data?.message || error.message
      );
    },
  });
};

// Create new coupon
export const useCreateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (couponData) => postRequest("/coupon", couponData),

    onSuccess: (data) => {
      // Invalidate and refetch vendor coupons
      queryClient.invalidateQueries({ queryKey: ["vendor-coupons"] });
      
      // Add the new coupon to the cache optimistically
      queryClient.setQueryData(["vendor-coupons"], (old) => {
        if (!old) return { data: { coupons: [data.date.newCupon] } };
        return {
          ...old,
          data: {
            ...old.data,
            coupons: [data.date.newCupon, ...old.data.coupons]
          }
        };
      });

      console.log("Coupon creation successful:", data);
    },

    onError: (error) => {
      console.error(
        "CreateCoupon error:",
        error.response?.data?.message || error.message
      );
    },
  });
};

// Update coupon by code
export const useUpdateCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ code, ...couponData }) => 
      patchRequest(`/coupon/me/${code}`, couponData),

    onSuccess: (data, variables) => {
      // Invalidate vendor coupons to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["vendor-coupons"] });
      
      // Update specific coupon in cache if you have single coupon queries
      if (data.data.coupon) {
        queryClient.setQueryData(
          ["coupon", variables.code], 
          data.data.coupon
        );
      }

      console.log("Coupon update successful:", data);
    },

    onError: (error) => {
      console.error(
        "UpdateCoupon error:",
        error.response?.data?.message || error.message
      );
    },
  });
};

// Delete coupon by code
export const useDeleteCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (couponCode) => deleteRequest(`/coupon/me/${couponCode}`),

    onSuccess: (_, couponCode) => {
      // Invalidate vendor coupons to refetch
      queryClient.invalidateQueries({ queryKey: ["vendor-coupons"] });
      
      // Remove specific coupon from cache
      queryClient.removeQueries({ queryKey: ["coupon", couponCode] });
      
      // Optimistically remove from vendor coupons list
      queryClient.setQueryData(["vendor-coupons"], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old.data,
            coupons: old.data.coupons.filter(coupon => coupon.code !== couponCode)
          }
        };
      });

      console.log("Coupon deletion successful:", couponCode);
    },

    onError: (error) => {
      console.error(
        "DeleteCoupon error:",
        error.response?.data?.message || error.message
      );
    },
  });
};
