'use client';

import React, { useState } from 'react';
import { useGetUserOrders, useCancelOrder } from '@/service/customerOrderService.js';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import OrderSectionSkeleton from '../../OrderSkelton.jsx';

function OrderSection() {
  const t = useTranslations('orders');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  
  const { data: ordersData, isLoading, isError, error } = useGetUserOrders(page, 10, statusFilter);


  const { mutate: cancelOrder, isLoading: isCancelling } = useCancelOrder();

  const handleCancelOrder = (orderId) => {
    if (confirm(t('areYouSure'))) {
      cancelOrder(orderId);
    }
  };

  const orderStatuses = ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'];

  return (
    <div className="space-y-6 ">
      {/* ... (Your header and filter UI is correct) ... */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">{t('myOrders')}</h3>
          <p className="text-slate-600">{t('desc')}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">{t('allStatuses')}</option>
            {orderStatuses.map(status => (
              <option key={status} value={status}>{t(`statuses.${status}`)}</option>
            ))}
          </select>
        </div>
      </div>

      {isLoading && <OrderSectionSkeleton />}

      {isError && <p className="text-red-500">{error.message}</p>}

      <div className="space-y-4">
   
        {ordersData?.orders?.length > 0 ? (

          ordersData.orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300">
            
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <div>
                  <p className="text-sm text-slate-500">{t('order')} #{order._id.slice(-6)}</p>
                  <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4 mt-2 sm:mt-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {t(`statuses.${order.status}`)}
                  </span>
                  <p className="text-lg font-bold text-slate-800">${order.totalAmount.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex -space-x-4">
                {order.orderItems.slice(0, 5).map(item => (
                  <img key={item._id} src={item.image} alt={item.name} className="w-12 h-12 rounded-full object-cover border-2 border-white"/>
                ))}
                {order.orderItems.length > 5 && (
                  <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-600 border-2 border-white">
                    +{order.orderItems.length - 5}
                  </div>
                )}
              </div>
              <div className="mt-4 flex flex-col sm:flex-row gap-3">
                <Link href={`/customer-profile/orders/${order._id}`} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-center hover:bg-blue-700 transition-colors">
                  {t('viewDetails')}
                </Link>
                {(order.status === 'pending' || order.status === 'processing') && (
                  <button
                    onClick={() => handleCancelOrder(order._id)}
                    disabled={isCancelling}
                    className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg text-center hover:bg-slate-50 transition-colors disabled:opacity-50"
                  >
                    {isCancelling ? t('cancelling') : t('cancelOrder')}
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          !isLoading && (
            <div className="text-center py-12 bg-slate-50 rounded-lg">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{t('noOrdersFound')}</h3>
              <p className="text-slate-600">{t('noOrdersSubtext')}</p>
            </div>
          )
        )}
      </div>

      {/* Pagination Controls  */}
      {ordersData?.pages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50">
            {t('previous')}
          </button>
          <span>{t('pageInfo', { page: ordersData.page, pages: ordersData.pages })}</span>
          <button onClick={() => setPage(p => (ordersData.page < ordersData.pages ? p + 1 : p))} disabled={ordersData.page === ordersData.pages} className="px-4 py-2 border border-slate-300 rounded-lg disabled:opacity-50">
            {t('next')}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderSection;