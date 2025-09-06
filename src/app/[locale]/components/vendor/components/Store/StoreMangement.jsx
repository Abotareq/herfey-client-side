'use client'
import { useTranslations } from 'next-intl'
import { useStoreContext } from '@/app/context/StoreContext'
import { useGetAllProducts } from '@/service/product'
import { useGetStoreOrdersByStoreId } from '@/service/customerOrderService'
import { useRouter } from 'next/navigation'
import { useState, useEffect, useMemo } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import { 
  Info, 
  Package, 
  ShoppingBag, 
  BarChart3, 
  Settings, 
  X, 
  Store,
  MapPin,
  Shield,
  Plus,
  RefreshCw,
  Edit,
  Trash2,
  Eye,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  DollarSign,
  TrendingUp,
  Users,
  Activity
} from 'lucide-react'


// Store Management Component
export function StoreManagement({ store, onUpdate, onClose }) {
  const [activeTab, setActiveTab] = useState('general')
  const router = useRouter()
  const { setStoreId } = useStoreContext()
  const t = useTranslations('StoreManagement')
  // Pagination states
  const [productsPage, setProductsPage] = useState(1)
  const [ordersPage, setOrdersPage] = useState(1)
  const ITEMS_PER_PAGE = 6

  const [formData, setFormData] = useState({
    name: store?.name || '',
    description: store?.description || '',
    logoUrl: store?.logoUrl || '',
    address: {
      city: store?.address?.city || '',
      postalCode: store?.address?.postalCode || '',
      street: store?.address?.street || '',
    },
    policies: {
      shipping: store?.policies?.shipping || '',
      returns: store?.policies?.returns || '',
    },
    status: store?.status || 'active',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [storeSettings, setStoreSettings] = useState({
    status: store?.status || 'active',
    maintenanceMode: false,
  })

  // Use the products service with pagination
  const {
    data: productsData,
    isLoading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = useGetAllProducts({
    storeId: store?._id,
    page: productsPage,
    limit: ITEMS_PER_PAGE,
  })

  // Use the orders service with pagination
  const {
    data: ordersData,
    isLoading: ordersLoading,
    error: ordersError,
    refetch: refetchOrders,
  } = useGetStoreOrdersByStoreId(store?._id, {
    page: ordersPage,
    limit: ITEMS_PER_PAGE,
  })

  const tabs = [
    { id: 'general', label: t('generalinfot'), icon: Info },
    { id: 'products', label: t('productst'), icon: Package },
    { id: 'orders', label: t('torders'), icon: ShoppingBag },
    { id: 'analytics', label: t('analyticst'), icon: BarChart3 },
    { id: 'settings', label: t('settingst'), icon: Settings }
  ]

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      onUpdate({ ...store, ...formData, updatedAt: new Date().toISOString() })
      toast.success(t('success'), {
        style: {
          border: '1px solid #FF8C00',
          padding: '16px',
          color: '#000000',
        },
        iconTheme: {
          primary: '#FF8C00',
          secondary: '#FFFFFF',
        },
      })
    } catch (error) {
      console.error('Error updating store:', error)
      toast.error(t('fail'), {
        style: {
          border: '1px solid #FF8C00',
          padding: '16px',
          color: '#000000',
        },
        iconTheme: {
          primary: '#FF8C00',
          secondary: '#FFFFFF',
        },
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (status) => {
    try {
      setStoreSettings(prev => ({ ...prev, status }))
      
      const statusMessage = status === 'active' ? t('storeactive') : t('storemain')
      const toastType = status === 'active' ? t('suucessstore') : t('default')
      
      if (toastType === 'success') {
        toast.success(statusMessage, {
          style: {
            border: '1px solid #10B981',
            padding: '16px',
            color: '#000000',
          },
          iconTheme: {
            primary: '#10B981',
            secondary: '#FFFFFF',
          },
        })
      } else {
        toast(statusMessage, {
          icon: '⚙️',
          style: {
            border: '1px solid #FF8C00',
            padding: '16px',
            color: '#000000',
          },
        })
      }
    } catch (error) {
      toast.error(t('taostfail'), {
        style: {
          border: '1px solid #EF4444',
          padding: '16px',
          color: '#000000',
        },
      })
    }
  }

  const handleDeleteStore = () => {
    const confirmDelete = window.confirm(t('window'))
    if (confirmDelete) {
      toast.error(t('toasterror'), {
        style: {
          border: '1px solid #EF4444',
          padding: '16px',
          color: '#000000',
        },
        iconTheme: {
          primary: '#EF4444',
          secondary: '#FFFFFF',
        },
        duration: 4000,
      })
    }
  }
  console.log("Data Fetched:", productsData,"orders", ordersData)
  // Process data
  const products = productsData?.products || []
  const productsPagination = { total: productsData?.totalProducts, totalPages: productsData?.totalPages || 0 }
  const orders = ordersData?.orders || ordersData || []
  const ordersPagination = { total: ordersData?.totalOrders, totalPages: ordersData?.totalPages || 0 }

  // Calculate analytics from real data
  const analytics = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => {
      return sum + (order.totalAmount || order.total || 0)
    }, 0)

    const totalOrders = orders.length
    const activeProducts = products.filter(product => 
      product.status === 'active' || product.stock > 0 || product.quantity > 0
    ).length

    const revenueGrowth = 12
    const ordersGrowth = 8

    const ordersByStatus = orders.reduce((acc, order) => {
      const status = order.status || 'pending'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {})

    return {
      totalRevenue,
      totalOrders,
      activeProducts,
      revenueGrowth,
      ordersGrowth,
      ordersByStatus,
    }
  }, [orders, products])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getStatusBadge = (status) => {
    const statusClasses = {
      delivered: 'bg-green-100 text-green-800',
      shipped: 'bg-blue-100 text-blue-800',
      processing: 'bg-orange-100 text-orange-800',
      pending: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    }

    return statusClasses[status] || statusClasses.pending
  }

  // Pagination component
  const Pagination = ({ currentPage, totalPages, onPageChange, isLoading }) => {
    return (
      <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="flex items-center text-sm text-gray-600">
          <span>
            {t('page')} {currentPage} of {totalPages}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-orange-50 hover:border-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />
            {t('prev')}
          </button>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-orange-50 hover:border-orange-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-1"
          >
            {t('next')}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header with Orange Gradient */}
        <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-red-500 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">{t('managestore')}</h2>
                <p className="text-white/80">{store?.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar Tabs */}
          <div className="w-64 bg-gradient-to-b from-orange-50 to-red-50 border-r border-orange-200 p-4">
            <div className="space-y-2">
              {tabs.map((tab) => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      activeTab === tab.id
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg'
                        : 'text-gray-600 hover:bg-white/80 hover:text-gray-900 hover:shadow-md'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto bg-gradient-to-br from-orange-25 to-red-25">
            {activeTab === 'general' && (
              <div className="p-8 space-y-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
                    {t('generalinfo')}
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          {t('storename')}
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-4 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-white/90"
                          placeholder={t('storenameplace')}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          {t('description')}
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          rows={4}
                          className="w-full px-4 py-4 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 resize-none bg-white/90"
                          placeholder={t('deecplace')}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          {t('logurl')}
                        </label>
                        <input
                          type="url"
                          value={formData.logoUrl}
                          onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
                          className="w-full px-4 py-4 border border-orange-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-white/90"
                          placeholder="https://example.com/logo.png"
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 space-y-4 border border-orange-100">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-orange-500" />
                          {t('addressinfo')}
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-600">{t('city')}</label>
                            <input
                              type="text"
                              value={formData.address.city}
                              onChange={(e) => setFormData(prev => ({ 
                                ...prev, 
                                address: { ...prev.address, city: e.target.value }
                              }))}
                              className="w-full px-3 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-white/80"
                              placeholder={t('city')}
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-600">{t('postalcode')}</label>
                            <input
                              type="text"
                              value={formData.address.postalCode}
                              onChange={(e) => setFormData(prev => ({ 
                                ...prev, 
                                address: { ...prev.address, postalCode: e.target.value }
                              }))}
                              className="w-full px-3 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-white/80"
                              placeholder="12345"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-600">{t('streetaddress')}</label>
                          <input
                            type="text"
                            value={formData.address.street}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              address: { ...prev.address, street: e.target.value }
                            }))}
                            className="w-full px-3 py-3 border border-orange-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-white/80"
                            placeholder="123 Main Street"
                          />
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 space-y-4 border border-green-200">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <Shield className="w-5 h-5 text-green-500" />
                          {t('storeploicies')}
                        </h4>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-600">{t('shipping')}</label>
                            <input
                              type="text"
                              value={formData.policies.shipping}
                              onChange={(e) => setFormData(prev => ({ 
                                ...prev, 
                                policies: { ...prev.policies, shipping: e.target.value }
                              }))}
                              className="w-full px-3 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/80"
                              placeholder={t('shippigplace')}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-600">{t('return')}</label>
                            <input
                              type="text"
                              value={formData.policies.returns}
                              onChange={(e) => setFormData(prev => ({ 
                                ...prev, 
                                policies: { ...prev.policies, returns: e.target.value }
                              }))}
                              className="w-full px-3 py-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-white/80"
                              placeholder={t('example')}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-6">
                    <button
                      onClick={handleSave}
                      disabled={isLoading}
                      className="px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 shadow-lg"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="w-5 h-5 animate-spin" />
                          t('saving')
                        </>
                      ) : (
                        t('saves')
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="p-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="text-white">
                        <h3 className="text-2xl font-bold">{t('productmanage')}</h3>
                        <p className="text-white/80 mt-1">
                          {productsLoading ? t('loading') : `${productsPagination.total || products.length} ${t('producttotal')}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => refetchProducts()}
                          disabled={productsLoading}
                          className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                        >
                          <RefreshCw className={`w-4 h-4 ${productsLoading ? 'animate-spin' : ''}`} />
                          {t('refreshb')}
                        </button>
                        <button
                          onClick={() => {
                            setStoreId(store._id);
                            router.push('/vendor-profile/add-products');
                            toast(t('toastw'), {
                              style: {
                                border: '1px solid #FF8C00',
                                padding: '16px',
                                color: '#000000',
                              },
                              iconTheme: {
                                primary: '#FF8C00',
                                secondary: '#FFFFFF',
                              },
                            })
                          }}
                          className="px-4 py-2 bg-white text-orange-600 rounded-xl hover:bg-orange-50 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          {t('addb')}
                        </button>
                      </div>
                    </div>
                  </div>

                  {productsError && (
                    <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <div className="flex items-center gap-2 text-red-800">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-medium">{t('error')}:</span>
                        <span>{productsError.message}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Products Content - Scrollable */}
                  <div className="max-h-96 overflow-y-auto">
                    {productsLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="flex items-center gap-3">
                          <RefreshCw className="w-6 h-6 text-orange-500 animate-spin" />
                          <span className="text-gray-600">{t('loading')}</span>
                        </div>
                      </div>
                    ) : products.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <Package className="w-12 h-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noproducts')}</h3>
                        <p className="text-gray-600 mb-4">{t('desc')}</p>
                        <button
                          onClick={() => {
                            setStoreId(store._id);
                            router.push('/vendor-profile/add-products');
                          }}
                          className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all duration-300 flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          {t('add')}
                        </button>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gradient-to-r from-orange-100 to-red-100 border-b border-orange-200">
                            <tr>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t('product')}</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t('price')}</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t('stock')}</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t('pstatus')}</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t('pstatus')}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {products.map((product) => (
                              <tr key={product._id || product.id} className="hover:bg-orange-50 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    {product.images?.[0] && (
                                      <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-10 h-10 rounded-lg object-cover border border-orange-200"
                                      />
                                    )}
                                    <div>
                                      <div className="font-medium text-gray-900">{product.name}</div>
                                      {product.category?.name && (
                                        <div className="text-sm text-gray-500">{product.category.name}</div>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                  {formatCurrency(product.price || 0)}
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                  {product.stock || product.quantity || 0}
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    product.status === 'active' || (product.stock > 0 || product.quantity > 0) ? 
                                      'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                  }`}>
                                    {product.status === 'active' || (product.stock > 0 || product.quantity > 0) ? 
                                      'Active' : 'Out of Stock'}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <button className="text-orange-500 hover:text-orange-700 font-medium flex items-center gap-1">
                                      <Edit className="w-4 h-4" />
                                      {t('pedit')}
                                    </button>
                                    <button className="text-red-600 hover:text-red-800 font-medium flex items-center gap-1">
                                      <Trash2 className="w-4 h-4" />
                                      {t('pdelete')}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Products Pagination */}
                  {products.length > 0 && (
                    <Pagination 
                      currentPage={productsPage}
                      totalPages={productsPagination.totalPages || 1}
                      onPageChange={setProductsPage}
                      isLoading={productsLoading}
                    />
                  )}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="p-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="text-white">
                        <h3 className="text-2xl font-bold">{t('porders')}</h3>
                        <p className="text-white/80 mt-1">
                          {ordersLoading ? t('loadingorders') : `${ordersPagination.total || orders.length} ${t('orderst')}`}
                        </p>
                      </div>
                      <button
                        onClick={() => refetchOrders()}
                        disabled={ordersLoading}
                        className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                      >
                        <RefreshCw className={`w-4 h-4 ${ordersLoading ? 'animate-spin' : ''}`} />
                        {t('brefresh')}
                      </button>
                    </div>
                  </div>

                  {ordersError && (
                    <div className="mx-6 mt-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <div className="flex items-center gap-2 text-red-800">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-medium">{t('orderserror')}:</span>
                        <span>{ordersError.message}</span>
                      </div>
                    </div>
                  )}
                  
                  {/* Orders Content - Scrollable */}
                  <div className="max-h-96 overflow-y-auto">
                    {ordersLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="flex items-center gap-3">
                          <RefreshCw className="w-6 h-6 text-orange-500 animate-spin" />
                          <span className="text-gray-600">{t('loadingorders')}</span>
                        </div>
                      </div>
                    ) : orders.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-12">
                        <ShoppingBag className="w-12 h-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">{t('oderserror')}</h3>
                        <p className="text-gray-600">{t('noordersdesc')}</p>
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gradient-to-r from-orange-100 to-red-100 border-b border-orange-200">
                            <tr>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order ID</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t('customer')}</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t('total')}</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t('status')}</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t('date')}</th>
                              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">{t('actions')}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                            {orders.map((order) => (
                              <tr key={order._id || order.id} className="hover:bg-orange-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-orange-600">
                                  #{order.orderNumber || order._id?.slice(-6) || t('na')}
                                </td>
                                <td className="px-6 py-4 text-gray-900">
                                  {order.customer?.name || order.customerName || order.user?.name || t('na')}
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                  {formatCurrency(order.totalAmount || order.total || 0)}
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(order.status)}`}>
                                    {order.status?.charAt(0).toUpperCase() + order.status?.slice(1) || t('pending')}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">
                                  {formatDate(order.createdAt || order.orderDate || new Date())}
                                </td>
                                <td className="px-6 py-4">
                                  <button 
                                    className="text-orange-500 hover:text-orange-700 font-medium flex items-center gap-1"
                                    onClick={() => {
                                      toast('Order details will open in a new window.', {
                                        style: {
                                          border: '1px solid #FF8C00',
                                          padding: '16px',
                                          color: '#000000',
                                        },
                                        iconTheme: {
                                          primary: '#FF8C00',
                                          secondary: '#FFFFFF',
                                        },
                                      })
                                    }}
                                  >
                                    <Eye className="w-4 h-4" />
                                    {t('details')}
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Orders Pagination */}
                  {orders.length > 0 && (
                    <Pagination 
                      currentPage={ordersPage}
                      totalPages={ordersPagination.totalPages || 1}
                      onPageChange={setOrdersPage}
                      isLoading={ordersLoading}
                    />
                  )}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="p-8 space-y-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
                    {t('storeanalysis')}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-orange-100 text-sm font-medium">{t('totalrevenue')}</p>
                          <p className="text-3xl font-bold">{formatCurrency(analytics.totalRevenue)}</p>
                          <p className="text-orange-100 text-sm">+{analytics.revenueGrowth}% {t('percent')}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <DollarSign className="w-6 h-6" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100 text-sm font-medium">{t('orders')}</p>
                          <p className="text-3xl font-bold">{analytics.totalOrders}</p>
                          <p className="text-green-100 text-sm">+{analytics.ordersGrowth}% {t('percent')}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <ShoppingBag className="w-6 h-6" />
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100 text-sm font-medium">{t('active')}</p>
                          <p className="text-3xl font-bold">{analytics.activeProducts}</p>
                          <p className="text-purple-100 text-sm">{t('totslinvetory')}</p>
                        </div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                          <Package className="w-6 h-6" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-200 p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-orange-500" />
                        {t('order')}
                      </h4>
                      {Object.keys(analytics.ordersByStatus).length > 0 ? (
                        <div className="space-y-3">
                          {Object.entries(analytics.ordersByStatus).map(([status, count]) => (
                            <div key={status} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-3 h-3 rounded-full ${
                                  status === 'delivered' ? 'bg-green-500' :
                                  status === 'shipped' ? 'bg-blue-500' :
                                  status === 'processing' ? 'bg-orange-500' :
                                  status === 'cancelled' ? 'bg-red-500' : 'bg-gray-500'
                                }`}></div>
                                <span className="text-gray-700 capitalize">{status}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-gray-900">{count}</span>
                                <span className="text-sm text-gray-500">
                                  ({analytics.totalOrders > 0 ? Math.round((count / analytics.totalOrders) * 100) : 0}%)
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-32 text-gray-500">
                          <div className="text-center">
                            <Activity className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                            <p>{t('noorder')}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-200 p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                       {t('recent')}
                      </h4>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-orange-100">
                          <span className="text-gray-600">{t('value')}</span>
                          <span className="font-medium text-gray-900">
                            {formatCurrency(analytics.totalOrders > 0 ? analytics.totalRevenue / analytics.totalOrders : 0)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-orange-100">
                          <span className="text-gray-600">{t('catchingsize')}</span>
                          <span className="font-medium text-gray-900">{products.length} {t('products')}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-white/60 rounded-lg border border-orange-100">
                          <span className="text-gray-600">{t('storestats')}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            storeSettings.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {storeSettings.status.charAt(0).toUpperCase() + storeSettings.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="p-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-orange-100">
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
                    {t('settings')}
                  </h3>
                  <p className="text-gray-600 mb-6">{t('settingsdesc')}</p>
                  
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl border border-orange-200 p-6">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-orange-500" />
                        {t('storestatus')}
                      </h4>
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700">{t('stores')}</label>
                          <div className="flex items-center space-x-4">
                            <button 
                              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                                storeSettings.status === 'active' 
                                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                              onClick={() => handleStatusChange('active')}
                            >
                              <CheckCircle className="w-4 h-4" />
                              {t('Active')}
                            </button>
                            <button 
                              className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                                storeSettings.status === 'maintenance' 
                                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg' 
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                              onClick={() => handleStatusChange('maintenance')}
                            >
                              <Settings className="w-4 h-4" />
                              {t('maintaince')}
                            </button>
                          </div>
                          <p className="text-sm text-gray-500">
                            {storeSettings.status === 'active' 
                              ? t('livestore') 
                              : t('storemaintance')}
                          </p>
                        </div>

                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-gray-700">{t('quickactions')}</label>
                          <div className="flex flex-wrap gap-3">
                            <button 
                              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
                              onClick={() => {
                                refetchProducts();
                                refetchOrders();
                                toast.success(t('storedata'), {
                                  style: {
                                    border: '1px solid #3B82F6',
                                    padding: '16px',
                                    color: '#000000',
                                  },
                                  iconTheme: {
                                    primary: '#3B82F6',
                                    secondary: '#FFFFFF',
                                  },
                                })
                              }}
                            >
                              <RefreshCw className="w-4 h-4" />
                              {t('refresh')}
                            </button>
                            <button 
                              className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-2"
                              onClick={() => {
                                toast.success(t('storeanaysis'), {
                                  style: {
                                    border: '1px solid #10B981',
                                    padding: '16px',
                                    color: '#000000',
                                  },
                                  iconTheme: {
                                    primary: '#10B981',
                                    secondary: '#FFFFFF',
                                  },
                                })
                              }}
                            >
                              <TrendingUp className="w-4 h-4" />
                              {t('update')}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6">
                      <h4 className="text-lg font-semibold text-red-800 mb-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5" />
                        {t('dangerzone')}
                      </h4>
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <p className="text-red-700 font-medium">{t('delete')}</p>
                          <p className="text-sm text-red-600">
                           {t('deletedesc')}
                          </p>
                          <button 
                            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                            onClick={handleDeleteStore}
                          >
                            <Trash2 className="w-4 h-4" />
                            {t('permently')}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}