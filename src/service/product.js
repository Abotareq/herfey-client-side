import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE}`;

// axios to fetch 
const ProductAPI = axios.create({
    baseURL: BASE_URL,
    headers:{
        "Content-Type": "application/json"
    },
    // cookies
    withCredentials: true
})

export const createProductAPI = async (formData) => {

  try {
    const response = await ProductAPI.post('/product', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'An unexpected error occurred');
  }
};
// helper function Get All
const getAllProducts = async(params = {}) => {
    const response = await ProductAPI.get('/product', {params});
    return response.data
}
// helper function to get product by Id
const getProductById = async(productId) => {
    const response = await ProductAPI.get(`/product/${productId}`);
    return response.data
}

// get all products
export const useGetAllProducts = (params = {}) => {
    return useQuery({
        queryKey: ['product', params],
        queryFn: () => getAllProducts(params),
        onError: (error) => {
            console.error("Failed to get All Products",
                error.response?.data?.message || error.message
            )
        }
    })
}
// get product by Id
export const useGetProductById = (productId) => {
    return useQuery({
        queryKey: ['product', productId],
        queryFn: () => getProductById(productId),
        enabled: !!productId,
        onError: (error) => {
            console.error("failed to get product by id",
                error.response?.data?.message || error.message
            )
        }
    })
}