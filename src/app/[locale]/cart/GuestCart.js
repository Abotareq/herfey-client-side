"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  getGuestCart,
  updateGuestCartItem,
  removeFromGuestCart,
  getGuestCartTotal,
  addToGuestCart,
  clearGuestCart,
} from "../../../service/cart.js";
import { useRouter } from "next/navigation";
import Image from "next/image.js";
import CartSkeleton from "./cartSkelton.jsx";
import { useTranslations } from "next-intl";

// Helper function to generate unique variant key
const generateVariantKey = (productId, variants = []) => {
  if (!Array.isArray(variants) || variants.length === 0) {
    return `${productId}_default`;
  }

  const variantString = variants
    .map((v) => `${v.name}:${v.value}`)
    .sort()
    .join("|");

  return `${productId}_${variantString}`;
};

// Helper function to compare variant arrays
const areVariantsEqual = (variants1 = [], variants2 = []) => {
  // Handle null/undefined cases
  if (!variants1 && !variants2) return true;
  if (!variants1 || !variants2) return false;

  // Ensure both are arrays
  const v1 = Array.isArray(variants1) ? variants1 : [];
  const v2 = Array.isArray(variants2) ? variants2 : [];

  // If both are empty arrays, they're equal
  if (v1.length === 0 && v2.length === 0) return true;

  // If different lengths, not equal
  if (v1.length !== v2.length) return false;

  // Sort both arrays by name:value for consistent comparison
  const sorted1 = [...v1]
    .filter((v) => v && v.name && v.value) // Filter out invalid entries
    .sort((a, b) =>
      `${a.name}:${a.value}`.localeCompare(`${b.name}:${b.value}`)
    );

  const sorted2 = [...v2]
    .filter((v) => v && v.name && v.value) // Filter out invalid entries
    .sort((a, b) =>
      `${a.name}:${a.value}`.localeCompare(`${b.name}:${b.value}`)
    );

  // If after filtering, lengths don't match, not equal
  if (sorted1.length !== sorted2.length) return false;

  // Compare each variant
  return sorted1.every((v, index) => {
    const otherVariant = sorted2[index];
    return v.name === otherVariant.name && v.value === otherVariant.value;
  });
};

