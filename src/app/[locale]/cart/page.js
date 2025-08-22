"use client";
import React from "react";
import { useAuth } from "../../context/AuthContext";
import AuthenticatedCart from "./AuthenticatedCart";
import GuestCart from "./GuestCart";

function ShoppingCart() {
  const { user, loading: authLoading } = useAuth();
  
  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="max-w-5xl max-lg:max-w-2xl mx-auto p-4">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
          <span className="ml-2">Loading cart...</span>
        </div>
      </div>
    );
  }

  // If user is authenticated, show authenticated cart
  // Render appropriate cart component based on authentication status
  return user ? <AuthenticatedCart /> : <GuestCart />;
}

export default ShoppingCart;