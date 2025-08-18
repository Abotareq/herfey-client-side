"use client"
import  { useEffect, useState } from 'react'
import Customer from './customercomponents/Profile'
import AddressesSection from './customercomponents/AdressSection';
import ReviewsSection from './customercomponents/ReviewSetcion';
import { useTranslations } from 'next-intl';
import { useGetUserById } from '@/service/user';
import { useAuth } from '@/app/context/AuthContext';

function CustomerProfile() {
  const [activeTab, setActiveTab] = useState('profile')
  
  // Mock user data based on your schema


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
  const [userId, setUserId] = useState(null);
  const { user, loading: authLoading } = useAuth();
  const { data, isLoading: userLoading, error } = useGetUserById(userId);
  const userData = data?.data?.user || {};
  const t = useTranslations('customerpage')

  useEffect(() => {
    if (!authLoading && user?.id) {
      setUserId(user.id);
    }
  }, [authLoading, user]);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
              {userData.firstName}{userData.lastName}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{userData.firstName} {userData.lastName}</h1>
              <p className="text-slate-600">@{userData.userName}</p>
              <p className="text-sm text-slate-500">{t('date')} {new Date(userData.createdAt).toLocaleDateString()}</p>
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
              {t('profile')}
            </button>
            <button
              onClick={() => setActiveTab('addresses')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'addresses'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('address')}
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'reviews'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {t('review')}
            </button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'profile' && <Customer />}
        {activeTab === 'addresses' && <AddressesSection  userData={userData} setUserData={setUserData} />}
        {activeTab === 'reviews' && <ReviewsSection userReviews={userReviews} setUserReviews={setUserReviews} />}
      </div>
    </div>
  )
}

export default CustomerProfile