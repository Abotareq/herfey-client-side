"use client";
import React, { useState, useEffect } from "react";
import { 
  useMyCart, 
  useUpdateCart, 
  useRemoveItemFromCart,
  useAddItemToCart,
  useApplyCoupon,
  getGuestCart,
  clearGuestCart
} from "../../../service/cart.js";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import SkeletonLoader from "../components/SkeltonLoader.jsx";
import NotFoundPage from "../components/NotFoundComponent.jsx";

function AuthenticatedCart() {
  const [couponCode, setCouponCode] = useState("");
  const { user } = useAuth();
  // Backend cart hooks
  const { 
    data: backendCart, 
    isLoading: cartLoading, 
    error: cartError,
    refetch: refetchCart 
  } = useMyCart();
  
  const updateCartMutation = useUpdateCart();
  const removeItemMutation = useRemoveItemFromCart();
  const addItemMutation = useAddItemToCart();
  const { mutateAsync: applyCoupon } = useApplyCoupon();
  const router = useRouter()
  // Handle cart migration when user logs in
  useEffect(() => {
    const migrateGuestCart = async () => {
      const guestCart = getGuestCart();
      if (guestCart.length > 0) {
        try {
          console.log('Migrating guest cart:', guestCart);
          
          // TODO: Implement cart migration based on your backend API
          // Example: Add each guest cart item to user cart
          for (const item of guestCart) {
                console.log("item",item);
                const { product, quantity, price, variant } = item;
                addItemMutation.mutate({ product: product._id, quantity,variant });
          }

          // Clear guest cart after successful migration
          clearGuestCart();
          
          // Refetch user cart to get updated data
          refetchCart();
        } catch (error) {
          console.error('Cart migration failed:', error);
        }
      }
    };

    migrateGuestCart();
  }, [refetchCart]);
  
  // Initialize coupon code from backend cart
  useEffect(() => {
    if (backendCart?.coupon?.code) {
      setCouponCode(backendCart.coupon.code);
    }
  }, [backendCart]);

  const cartItems = backendCart?.items || [];
  
  // Calculate totals using backend data
  const calculateTotals = () => {
    const subtotal = backendCart?.total || 0;
    const discount = backendCart?.discount || 0;
    const shipping = subtotal > 0 ? 50.00 : 0;
    const tax = subtotal * 0.02; // 2% tax
    const total = subtotal + shipping + tax - discount;
    
    return { subtotal, shipping, tax, total, discount };
  };

  const { subtotal, shipping, tax, total, discount } = calculateTotals();

  // Update item quantity
  const handleUpdateQuantity = async (itemId, productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      const updatedItems = backendCart.items.map(item => ({
        ...item,
        quantity: item._id === itemId || item.id === itemId ? newQuantity : item.quantity,
        price: item.price,
        product: item.product._id
      }));
      
      const updateCart = {
        items: updatedItems,
        coupon: backendCart?.coupon?._id
      };
      
      await updateCartMutation.mutateAsync(updateCart);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  // Apply coupon
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    try {
      const updatedItems = backendCart.items.map(item => ({
        ...item,
        quantity: item.quantity,
        price: item.price,
        product: item.product._id
      }));
      
      await applyCoupon({ 
        code: couponCode.trim(),
        items: updatedItems 
      });
    } catch (error) {
      console.error("Error applying coupon:", error);
    }
  };

  // Remove item from cart
  const handleRemoveItem = async (itemId) => {
    try {
      await removeItemMutation.mutateAsync(itemId);
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };
  
  // Handle checkout
  const handleCheckout = () => {
    if (!user) {
      alert("You must be logged in to proceed to checkout");
      router.push("/signin");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty");
      return;
    }

    // redirect to checkout page
    router.push("/checkout");
  };

  // Continue shopping
  const handleContinueShopping = () => {
    router.push('/products');
  };
  if(cartLoading){
        return(
          <SkeletonLoader />
        )
      }
    
  if(cartError){
        return(
          <NotFoundPage />
        )
      }
  // Show loading state
  if (cartLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-orange-200 rounded-full animate-spin"></div>
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
              </div>
              <span className="text-orange-800 font-medium">Loading your cart...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Show error state
  if (cartError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Shopping Cart</h1>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-red-800 font-medium">Error loading cart</p>
                  <p className="text-red-600 text-sm mt-1">{cartError.message}</p>
                  <button 
                    onClick={() => refetchCart()}
                    className="mt-4 inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Empty cart state
  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-xl border border-orange-100 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
            <div className="text-center py-16">
              <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center">
                <svg className="w-16 h-16 text-orange-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M7 4V2C7 1.45 7.45 1 8 1H16C16.55 1 17 1.45 17 2V4H20C20.55 4 21 4.45 21 5S20.55 6 20 6H19V19C19 20.1 18.1 21 17 21H7C5.9 21 5 20.1 5 19V6H4C3.45 6 3 5.55 3 5S3.45 4 4 4H7ZM9 3V4H15V3H9ZM7 6V19H17V6H7Z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-8">Looks like you haven t added any items to your cart yet</p>
              <button
                type="button"
                onClick={handleContinueShopping}
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16l-4-4m0 0l4-4m-4 4h18" />
                </svg>
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-1">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
          </div>
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-lg shadow-lg">
            <span className="text-sm font-medium">
              Welcome, {user.name || user.email}
            </span>
          </div>
        </div>
        
        <div className="grid lg:grid-cols-3 lg:gap-8 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => {
              const itemId = item._id;
              const productId = item.product._id;
              const productName = item.product.name;
              const price = parseFloat(item.price) || 0;
              const quantity = parseInt(item.quantity) || 1;
              const image = item.product.images?.[0] || "https://readymadeui.com/images/placeholder.webp";
              const color = item.variant[0]?.value;
              const size = item.variant[1]?.value;

              return (
                <div 
                  key={itemId} 
                  className="bg-white rounded-xl shadow-md border border-orange-100 p-6 transition-all duration-300 hover:shadow-lg hover:border-orange-200 group animate-fadeIn"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-50 transition-transform duration-300 group-hover:scale-105">
                      <img
                        src={image}
                        alt={productName}
                        className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = "https://readymadeui.com/images/placeholder.webp";
                        }}
                      />
                    </div>
                    
                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-orange-600 transition-colors duration-200">
                          {productName}
                        </h3>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 ml-4">
                          <button
                            type="button"
                            className="p-2 rounded-lg text-gray-400 hover:text-pink-500 hover:bg-pink-50 transition-all duration-200 transform hover:scale-110"
                            title="Add to wishlist"
                          >
                            <svg className="w-5 h-5" viewBox="0 0 64 64" fill="currentColor">
                              <path d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z" />
                            </svg>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleRemoveItem(itemId)}
                            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 transform hover:scale-110"
                            title="Remove item"
                            disabled={updateCartMutation.isLoading || removeItemMutation.isLoading}
                          >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19 7a1 1 0 0 0-1 1v11.191A1.92 1.92 0 0 1 15.99 21H8.01A1.92 1.92 0 0 1 6 19.191V8a1 1 0 0 0-2 0v11.191A3.918 3.918 0 0 0 8.01 23h7.98A3.918 3.918 0 0 0 20 19.191V8a1 1 0 0 0-1-1Zm1-3h-4V2a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v2H4a1 1 0 0 0 0 2h16a1 1 0 0 0 0-2ZM10 4V3h4v1Z" />
                              <path d="M11 17v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Zm4 0v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 2 0Z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm text-gray-600">Color:</span>
                        <div 
                          className="w-5 h-5 rounded-full border-2 border-white shadow-md ring-1 ring-gray-200" 
                          style={{ backgroundColor: color }}
                          title={`Color: ${color}`}
                        />
                        {/* size */}
                        {size && (
                          <>
                            <span className="text-sm text-gray-600">Size:</span>
                            <span className="text-sm text-gray-800 font-medium">{size}</span>
                          </>
                        )}
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-2xl font-bold text-gray-900">
                            ${price.toFixed(2)}
                          </p>
                          {quantity > 1 && (
                            <p className="text-sm text-gray-500">
                              Total: ${(price * quantity).toFixed(2)}
                            </p>
                          )}
                        </div>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-2">
                          <button
                            type="button"
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-white hover:bg-orange-500 text-gray-600 hover:text-white shadow-md transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-gray-600 disabled:hover:scale-100"
                            onClick={() => handleUpdateQuantity(itemId, productId, quantity - 1)}
                            disabled={quantity <= 1 || updateCartMutation.isLoading}
                            title="Decrease quantity"
                          >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 124 124">
                              <path d="M112 50H12C5.4 50 0 55.4 0 62s5.4 12 12 12h100c6.6 0 12-5.4 12-12s-5.4-12-12-12z" />
                            </svg>
                          </button>
                          
                          <span className="font-bold text-lg min-w-[24px] text-center">
                            {quantity}
                          </span>
                          
                          <button
                            type="button"
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-md transition-all duration-200 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => handleUpdateQuantity(itemId, productId, quantity + 1)}
                            disabled={updateCartMutation.isLoading}
                            title="Increase quantity"
                          >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 42 42">
                              <path d="M37.059 16H26V4.941C26 2.224 23.718 0 21 0s-5 2.224-5 4.941V16H4.941C2.224 16 0 18.282 0 21s2.224 5 4.941 5H16v11.059C16 39.776 18.282 42 21 42s5-2.224 5-4.941V26h11.059C39.776 26 42 23.718 42 21s-2.224-5-4.941-5z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-lg border border-orange-100 p-6 h-fit sticky top-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-medium">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span className="font-medium">${tax.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span className="font-medium">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* Coupon Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Coupon Code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all duration-200"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
                <button
                  type="button"
                  className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                  onClick={handleApplyCoupon}
                  disabled={updateCartMutation.isLoading || removeItemMutation.isLoading || !couponCode.trim()}
                >
                  Apply
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 shadow-lg hover:shadow-xl"
                onClick={handleCheckout}
                disabled={updateCartMutation.isLoading || removeItemMutation.isLoading || cartItems.length === 0}
              >
                {updateCartMutation.isLoading || removeItemMutation.isLoading 
                  ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Updating...
                    </div>
                  ) 
                  : 'Proceed to Checkout'
                }
              </button>
              
              <button
                type="button"
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                onClick={handleContinueShopping}
              >
                Continue Shopping
              </button>
            </div>
            
            {/* Payment Icons */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600 text-center mb-4">Secure payments powered by</p>
              <div className="flex justify-center gap-4 opacity-60">
                <img
                  src="https://readymadeui.com/images/master.webp"
                  alt="Mastercard"
                  className="h-8 object-contain transition-opacity duration-200 hover:opacity-100"
                />
                <img
                  src="https://readymadeui.com/images/visa.webp"
                  alt="Visa"
                  className="h-8 object-contain transition-opacity duration-200 hover:opacity-100"
                />
                <img
                  src="https://readymadeui.com/images/american-express.webp"
                  alt="American Express"
                  className="h-8 object-contain transition-opacity duration-200 hover:opacity-100"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
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
          animation: fadeIn 0.5s ease-out forwards;
          opacity: 0;
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}


export default AuthenticatedCart;