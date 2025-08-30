'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createProductAPI } from '../service/product.js';
import { toast } from 'react-hot-toast'; 
import { useTranslations } from 'next-intl';

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const t = useTranslations('products')
  const mutation = useMutation({
    mutationFn: createProductAPI,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      
      console.log('Product created successfully!', data);
      toast.success(t('productcreated'));  
    },
    onError: (error) => {
      console.error(t('productfail'), error.message);
      toast.error(`Error: ${error.message}`);  
    },
  });

  return mutation;
};