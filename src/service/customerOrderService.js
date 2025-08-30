import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// ===== Axios instance =====
const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE}`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ===== Helper functions =====
const getRequest = async (endpoint) => (await apiClient.get(endpoint)).data.data.data;
const postRequest = async (endpoint, data) => (await apiClient.post(endpoint, data)).data;
const patchRequest = async (endpoint, data) => (await apiClient.patch(endpoint, data)).data.data.data;

// ====== Order Hooks ======

// Fetch user orders
export const useGetUserOrders = (page = 1, limit = 10, status = '') =>
  useQuery({
    queryKey: ["userOrders", page, limit, status],
    queryFn: () => getRequest(`/order?page=${page}&limit=${limit}&status=${status}`),
    keepPreviousData: true, 
  });
export const useGetSellerOrders = (params) =>
  useQuery({
    queryKey: ["sellerOrders", params],
    queryFn: () => getRequest(`/order/seller/orders?page=${params.page}&limit=${params.limit}&searchQuery=${params.searchQuery}&statusFilter=${params.statusFilter}`),
    keepPreviousData: true, 
  });

// Fetch single order by ID
export const useGetUserOrderById = (orderId) =>
  useQuery({
    queryKey: ["userOrder", orderId],
    queryFn: () => getRequest(`/order/${orderId}`),
    enabled: !!orderId, 
  });

export const useGetSellerOrderById = (orderId) =>
  useQuery({
    queryKey: ["sellerOrder", orderId],
    queryFn: () => getRequest(`/order/vendor/orders/${orderId}`),
    enabled: !!orderId, 
  });

// Cancel order
export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId) => patchRequest(`/order/${orderId}/cancel`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
    },
  });
};

// ===== Create Order Hook =====
export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderData) => postRequest("/order", orderData),
    onSuccess: (newOrder) => {
      // Invalidate orders list so it refreshes
      console.log("new order",newOrder)
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
    },
  });
};

// ===== Update Vendor Order Status =====
export const useUpdateVendorOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ orderId, status }) =>
      patchRequest(`/order/vendor/orders/${orderId}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sellerOrders"] });
      queryClient.invalidateQueries({ queryKey: ["userOrders"] }); // optional refresh for user too
    },
  });
};