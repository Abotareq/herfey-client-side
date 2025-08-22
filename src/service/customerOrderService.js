import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// ===== Axios instance =====
const apiClient = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE}/api`,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ===== Helper functions =====
const getRequest = async (endpoint) => (await apiClient.get(endpoint)).data.data.data;
const patchRequest = async (endpoint, data) => (await apiClient.patch(endpoint, data)).data.data.data;


// ====== Order Hooks ======

export const useGetUserOrders = (page = 1, limit = 10, status = '') =>
  useQuery({
    queryKey: ["userOrders", page, limit, status],
    queryFn: () => getRequest(`/order?page=${page}&limit=${limit}&status=${status}`),
    keepPreviousData: true, 
  });


export const useGetUserOrderById = (orderId) =>
  useQuery({
    queryKey: ["userOrder", orderId],
    queryFn: () => getRequest(`/order/${orderId}`),
    enabled: !!orderId, 
  });


export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderId) => patchRequest(`/order/${orderId}/cancel`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userOrders"] });
    },
  });
};