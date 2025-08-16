'use client';
import { useState } from 'react'

function CouponsSection({ userCoupons, setUserCoupons }) {
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('newest')
  const [showCouponForm, setShowCouponForm] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState(null)
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    type: 'percentage',
    value: 0,
    minCartTotal: 0,
    maxDiscount: '',
    expiryDate: '',
    usageLimit: 1,
    active: true
  })

  const filteredCoupons = userCoupons.filter(coupon => {
    if (filterStatus === 'all') return true
    if (filterStatus === 'active') return coupon.active && new Date(coupon.expiryDate) > new Date()
    if (filterStatus === 'expired') return new Date(coupon.expiryDate) <= new Date()
    if (filterStatus === 'inactive') return !coupon.active
    return true
  })

  const sortedCoupons = [...filteredCoupons].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.expiryDate) - new Date(a.expiryDate)
      case 'oldest':
        return new Date(a.expiryDate) - new Date(b.expiryDate)
      case 'mostUsed':
        return b.usedCount - a.usedCount
      case 'leastUsed':
        return a.usedCount - b.usedCount
      default:
        return 0
    }
  })

  const handleAddCoupon = () => {
    const couponWithId = { 
      ...newCoupon, 
      _id: Date.now().toString(),
      usedCount: 0,
      maxDiscount: newCoupon.maxDiscount === '' ? null : Number(newCoupon.maxDiscount)
    }
    setUserCoupons(prev => [...prev, couponWithId])
    setNewCoupon({
      code: '',
      type: 'percentage',
      value: 0,
      minCartTotal: 0,
      maxDiscount: '',
      expiryDate: '',
      usageLimit: 1,
      active: true
    })
    setShowCouponForm(false)
  }

  const handleEditCoupon = (coupon) => {
    setEditingCoupon(coupon)
    setNewCoupon({ 
      ...coupon, 
      maxDiscount: coupon.maxDiscount === null ? '' : coupon.maxDiscount.toString()
    })
  }

  const handleUpdateCoupon = () => {
    setUserCoupons(prev => prev.map(coupon => 
      coupon._id === editingCoupon._id 
        ? { 
            ...newCoupon, 
            maxDiscount: newCoupon.maxDiscount === '' ? null : Number(newCoupon.maxDiscount)
          }
        : coupon
    ))
    setNewCoupon({
      code: '',
      type: 'percentage',
      value: 0,
      minCartTotal: 0,
      maxDiscount: '',
      expiryDate: '',
      usageLimit: 1,
      active: true
    })
    setEditingCoupon(null)
  }

  const handleDeleteCoupon = (couponId) => {
    setUserCoupons(prev => prev.filter(coupon => coupon._id !== couponId))
  }

  const handleCancelCouponEdit = () => {
    setEditingCoupon(null)
    setShowCouponForm(false)
    setNewCoupon({
      code: '',
      type: 'percentage',
      value: 0,
      minCartTotal: 0,
      maxDiscount: '',
      expiryDate: '',
      usageLimit: 1,
      active: true
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-bold text-slate-900">My Coupons</h3>
          <p className="text-slate-600">Create and manage discount coupons for your stores</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Coupons</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="inactive">Inactive</option>
          </select>
          
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="mostUsed">Most Used</option>
            <option value="leastUsed">Least Used</option>
          </select>

          <button
            onClick={() => setShowCouponForm(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Add Coupon</span>
          </button>
        </div>
      </div>

      {/* Coupon Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
          <p className="text-2xl font-bold text-blue-600">{userCoupons.length}</p>
          <p className="text-slate-600 text-sm">Total Coupons</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
          <p className="text-2xl font-bold text-green-600">
            {userCoupons.filter(c => c.active && new Date(c.expiryDate) > new Date()).length}
          </p>
          <p className="text-slate-600 text-sm">Active Coupons</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
          <p className="text-2xl font-bold text-red-600">
            {userCoupons.filter(c => new Date(c.expiryDate) <= new Date()).length}
          </p>
          <p className="text-slate-600 text-sm">Expired Coupons</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
          <p className="text-2xl font-bold text-amber-600">
            {userCoupons.reduce((acc, c) => acc + c.usedCount, 0)}
          </p>
          <p className="text-slate-600 text-sm">Total Usage</p>
        </div>
      </div>

      {/* Add/Edit Coupon Form */}
      {(showCouponForm || editingCoupon) && (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">
            {editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Coupon Code</label>
              <input
                type="text"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., SAVE20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Discount Type</label>
              <select
                value={newCoupon.type}
                onChange={(e) => setNewCoupon(prev => ({ ...prev, type: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Discount Value {newCoupon.type === 'percentage' ? '(%)' : '($)'}
              </label>
              <input
                type="number"
                value={newCoupon.value}
                onChange={(e) => setNewCoupon(prev => ({ ...prev, value: Number(e.target.value) }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                max={newCoupon.type === 'percentage' ? '100' : undefined}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Minimum Cart Total ($)</label>
              <input
                type="number"
                value={newCoupon.minCartTotal}
                onChange={(e) => setNewCoupon(prev => ({ ...prev, minCartTotal: Number(e.target.value) }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Max Discount ($) - Optional</label>
              <input
                type="number"
                value={newCoupon.maxDiscount}
                onChange={(e) => setNewCoupon(prev => ({ ...prev, maxDiscount: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                placeholder="Leave empty for no limit"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Usage Limit</label>
              <input
                type="number"
                value={newCoupon.usageLimit}
                onChange={(e) => setNewCoupon(prev => ({ ...prev, usageLimit: Number(e.target.value) }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Expiry Date</label>
              <input
                type="date"
                value={newCoupon.expiryDate ? newCoupon.expiryDate.split('T')[0] : ''}
                onChange={(e) => setNewCoupon(prev => ({ ...prev, expiryDate: e.target.value + 'T23:59:59Z' }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={newCoupon.active}
                onChange={(e) => setNewCoupon(prev => ({ ...prev, active: e.target.checked }))}
                className="mr-2"
              />
              <label className="text-sm font-medium text-slate-700">Active</label>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={handleCancelCouponEdit}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={editingCoupon ? handleUpdateCoupon : handleAddCoupon}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingCoupon ? 'Update Coupon' : 'Add Coupon'}
            </button>
          </div>
        </div>
      )}

      {/* Coupons List */}
      <div className="space-y-4">
        {sortedCoupons.length > 0 ? (
          sortedCoupons.map((coupon) => {
            const isExpired = new Date(coupon.expiryDate) <= new Date()
            const usagePercentage = (coupon.usedCount / coupon.usageLimit) * 100
            
            return (
              <div key={coupon._id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg font-mono font-bold text-lg">
                        {coupon.code}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          coupon.active && !isExpired ? 'bg-green-100 text-green-700' :
                          isExpired ? 'bg-red-100 text-red-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                          {isExpired ? 'Expired' : coupon.active ? 'Active' : 'Inactive'}
                        </span>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `${coupon.value} OFF`}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-slate-600">
                      <div>
                        <span className="font-medium">Min Cart:</span> ${coupon.minCartTotal}
                      </div>
                      {coupon.maxDiscount && (
                        <div>
                          <span className="font-medium">Max Discount:</span> ${coupon.maxDiscount}
                        </div>
                      )}
                      <div>
                        <span className="font-medium">Expires:</span> {new Date(coupon.expiryDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditCoupon(coupon)}
                      className="text-slate-400 hover:text-blue-600 transition-colors"
                      title="Edit coupon"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteCoupon(coupon._id)}
                      className="text-slate-400 hover:text-red-600 transition-colors"
                      title="Delete coupon"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Usage Progress */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-slate-600 mb-2">
                    <span>Usage: {coupon.usedCount}/{coupon.usageLimit}</span>
                    <span>{Math.round(usagePercentage)}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a1 1 0 001 1h1a1 1 0 001-1V7a2 2 0 00-2-2H5zM5 14a2 2 0 00-2 2v3a1 1 0 001 1h1a1 1 0 001-1v-3a2 2 0 00-2-2H5zM19 5a2 2 0 012 2v3a1 1 0 01-1 1h-1a1 1 0 01-1-1V7a2 2 0 012-2h1zM19 14a2 2 0 012 2v3a1 1 0 01-1 1h-1a1 1 0 01-1-1v-3a2 2 0 012-2h1z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No coupons found</h3>
            <p className="text-slate-600">
              {filterStatus === 'all' 
                ? "You haven't created any coupons yet." 
                : `No ${filterStatus} coupons found.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default CouponsSection