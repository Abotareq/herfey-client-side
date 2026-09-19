"use client";

import { useCheckout } from "@/app/context/CheckoutContext";
import { useRouter } from "next/navigation";
import { useCreateOrder } from "@/service/customerOrderService";
import { useCreatePayment } from "@/service/payment";
import { useState, useEffect } from "react";
import { CreditCard, Banknote, AlertTriangle, Info, ShoppingCart, Lock, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function CheckoutStep2() {
  const { paymentMethod, setPaymentMethod, state } = useCheckout();
  const router = useRouter();
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const t = useTranslations("CheckoutStep2");
  const createOrderMutation = useCreateOrder();
  const createPaymentMutation = useCreatePayment();

  // Reset error when payment method changes
  useEffect(() => {
    if (error) {
      setError("");
    }
  }, [paymentMethod]);

  const handleGoBack = () => {
    router.push("/checkout/step1");
  };

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

      if (
        !state.useExisting &&
        (!state.newAddress || Object.keys(state.newAddress).length === 0)
      ) {
        throw new Error("Please provide shipping address");
      }

      console.log("Starting checkout process...");
      console.log("Payment method:", paymentMethod);
      console.log("Use existing address:", state.useExisting);

      // Prepare order data
      const orderData = {
        useExisting: state.useExisting,
        shippingAddress: state.useExisting
          ? "Profile Address"
          : state.newAddress,
        paymentMethod,
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
        throw new Error(orderResult.message || t("orderfailed"));
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
            status: "pending", // COD payments start as pending
          };

          const codPaymentResult = await createPaymentMutation.mutateAsync(
            codPaymentData
          );
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
          provider: "Stripe",
        };

        console.log("Creating Stripe payment with data:", paymentData);

        const paymentResult = await createPaymentMutation.mutateAsync(
          paymentData
        );

        console.log("Payment creation response:", paymentResult);

        // Validate payment response
        if (!paymentResult) {
          throw new Error("No response from payment creation");
        }

        if (!paymentResult.sessionUrl) {
          throw new Error("No Stripe checkout URL received");
        }

        console.log(
          "Redirecting to Stripe checkout:",
          paymentResult.sessionUrl
        );

        // Redirect to Stripe Checkout
        window.location.href = paymentResult.sessionUrl;
      } else {
        throw new Error("Invalid payment method selected");
      }
    } catch (err) {
      console.error("Checkout process failed:", err);

      // Enhanced error handling
      let errorMessage = "Something went wrong during checkout.";

      if (err?.response?.data?.error) {
        errorMessage = err.response.data.error;
      } else if (err?.message) {
        errorMessage = err.message;
      } else if (typeof err === "string") {
        errorMessage = err;
      }

      setError(errorMessage);

      // Log detailed error for debugging
      console.error("Detailed error:", {
        message: err?.message,
        response: err?.response?.data,
        stack: err?.stack,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Check if we have required data
  const canProceed =
    paymentMethod &&
    (state.useExisting ||
      (state.newAddress && Object.keys(state.newAddress).length > 0));

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:py-14">
      {/* where we are in the flow */}
      <div className="mb-8">
        <p className="label">{t("stepOf", { step: 2, total: 2 })}</p>
        <h1 className="mt-2 text-3xl text-gray-900 sm:text-4xl">{t("payment")}</h1>
        <div className="mt-5 grid grid-cols-2 gap-2" aria-hidden="true">
          <div className="h-1 rounded-full bg-orange-600" />
          <div className="h-1 rounded-full bg-orange-600" />
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 text-red-900 ring-1 ring-red-200 ring-inset rounded-xl">
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
      <div className="space-y-3 mb-8">
        <h2 className="row-title mb-4">
          {t("paymentchoice")}
        </h2>

        {/* Credit Card Option */}
        <label className="flex cursor-pointer items-start gap-4 rounded-2xl bg-white p-5 ring-1 ring-gray-900/10 ring-inset transition duration-200 has-[:checked]:ring-2 has-[:checked]:ring-orange-500 hover:ring-gray-900/20">
          <input
            type="radio"
            name="payment"
            value="credit_card"
            checked={paymentMethod === "credit_card"}
            onChange={() => setPaymentMethod("credit_card")}
            className="mt-0.5 h-5 w-5 shrink-0 accent-orange-600"
            disabled={isProcessing}
          />
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <CreditCard className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-gray-900">
                {t("card")}
              </span>
              <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                {t("secure")}
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {t("security")}
            </p>
          </div>
        </label>

        {/* Cash on Delivery Option */}
        <label className="flex cursor-pointer items-start gap-4 rounded-2xl bg-white p-5 ring-1 ring-gray-900/10 ring-inset transition duration-200 has-[:checked]:ring-2 has-[:checked]:ring-orange-500 hover:ring-gray-900/20">
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
              <span className="font-medium text-gray-900">
                {t("cash")}
              </span>
              <span className="rounded-md bg-orange-50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-orange-800">
                {t("popular")}
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              {t("cashdesc")}
            </p>
          </div>
        </label>
      </div>

      {/* Validation Messages */}
      {!canProceed && (
        <div className="mb-6 p-4 bg-orange-50 text-orange-950 ring-1 ring-orange-200 ring-inset rounded-xl">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Info className="w-5 h-5 text-amber-500" />
            </div>
            <div className="ml-3">
              <p className="text-amber-700 font-medium">
                {!paymentMethod &&
                  "Please select a payment method to continue."}
                {paymentMethod &&
                  !state.useExisting &&
                  (!state.newAddress ||
                    Object.keys(state.newAddress).length === 0) &&
                  t("warning")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Order Summary */}
      {state.cartItems && (
        <div className="mb-8 rounded-2xl bg-white p-6 shadow-xs">
          <p className="label">{t("ordersummary")}</p>
          <div className="mt-3 flex items-baseline justify-between gap-4">
            <p className="text-sm text-gray-500">
              <span className="font-medium tabular-nums text-gray-900">{state.cartItems.length}</span>{" "}
              {t("items")}
            </p>
            <p className="font-display text-2xl tabular-nums text-gray-900">
              <span className="me-1 text-sm font-sans font-medium text-gray-500">EGP</span>
              {state.totalAmount?.toFixed(2) || "0.00"}
            </p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mb-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Go Back Button */}
        <button type="button" onClick={handleGoBack} disabled={isProcessing} className="btn btn-ghost">
          <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
          {t("goback")}
        </button>

        {/* Confirm Button */}
        <button
          onClick={handleConfirmPayment}
          disabled={
            !canProceed ||
            isProcessing ||
            createOrderMutation.isLoading ||
            createPaymentMutation.isLoading
          }
          className="btn btn-primary disabled:bg-gray-200 disabled:text-gray-500 disabled:opacity-100 disabled:shadow-none"
        >
          {isProcessing ||
          createOrderMutation.isLoading ||
          createPaymentMutation.isLoading ? (
            <div className="flex items-center justify-center space-x-3">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              <span>{t("processing")}</span>
            </div>
          ) : paymentMethod === "credit_card" ? (
            t("securepayment")
          ) : (
            t("confirmorder")
          )}
        </button>
      </div>

      {/* Loading States */}
      {(createOrderMutation.isLoading || createPaymentMutation.isLoading) && (
        <div className="mb-6 rounded-xl bg-orange-50 p-4 text-orange-950 ring-1 ring-orange-200 ring-inset">
          <div className="flex items-center justify-center gap-3">
            <Loader2 className="h-4 w-4 animate-spin text-orange-700" aria-hidden="true" />
            <p className="text-sm font-medium">
              {createOrderMutation.isLoading && t("processing")}
              {createPaymentMutation.isLoading && t("securepayment")}
            </p>
          </div>
        </div>
      )}

      {/* Security Badge */}
      <div className="text-center">
        <p className="flex items-center justify-center gap-1.5 text-xs text-gray-500">
          <Lock className="h-3 w-3" aria-hidden="true" />
          <span>{t("desc")}</span>
        </p>
      </div>
    </div>
  );
}
