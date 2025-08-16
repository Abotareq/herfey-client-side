'use client'
import { useState } from 'react'

export default function StoresSection({ userStores, setUserStores }) {
  const [showStoreForm, setShowStoreForm] = useState(false)
  const [editingStore, setEditingStore] = useState(null)
  const [newStore, setNewStore] = useState({
    name: '',
    description: '',
    logoUrl: '',
    address: {
      city: '',
      postalCode: '',
      street: ''
    },
    policies: {
      shipping: '',
      returns: ''
    }
  })

  const handleAddStore = () => {
    const storeWithId = { 
      ...newStore, 
      _id: Date.now().toString(),
      slug: newStore.name.toLowerCase().replace(/\s+/g, '-'),
      status: 'pending',
      categorieCount: 0,
      couponsUsed: 0,
      productCount: 0,
      ordersCount: 0,
      location: { coordinates: [31.2357, 30.0444] }
    }
    setUserStores(prev => [...prev, storeWithId])
    setNewStore({
      name: '',
      description: '',
      logoUrl: '',
      address: { city: '', postalCode: '', street: '' },
      policies: { shipping: '', returns: '' }
    })
    setShowStoreForm(false)
  }

  const handleEditStore = (store) => {
    setEditingStore(store)
    setNewStore({ ...store })
  }

  const handleUpdateStore = () => {
    setUserStores(prev => prev.map(store => 
      store._id === editingStore._id ? { ...newStore } : store
    ))
    setNewStore({
      name: '',
      description: '',
      logoUrl: '',
      address: { city: '', postalCode: '', street: '' },
      policies: { shipping: '', returns: '' }
    })
    setEditingStore(null)
  }

  const handleCancelEdit = () => {
    setEditingStore(null)
    setNewStore({
      name: '',
      description: '',
      logoUrl: '',
      address: { city: '', postalCode: '', street: '' },
      policies: { shipping: '', returns: '' }
    })
    setShowStoreForm(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">My Stores</h3>
          <p className="text-slate-600">Manage your stores and their settings</p>
        </div>
        <button
          onClick={() => setShowStoreForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Store</span>
        </button>
      </div>

      {/* Add/Edit Store Form */}
      {(showStoreForm || editingStore) && (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">
            {editingStore ? 'Edit Store' : 'Add New Store'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Store Name</label>
              <input
                type="text"
                value={newStore.name}
                onChange={(e) => setNewStore(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Store name"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Description</label>
              <textarea
                value={newStore.description}
                onChange={(e) => setNewStore(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Store description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
              <input
                type="text"
                value={newStore.address?.city || ''}
                onChange={(e) => setNewStore(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, city: e.target.value }
                }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Postal Code</label>
              <input
                type="number"
                value={newStore.address?.postalCode || ''}
                onChange={(e) => setNewStore(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, postalCode: e.target.value }
                }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Postal code"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">Street Address</label>
              <input
                type="text"
                value={newStore.address?.street || ''}
                onChange={(e) => setNewStore(prev => ({ 
                  ...prev, 
                  address: { ...prev.address, street: e.target.value }
                }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Street address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Shipping Policy</label>
              <input
                type="text"
                value={newStore.policies?.shipping || ''}
                onChange={(e) => setNewStore(prev => ({ 
                  ...prev, 
                  policies: { ...prev.policies, shipping: e.target.value }
                }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Free shipping on orders over $50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Return Policy</label>
              <input
                type="text"
                value={newStore.policies?.returns || ''}
                onChange={(e) => setNewStore(prev => ({ 
                  ...prev, 
                  policies: { ...prev.policies, returns: e.target.value }
                }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 30-day return policy"
              />
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={handleCancelEdit}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={editingStore ? handleUpdateStore : handleAddStore}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingStore ? 'Update Store' : 'Add Store'}
            </button>
          </div>
        </div>
      )}

      {/* Stores List */}
      <div className="grid grid-cols-1 gap-6">
        {userStores.map((store) => (
          <div key={store._id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <img 
                src={store.logoUrl || "https://readymadeui.com/images/product1.webp"} 
                alt={store.name}
                className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-slate-900 text-lg">{store.name}</h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        store.status === 'approved' ? 'bg-green-100 text-green-700' :
                        store.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        store.status === 'rejected' ? 'bg-red-100 text-red-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {store.status}
                      </span>
                    </div>
                    <p className="text-slate-600 mb-3">{store.description}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditStore(store)}
                      className="text-slate-400 hover:text-blue-600 transition-colors"
                      title="Edit store"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Store Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center bg-slate-50 rounded-lg p-3">
                    <p className="text-lg font-bold text-blue-600">{store.productCount}</p>
                    <p className="text-xs text-slate-600">Products</p>
                  </div>
                  <div className="text-center bg-slate-50 rounded-lg p-3">
                    <p className="text-lg font-bold text-green-600">{store.ordersCount}</p>
                    <p className="text-xs text-slate-600">Orders</p>
                  </div>
                  <div className="text-center bg-slate-50 rounded-lg p-3">
                    <p className="text-lg font-bold text-purple-600">{store.categorieCount}</p>
                    <p className="text-xs text-slate-600">Categories</p>
                  </div>
                  <div className="text-center bg-slate-50 rounded-lg p-3">
                    <p className="text-lg font-bold text-amber-600">{store.couponsUsed}</p>
                    <p className="text-xs text-slate-600">Coupons Used</p>
                  </div>
                </div>

                {/* Address and Policies */}
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span>{store.address.street}, {store.address.city} {store.address.postalCode}</span>
                  </div>
                  {store.policies.shipping && (
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                      </svg>
                      <span>{store.policies.shipping}</span>
                    </div>
                  )}
                  {store.policies.returns && (
                    <div className="flex items-center space-x-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4m6 0l-5 5-3-3" />
                      </svg>
                      <span>{store.policies.returns}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}