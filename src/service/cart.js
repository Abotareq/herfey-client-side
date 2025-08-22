// src/service/cart.js
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

/** ===================== CONFIG ===================== **/
const API_BASE = "http://localhost:5000/api/cart";

/** ===================== CUSTOMER METHODS ===================== **/

/**
 * Get the authenticated user's cart
 */
const getMyCart = async () => {
  try {
    const { data } = await axios.get(`${API_BASE}`, {
      withCredentials: true,
    });
    return data.data.cart; // assuming { status, data: { cart } }
  } catch (error) {
    console.error("Error fetching cart:", error?.response?.data || error);
    throw error;
  }
};

/**
 * Create or update cart
 */
const createOrUpdateCart = async (payload) => {
  try {
    const { data } = await axios.post(`${API_BASE}`, payload, {
      withCredentials: true,
    });
    return data.data.cart;
  } catch (error) {
    console.error("Error creating/updating cart:", error?.response?.data || error);
    throw error;
  }
};

/**
 * Update cart (PATCH)
 */
const updateCart = async (payload) => {
  try {
    const { data } = await axios.patch(`${API_BASE}`, payload, {
      withCredentials: true,
    });
    return data.data.cart;
  } catch (error) {
    console.error("Error updating cart:", error?.response?.data || error);
    throw error;
  }
};

/**
 * Delete cart
 */
const deleteCart = async () => {
  try {
    const { data } = await axios.delete(`${API_BASE}`, {
      withCredentials: true,
    });
    return data;
  } catch (error) {
    console.error("Error deleting cart:", error?.response?.data || error);
    throw error;
  }
};

/**
 * Add item to cart
 * @param {Object} item { productId, quantity, ... }
 */
const addItemToCart = async (item) => {
  try {
    const { data } = await axios.post(`${API_BASE}/items`, item, {
      withCredentials: true,
    });
    return data.data.cart;
  } catch (error) {
    console.error("Error adding item:", error?.response?.data || error);
    throw error;
  }
};

/**
 * Remove item from cart
 */
const removeItemFromCart = async (itemId) => {
  try {
    const { data } = await axios.delete(`${API_BASE}/items/${itemId}`, {
      withCredentials: true,
    });
    return data.data.cart;
  } catch (error) {
    console.error("Error removing item:", error?.response?.data || error);
    throw error;
  }
};

/**
 * Apply coupon to cart
 */
const applyCoupon = async (couponData) => {
  try {
    const { data } = await axios.post(`${API_BASE}/apply-coupon`, couponData, {
      withCredentials: true,
    });
    return data.data.cart;
  } catch (error) {
    console.error("Error applying coupon:", error?.response?.data || error);
    throw error;
  }
};

// guestCart.js

// Add item to cart
export const addToGuestCart = (item) => {
  const cart = JSON.parse(localStorage.getItem("guestCart") || "[]");
  cart.push(item);
  localStorage.setItem("guestCart", JSON.stringify(cart));
};

// Get all cart items
export const getGuestCart = () => {
  return JSON.parse(localStorage.getItem("guestCart") || "[]");
};

//Clear all cart items
export const clearGuestCart = () => {
  localStorage.removeItem("guestCart");
};

//Get cart items count
export const getGuestCartCount = () => {
  const cart = getGuestCart();
  return cart.length;
};

//Remove single item (by id for example)
export const removeFromGuestCart = (id) => {
  const cart = getGuestCart();
  const updatedCart = cart.filter((item) => item.id !== id);
  localStorage.setItem("guestCart", JSON.stringify(updatedCart));
};

//Update item quantity
export const updateGuestCartItem = (id, quantity) => {
  const cart = getGuestCart();
  const updatedCart = cart.map((item) =>
    item.id === id ? { ...item, quantity } : item
  );
  localStorage.setItem("guestCart", JSON.stringify(updatedCart));
};

//Check if item exists in cart
export const isInGuestCart = (id) => {
  const cart = getGuestCart();
  return cart.some((item) => item.id === id);
};

// Calculate total price
export const getGuestCartTotal = () => {
  const cart = getGuestCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};


/** ===================== HOOKS ===================== **/

/**
 * Get my cart
 */
export const useMyCart = () => {
  return useQuery({
    queryKey: ["cart"],
    queryFn: getMyCart,
  });
};

/**
 * Create or update cart
 */
export const useCreateOrUpdateCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createOrUpdateCart,
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
    },
  });
};

/**
 * Update cart
 */
export const useUpdateCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCart,
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
    },
  });
};

/**
 * Delete cart
 */
export const useDeleteCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCart,
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
    },
  });
};

/**
 * Add item
 */
export const useAddItemToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addItemToCart,
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
    },
  });
};

/**
 * Remove item
 */
export const useRemoveItemFromCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeItemFromCart,
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
    },
  });
};

/**
 * Apply coupon
 */
export const useApplyCoupon = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: applyCoupon,
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"]);
    },
  });
};
