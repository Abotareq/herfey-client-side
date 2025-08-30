"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetPaymentBySessionId } from "@/service/payment";
import PaymentSkeleton from "./paymentSkelton"
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle, 
  HelpCircle, 
  Loader2, 
  ShoppingBag, 
  Package, 
  Mail,
  Home,
  RefreshCw
} from "lucide-react";

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");
  const [paymentId, setPaymentId] = useState(null);
  const [pollingAttempts, setPollingAttempts] = useState(0);
  
  const { 
    data: paymentData, 
    isLoading, 
    isError, 
    refetch 
  } = useGetPaymentBySessionId(paymentId);

  useEffect(() => {
    if (!sessionId) {
      router.push("/"); // Redirect if no session ID
      return;
    }
    setPaymentId(sessionId);
  }, [sessionId, router]);

  // Polling with exponential backoff and max attempts
  useEffect(() => {
    if (!paymentId || paymentData?.payment[0]?.status === "completed") return;
    
    const maxAttempts = 4; // Stop after 10 attempts (5 minutes)
    
    if (pollingAttempts >= maxAttempts) return;
    
    const intervalId = setInterval(() => {
      setPollingAttempts(prev => prev + 1);
      refetch();
    }, 10000); // every 30 seconds

    return () => clearInterval(intervalId);
  }, [paymentId, refetch, paymentData?.payment[0]?.status, pollingAttempts]);

  // Loading state
  if (isLoading) {
    return <PaymentSkeleton />
  }

  // Error state
  if (isError) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-red-100">
        <div className="text-center">
          <AlertTriangle className="text-red-500 w-12 h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-6">
            We couldnot retrieve your payment information. Please contact support if this persists.
          </p>
          <div className="space-x-4">
            <button
              className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              onClick={() => refetch()}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </button>
            <button
              className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              onClick={() => router.push("/")}
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No session ID
  if (!sessionId) {
    return (
      <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-red-100">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Invalid Payment Session</h1>
          <p className="text-gray-600 mb-6">
            No valid payment session found. Please try your purchase again.
          </p>
          <button
            className="inline-flex items-center px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
            onClick={() => router.push("/")}
          >
            <Home className="w-4 h-4 mr-2" />
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  const payment = paymentData?.payment[0];
  const order = payment?.order;
  const paymentStatus = payment?.status;
  
  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-orange-100">
      {paymentStatus === "completed" ? (
        <div className="text-center">
          {/* Success Icon */}
          <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-4" />
          
          {/* Success Message */}
          <h1 className="text-3xl font-bold text-green-600 mb-6">
            Payment Successful!
          </h1>
          
          {/* Order Details */}
          <div className="bg-orange-50 p-4 rounded-lg mb-6 border border-orange-100">
            <div className="flex items-center justify-center mb-3">
              <Package className="w-5 h-5 text-orange-600 mr-2" />
              <h2 className="text-lg font-semibold text-gray-800">
                Order Details
              </h2>
            </div>
            <div className="space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-mono text-sm bg-orange-100 px-2 py-1 rounded text-orange-800">{order?._id || "N/A"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-green-600">
                  ${order?.totalAmount ? Number(order.totalAmount).toFixed(2) : "0.00"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span className="text-green-600 font-semibold capitalize flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  {paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100">
            <div className="flex items-center justify-center text-blue-800">
              <Mail className="w-4 h-4 mr-2" />
              <p className="text-sm">
                A confirmation email has been sent to your registered email address.
              </p>
            </div>
          </div>
        </div>
      ) : paymentStatus === "pending" ? (
        <div className="text-center">
          <Clock className="text-yellow-500 w-12 h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-yellow-600 mb-4">
            Payment Processing
          </h1>
          <p className="text-gray-600 mb-4">
            Your payment is still being processed. This usually takes a few moments.
          </p>
          <div className="bg-yellow-50 p-4 rounded-lg mb-6 border border-yellow-200">
            <div className="flex items-center justify-center text-yellow-800">
              <Clock className="w-4 h-4 mr-2" />
              <p className="text-sm">
                We are checking every 30 seconds for updates. Please dont close this page.
              </p>
            </div>
          </div>
        </div>
      ) : paymentStatus === "failed" ? (
        <div className="text-center">
          <XCircle className="text-red-500 w-12 h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Payment Failed
          </h1>
          <p className="text-gray-600 mb-6">
            Unfortunately, your payment could not be processed. Please try again or contact support.
          </p>
        </div>
      ) : (
        <div className="text-center">
          <HelpCircle className="text-gray-500 w-12 h-12 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-600 mb-4">
            Unknown Payment Status
          </h1>
          <p className="text-gray-600 mb-6">
            We're unable to determine your payment status. Please contact support for assistance.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <button
          className="inline-flex items-center justify-center px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors font-medium"
          onClick={() => router.push("/products")}
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          Continue Shopping
        </button>
        
        {paymentStatus === "completed" && (
          <button
            className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            onClick={() => router.push(`/customer-profile/orders/${order?._id}`)}
          >
            <Package className="w-4 h-4 mr-2" />
            View Order Details
          </button>
        )}
        
        {(paymentStatus === "failed" || paymentStatus === "pending") && (
          <button
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            onClick={() => window.location.href = "mailto:support@yoursite.com"}
          >
            <Mail className="w-4 h-4 mr-2" />
            Contact Support
          </button>
        )}
      </div>
    </div>
  );
}