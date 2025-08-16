"use client"
import React, { useState } from 'react'

function CustomerProfile() {
  const [activeTab, setActiveTab] = useState('profile')
  const [isEditing, setIsEditing] = useState(false)
  const [showAddressForm, setShowAddressForm] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [editingReview, setEditingReview] = useState(null)
  const [editReviewData, setEditReviewData] = useState({ rating: 1, comment: '' })
  
  // Mock user data based on your schema
  const [userData, setUserData] = useState({
    userName: "osama_saad",
    firstName: "Osama",
    lastName: "Saad",
    email: "osama@gmail.com",
    emailVerified: true,
    phone: "01000000000",
    role: "customer",
    addresses: [
      {
        _id: "1",
        buildingNo: 4,
        street: "Al Shohadaa",
        nearestLandMark: "School",
        city: "Juhayna",
        governorate: "Sohag",
        country: "Egypt",
        addressType: "home",
        isDefault: true
      }
    ],
    wishlist: [],
    ordersCount: 12,
    cancelledOrders: 1,
    activeOrders: 2,
    createdAt: "2024-01-15T10:30:00Z"
  })

  // Mock reviews data based on your schema
  const [userReviews, setUserReviews] = useState([
    {
      _id: "65ff32fae201f6b1b3d7c9ef",
      user: "65ff32fae201f6b1b3d7c9ef",
      entityId: "65ff3401e201f6b1b3d7c9f0",
      entityType: "Product",
      rating: 4,
      comment: "منتج بايظ",
      createdAt: "2024-08-10T14:30:00Z",
      // Populated product/store data for display
      entityDetails: {
        name: "Premium Cotton T-Shirt",
        image: "https://readymadeui.com/images/product6.webp",
        price: 30
      }
    },
    {
      _id: "65ff32fae201f6b1b3d7c9f1",
      user: "65ff32fae201f6b1b3d7c9ef",
      entityId: "65ff3401e201f6b1b3d7c9f1",
      entityType: "Product",
      rating: 5,
      comment: "Excellent quality and fast delivery! Really happy with this purchase.",
      createdAt: "2024-08-05T10:15:00Z",
      entityDetails: {
        name: "Wireless Bluetooth Headphones",
        image: "https://readymadeui.com/images/product3.webp",
        price: 75
      }
    },
    {
      _id: "65ff32fae201f6b1b3d7c9f2",
      user: "65ff32fae201f6b1b3d7c9ef",
      entityId: "65ff3401e201f6b1b3d7c9f2",
      entityType: "Store",
      rating: 3,
      comment: "Good store but shipping could be faster. Customer service was helpful though.",
      createdAt: "2024-07-28T16:45:00Z",
      entityDetails: {
        name: "Tech World Store",
        image: "https://readymadeui.com/images/product5.webp",
        totalProducts: 150
      }
    },
    {
      _id: "65ff32fae201f6b1b3d7c9f3",
      user: "65ff32fae201f6b1b3d7c9ef",
      entityId: "65ff3401e201f6b1b3d7c9f3",
      entityType: "Product",
      rating: 2,
      comment: "Product quality didn't match the description. Disappointed with the purchase.",
      createdAt: "2024-07-20T09:20:00Z",
      entityDetails: {
        name: "Smart Watch",
        image: "https://readymadeui.com/images/product2.webp",
        price: 120
      }
    }
  ])

  const [newAddress, setNewAddress] = useState({
    buildingNo: '',
    street: '',
    nearestLandMark: '',
    city: '',
    governorate: '',
    country: 'Egypt',
    addressType: 'home',
    isDefault: false
  })

  const handleSaveProfile = () => {
    setIsEditing(false)
    // Here you would typically make an API call to update the user data
    console.log('Saving profile data:', userData)
  }

  const handleAddAddress = () => {
    const addressWithId = { ...newAddress, _id: Date.now().toString() }
    setUserData(prev => ({
      ...prev,
      addresses: [...prev.addresses, addressWithId]
    }))
    setNewAddress({
      buildingNo: '',
      street: '',
      nearestLandMark: '',
      city: '',
      governorate: '',
      country: 'Egypt',
      addressType: 'home',
      isDefault: false
    })
    setShowAddressForm(false)
  }

  const handleEditAddress = (address) => {
    setEditingAddress(address)
    setNewAddress({ ...address })
  }

  const handleUpdateAddress = () => {
    setUserData(prev => ({
      ...prev,
      addresses: prev.addresses.map(addr => 
        addr._id === editingAddress._id ? { ...newAddress } : addr
      )
    }))
    setNewAddress({
      buildingNo: '',
      street: '',
      nearestLandMark: '',
      city: '',
      governorate: '',
      country: 'Egypt',
      addressType: 'home',
      isDefault: false
    })
    setEditingAddress(null)
  }

  const handleCancelEdit = () => {
    setEditingAddress(null)
    setNewAddress({
      buildingNo: '',
      street: '',
      nearestLandMark: '',
      city: '',
      governorate: '',
      country: 'Egypt',
      addressType: 'home',
      isDefault: false
    })
    setShowAddressForm(false)
  }

  const handleDeleteAddress = (addressId) => {
    setUserData(prev => ({
      ...prev,
      addresses: prev.addresses.filter(addr => addr._id !== addressId)
    }))
  }

  const handleSetDefaultAddress = (addressId) => {
    setUserData(prev => ({
      ...prev,
      addresses: prev.addresses.map(addr => ({
        ...addr,
        isDefault: addr._id === addressId
      }))
    }))
  }

  const ProfileSection = () => (
    <div className="space-y-8">
      {/* Personal Information Card */}
      <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-slate-900">Personal Information</h3>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <span>{isEditing ? 'Cancel' : 'Edit Profile'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
            {isEditing ? (
              <input
                type="text"
                value={userData.userName}
                onChange={(e) => setUserData(prev => ({ ...prev, userName: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-slate-900 font-medium bg-slate-50 px-4 py-3 rounded-lg">{userData.userName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
            {isEditing ? (
              <input
                type="text"
                value={userData.firstName}
                onChange={(e) => setUserData(prev => ({ ...prev, firstName: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-slate-900 font-medium bg-slate-50 px-4 py-3 rounded-lg">{userData.firstName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
            {isEditing ? (
              <input
                type="text"
                value={userData.lastName}
                onChange={(e) => setUserData(prev => ({ ...prev, lastName: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-slate-900 font-medium bg-slate-50 px-4 py-3 rounded-lg">{userData.lastName}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <div className="flex items-center space-x-2">
              {isEditing ? (
                <input
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                  className="flex-1 px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              ) : (
                <p className="flex-1 text-slate-900 font-medium bg-slate-50 px-4 py-3 rounded-lg">{userData.email}</p>
              )}
              {userData.emailVerified && (
                <div className="flex items-center space-x-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Verified</span>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
            {isEditing ? (
              <input
                type="tel"
                value={userData.phone}
                onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            ) : (
              <p className="text-slate-900 font-medium bg-slate-50 px-4 py-3 rounded-lg">{userData.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
            <p className="text-slate-900 font-medium bg-slate-50 px-4 py-3 rounded-lg capitalize">{userData.role}</p>
          </div>
        </div>

        {isEditing && (
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={() => setIsEditing(false)}
              className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Changes
            </button>
          </div>
        )}
      </div>

      {/* Account Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Orders</p>
              <p className="text-3xl font-bold text-blue-600">{userData.ordersCount}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M8 11v6h8v-6M8 11H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-2" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Active Orders</p>
              <p className="text-3xl font-bold text-green-600">{userData.activeOrders}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Cancelled Orders</p>
              <p className="text-3xl font-bold text-red-600">{userData.cancelledOrders}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const ReviewsSection = () => {
    const [filterType, setFilterType] = useState('all')
    const [sortBy, setSortBy] = useState('newest')

    const filteredReviews = userReviews.filter(review => {
      if (filterType === 'all') return true
      return review.entityType.toLowerCase() === filterType
    })

    const sortedReviews = [...filteredReviews].sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return new Date(b.createdAt) - new Date(a.createdAt)
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt)
        case 'highest':
          return b.rating - a.rating
        case 'lowest':
          return a.rating - b.rating
        default:
          return 0
      }
    })

    const handleDeleteReview = (reviewId) => {
      setUserReviews(prev => prev.filter(review => review._id !== reviewId))
      // Here you would typically make an API call to delete the review
      console.log('Deleting review:', reviewId)
    }

    const handleEditReview = (review) => {
      setEditingReview(review)
      setEditReviewData({
        rating: review.rating,
        comment: review.comment
      })
    }

    const handleUpdateReview = () => {
      setUserReviews(prev => prev.map(review => 
        review._id === editingReview._id 
          ? { ...review, rating: editReviewData.rating, comment: editReviewData.comment }
          : review
      ))
      setEditingReview(null)
      setEditReviewData({ rating: 1, comment: '' })
      // Here you would typically make an API call to update the review
      console.log('Updating review:', editingReview._id, editReviewData)
    }

    const handleCancelEditReview = () => {
      setEditingReview(null)
      setEditReviewData({ rating: 1, comment: '' })
    }

    const StarRating = ({ rating, size = 'w-4 h-4' }) => (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className={`${size} ${i < rating ? 'fill-amber-400' : 'fill-slate-300'}`} viewBox="0 0 14 13">
            <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
          </svg>
        ))}
      </div>
    )

    const EditableStarRating = ({ rating, onChange }) => (
      <div className="flex items-center space-x-1">
        {[...Array(5)].map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i + 1)}
            className="focus:outline-none"
          >
            <svg className={`w-6 h-6 transition-colors ${i < rating ? 'fill-amber-400 text-amber-400' : 'fill-slate-300 text-slate-300 hover:fill-amber-200'}`} viewBox="0 0 14 13">
              <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
            </svg>
          </button>
        ))}
        <span className="ml-2 text-sm font-medium text-slate-700">{rating}/5</span>
      </div>
    )

    return (
      <div className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold text-slate-900">My Reviews</h3>
            <p className="text-slate-600">Your reviews and feedback on products and stores</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Reviews</option>
              <option value="product">Products</option>
              <option value="store">Stores</option>
            </select>
            
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-lg bg-white text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Rated</option>
              <option value="lowest">Lowest Rated</option>
            </select>
          </div>
        </div>

        {/* Reviews Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
            <p className="text-2xl font-bold text-blue-600">{userReviews.length}</p>
            <p className="text-slate-600 text-sm">Total Reviews</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
            <p className="text-2xl font-bold text-green-600">
              {userReviews.filter(r => r.entityType === 'Product').length}
            </p>
            <p className="text-slate-600 text-sm">Product Reviews</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
            <p className="text-2xl font-bold text-purple-600">
              {userReviews.filter(r => r.entityType === 'Store').length}
            </p>
            <p className="text-slate-600 text-sm">Store Reviews</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-slate-200 text-center">
            <p className="text-2xl font-bold text-amber-600">
              {(userReviews.reduce((acc, r) => acc + r.rating, 0) / userReviews.length).toFixed(1)}
            </p>
            <p className="text-slate-600 text-sm">Average Rating</p>
          </div>
        </div>

        {/* Edit Review Modal */}
        {editingReview && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Edit Review</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Rating</label>
                  <EditableStarRating 
                    rating={editReviewData.rating}
                    onChange={(rating) => setEditReviewData(prev => ({ ...prev, rating }))}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Comment</label>
                  <textarea
                    value={editReviewData.comment}
                    onChange={(e) => setEditReviewData(prev => ({ ...prev, comment: e.target.value }))}
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Share your thoughts about this product/store..."
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={handleCancelEditReview}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateReview}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Update Review
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {sortedReviews.length > 0 ? (
            sortedReviews.map((review) => (
              <div key={review._id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-4">
                  <img 
                    src={review.entityDetails.image} 
                    alt={review.entityDetails.name}
                    className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-1">
                          {review.entityDetails.name}
                        </h4>
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            review.entityType === 'Product' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-purple-100 text-purple-700'
                          }`}>
                            {review.entityType}
                          </span>
                          {review.entityType === 'Product' && review.entityDetails.price && (
                            <span className="text-slate-500 text-sm">${review.entityDetails.price}</span>
                          )}
                          {review.entityType === 'Store' && review.entityDetails.totalProducts && (
                            <span className="text-slate-500 text-sm">{review.entityDetails.totalProducts} products</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-slate-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                        <button
                          onClick={() => handleEditReview(review)}
                          className="text-slate-400 hover:text-blue-600 transition-colors"
                          title="Edit review"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteReview(review._id)}
                          className="text-slate-400 hover:text-red-600 transition-colors"
                          title="Delete review"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 mb-3">
                      <StarRating rating={review.rating} />
                      <span className="text-sm font-medium text-slate-700">{review.rating}/5</span>
                    </div>
                    
                    {review.comment && (
                      <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg">
                        "{review.comment}"
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No reviews found</h3>
              <p className="text-slate-600">
                {filterType === 'all' 
                  ? "You haven't written any reviews yet." 
                  : `No ${filterType} reviews found.`
                }
              </p>
            </div>
          )}
        </div>
      </div>
    )
  }

  const AddressesSection = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-slate-900">Delivery Addresses</h3>
        <button
          onClick={() => setShowAddressForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span>Add New Address</span>
        </button>
      </div>

      {/* Add/Edit Address Form */}
      {(showAddressForm || editingAddress) && (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-900 mb-4">
            {editingAddress ? 'Edit Address' : 'Add New Address'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Building Number</label>
              <input
                type="number"
                value={newAddress.buildingNo}
                onChange={(e) => setNewAddress(prev => ({ ...prev, buildingNo: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Building number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Street</label>
              <input
                type="text"
                value={newAddress.street}
                onChange={(e) => setNewAddress(prev => ({ ...prev, street: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Street name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Nearest Landmark</label>
              <input
                type="text"
                value={newAddress.nearestLandMark}
                onChange={(e) => setNewAddress(prev => ({ ...prev, nearestLandMark: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Nearest landmark (optional)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
              <input
                type="text"
                value={newAddress.city}
                onChange={(e) => setNewAddress(prev => ({ ...prev, city: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Governorate</label>
              <input
                type="text"
                value={newAddress.governorate}
                onChange={(e) => setNewAddress(prev => ({ ...prev, governorate: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Governorate"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Country</label>
              <input
                type="text"
                value={newAddress.country}
                onChange={(e) => setNewAddress(prev => ({ ...prev, country: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Country"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Address Type</label>
              <select
                value={newAddress.addressType}
                onChange={(e) => setNewAddress(prev => ({ ...prev, addressType: e.target.value }))}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="home">Home</option>
                <option value="work">Work</option>
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={newAddress.isDefault}
                onChange={(e) => setNewAddress(prev => ({ ...prev, isDefault: e.target.checked }))}
                className="mr-2"
              />
              <label className="text-sm font-medium text-slate-700">Set as default address</label>
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
              onClick={editingAddress ? handleUpdateAddress : handleAddAddress}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              {editingAddress ? 'Update Address' : 'Add Address'}
            </button>
          </div>
        </div>
      )}

      {/* Address List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {userData.addresses.map((address) => (
          <div key={address._id} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative">
            {address.isDefault && (
              <div className="absolute top-4 right-4 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                Default
              </div>
            )}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="font-semibold text-slate-900 capitalize">{address.addressType}</span>
              </div>
            </div>
            
            <div className="space-y-2 text-slate-600">
              <p><span className="font-medium">Building:</span> {address.buildingNo}</p>
              <p><span className="font-medium">Street:</span> {address.street}</p>
              {address.nearestLandMark && (
                <p><span className="font-medium">Near:</span> {address.nearestLandMark}</p>
              )}
              <p><span className="font-medium">City:</span> {address.city}</p>
              <p><span className="font-medium">Governorate:</span> {address.governorate}</p>
              <p><span className="font-medium">Country:</span> {address.country}</p>
            </div>
            
            <div className="mt-4 flex justify-between items-center">
              {!address.isDefault && (
                <button
                  onClick={() => handleSetDefaultAddress(address._id)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                >
                  Set as Default
                </button>
              )}
              <div className="flex space-x-2 ml-auto">
                <button 
                  onClick={() => handleEditAddress(address)}
                  className="text-slate-500 hover:text-blue-600 transition-colors"
                  title="Edit address"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteAddress(address._id)}
                  className="text-slate-500 hover:text-red-600 transition-colors"
                  title="Delete address"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {userData.firstName[0]}{userData.lastName[0]}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{userData.firstName} {userData.lastName}</h1>
              <p className="text-slate-600">@{userData.userName}</p>
              <p className="text-sm text-slate-500">Member since {new Date(userData.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 bg-slate-100 rounded-lg p-1 max-w-lg">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'profile'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'addresses'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Addresses
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'reviews'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Reviews
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'profile' && <ProfileSection />}
        {activeTab === 'addresses' && <AddressesSection />}
        {activeTab === 'reviews' && <ReviewsSection />}
      </div>
    </div>
  )
}

export default CustomerProfile