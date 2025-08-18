import axios from "axios";

const API_BASE = 'http://localhost:5000/api/store';

/** ===================== PUBLIC METHODS ===================== **/

/**
 * Get all stores (public)
 * @param {Object} params Optional query params: page, limit, search, status
 */
export const getAllStores = async ({
  page = 1,
  limit = 10,
  search,
  status,
  sort,
  ...extraFilters // allows passing brand, city, etc.
} = {}) => {
  console.log("Fetching all stores...");

  try {
    // Build query params
    const queryParams = new URLSearchParams({
      page,
      limit,
      ...(search ? { search } : {}),
      ...(status ? { status } : {}),
      ...(sort ? { sort } : {}),
      ...extraFilters,
    }).toString();

    // Call API
    const { data } = await axios.get(`${API_BASE}?${queryParams}`, {
      withCredentials: true, // include cookies if needed
    });

    console.log("All stores:", data);

    // Return normalized response
    return {
      stores: data?.data?.stores || [],
      pagination: data?.pagination || {},
      status: data?.status || "error",
    };
  } catch (error) {
    console.error(
      "Error fetching stores:",
      error?.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Get store by ID (public)
 * @param {string} storeId
 */
export const getStoreById = async (storeId) => {
    console.log("Fetching store by ID:", storeId);
    try {
        const { data } = await axios.get(`${API_BASE}/${storeId}`, {
        withCredentials: true,
        });
        console.log("Store by ID:", data);
        return data.data.store;
    } catch (error) {
        console.error(`Error fetching store ${storeId}:`, error);
        throw error;
    }
};

/** ===================== PRIVATE METHODS (Vendor/Admin only) ===================== **/

/**
 * Get stores of the authenticated vendor/admin
 * @param {Object} params Optional query params: page, limit, search, status
 */
export const getVendorStores = async ({ page = 1, limit = 10, search, status } = {}) => {
    console.log("Fetching vendor stores...");
    try {
        const queryParams = new URLSearchParams({
        page,
        limit,
        ...(search && { search }),
        ...(status && { status }),
        }).toString();

        const { data } = await axios.get(`${API_BASE}/vendor/vendor?${queryParams}`, {
        withCredentials: true, // cookie auth
        });

        console.log("Vendor stores:", data);
        return data.data; // JSEND-style { status, data, pagination }
    } catch (error) {
        console.error("Error fetching vendor stores:", error);
        throw error;
    }
};

/**
 * Create a new store (Vendor/Admin)
 * @param {FormData} formData
 */
export const createStore = async (formData) => {
    try {
        const { data } = await axios.post(API_BASE, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
        });
        console.log("Store created:", data);
        return data;
    } catch (error) {
        console.error("Error creating store:", error);
        throw error;
    }
};

/**
 * Update store by ID (Vendor/Admin)
 * @param {string} storeId
 * @param {FormData} formData
 */
export const updateStore = async (storeId, formData) => {
  try {
    const { data } = await axios.patch(`${API_BASE}/${storeId}`, formData, {
      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" },
    });
    console.log("Store updated:", data);
    return data;
  } catch (error) {
    console.error(`Error updating store ${storeId}:`, error);
    throw error;
  }
};

/**
 * Delete store by ID (Vendor/Admin)
 * @param {string} storeId
 */
export const deleteStore = async (storeId) => {
  try {
    const { data } = await axios.delete(`${API_BASE}/${storeId}`, {
      withCredentials: true,
    });
    console.log("Store deleted:", data);
    return data;
  } catch (error) {
    console.error(`Error deleting store ${storeId}:`, error);
    throw error;
  }
};