function GuestCart() {
  const [guestCartItems, setGuestCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingItems, setUpdatingItems] = useState(new Set());
  const [animatingItems, setAnimatingItems] = useState(new Set());
  const router = useRouter();
  const t = useTranslations('GuestCart');
  // Animate item addition/removal
  const animateItem = useCallback((itemKey, type = "update") => {
    setAnimatingItems((prev) => new Set([...prev, itemKey]));
    setTimeout(
      () => {
        setAnimatingItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(itemKey);
          return newSet;
        });
      },
      type === "remove" ? 500 : 300
    );
  }, []);

  // Helper function to remove duplicate items from cart
  const removeDuplicateItems = useCallback(() => {
    try {
      const cart = getGuestCart();
      const uniqueItems = [];
      const seenItems = new Map();

      cart.forEach((item) => {
        const productId = item.product?._id || item.product?.id;
        const variantKey = generateVariantKey(productId, item.variant);

        if (seenItems.has(variantKey)) {
          // Found duplicate - merge quantities
          const existingItem = seenItems.get(variantKey);
          existingItem.quantity += item.quantity;
          console.log(
            `Merged duplicate item ${variantKey}: quantity now ${existingItem.quantity}`
          );
        } else {
          // New unique item
          seenItems.set(variantKey, { ...item });
        }
      });

      // Convert map values back to array
      const cleanedCart = Array.from(seenItems.values());

      // If we found duplicates, update the cart
      if (cleanedCart.length < cart.length) {
        console.log(
          `Removed ${cart.length - cleanedCart.length} duplicate items`
        );
        localStorage.setItem("guestCart", JSON.stringify(cleanedCart));
        return cleanedCart;
      }

      return cart;
    } catch (error) {
      console.error("Error removing duplicates:", error);
      return getGuestCart(); // Return original cart if cleanup fails
    }
  }, []);

  const loadGuestCart = useCallback(() => {
    try {
      setIsLoading(true);
      setError(null);

      // First clean up any duplicates
      const cleanedCart = removeDuplicateItems();
      console.log("Cleaned cart data:", cleanedCart);

      // Transform cart items to match the new structure
      const validatedCart = cleanedCart.map((item, index) => {
        // Extract product information - handle the actual structure from your data
        const product = item.product || {};
        const productId = product._id;

        // Parse variant array into object for easier access
        const variantObj = {};
        if (Array.isArray(item.variant)) {
          item.variant.forEach((v) => {
            if (v.name && v.value) {
              variantObj[v.name.toLowerCase()] = v.value;
            }
          });
        }

        // Create variant key for unique identification
        const variantKey = generateVariantKey(productId, item.variant);

        const processedItem = {
          // Original item data for service calls
          originalItem: item,
          // Normalized fields
          id: productId,
          productId: productId,
          name: product.name || t('unkownproduct'),
          description: product.description || "",
          price:
            parseFloat(item.price) ||
            parseFloat(product.basePrice) ||
            parseFloat(product.price) ||
            0,
          quantity: parseInt(item.quantity) || 1,
          image:
            product.images?.[0] ||
            "https://readymadeui.com/images/placeholder.webp",

          // Variant information
          variant: item.variant || [],
          variantObj: variantObj,
          variantKey: variantKey,

          // Individual variant properties for backward compatibility
          color: variantObj.color || null,
          size: variantObj.size || null,

          // Additional product data
          product: product,
        };

        console.log("Processed item:", processedItem);
        return processedItem;
      });

      console.log("Final validated cart:", validatedCart);
      setGuestCartItems(validatedCart);
    } catch (error) {
      console.error("Error loading guest cart:", error);
      setError("Failed to load cart items. Please refresh the page.");
      setGuestCartItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [removeDuplicateItems]);

  // FIX: Load guest cart on component mount with proper dependency array
  useEffect(() => {
    loadGuestCart();
  }, []); // Empty dependency array - only runs once on mount

  // Calculate totals with error handling
  const calculateTotals = useCallback(() => {
    try {
      const subtotal = guestCartItems.reduce((total, item) => {
        const itemPrice = parseFloat(item.price) || 0;
        const itemQuantity = parseInt(item.quantity) || 0;
        return total + itemPrice * itemQuantity;
      }, 0);

      const shipping = subtotal > 0 ? 50.0 : 0;
      const tax = subtotal * 0.02; // 2% tax
      const discount = 0; // Guest users can't apply coupons
      const total = subtotal + shipping + tax - discount;

      return {
        subtotal: Math.max(0, subtotal),
        shipping,
        tax: Math.max(0, tax),
        total: Math.max(0, total),
        discount,
      };
    } catch (error) {
      console.error("Error calculating totals:", error);
      return { subtotal: 0, shipping: 0, tax: 0, total: 0, discount: 0 };
    }
  }, [guestCartItems]);

  const { subtotal, shipping, tax, total, discount } = calculateTotals();

  // Update item quantity with optimistic updates and error handling
  const handleUpdateQuantity = useCallback(async (item, newQuantity) => {
    console.log(
      "Updating quantity for item:",
      item,
      "new quantity:",
      newQuantity
    );

    if (newQuantity < 1) {
      handleRemoveItem(item);
      return;
    }

    const itemKey = item.variantKey || item.id;
    setUpdatingItems((prev) => new Set([...prev, itemKey]));
    animateItem(itemKey, "update");

    try {
      // First update the service/storage
      console.log("Calling updateGuestCartItem with:", {
        productId: item.productId,
        quantity: newQuantity,
        variants: item.variant,
      });

      await updateGuestCartItem(item.productId, newQuantity, item.variant);

      // Then update local state
      setGuestCartItems((prevItems) => {
        const updatedItems = prevItems.map((cartItem) => {
          if ((cartItem.variantKey || cartItem.id) === itemKey) {
            console.log(
              "Updating item in state:",
              cartItem,
              "to quantity:",
              newQuantity
            );
            return {
              ...cartItem,
              quantity: newQuantity,
              originalItem: { ...cartItem.originalItem, quantity: newQuantity },
            };
          }
          return cartItem;
        });
        console.log("Updated cart items:", updatedItems);
        return updatedItems;
      });
    } catch (error) {
      console.error("Error updating quantity:", error);
      setError("Failed to update item quantity. Please try again.");

      // Reload cart to ensure consistency on error
      setTimeout(() => {
        loadGuestCart();
      }, 500);
    } finally {
      setUpdatingItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemKey);
        return newSet;
      });
    }
  }, [animateItem, loadGuestCart]);

  // Remove item from cart with confirmation
  const handleRemoveItem = useCallback(async (item) => {
    const itemKey = item.variantKey || item.id;

    if (
      !window.confirm(
        `${t('alert')}${item.name}" ${t('cartalert')}`
      )
    ) {
      return;
    }

    setUpdatingItems((prev) => new Set([...prev, itemKey]));
    animateItem(itemKey, "remove");

    try {
      console.log(
        "Removing item with productId:",
        item.productId,
        "variants:",
        item.variant
      );

      // Remove from storage with variant array
      await removeFromGuestCart(item.productId, item.variant);

      // Update local state with animation delay
      setTimeout(() => {
        setGuestCartItems((prevItems) =>
          prevItems.filter(
            (cartItem) => (cartItem.variantKey || cartItem.id) !== itemKey
          )
        );
      }, 300);
    } catch (error) {
      console.error("Error removing item:", error);
      setError("Failed to remove item. Please try again.");

      // Reload cart to ensure consistency
      setTimeout(() => {
        loadGuestCart();
      }, 500);
    } finally {
      setTimeout(() => {
        setUpdatingItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(itemKey);
          return newSet;
        });
      }, 300);
    }
  }, [animateItem, loadGuestCart]);

  // Helper function to add item to cart with proper variant handling
  const handleAddToCart = useCallback(async (
    productData,
    selectedVariants = [],
    quantity = 1
  ) => {
    try {
      console.log("=== ADD TO CART START ===");
      console.log("Product Data:", productData);
      console.log("Selected Variants:", selectedVariants);
      console.log("Quantity to add:", quantity);

      // Get fresh cart data to ensure we have the latest state
      const freshCart = getGuestCart();
      console.log("Fresh cart from storage:", freshCart);

      const productId = productData._id || productData.id;
      console.log("Product ID to match:", productId);

      // Check in fresh cart data instead of state (to avoid timing issues)
      const existingItemIndex = freshCart.findIndex((item) => {
        const existingProductId = item.product?._id || item.product?.id;
        console.log("Comparing:", {
          existingProductId,
          newProductId: productId,
          existingVariants: item.variant,
          newVariants: selectedVariants,
          productIdMatch: existingProductId === productId,
          variantsMatch: areVariantsEqual(item.variant, selectedVariants),
        });

        // Compare product IDs
        if (existingProductId !== productId) {
          return false;
        }

        // Compare variants
        return areVariantsEqual(item.variant, selectedVariants);
      });

      console.log("Found existing item at index:", existingItemIndex);

      if (existingItemIndex !== -1) {
        // Item exists - update quantity using the service function
        console.log("=== UPDATING EXISTING ITEM ===");
        const existingItem = freshCart[existingItemIndex];
        const newQuantity = existingItem.quantity + quantity;
        console.log(
          `Updating quantity from ${existingItem.quantity} to ${newQuantity}`
        );

        // Use the service function to update
        await updateGuestCartItem(productId, newQuantity, selectedVariants);

        // Reload the component state
        loadGuestCart();

        // Show success message
        const variantText =
          selectedVariants.length > 0
            ? ` (${selectedVariants.map((v) => v.value).join(", ")})`
            : "";
        alert(
          `Updated "${productData.name}${variantText}" quantity to ${newQuantity}!`
        );
      } else {
        // Add new item to cart
        console.log("=== ADDING NEW ITEM ===");

        // Create the item structure that matches your cart format
        const cartItem = {
          price: productData.price || productData.basePrice || 0,
          quantity: quantity,
          variant: selectedVariants, // Array of {name: "Color", value: "Red"}
          product: productId,
        };

        console.log("New cart item to add:", cartItem);
        await addToGuestCart(cartItem);

        // Reload cart to get the updated items
        loadGuestCart();

        // Show success message for new item
        const variantText =
          selectedVariants.length > 0
            ? ` (${selectedVariants.map((v) => v.value).join(", ")})`
            : "";
        alert(`${t('added')} "${productData.name}${variantText}" ${t('tocart')}`);
      }

      console.log("=== ADD TO CART END ===");
    } catch (error) {
      console.error("Error adding to cart:", error);
      setError("Failed to add item to cart. Please try again.");
    }
  }, [loadGuestCart]);

  // Handle adding current item again (for example, from wishlist or similar items)
  const handleAddMoreOfSameItem = useCallback(async (item) => {
    await handleAddToCart(item.product, item.variant, 1);
  }, [handleAddToCart]);

  // Handle adding to wishlist (guest users need to login)
  const handleAddToWishlist = useCallback((item) => {
    alert(t('loginalert'));
    router.push("/signin");
  }, [router]);

  const handleApplyCoupon = useCallback(() => {
    if (!couponCode.trim()) {
      alert(t('couponalert'));
      return;
    }
    alert(t('logincouponalert'));
    router.push("/login");
  }, [couponCode, router]);

  // Handle checkout (redirect to login)
  const handleCheckout = useCallback(() => {
    if (guestCartItems.length === 0) {
      alert(t('emptycart'));
      return;
    }

    // Save cart state before redirecting to login
    try {
      localStorage.setItem("redirectAfterLogin", "/checkout");
      localStorage.setItem("cartBeforeLogin", JSON.stringify(guestCartItems));
    } catch (error) {
      console.error("Error saving cart state:", error);
    }

    router.push("/signin");
  }, [guestCartItems, router]);

  // Continue shopping
  const handleContinueShopping = useCallback(() => {
    router.push("/productpage");
  }, [router]);

  // Clear entire cart
  const handleClearCart = useCallback(() => {
    if (!window.confirm(t('removecart'))) {
      return;
    }

    try {
      clearGuestCart();
      setGuestCartItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
      setError("Failed to clear cart. Please try again.");
    }
  }, []);

  // Format variant display
  const formatVariantInfo = useCallback((item) => {
    if (!Array.isArray(item.variant) || item.variant.length === 0) {
      return [];
    }

    return item.variant.map((v) => ({
      name: v.name,
      value: v.value,
      display: `${v.name}: ${v.value}`,
    }));
  }, []);

  // Retry loading cart on error
  const handleRetry = useCallback(() => {
    setError(null);
    loadGuestCart();
  }, [loadGuestCart]);

  // Debug function to check current state
  const debugCurrentState = useCallback(() => {
    console.log("Current guest cart items:", guestCartItems);
    console.log("Current updating items:", Array.from(updatingItems));
    console.log("Raw cart from service:", getGuestCart());
  }, [guestCartItems, updatingItems]);

  // Add debug button in development
  const isDev = process.env.NODE_ENV === "development";

  // Show loading state with professional spinner
  if (isLoading) {
    return <CartSkeleton />;
  }

  // Enhanced error state
  if (error && guestCartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {t('shoppingcart')}
          </h1>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 mx-auto mb-6 text-red-400">
              <svg
                fill="currentColor"
                viewBox="0 0 20 20"
                className="w-full h-full"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {t('error')}
            </h3>
            <p className="text-gray-600 mb-8">{error}</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              >
                {t('tryagain')}
              </button>
              <button
                onClick={handleContinueShopping}
                className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                {t('continueshopping')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Professional empty cart state
  if (guestCartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {t('shoppingcart')}
          </h1>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-24 h-24 mx-auto mb-6 text-gray-400">
              <svg
                fill="currentColor"
                viewBox="0 0 24 24"
                className="w-full h-full"
              >
                <path d="M7 4V2a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2h5a1 1 0 0 1 0 2h-1v13a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V6H2a1 1 0 0 1 0-2h5zM9 2v2h6V2H9zm9 4H6v13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {t('emptycart')}
            </h3>
            <p className="text-gray-600 mb-8">
              {t('emptycartdesc')}
            </p>
            <button
              onClick={handleContinueShopping}
              className="px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-105 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              {t('startshopping')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">{t('shoppingcart')}</h1>
            <p className="text-gray-600">
              {guestCartItems.length} {t('item')}
              {guestCartItems.length !== 1 ? "s" : ""} {t('cart')}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full border border-orange-200 text-sm font-medium">
              {t('guestcart')}
            </div>
            {isDev && (
              <div className="flex gap-2">
                <button
                  onClick={debugCurrentState}
                  className="text-sm text-orange-600 hover:text-orange-700 underline transition-colors"
                  title="Debug - check console"
                >
                  {t('debug')}
                </button>
                <button
                  onClick={() => {
                    const cleaned = removeDuplicateItems();
                    if (cleaned) {
                      loadGuestCart();
                      alert("Duplicates cleaned!");
                    }
                  }}
                  className="text-sm text-orange-600 hover:text-orange-700 underline transition-colors"
                  title="Remove duplicate items"
                >
                  {t('clean')}
                </button>
              </div>
            )}
            <button
              onClick={handleClearCart}
              className="text-sm text-red-600 hover:text-red-700 underline transition-colors"
            >
              {t('clearcart')}
            </button>
            <button
              onClick={() => router.push("/signin")}
              className="px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              {t('login')}
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-red-500 mr-3"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-red-800 font-medium">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800 p-1 rounded-full hover:bg-red-100 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Main Content Grid - Fixed Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Cart Items Section */}
          <div className="xl:col-span-2">
            <div className="space-y-4">
              {guestCartItems.map((item) => {
                const itemKey = item.variantKey || item.id;
                const isUpdating = updatingItems.has(itemKey);
                const isAnimating = animatingItems.has(itemKey);
                const variantInfo = formatVariantInfo(item);
                const imgSrc = item.image || "https://readymadeui.com/images/placeholder.webp";

                return (
                  <div
                    key={itemKey}
                    className={`bg-white rounded-lg shadow-sm border border-gray-200 transition-all duration-300 ${
                      isUpdating
                        ? "opacity-75 scale-[0.98]"
                        : "hover:shadow-md hover:border-orange-200"
                    } ${isAnimating ? "animate-pulse" : ""}`}
                  >
                    <div className="p-6">
                      <div className="flex flex-col sm:flex-row gap-6">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="w-full sm:w-32 h-48 sm:h-32 relative group overflow-hidden rounded-lg">
                            <Image
                              src={imgSrc}
                              alt={item.name}
                              width={128}
                              height={128}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                          </div>
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 min-w-0">
                          <div className="space-y-4">
                            {/* Product Title */}
                            <div>
                              <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                                {item.name}
                              </h3>
                              {variantInfo.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                  {variantInfo.map((variant, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center gap-2"
                                    >
                                      {variant.name.toLowerCase() ===
                                      "color" ? (
                                        <div className="flex items-center gap-2 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200">
                                          <span className="text-sm font-medium text-orange-700">
                                            {variant.name}:
                                          </span>
                                          <div
                                            className="w-4 h-4 rounded-full border-2 border-white shadow-sm ring-1 ring-orange-200"
                                            style={{
                                              backgroundColor:
                                                variant.value.toLowerCase(),
                                            }}
                                            title={variant.value}
                                          ></div>
                                          <span className="text-sm font-medium text-orange-800">
                                            {variant.value}
                                          </span>
                                        </div>
                                      ) : (
                                        <div className="bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200">
                                          <span className="text-sm font-medium text-orange-700">
                                            {variant.display}
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* Price and Quantity Section */}
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                              {/* Price Info */}
                              <div className="space-y-1">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-2xl font-bold text-orange-600">
                                    ${item.price.toFixed(2)}
                                  </span>
                                  {item.quantity > 1 && (
                                    <span className="text-sm text-gray-500">
                                      {t('each')}
                                    </span>
                                  )}
                                </div>
                                {item.quantity > 1 && (
                                  <div className="text-sm text-gray-600">
                                    Subtotal:{" "}
                                    <span className="font-semibold text-orange-600">
                                      ${(item.price * item.quantity).toFixed(2)}
                                    </span>
                                  </div>
                                )}
                              </div>

                              {/* Quantity Controls */}
                              <div className="flex items-center gap-4">
                                <div className="flex items-center bg-gray-50 rounded-lg p-1 border border-gray-200">
                                  <button
                                    type="button"
                                    className="p-2 text-orange-600 hover:bg-orange-100 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() =>
                                      handleUpdateQuantity(
                                        item,
                                        item.quantity - 1
                                      )
                                    }
                                    disabled={item.quantity <= 1 || isUpdating}
                                    title={t('decrease')}
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </button>

                                  <div className="min-w-[3rem] text-center px-2">
                                    {isUpdating ? (
                                      <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                    ) : (
                                      <span className="font-semibold text-gray-900">
                                        {item.quantity}
                                      </span>
                                    )}
                                  </div>

                                  <button
                                    type="button"
                                    className="p-2 text-orange-600 hover:bg-orange-100 rounded-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={() =>
                                      handleUpdateQuantity(
                                        item,
                                        item.quantity + 1
                                      )
                                    }
                                    disabled={isUpdating}
                                    title={t('increase')}
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </button>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleAddMoreOfSameItem(item)
                                    }
                                    className="p-2 text-orange-600 hover:bg-orange-100 rounded-md transition-colors duration-200 disabled:opacity-50"
                                    title="Add one more"
                                    disabled={isUpdating}
                                  >
                                    <svg
                                      className="w-5 h-5"
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleAddToWishlist(item)}
                                    className="p-2 text-pink-500 hover:bg-pink-100 rounded-md transition-colors duration-200 disabled:opacity-50"
                                    title={t('wishlist')}
                                    disabled={isUpdating}
                                  >
                                    <svg
                                      className="w-5 h-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                      />
                                    </svg>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleRemoveItem(item)}
                                    className="p-2 text-red-500 hover:bg-red-100 rounded-md transition-colors duration-200 disabled:opacity-50"
                                    title={t('remove')}
                                    disabled={isUpdating}
                                  >
                                    <svg
                                      className="w-5 h-5"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                      />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Checkout Sidebar - Fixed Position */}
          <div className="xl:col-span-1">
            <div className="sticky top-6">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {t('ordersummary')}
                      </h2>
                      <p className="text-orange-100 text-sm">
                        {guestCartItems.length} {t('cartlength')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Price Breakdown */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-700">{t('subtotal')}</span>
                      <span className="font-semibold text-gray-900">
                        ${subtotal.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-700">{t('shipping')}</span>
                      <span className="font-semibold text-gray-900">
                        ${shipping.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-gray-700">{t('tax')}</span>
                      <span className="font-semibold text-gray-900">
                        ${tax.toFixed(2)}
                      </span>
                    </div>

                    {discount > 0 && (
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-green-700">Discount</span>
                        <span className="font-semibold text-green-600">
                          -${discount.toFixed(2)}
                        </span>
                      </div>
                    )}

                    {/* Total */}
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-gray-900">
                          {t('total')}
                        </span>
                        <span className="text-2xl font-bold text-orange-600">
                          ${total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Coupon Section */}
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-800">
                      {t('promo')}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={t('loginplace')}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-500 cursor-not-allowed text-sm"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        disabled
                      />
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed text-sm font-medium"
                        onClick={handleApplyCoupon}
                        disabled
                      >
                        {t('apply')}
                      </button>
                    </div>
                    <p className="text-xs text-orange-600 flex items-center gap-1">
                      <svg
                        className="w-3 h-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {t('logintitle')}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      type="button"
                      className="w-full py-4 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-bold rounded-lg transition-all duration-200 disabled:opacity-50 shadow-lg transform hover:scale-105"
                      onClick={handleCheckout}
                      disabled={guestCartItems.length === 0}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {t('logincheck')}
                      </div>
                    </button>

                    <button
                      type="button"
                      className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200"
                      onClick={handleContinueShopping}
                    >
                      {t('continue')}
                    </button>
                  </div>

                  {/* Login Benefits */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-orange-500 rounded-lg">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-orange-800">
                          {t('createaccount')}
                        </h3>
                        <p className="text-xs text-orange-600">
                          {t('unlock')}
                        </p>
                      </div>
                    </div>

                    <ul className="space-y-2 mb-4">
                      {[
                        "Save cart across devices",
                        "Apply discount codes",
                        "Track order history",
                        "Faster checkout",
                      ].map((benefit, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-2.5 h-2.5 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <span className="text-sm text-orange-700">
                            {benefit}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => router.push("/signup")}
                      className="w-full py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition-colors duration-200 text-sm"
                    >
                      {t('signup')}
                    </button>
                  </div>

                  {/* Payment Methods */}
                  <div className="text-center space-y-3">
                    <p className="text-sm font-medium text-gray-600">
                      {t('weaccept')}
                    </p>
                    <div className="flex justify-center gap-4">
                      {[
                        {
                          src: "https://readymadeui.com/images/master.webp",
                          alt: "Mastercard",
                        },
                        {
                          src: "https://readymadeui.com/images/visa.webp",
                          alt: "Visa",
                        },
                        {
                          src: "https://readymadeui.com/images/american-express.webp",
                          alt: "American Express",
                        },
                      ].map((card, index) => (
                        <div
                          key={index}
                          className="p-2 bg-white rounded-lg shadow-sm border border-gray-200"
                        >
                          <Image
                            src={card.src}
                            alt={card.alt}
                            width={40}
                            height={24}
                            className="h-6 object-contain"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Security Badge */}
                  <div className="text-center border-t border-gray-200 pt-4">
                    <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2">
                      <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                        <svg
                          className="w-2.5 h-2.5 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-xs font-medium text-green-700">
                        {t('securessl')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GuestCart;