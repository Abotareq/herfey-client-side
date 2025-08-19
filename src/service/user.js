import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

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

const patchRequest = async (endpoint, data) => {
  const response = await apiClient.patch(endpoint, data);
  return response.data;
};

const deleteRequest = async (endpoint) => {
  const response = await apiClient.delete(endpoint);
  return response.data;
};

export const useGetUserById = (userId, Option = {}) => {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: () => getRequest(`/users/${userId}`),
    enabled: !!userId,
    ...Option,
    onError: (error) => {
      console.error(
        "GetUserById error:",
        error.response?.data?.message || error.message
      );
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, ...userData }) =>
      patchRequest(`/users`, userData),

    onSuccess: (data, variables) => {
      queryClient.setQueryData(["user", variables.userId], (old) => ({
        ...old,
        // shape of data in backend
        ...data.user, 
        ...data,
      }));

      console.log("User update successful:", data);
    },

    onError: (error) => {
      console.error(
        "UpdateUser error:",
        error.response?.data?.message || error.message
      );
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId) => deleteRequest(`/users`),

    onSuccess: (_, userId) => {
      queryClient.removeQueries({ queryKey: ["user", userId] });
      console.log("User deletion successful, user cache removed");
    },

    onError: (error) => {
      console.error(
        "DeleteUser error:",
        error.response?.data?.message || error.message
      );
    },
  });
};
