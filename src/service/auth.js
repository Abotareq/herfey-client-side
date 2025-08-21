
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE}/api/auth`;

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Helper function for POST requests
const postRequest = async (endpoint, data) => {
  const response = await apiClient.post(endpoint, data);
  return response.data;
};

// SignUp Mutation
export const useSignUp = () => {
  return useMutation({
    mutationFn: (userData) => postRequest("/signup", userData),
    onSuccess: (data) => {
      console.log("SignUp successful:", data);
    },
    onError: (error) => {
      console.error(
        "SignUp error:",
        error.response?.data?.message || error.message
      );
    },
  });
};

// SignIn Mutation
export const useSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials) => postRequest("/signin", credentials),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      console.log("SignIn successful:", data);
    },
    onError: (error) => {
      console.error(
        "SignIn error:",
        error.response?.data?.message || error.message
      );
    },
  });
};

// SignOut Mutation
export const useSignOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => postRequest("/signout", {}), // Empty object for body
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["user"] });
      console.log("SignOut successful, user cache removed");
    },
    onError: (error) => {
      console.error(
        "SignOut error:",
        error.response?.data?.message || error.message
      );
    },
  });
};
