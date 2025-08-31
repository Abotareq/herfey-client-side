"use client";

import { useCheckout } from "@/app/context/CheckoutContext";
import { useRouter } from "next/navigation";
import { useCreateOrder } from "@/service/customerOrderService";
import { useCreatePayment } from "@/service/payment";
import { useState, useEffect } from "react";
import { CreditCard, Banknote, AlertTriangle, Info, ShoppingCart, Lock, CheckCircle } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CheckoutStep2() {
  const { paymentMethod, setPaymentMethod, state } = useCheckout();
  const router = useRouter();
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const t = useTranslations('CheckoutStep2')
  const createOrderMutation = useCreateOrder();
  const createPaymentMutation = useCreatePayment();

  // Reset error when payment method changes
  useEffect(() => {
    if (error) {
      setError("");
    }
  }, [paymentMethod]);

  const handleConfirmPayment = async () => {
    // Prevent multiple submissions
    if (isProcessing) {
      return;
    }

    setError("");
    setIsProcessing(true);

    try {
      // Validate required data before proceeding
      if (!paymentMethod) {
        throw new Error("Please select a payment method");
      }

      if (!state.useExisting && (!state.newAddress || Object.keys(state.newAddress).length === 0)) {
        throw new Error("Please provide shipping address");
      }

      console.log("Starting checkout process...");
      console.log("Payment method:", paymentMethod);
      console.log("Use existing address:", state.useExisting);

      // Prepare order data
      const orderData = {
        useExisting: state.useExisting,
        shippingAddress: state.useExisting ? t('profileaddress') : state.newAddress,
      };

      console.log("Creating order with data:", orderData);

      // Create order first
      const orderResult = await createOrderMutation.mutateAsync(orderData);
      
      console.log("Order creation response:", orderResult);

      // Better validation of order creation response
      if (!orderResult) {
        throw new Error("No response from order creation");
      }

      if (orderResult.status !== "success") {
        throw new Error(orderResult.message || t('orderfailed'));
      }

      if (!orderResult.data || !orderResult.data._id) {
        throw new Error("Invalid order data received");
      }

      const orderId = orderResult.data._id;
      console.log("Order created with ID:", orderId);

      // Handle payment based on method
      if (paymentMethod === "cash_on_delivery") {
        console.log("Processing COD order...");
        
        // For COD, we might still want to create a payment record
        try {
          const codPaymentData = {
            order: orderId,
            paymentMethod: "cash_on_delivery",
            status: "pending" // COD payments start as pending
          };

          const codPaymentResult = await createPaymentMutation.mutateAsync(codPaymentData);
          console.log("COD payment record created:", codPaymentResult);
        } catch (codError) {
          console.warn("COD payment record creation failed:", codError);
          // Don't fail the entire process for COD payment record failure
        }

        // Redirect to confirmation page for COD
        router.push(`/customer-profile/orders/${orderId}`);

      } else if (paymentMethod === "credit_card") {
        console.log("Processing credit card payment...");
        
        const paymentData = {
          order: orderId,
          paymentMethod: "credit_card",
          provider: "Stripe"
        };

        console.log("Creating Stripe payment with data:", paymentData);

        const paymentResult = await createPaymentMutation.mutateAsync(paymentData);
        
        console.log("Payment creation response:", paymentResult);

        // Validate payment response
        if (!paymentResult) {
          throw new Error("No response from payment creation");
        }

        if (!paymentResult.sessionUrl) {
          throw new Error("No Stripe checkout URL received");
        }

        console.log("Redirecting to Stripe checkout:", paymentResult.sessionUrl);

        // Redirect to Stripe Checkout
        window.location.href = paymentResult.sessionUrl;
        
      } else {
        throw new Error("Invalid payment method selected");
      }

    } catch (err) {
      console.error("Checkout process failed:", err);
      
      // Enhanced error handling
      let errorMessage = "Something went wrong during checkout.";
      
      if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (typeof err === 'string') {
        errorMessage = err;
      }

      setError(errorMessage);
      
      // Log detailed error for debugging
      console.error("Detailed error:", {
        message: err?.message,
        response: err?.response?.data,
        stack: err?.stack
      });
      
    } finally {
      setIsProcessing(false);
    }
  };

  // Check if we have required data
  const canProceed = paymentMethod && (state.useExisting || (state.newAddress && Object.keys(state.newAddress).length > 0));

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-orange-50 to-amber-50 shadow-xl rounded-3xl border border-orange-100">
      {/* Header with orange accent and step indicator */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">2</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            {t('payment')}
          </h2>
        </div>
        <div className="w-full bg-orange-200 rounded-full h-2">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full w-2/3 shadow-sm"></div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-400 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Payment Method Selection */}
      <div className="space-y-4 mb-8">
        <h3 className="text-lg font-semibold text-orange-800 mb-4">{t('paymentchoice')}</h3>
        
        {/* Credit Card Option */}
        <label className="flex items-start space-x-4 p-5 border-2 border-orange-200 rounded-xl cursor-pointer hover:border-orange-300 hover:bg-orange-50/50 transition-all duration-200 group">
          <input
            type="radio"
            name="payment"
            value="credit_card"
            checked={paymentMethod === "credit_card"}
            onChange={() => setPaymentMethod("credit_card")}
            className="w-5 h-5 text-orange-600 mt-0.5 focus:ring-orange-500 focus:ring-2"
            disabled={isProcessing}
          />
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <CreditCard className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-gray-800 group-hover:text-orange-700 transition-colors">
                {t('card')}
              </span>
              <span className="px-3 py-1 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 text-xs font-medium rounded-full">
                {t('secure')}
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {t('security')}
            </p>
          </div>
        </label>

        {/* Cash on Delivery Option */}
        <label className="flex items-start space-x-4 p-5 border-2 border-orange-200 rounded-xl cursor-pointer hover:border-orange-300 hover:bg-orange-50/50 transition-all duration-200 group">
          <input
            type="radio"
            name="payment"
            value="cash_on_delivery"
            checked={paymentMethod === "cash_on_delivery"}
            onChange={() => setPaymentMethod("cash_on_delivery")}
            className="w-5 h-5 text-orange-600 mt-0.5 focus:ring-orange-500 focus:ring-2"
            disabled={isProcessing}
          />
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <Banknote className="w-5 h-5 text-orange-600" />
              <span className="font-semibold text-gray-800 group-hover:text-orange-700 transition-colors">
                {t('cash')}
              </span>
              <span className="px-3 py-1 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 text-xs font-medium rounded-full">
                {t('popular')}
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {t('cashdesc')}
            </p>
          </div>
        </label>
      </div>

      {/* Validation Messages */}
      {!canProceed && (
        <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-l-4 border-amber-400 rounded-xl shadow-sm">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Info className="w-5 h-5 text-amber-500" />
            </div>
            <div className="ml-3">
              <p className="text-amber-700 font-medium">
                {!paymentMethod && "Please select a payment method to continue."}
                {paymentMethod && !state.useExisting && (!state.newAddress || Object.keys(state.newAddress).length === 0) && 
                  t('warning')}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Order Summary */}
      {state.cartItems && (
        <div className="mb-8 p-6 bg-white/70 rounded-2xl border border-orange-100 shadow-sm">
          <h3 className="font-semibold text-orange-800 mb-3 flex items-center">
            <ShoppingCart className="w-5 h-5 mr-2 text-orange-600" />
            {t('ordersummary')}
          </h3>
          <div className="flex items-center justify-between">
            <p className="text-gray-700">
              <span className="font-medium">{state.cartItems.length}</span> {t('items')}
            </p>
            <p className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              ${state.totalAmount?.toFixed(2) || '0.00'}
            </p>
          </div>
        </div>
      )}

      {/* Confirm Button */}
      <button
        onClick={handleConfirmPayment}
        disabled={!canProceed || isProcessing || createOrderMutation.isLoading || createPaymentMutation.isLoading}
        className={`
          w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform
          ${canProceed && !isProcessing
            ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-500/30'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-sm'
          }
        `}
      >
        {isProcessing || createOrderMutation.isLoading || createPaymentMutation.isLoading
          ? (
            <div className="flex items-center justify-center space-x-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>{t('processing')}</span>
            </div>
          )
          : paymentMethod === "credit_card" 
            ? t('securepayment') 
            : t('confirmorder')
        }
      </button>

      {/* Loading States */}
      {(createOrderMutation.isLoading || createPaymentMutation.isLoading) && (
        <div className="mt-6 p-4 bg-orange-50 rounded-xl border border-orange-100">
          <div className="flex items-center justify-center space-x-3">
            <CheckCircle className="w-4 h-4 text-orange-600 animate-pulse" />
            <p className="text-sm text-orange-700 font-medium">
              {createOrderMutation.isLoading && t('processing')}
              {createPaymentMutation.isLoading && t('securepayment')}
            </p>
          </div>
        </div>
      )}

      {/* Security Badge */}
      <div className="mt-6 text-center">
        <p className="text-xs text-gray-500 flex items-center justify-center space-x-1">
          <Lock className="w-3 h-3" />
          <span>{t('desc')}</span>
        </p>
      </div>
    </div>
  );
}