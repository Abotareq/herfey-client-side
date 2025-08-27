import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// ===== Axios instance =====
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ===== Helper functions =====
const getRequest = async (endpoint) => (await apiClient.get(endpoint)).data.data;
const postRequest = async (endpoint, data) => (await apiClient.post(endpoint, data)).data.data;
const patchRequest = async (endpoint, data) => (await apiClient.patch(endpoint, data)).data.data.data;

// =====================
// ===== Payment Hooks
// =====================

// ---- Customer ----
export const useGetUserPayments = () =>
  useQuery({
    queryKey: ["userPayments"],
    queryFn: () => getRequest("/payments/user"),
  });

export const useCreatePayment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (paymentData) => postRequest("/payments", paymentData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userPayments"] });
    },
  });
};

// ---- Vendor ----
export const useGetSellerPayments = () =>
  useQuery({
    queryKey: ["sellerPayments"],
    queryFn: () => getRequest("/payments/seller"),
  });

// ---- Admin (optional) ----
export const useGetAllPayments = () =>
  useQuery({
    queryKey: ["allPayments"],
    queryFn: () => getRequest("/payments"),
  });

export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => patchRequest(`/payments/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allPayments"] });
      queryClient.invalidateQueries({ queryKey: ["userPayments"] });
      queryClient.invalidateQueries({ queryKey: ["sellerPayments"] });
    },
  });
};

// ---- Get payment by ID (Admin) ----
export const useGetPaymentById = (paymentId) =>
  useQuery({
    queryKey: ["payment", paymentId],
    queryFn: () => getRequest(`/payments/${paymentId}`),
    enabled: !!paymentId,
  });

// ---- Get payment by  session ID (Admin) ----
export const useGetPaymentBySessionId = (sessionId) =>
  useQuery({
    queryKey: ["payment", sessionId],
    queryFn: () => getRequest(`/payments/session/${sessionId}`),
    enabled: !!sessionId,
  });