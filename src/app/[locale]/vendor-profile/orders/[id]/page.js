"use client"
import React, { useState } from 'react'
import { useGetSellerOrderById, useUpdateVendorOrderStatus } from '@/service/customerOrderService' // Update with your actual path
import { useParams } from 'next/navigation'
import Breadcrumbs from '@/app/[locale]/components/Breadcrumbs'
import { useTranslations } from 'next-intl'

// Loading Skeleton Component
function OrderDetailsSkeleton() {
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 p-8 mb-8">
          <div className="animate-pulse">
            <div className="flex items-center justify-between mb-6">
              <div className="h-8 bg-gradient-to-r from-orange-200 to-orange-300 rounded-lg w-64"></div>
              <div className="h-10 bg-gradient-to-r from-orange-200 to-orange-300 rounded-xl w-32"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-orange-200 rounded w-20"></div>
                  <div className="h-6 bg-orange-300 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Items Skeleton */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 p-8 mb-8">
          <div className="animate-pulse">
            <div className="h-6 bg-gradient-to-r from-orange-200 to-orange-300 rounded w-32 mb-6"></div>
            {[1, 2].map((i) => (
              <div key={i} className="flex space-x-4 p-4 border border-orange-100 rounded-xl mb-4">
                <div className="w-16 h-16 bg-orange-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 bg-orange-200 rounded w-3/4"></div>
                  <div className="h-4 bg-orange-200 rounded w-1/2"></div>
                  <div className="h-4 bg-orange-200 rounded w-1/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Info Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 p-8">
            <div className="animate-pulse">
              <div className="h-6 bg-gradient-to-r from-orange-200 to-orange-300 rounded w-40 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 bg-orange-200 rounded w-full"></div>
                ))}
              </div>
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 p-8">
            <div className="animate-pulse">
              <div className="h-6 bg-gradient-to-r from-orange-200 to-orange-300 rounded w-32 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 bg-orange-200 rounded w-full"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Status Badge Component
function StatusBadge({ status }) {
  const statusConfig = {
    pending: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: '⏳' },
    confirmed: { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '✅' },
    preparing: { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: '👨‍🍳' },
    ready: { color: 'bg-green-100 text-green-800 border-green-200', icon: '📦' },
    delivered: { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: '🚚' },
    cancelled: { color: 'bg-red-100 text-red-800 border-red-200', icon: '❌' }
  }

  const config = statusConfig[status] || statusConfig.pending

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${config.color}`}>
      <span className="mr-1">{config.icon}</span>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

// Main Order Details Component
export default function OrderDetailsPage() {
  const [selectedStatus, setSelectedStatus] = useState('')
  const [showStatusModal, setShowStatusModal] = useState(false)
  const params = useParams()
  // Fetch order data
  const { data: order, isLoading, error } = useGetSellerOrderById(params.id)
  console.log('Fetched order data:', order)
  // Update status mutation
  const updateStatusMutation = useUpdateVendorOrderStatus()
  const t = useTranslations('orderdetails')
  // Handle status update
  const handleStatusUpdate = async () => {
    if (!selectedStatus) return

    try {
      await updateStatusMutation.mutateAsync({
        orderId: params.id,
        status: selectedStatus
      })
      setShowStatusModal(false)
      setSelectedStatus('')
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  // Loading state
  if (isLoading) {
    return <OrderDetailsSkeleton />
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-red-700 mb-2">{t('error')}</h2>
          <p className="text-red-600">{t('errordes')}</p>
        </div>
      </div>
    )
  }

  const statusOptions = [
    { value: 'pending', label: t('pending'), icon: '⏳' },
    { value: 'confirmed', label: t('confirmed'), icon: '✅' },
    { value: 'preparing', label: t('preparing'), icon: '👨‍🍳' },
    { value: 'ready', label: t('ready'), icon: '📦' },
    { value: 'delivered', label: t('delevired'), icon: '🚚' },
    { value: 'cancelled', label: t('cancelled'), icon: '❌' }
  ]

  return (
    // <Breadcrumbs >
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-orange-200/20 to-orange-300/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-orange-200/20 to-orange-300/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-8">
        {/* Header Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 p-8 mb-8 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent mb-2">
                {t('order')} #{order?._id?.slice(-8)}
              </h1>
              <p className="text-gray-600">{t('orderdetails')}</p>
            </div>
            <button
              onClick={() => setShowStatusModal(true)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {t('update')}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
              <p className="text-sm text-gray-600 mb-1">{t('status')}</p>
              <StatusBadge status={order.status} />
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
              <p className="text-sm text-gray-600 mb-1">{t('orderdate')}</p>
              <p className="font-semibold text-orange-800">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl border border-orange-200">
              <p className="text-sm text-gray-600 mb-1">{t('payment')}</p>
              <p className="font-semibold text-orange-800">
                {order.paymentMethod === 'cod' ? t('cash') : order.paymentMethod}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 p-8 mb-8 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
              {t('orderitems')} ({order.orderItems?.length || 0})
            </h2>
          </div>

          <div className="space-y-4">
            {order.orderItems?.map((item, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl hover:shadow-md transition-all duration-300">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-200 to-orange-300 rounded-lg flex items-center justify-center">
                  <span className="text-2xl">🛍️</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-800 text-lg">{item.name}</h3>
                  <p className="text-gray-600">{t('quantity')}: {item.quantity}</p>
                  <p className="text-orange-600 font-medium">${item.price} {t('each')}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-orange-800">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-orange-200">
            <div className="flex justify-between items-center bg-gradient-to-r from-orange-100 to-orange-200 p-4 rounded-xl">
              <span className="text-lg font-semibold text-orange-800">{t('total')}:</span>
              <span className="text-2xl font-bold text-orange-800">${order.totalAmount?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Customer & Delivery Info */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Customer Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 p-8 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                {t('customerinfo')}
              </h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">👤 {t('name')}:</span>
                <span className="font-medium text-orange-800">{order.user?.userName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">📧 {t('email')}:</span>
                <span className="font-medium text-orange-800">{order.user?.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">📱 {t('phone')}:</span>
                <span className="font-medium text-orange-800">{order.user?.phone}</span>
              </div>
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 p-8 hover:shadow-xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                {t('delivery')}
              </h3>
            </div>
            <div className="space-y-2 text-gray-700">
              <p className="font-medium text-orange-800"><span className='font-semibold text-orange-800'>Street</span> : {order.shippingAddress?.street}</p>
              <p><span className='font-semibold text-orange-800'>{t('city')}</span> : {order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
              <p><span className='font-semibold text-orange-800'>{t('postalcode')}</span> : {order.shippingAddress?.postalCode}</p>
              <p className="text-sm text-gray-600 mt-3">
                📝 {t('notes')}: {order.shippingNotes || t('special')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl border border-orange-100 p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
                {t('updateo')}
              </h3>
              <button
                onClick={() => setShowStatusModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-3 mb-8">
              {statusOptions.map((status) => (
                <label key={status.value} className="flex items-center space-x-3 p-3 rounded-xl border border-orange-200 hover:bg-orange-50 cursor-pointer transition-colors">
                  <input
                    type="radio"
                    name="status"
                    value={status.value}
                    checked={selectedStatus === status.value}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="text-orange-500 focus:ring-orange-400"
                  />
                  <span className="text-lg">{status.icon}</span>
                  <span className="font-medium text-gray-800">{status.label}</span>
                </label>
              ))}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setShowStatusModal(false)}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={!selectedStatus || updateStatusMutation.isLoading}
                className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 transition-all duration-300"
              >
                {updateStatusMutation.isLoading ? t('updating') : t('updates')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    // </Breadcrumbs>
  )
}