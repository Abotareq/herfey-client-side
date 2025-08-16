"use client"
import { useState } from 'react'
import CouponsSection from './components/Coupon/Coupon'
import ProfileSection from './components/PersonalInfo/PersonalInfo'
import StoresSection from './components/Store/Store'


function VendorProfile() {
  const [activeTab, setActiveTab] = useState('profile')
  
  // Mock vendor data based on your schema
  const [userData, setUserData] = useState({
    userName: "ahmed_tech",
    firstName: "Ahmed",
    lastName: "Mohamed",
    email: "ahmed@techworld.com",
    emailVerified: true,
    phone: "01123456789",
    role: "vendor",
    storesCount: 2,
    ordersCount: 156,
    cancelledOrders: 8,
    activeOrders: 23,
    createdAt: "2023-06-15T10:30:00Z"
  })

  // Mock stores data
  const [userStores, setUserStores] = useState([
    {
      _id: "65ff32fae201f6b1b3d7c9ef",
      name: "Tech World Electronics",
      slug: "tech-world-electronics",
      description: "Premium electronics and gadgets for tech enthusiasts",
      logoUrl: "https://readymadeui.com/images/product1.webp",
      status: "approved",
      location: {
        coordinates: [31.2357, 30.0444]
      },
      address: {
        city: "Cairo",
        postalCode: 12345,
        street: "Tech Street 123"
      },
      categorieCount: 5,
      couponsUsed: 12,
      productCount: 45,
      ordersCount: 89,
      policies: {
        shipping: "Free shipping on orders over $50",
        returns: "30-day return policy"
      }
    },
    {
      _id: "65ff32fae201f6b1b3d7c9f0",
      name: "Modern Fashion Hub",
      slug: "modern-fashion-hub",
      description: "Trendy fashion and accessories for modern lifestyle",
      logoUrl: "https://readymadeui.com/images/product4.webp",
      status: "pending",
      location: {
        coordinates: [31.2357, 30.0444]
      },
      address: {
        city: "Cairo",
        postalCode: 12346,
        street: "Fashion Avenue 456"
      },
      categorieCount: 3,
      couponsUsed: 5,
      productCount: 28,
      ordersCount: 67,
      policies: {
        shipping: "Standard shipping 3-5 days",
        returns: "14-day return policy"
      }
    }
  ])

  // Mock coupons data
  const [userCoupons, setUserCoupons] = useState([
    {
      _id: "coup1",
      code: "TECH20",
      type: "percentage",
      value: 20,
      minCartTotal: 100,
      maxDiscount: 50,
      expiryDate: "2024-12-31T23:59:59Z",
      usageLimit: 100,
      usedCount: 23,
      active: true
    },
    {
      _id: "coup2",
      code: "FIXED10",
      type: "fixed",
      value: 10,
      minCartTotal: 50,
      maxDiscount: null,
      expiryDate: "2024-11-30T23:59:59Z",
      usageLimit: 50,
      usedCount: 12,
      active: true
    }
  ])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {userData.firstName[0]}{userData.lastName[0]}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{userData.firstName} {userData.lastName}</h1>
              <p className="text-slate-600">@{userData.userName}</p>
              <div className="flex items-center space-x-4 text-sm text-slate-500">
                <span>Vendor since {new Date(userData.createdAt).toLocaleDateString()}</span>
                <span className="flex items-center space-x-1">
                  <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span>{userData.storesCount} Store{userData.storesCount !== 1 ? 's' : ''}</span>
                </span>
              </div>
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
              onClick={() => setActiveTab('stores')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'stores'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Stores
            </button>
            <button
              onClick={() => setActiveTab('coupons')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'coupons'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Coupons
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'profile' && (
          <ProfileSection
            userData={userData} 
            setUserData={setUserData} 
          />
        )}
        {activeTab === 'stores' && (
          <StoresSection 
            userStores={userStores} 
            setUserStores={setUserStores} 
          />
        )}
        {activeTab === 'coupons' && (
          <CouponsSection 
            userCoupons={userCoupons} 
            setUserCoupons={setUserCoupons} 
          />
        )}
      </div>
    </div>
  )
}

export default VendorProfile