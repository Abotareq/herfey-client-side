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
    Shield,
    X,
    Navigation
} from 'lucide-react';
import { useStore } from '@/service/store';
import Image from 'next/image';
import Breadcrumbs from '../../components/Breadcrumbs';

// Main component for Store Details Page
export default function StoreDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

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
    }
  };

  const handleViewLocation = () => {
    setShowLocationModal(true);
  };

  const handleOpenGoogleMaps = () => {
    const address = `${storeData.address?.street}, ${storeData.address?.city}`;
    const googleMapsUrl = `https://maps.google.com?q=${encodeURIComponent(address)}`;
    window.open(googleMapsUrl, '_blank');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { 
        bg: 'bg-emerald-50 border-emerald-200', 
        text: 'text-emerald-700',
        dot: 'bg-emerald-500'
      },
      pending: { 
        bg: 'bg-amber-50 border-amber-200', 
        text: 'text-amber-700',
        dot: 'bg-amber-500'
      },
      rejected: { 
        bg: 'bg-red-50 border-red-200', 
        text: 'text-red-700',
        dot: 'bg-red-500'
      }
    };
    
    const config = statusConfig[status] || { bg: 'bg-gray-50 border-gray-200', text: 'text-gray-700', dot: 'bg-gray-500' };
    
    return (
      <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold border ${config.bg} ${config.text} transition-all duration-300`}>
        <div className={`w-2 h-2 rounded-full mr-2 ${config.dot}`}></div>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </div>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Location Modal Component
  const LocationModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Store Location</h3>
            <button
              onClick={() => setShowLocationModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-900">{storeData?.name}</h4>
                  <p className="text-gray-700 mt-1">{storeData?.address?.street}</p>
                  <p className="text-gray-600">{storeData?.address?.city}, {storeData?.address?.postalCode}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 h-48 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-500">Interactive map would be integrated here</p>
                <p className="text-sm text-gray-400">Using Google Maps, Mapbox, or similar service</p>
              </div>
            </div>

            <button
              onClick={handleOpenGoogleMaps}
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-xl font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
            >
              <Navigation className="w-5 h-5" />
              Open in Google Maps
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-xl font-semibold text-gray-800">Loading store details</h3>
          <p className="text-gray-600 mt-2">Please wait while we fetch the information...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch store details';
    
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{errorMessage}</p>
            <div className="flex gap-3">
              <button
                onClick={handleBackToStores}
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Back to Stores
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No store data found
  if (!storeData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Store not found</h3>
          <button
            onClick={handleBackToStores}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
          >
            Back to Stores
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Breadcrumbs />
      <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={handleBackToStores}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Stores</span>
            </button>
            <div className="flex items-center gap-3">
              <button
                onClick={handleFavorite}
                className={`p-2 rounded-lg transition-colors ${
                  isFavorite ? 'text-red-500 bg-red-50' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
              </button>
              <button
                onClick={handleShare}
                className="p-2 rounded-lg text-gray-400 hover:text-orange-600 hover:bg-orange-50 transition-colors"
              >
                <Share className="w-5 h-5" />
              </button>
              {getStatusBadge(storeData.status)}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className={`bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Orange Header */}
          <div className="h-32 bg-gradient-to-r from-orange-500 to-orange-600"></div>
          
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-6">
              {/* Store Logo */}
              <div className="relative -mt-20">
                <div className="w-24 h-24 bg-white rounded-xl shadow-lg border-4 border-white overflow-hidden">
                  <Image
                    src={storeData.logoUrl || '/api/placeholder/96/96'}
                    alt={storeData.name}
                    className="w-full h-full object-cover"
                    width={96}
                    height={96}
                    onError={(e) => {
                      e.target.src = '/api/placeholder/96/96';
                    }}
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              
              {/* Store Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {storeData.name}
                    </h1>
                    <p className="text-gray-600 text-lg mb-4 max-w-2xl">
                      {storeData.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <button
                        onClick={handleViewLocation}
                        className="flex items-center gap-2 hover:text-orange-600 transition-colors"
                      >
                        <MapPin className="w-4 h-4" />
                        <span>{storeData.address?.city}</span>
                      </button>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        <span>ID: {storeData._id?.slice(-8) || storeData.id?.slice(-8)}</span>
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

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {[
            { icon: Package, label: 'Products', value: storeData.productCount || 0, color: 'orange' },
            { icon: ShoppingBag, label: 'Orders', value: storeData.ordersCount || 0, color: 'green' },
            { icon: Star, label: 'Categories', value: storeData.categorieCount || 0, color: 'blue' },
            { icon: Users, label: 'Coupons Used', value: storeData.couponsUsed || 0, color: 'purple' }
          ].map((stat, index) => (
            <div 
              key={index}
              className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-500 hover:shadow-md ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  stat.color === 'orange' ? 'bg-orange-50 text-orange-600' :
                  stat.color === 'green' ? 'bg-green-50 text-green-600' :
                  stat.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                  'bg-purple-50 text-purple-600'
                }`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Store Policies */}
          <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '400ms' }}>
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-600" />
              Store Policies
            </h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Truck className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Shipping Policy</h3>
                    <p className="text-gray-600 text-sm">{storeData.policies?.shipping || 'No shipping policy specified'}</p>
                  </div>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <RotateCcw className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Return Policy</h3>
                    <p className="text-gray-600 text-sm">{storeData.policies?.returns || 'No return policy specified'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '500ms' }}>
            <h2 className="text-xl font-bold text-gray-900 mb-6">Location Details</h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Full Address</label>
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 font-medium">{storeData.address?.street || 'N/A'}</span>
                  <button
                    onClick={handleViewLocation}
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                  >
                    View Map
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">City</label>
                  <p className="text-gray-900 font-medium">{storeData.address?.city || 'N/A'}</p>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Postal Code</label>
                  <p className="text-gray-900 font-medium">{storeData.address?.postalCode || 'N/A'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Store Information */}
        <div className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '600ms' }}>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Store Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Store Slug</label>
              <p className="text-gray-900 font-medium">{storeData.slug || 'N/A'}</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 block">Last Updated</label>
              <div className="flex items-center gap-2 text-gray-900">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="font-medium">{formatDate(storeData.updatedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className={`bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg p-8 text-center text-white transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '700ms' }}>
          <h3 className="text-2xl font-bold mb-2">Ready to explore this store?</h3>
          <p className="text-orange-100 mb-6">Discover amazing products and great deals!</p>
          <button className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-orange-50 transition-colors">
            Browse Products
          </button>
        </div>
      </div>

      {/* Location Modal */}
      {showLocationModal && <LocationModal />}
    </div>
    </div>
  );
}