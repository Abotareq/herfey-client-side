// services/authService.js
// This is a client-side service using TanStack Query (React Query) for handling authentication mutations.
// Assumptions:
// - You've installed @tanstack/react-query.
// - Wrap your app with QueryClientProvider as per TanStack Query docs.
// - For signIn, assuming the backend returns a token; store it in localStorage (or use a state manager like Zustand for better security/practices).
// - Handle errors appropriately in your components.
// - For signOut, assuming it clears session on backend; client-side clears token.
// - Use these hooks in Client Components (mark files with 'use client').

import { useMutation, useQueryClient } from '@tanstack/react-query';

//const API_BASE = 'https://herafy-backend.up.railway.app/api/auth';
const API_BASE = 'http://localhost:5000/api/auth';
// Helper function for POST requests
const postRequest = async (endpoint, data) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Request failed');
  }

  return response.json();
};

// SignUp Mutation
export const useSignUp = () => {
  return useMutation({
    mutationFn: (userData) => postRequest('/signup', userData),
    onSuccess: (data) => {
      // Optional: Handle success, e.g., auto-signin or redirect
      console.log('SignUp successful:', data);
    },
    onError: (error) => {
      console.error('SignUp error:', error);
    },
  });
};

// SignIn Mutation
export const useSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials) => postRequest('/signin', credentials),
    onSuccess: (data) => {
      // Assuming response includes { token }; store it
   /*    if (data.token) {
        localStorage.setItem('authToken', data.token);
      } */
      // Invalidate queries to refetch protected data
      queryClient.invalidateQueries({ queryKey: ['user'] }); // Adjust key as needed
      console.log('SignIn successful:', data);
    },
    onError: (error) => {
      console.error('SignIn error:', error);
    },
  });
};

// SignOut Mutation
export const useSignOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => postRequest('/signout', null), // Empty body if no data needed
    onSuccess: () => {
      // Clear token
    //  localStorage.removeItem('authToken');
      // Invalidate queries and reset state
      //queryClient.clear();
      console.log('SignOut successful');
    },
    onError: (error) => {
      console.error('SignOut error:', error);
    },
  });
};
