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
import { useTranslations } from "next-intl";

export default function PaymentSuccessPage() {
  const t = useTranslations('PaymentSuccessPage')
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
      <div className="mx-auto my-14 max-w-xl rounded-[2rem] bg-white p-8 shadow-xs sm:p-10">
        <div className="text-center">
          <AlertTriangle className="mx-auto mb-4 h-12 w-12 text-red-600" strokeWidth={1.5} />
          <h1 className="mb-3 text-2xl text-gray-900">{t('warinig')}</h1>
          <p className="text-gray-600 mb-6">
            {t('wariningdesc')}
          </p>
          <div className="space-x-4">
            <button
              className="btn btn-primary"
              onClick={() => refetch()}
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              {t('tryagain')}
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => router.push("/")}
            >
              <Home className="w-4 h-4 mr-2" />
              {t('home')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // No session ID
  if (!sessionId) {
    return (
      <div className="mx-auto my-14 max-w-xl rounded-[2rem] bg-white p-8 shadow-xs sm:p-10">
        <div className="text-center">
          <h1 className="mb-3 text-2xl text-gray-900">{t('invalidpayment')}</h1>
          <p className="text-gray-600 mb-6">
            {t('invalidpaymanetdesc')}
          </p>
          <button
            className="btn btn-primary"
            onClick={() => router.push("/")}
          >
            <Home className="w-4 h-4 mr-2" />
            {t('home')}
          </button>
        </div>
      </div>
    );
  }

  const payment = paymentData?.payment[0];
  const order = payment?.order;
  const paymentStatus = payment?.status;
  
  return (
    <div className="mx-auto max-w-xl px-4 py-14 md:py-20">
     <div className="rounded-[2rem] bg-white p-8 shadow-xs sm:p-10">
      {paymentStatus === "completed" ? (
        <div className="text-center">
          {/* Success Icon */}
          <div className="pop-in mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full bg-green-50 text-green-700">
            <CheckCircle className="h-8 w-8" strokeWidth={1.75} aria-hidden="true" />
          </div>

          {/* Success Message */}
          <h1 className="mb-8 text-3xl text-gray-900 sm:text-4xl">
            {t('paymentsuccess')}
          </h1>
          
          {/* Order Details */}
          <div className="mb-6 rounded-2xl bg-gray-50 p-5 text-start">
            <div className="mb-4 flex items-center gap-2">
              <Package className="h-4 w-4 text-gray-500" strokeWidth={1.75} aria-hidden="true" />
              <h2 className="label">
                {t('orderdetails')}
              </h2>
            </div>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">Order ID</span>
                <span className="font-mono text-xs tabular-nums text-gray-700">{order?._id || "N/A"}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">{t('totalamount')}</span>
                <span className="font-semibold tabular-nums text-gray-900">
                  ${order?.totalAmount ? Number(order.totalAmount).toFixed(2) : "0.00"}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">{t('paymentstatus')}</span>
                <span className="flex items-center gap-1 font-medium capitalize text-green-700">
                  <CheckCircle className="h-4 w-4" aria-hidden="true" />
                  {paymentStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <Mail className="h-4 w-4" aria-hidden="true" />
              <p className="text-sm">
                {t('emailconfirm')}
              </p>
            </div>
          </div>
        </div>
      ) : paymentStatus === "pending" ? (
        <div className="text-center">
          <Clock className="mx-auto mb-4 h-12 w-12 text-orange-600" strokeWidth={1.5} />
          <h1 className="mb-3 text-2xl text-gray-900">
            {t('paymentproccessing')}
          </h1>
          <p className="text-gray-600 mb-4">
            {t('paymentprocessingdesc')}
          </p>
          <div className="mb-6 rounded-xl bg-orange-50 p-4 text-orange-950 ring-1 ring-orange-200 ring-inset">
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-4 w-4" aria-hidden="true" />
              <p className="text-sm">
                {t('message')}
              </p>
            </div>
          </div>
        </div>
      ) : paymentStatus === "failed" ? (
        <div className="text-center">
          <XCircle className="mx-auto mb-4 h-12 w-12 text-red-600" strokeWidth={1.5} />
          <h1 className="mb-3 text-2xl text-gray-900">
            {t('paymentfailed')}
          </h1>
          <p className="text-gray-600 mb-6">
            {t('paymentfaileddesc')}
          </p>
        </div>
      ) : (
        <div className="text-center">
          <HelpCircle className="mx-auto mb-4 h-12 w-12 text-gray-400" strokeWidth={1.5} />
          <h1 className="mb-3 text-2xl text-gray-900">
            {t('unkownmessage')}
          </h1>
          <p className="text-gray-600 mb-6">
            {t('unkownmessagedesc')}
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <button
          className="btn btn-primary justify-center"
          onClick={() => router.push("/products")}
        >
          <ShoppingBag className="w-4 h-4 mr-2" />
          {t('continueshopping')}
        </button>
        
        {paymentStatus === "completed" && (
          <button
            className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            onClick={() => router.push(`/customer-profile/orders/${order?._id}`)}
          >
            <Package className="w-4 h-4 mr-2" />
            {t('viewdetails')}
          </button>
        )}
        
        {(paymentStatus === "failed" || paymentStatus === "pending") && (
          <button
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            onClick={() => window.location.href = "mailto:support@yoursite.com"}
          >
            <Mail className="w-4 h-4 mr-3" />
            {t('contactsupport')}
          </button>
        )}
      </div>
     </div>
    </div>
  );
}