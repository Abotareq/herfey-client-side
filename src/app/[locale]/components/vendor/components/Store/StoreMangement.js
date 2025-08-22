'use client'
import { useState, useEffect } from 'react'

// Store Management Component
export function StoreManagement({ store, onUpdate, onClose }) {
  const [activeTab, setActiveTab] = useState('general')
  const [formData, setFormData] = useState({
    name: store?.name || '',
    description: store?.description || '',
    logoUrl: store?.logoUrl || '',
    address: {
      city: store?.address?.city || '',
      postalCode: store?.address?.postalCode || '',
      street: store?.address?.street || ''
    },
    policies: {
      shipping: store?.policies?.shipping || '',
      returns: store?.policies?.returns || ''
    }
  })
  const [isLoading, setIsLoading] = useState(false)
  const [activeSection, setActiveSection] = useState('basic')

  const tabs = [
    { id: 'general', label: 'General Info', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { id: 'products', label: 'Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
    { id: 'orders', label: 'Orders', icon: 'M16 11V7a4 4 0 00-8 0v4M8 11v6a2 2 0 002 2h4a2 2 0 002-2v-6M8 11h8' },
    { id: 'analytics', label: 'Analytics', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'settings', label: 'Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' }
  ]

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      onUpdate({ ...store, ...formData, updatedAt: new Date().toISOString() })
    } catch (error) {
      console.error('Error updating store:', error)
    } finally {
      setIsLoading(false)
    }

  }

  const mockProducts = [
    { id: 1, name: 'The Great Gatsby', price: 24.99, stock: 15, status: 'active' },
    { id: 2, name: 'To Kill a Mockingbird', price: 19.99, stock: 8, status: 'active' },
    { id: 3, name: '1984', price: 22.50, stock: 0, status: 'out_of_stock' },
    { id: 4, name: 'Pride and Prejudice', price: 18.99, stock: 12, status: 'active' }
  ]

  const mockOrders = [
    { id: '#ORD-001', customer: 'Ahmed Ali', total: 67.48, status: 'delivered', date: '2025-08-15' },
    { id: '#ORD-002', customer: 'Sarah Hassan', total: 42.99, status: 'processing', date: '2025-08-16' },
    { id: '#ORD-003', customer: 'Mohamed Sayed', total: 89.97, status: 'shipped', date: '2025-08-17' },
    { id: '#ORD-004', customer: 'Fatma Omar', total: 24.99, status: 'pending', date: '2025-08-18' }
  ]

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-2m-2 0H7m5 0v-9a3 3 0 00-6 0v9" />
                </svg>
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">Manage Store</h2>
                <p className="text-white/80">{store?.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-white/20 backdrop-blur-sm text-white rounded-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-110"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar Tabs */}
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-md'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                  </svg>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'general' && (
              <div className="p-8 space-y-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">General Information</h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Store Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          placeholder="Enter store name"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Description
                        </label>
                        <textarea
                          value={formData.description}
                          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                          rows={4}
                          className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 resize-none"
                          placeholder="Describe your store"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700 uppercase tracking-wide">
                          Logo URL
                        </label>
                        <input
                          type="url"
                          value={formData.logoUrl}
                          onChange={(e) => setFormData(prev => ({ ...prev, logoUrl: e.target.value }))}
                          className="w-full px-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          placeholder="https://example.com/logo.png"
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          Address Information
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-600">City</label>
                            <input
                              type="text"
                              value={formData.address.city}
                              onChange={(e) => setFormData(prev => ({ 
                                ...prev, 
                                address: { ...prev.address, city: e.target.value }
                              }))}
                              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                              placeholder="City"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-600">Postal Code</label>
                            <input
                              type="text"
                              value={formData.address.postalCode}
                              onChange={(e) => setFormData(prev => ({ 
                                ...prev, 
                                address: { ...prev.address, postalCode: e.target.value }
                              }))}
                              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                              placeholder="12345"
                            />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-600">Street Address</label>
                          <input
                            type="text"
                            value={formData.address.street}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              address: { ...prev.address, street: e.target.value }
                            }))}
                            className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                            placeholder="123 Main Street"
                          />
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                        <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                          <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                          </svg>
                          Store Policies
                        </h4>
                        
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-600">Shipping Policy</label>
                            <input
                              type="text"
                              value={formData.policies.shipping}
                              onChange={(e) => setFormData(prev => ({ 
                                ...prev, 
                                policies: { ...prev.policies, shipping: e.target.value }
                              }))}
                              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                              placeholder="e.g., Free shipping on orders over $50"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <label className="block text-sm font-medium text-gray-600">Return Policy</label>
                            <input
                              type="text"
                              value={formData.policies.returns}
                              onChange={(e) => setFormData(prev => ({ 
                                ...prev, 
                                policies: { ...prev.policies, returns: e.target.value }
                              }))}
                              className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                              placeholder="e.g., 30-day return policy"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Products Management</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105">
                    Add Product
                  </button>
                </div>
                
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Product</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stock</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {mockProducts.map((product) => (
                          <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="font-medium text-gray-900">{product.name}</div>
                            </td>
                            <td className="px-6 py-4 text-gray-600">${product.price}</td>
                            <td className="px-6 py-4 text-gray-600">{product.stock}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                product.status === 'active' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {product.status === 'active' ? 'Active' : 'Out of Stock'}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <button className="text-blue-600 hover:text-blue-800">Edit</button>
                                <button className="text-red-600 hover:text-red-800">Delete</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Orders</h3>
                
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Order ID</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Customer</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Total</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {mockOrders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 font-medium text-blue-600">{order.id}</td>
                            <td className="px-6 py-4 text-gray-900">{order.customer}</td>
                            <td className="px-6 py-4 text-gray-600">${order.total}</td>
                            <td className="px-6 py-4">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-gray-600">{order.date}</td>
                            <td className="px-6 py-4">
                              <button className="text-blue-600 hover:text-blue-800">View Details</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">Store Analytics</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm font-medium">Total Revenue</p>
                        <p className="text-3xl font-bold">$12,847</p>
                        <p className="text-blue-100 text-sm">+12% from last month</p>
                      </div>
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance Charts</h4>
                  <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
                    <p className="text-gray-500">Performance charts will be displayed here</p>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'reviews' && (
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-lg font-semibold text-gray-900">4.8</span>
                    <span className="text-gray-600">({mockReviews.length} reviews)</span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {mockReviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                            {review.customer.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{review.customer}</h4>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <svg key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">{formatDate(review.date)}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  )
}
