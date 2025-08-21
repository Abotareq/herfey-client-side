import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// axios to fetch 
const ProductAPI = axios.create({
    baseURL: BASE_URL,
    headers:{
        "Content-Type": "application/json"
    },
    // cookies
    withCredentials: true
})

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