import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';

const API_BASE = `${process.env.NEXT_PUBLIC_API_BASE}/api/category`;

// Axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
  
  // No withCredentials, as cookies are not needed
});

// Helper function for GET requests
const getRequest = async (endpoint, params = {}) => {
  const response = await apiClient.get(endpoint, { params });
  console.log(`Request to ${endpoint} returned status: ${response.status}`);
  console.log(`Response data for ${endpoint}:`, response.data);
  // Extract the correct field from response.data.data
  const data = response.data.data;
  if (endpoint === '/') {
    return data.allCategories || data;
  } else if (endpoint.startsWith('/filter')) {
    return data.result || data;
  } else if (endpoint.startsWith('/search')) {
    return data.category || data;
  } else {
    return data.category || data; // For /:id
  }
};

// Custom hook to invalidate categories cache
export const useInvalidateCategories = () => {
  const queryClient = useQueryClient();
  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['categories'] });
    console.log('Invalidated categories cache');
  };
  return invalidate;
};

// Fetch all categories
export const useGetAllCategories = () => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['categories'],
    queryFn: () => getRequest('/'),
    onSuccess: (data) => {
      console.log('Successfully fetched all categories:', data);
    },
    onError: (error) => {
      console.error('Error fetching all categories:', error.response?.data?.message || error.message);
    },
  });
};

// Fetch category by ID
export const useGetCategoryById = (id) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['category', id],
    queryFn: () => getRequest(`/${id}`),
    enabled: !!id, // Only fetch if ID is provided
    onSuccess: (data) => {
      console.log(`Successfully fetched category with ID ${id}:`, data);
    },
    onError: (error) => {
      console.error(`Error fetching category with ID ${id}:`, error.response?.data?.message || error.message);
    },
  });
};

// Filter categories by name
export const useFilterCategoriesByName = (name) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['categories', 'filter', name],
    queryFn: () => getRequest('/filter', { name }),
    enabled: !!name, // Only fetch if name is provided
    onSuccess: (data) => {
      console.log(`Successfully filtered categories by name ${name}:`, data);
    },
    onError: (error) => {
      console.error(`Error filtering categories by name ${name}:`, error.response?.data?.message || error.message);
    },
  });
};

// Search categories by name
export const useSearchCategoriesByName = (searchTerm) => {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['categories', 'search', searchTerm],
    queryFn: () => getRequest('/search', { name: searchTerm }),
    enabled: !!searchTerm, // Only fetch if searchTerm is provided
    onSuccess: (data) => {
      console.log(`Successfully searched categories with term ${searchTerm}:`, data);
    },
    onError: (error) => {
      console.error(`Error searching categories with term ${searchTerm}:`, error.response?.data?.message || error.message);
    },
  });
};

// Example mutation for creating a category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (categoryData) => apiClient.post('/', categoryData).then(res => res.data.data.category),
    onSuccess: (data) => {
      console.log('Category created successfully:', data);
      queryClient.invalidateQueries({ queryKey: ['categories'] }); // Refresh categories list
    },
    onError: (error) => {
      console.error('Error creating category:', error.response?.data?.message || error.message);
    },
  });
};