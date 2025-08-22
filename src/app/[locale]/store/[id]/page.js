'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
    ArrowLeft, 
    MapPin, 
    Package, 
    ShoppingBag, 
    Clock, 
    RotateCcw, 
    Star, 
    Users, 
    Loader, 
    AlertCircle,
    Heart,
    Share,
    Eye,
    Truck,
    Shield
} from 'lucide-react';
import { useStore } from '@/service/store';
import Image from 'next/image';

// Main component for Store Details Page
export default function StoreDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Extract store ID from params
  const storeId = params?.id;

  // Use React Query hook for fetching store data
  const {
    data: storeData,
    isLoading: loading,
    error,
    isError
  } = useStore(storeId);

  // Trigger animations after data loads
  useEffect(() => {
    if (storeData && !loading) {
      const timer = setTimeout(() => setIsVisible(true), 100);
      return () => clearTimeout(timer);
    }
  }, [storeData, loading]);

  const handleBackToStores = () => {
    router.push('/store');
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: storeData.name,
        text: storeData.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { 
        bg: 'bg-green-100', 
        text: 'text-green-800',
        pulse: 'animate-pulse'
      },
      pending: { 
        bg: 'bg-yellow-100', 
        text: 'text-yellow-800',
        pulse: 'animate-pulse'
      },
      rejected: { 
        bg: 'bg-red-100', 
        text: 'text-red-800',
        pulse: ''
      }
    };
    
    const config = statusConfig[status] || { bg: 'bg-gray-100', text: 'text-gray-800', pulse: '' };
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text} ${config.pulse} transform transition-all duration-300 hover:scale-105`}>
        <div className={`w-2 h-2 rounded-full mr-2 ${status === 'approved' ? 'bg-green-500' : status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Loading state with improved animation
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 p-8">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full animate-spin"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-800 animate-pulse">Loading store details</h3>
            <p className="text-gray-600 mt-2">Please wait while we fetch the information...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch store details';
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full transform transition-all duration-500 hover:scale-105">
          <div className="flex items-center gap-4 text-red-600 mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center animate-bounce">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold">Oops! Something went wrong</h2>
          </div>
          <p className="text-gray-600 mb-6 leading-relaxed">{errorMessage}</p>
          <div className="flex gap-3">
            <button
              onClick={handleBackToStores}
              className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 font-medium"
            >
              Back to Stores
            </button>
            <button
              onClick={() => window.location.reload()}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-medium shadow-lg"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No store data found
  if (!storeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center transform transition-all duration-500 hover:scale-105">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Package className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Store not found</h3>
          <button
            onClick={handleBackToStores}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 font-medium shadow-lg"
          >
            Back to Stores
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Floating Header */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={handleBackToStores}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-300 transform hover:scale-105 hover:-translate-x-1 group"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span className="font-medium">Back to Stores</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={handleFavorite}
                className={`p-2 rounded-full transition-all duration-300 transform hover:scale-110 ${
                  isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-full text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all duration-300 transform hover:scale-110"
              >
                <Share className="w-5 h-5" />
              </button>
              {getStatusBadge(storeData.status)}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className={`bg-white rounded-3xl shadow-xl border overflow-hidden mb-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative h-64 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            <div className="absolute inset-0">
              <div className="w-full h-full bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"></div>
            </div>
          </div>
          
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="relative -mt-24 group">
                <div className="w-32 h-32 bg-white rounded-2xl shadow-2xl border-4 border-white overflow-hidden transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
                  <img
                    src={storeData.logoUrl || '/api/placeholder/128/128'}
                    alt={storeData.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    width={128}
                    height={128}
                    onError={() => {
                      storeData.logoUrl = '/api/placeholder/128/128';
                    }}
                  />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text">
                      {storeData.name}
                    </h1>
                    <p className="text-gray-600 text-lg mb-4 leading-relaxed">
                      {storeData.description}
                    </p>
                    <div className="flex items-center gap-2 text-gray-500 mb-4 group cursor-pointer">
                      <MapPin className="w-5 h-5 text-red-500 group-hover:animate-bounce" />
                      <span className="group-hover:text-gray-700 transition-colors">
                        {storeData.address?.street}, {storeData.address?.city}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>Store ID: {storeData._id?.slice(-8) || storeData.id?.slice(-8)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Updated {formatDate(storeData.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Package, label: 'Products', value: storeData.productCount || 0, color: 'blue', delay: '0ms' },
            { icon: ShoppingBag, label: 'Orders', value: storeData.ordersCount || 0, color: 'green', delay: '100ms' },
            { icon: Star, label: 'Categories', value: storeData.categorieCount || 0, color: 'purple', delay: '200ms' },
            { icon: Users, label: 'Coupons Used', value: storeData.couponsUsed || 0, color: 'orange', delay: '300ms' }
          ].map((stat, index) => (
            <div 
              key={index}
              className={`bg-white rounded-2xl shadow-lg border p-6 transform transition-all duration-1000 hover:scale-105 hover:shadow-xl ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              style={{ transitionDelay: stat.delay }}
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 bg-${stat.color}-100 rounded-2xl flex items-center justify-center transform transition-all duration-500 group-hover:rotate-12`}>
                  <stat.icon className={`w-7 h-7 text-${stat.color}-600`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Store Policies */}
        <div className={`bg-white rounded-3xl shadow-xl border p-8 mb-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '400ms' }}>
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-600" />
            Store Policies
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group">
              <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100/50 transform transition-all duration-500 hover:scale-105 hover:shadow-lg">
                <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0 transform transition-all duration-500 group-hover:rotate-12">
                  <Truck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">Shipping Policy</h3>
                  <p className="text-gray-700 leading-relaxed">{storeData.policies?.shipping || 'No shipping policy specified'}</p>
                </div>
              </div>
            </div>
            <div className="group">
              <div className="flex items-start gap-4 p-6 rounded-2xl bg-gradient-to-br from-green-50 to-green-100/50 transform transition-all duration-500 hover:scale-105 hover:shadow-lg">
                <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center flex-shrink-0 transform transition-all duration-500 group-hover:rotate-12">
                  <RotateCcw className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-3 text-lg">Return Policy</h3>
                  <p className="text-gray-700 leading-relaxed">{storeData.policies?.returns || 'No return policy specified'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Store Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className={`bg-white rounded-3xl shadow-xl border p-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '500ms' }}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Store Information</h2>
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-xl">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Store Slug</label>
                <p className="text-gray-900 font-medium mt-1">{storeData.slug || 'N/A'}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Last Updated</label>
                <div className="flex items-center gap-2 text-gray-900 mt-1">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">{formatDate(storeData.updatedAt)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className={`bg-white rounded-3xl shadow-xl border p-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '600ms' }}>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Location Details</h2>
            <div className="space-y-6">
              <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-xl">
                <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Address</label>
                <div className="flex items-center gap-2 text-gray-900 mt-1">
                  <MapPin className="w-4 h-4 text-red-600" />
                  <span className="font-medium">{storeData.address?.street || 'N/A'}</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-xl">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">City</label>
                  <p className="text-gray-900 font-medium capitalize mt-1">{storeData.address?.city || 'N/A'}</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-xl">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Postal Code</label>
                  <p className="text-gray-900 font-medium mt-1">{storeData.address?.postalCode || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className={`bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl p-8 text-center text-white transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`} style={{ transitionDelay: '700ms' }}>
          <h3 className="text-2xl font-bold mb-4">Ready to explore this store?</h3>
          <p className="text-lg mb-6 text-white/90">Discover amazing products and great deals!</p>
          <button className="bg-white text-gray-900 px-8 py-4 rounded-2xl font-bold text-lg transform transition-all duration-300 hover:scale-110 hover:shadow-xl">
            Browse Products
          </button>
        </div>
      </div>
    </div>
  );
}