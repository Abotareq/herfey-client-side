import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

// 👇 API_BASE بقى يبدأ بـ /api
const API_BASE = `/api/auth`;

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true, // مهم عشان الكوكي يروح ويترجع
});

// Helper for POST requests
const postRequest = async (endpoint, data) => {
  const response = await apiClient.post(endpoint, data);
  return response.data;
};

// ✅ Current User
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await apiClient.get("/me");
      return response.data;
    },
    retry: false,
  });
};

// ✅ SignUp
export const useSignUp = () => {
  return useMutation({
    mutationFn: (userData) => postRequest("/signup", userData),
  });
};

// ✅ SignIn
export const useSignIn = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credentials) => postRequest("/signin", credentials),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

// ✅ SignOut
export const useSignOut = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => postRequest("/signout", {}),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["user"] });
    },
  });
};

// ✅ Google Sign-In
export const useGoogleSignIn = () => {
  return useMutation({
    mutationFn: async () => {
      // 👇 هنا كمان استخدم /api/auth/google
      window.location.href = `/api/auth/google`;
    },
  });
};
