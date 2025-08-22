'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProductAPI } from '../service/productService.js';
import { toast } from 'react-hot-toast'; 

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createProductAPI,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      console.log('Product created successfully!', data);
      toast.success('Product created successfully!');  
    },
    onError: (error) => {
      console.error('Failed to create product:', error.message);
      toast.error(`Error: ${error.message}`);  
    },
  });

  return mutation;
};