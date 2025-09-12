"use client";

import { useParams } from "next/navigation";
import {
  useCancelOrder,
  useGetUserOrderById,
} from "@/service/customerOrderService";
import { useTranslations } from "next-intl";
import Link from "next/link";
import toast from "react-hot-toast";
import LoadingSpinner from "../../../components/ReusableComponents/LoadingSpinner/LoadingSpinner.jsx";
import { Icons } from "../../../components/ReusableComponents/SVG-Icons/SVG-Icons.jsx";
import Image from "next/image.js";

const OrderStatusTracker = ({ status, paymentMethod, t }) => {
  // Different status flows for different payment methods
  const creditCardStatuses = ["paid", "processing", "shipped", "delivered"];
  const codStatuses = ["pending", "processing", "shipped", "delivered"];
  
  const statuses = paymentMethod === "cash_on_delivery" ? codStatuses : creditCardStatuses;
  
  // For COD: when status is "paid", it means delivered + paid
  // For Credit Card: status follows normal flow
  let currentStatusIndex;
  if (paymentMethod === "cash_on_delivery" && status === "paid") {
    // For COD "paid" status, show as completed delivery
    currentStatusIndex = 3; // delivered index
  } else {
    currentStatusIndex = statuses.indexOf(status);
  }

  const getStatusLabel = (s) => {
    const statusLabels = {
      pending: t("orderPlaced"),
      paid: t("orderPlaced"), 
      processing: t("processing"),
      shipped: t("shipped"),
      delivered: t("delivered"),
      cancelled: t("cancelled")
    };
    return statusLabels[s] || t(s);
  };

  // Handle cancelled orders
  if (status === "cancelled") {
    return (
      <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200/50 shadow-md">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-red-500 mb-2">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-lg font-semibold">{t("orderCancelled")}</span>
          </div>
          <p className="text-slate-600 text-sm">{t("orderCancelledMessage")}</p>
        </div>
      </div>
    );
  }

  // Handle COD order with confirmed payment (status is "paid" = delivered + paid)
  if (paymentMethod === "cash_on_delivery" && status === "paid") {
    return (
      <div className="bg-gradient-to-r from-orange-300 via-orange-500 to-orange-300 rounded-2xl p-6 border border-green-200 shadow-lg">
        {/* Delivery & Payment Confirmation Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center gap-3 text-white mb-3">
            <div className="relative">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
              </div>
              {/* Pulse animation */}
              <div className="absolute inset-0 w-12 h-12 bg-white/10 rounded-full animate-ping"></div>
            </div>
            <div className="text-left">
              <h3 className="text-xl font-bold text-white">{t("orderCompleted")}</h3>
              <p className="text-green-100 text-sm">{t("deliveredAndPaid")}</p>
            </div>
          </div>
        </div>

        {/* Payment Method Info */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/>
              </svg>
            </div>
            <span className="text-sm font-medium text-white/90">
              {t("cashOnDelivery")} - {t("paymentReceived")}
            </span>
          </div>
        </div>
        
        {/* Completed Status Progress */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
          <ol className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm font-medium">
            {codStatuses.map((s, index) => (
              <li key={s} className="flex flex-col items-center gap-2">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-green-500 shadow-md">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <span className="text-white font-semibold text-center">
                  {getStatusLabel(s)}
                </span>
              </li>
            ))}
          </ol>
          
          {/* Payment Confirmation */}
          <div className="mt-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
            <div className="flex items-center justify-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-green-500">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
                  <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/>
                </svg>
              </div>
              <span className="text-white font-medium">{t("paymentConfirmed")}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Regular status tracker for other cases
  return (
    <div className="bg-gradient-to-r from-orange-50 to-orange-100 backdrop-blur-lg rounded-2xl p-6 border border-orange-200/50 shadow-md">
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-orange-500">
            {paymentMethod === "cash_on_delivery" ? 
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/>
              </svg>
              :
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v2H4V6zm0 4h12v4H4v-4z" clipRule="evenodd"/>
              </svg>
            }
          </span>
          <span className="text-sm font-medium text-slate-700">
            {paymentMethod === "cash_on_delivery" ? t("cashOnDelivery") : t("creditCard")}
          </span>
        </div>
      </div>
      
      <ol className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm font-medium text-slate-500">
        {statuses.map((s, index) => {
          const isActive = index <= currentStatusIndex;
          // For credit card: when status is "delivered", mark it as completed
          // For COD: keep original logic (completed when index < currentStatusIndex)
          const isCompleted = paymentMethod === "cash_on_delivery" 
            ? index < currentStatusIndex 
            : (status === "delivered" && s === "delivered") 
              ? true 
              : index < currentStatusIndex;
          
          return (
            <li
              key={s}
              className="flex items-center gap-2 transition-colors duration-300"
            >
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 ${
                isCompleted 
                  ? "bg-orange-500 border-orange-500" 
                  : isActive 
                    ? "border-orange-500 bg-orange-100" 
                    : "border-orange-300 bg-white"
              }`}>
                {isCompleted ? (
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                ) : (
                  <div className={`w-3 h-3 rounded-full ${
                    isActive ? "bg-orange-500" : "bg-orange-300"
                  }`} />
                )}
              </div>
              <span className={`${
                isActive ? "text-slate-800 font-semibold" : "text-slate-500"
              }`}>
                {getStatusLabel(s)}
              </span>
            </li>
          );
        })}
      </ol>
      
      {/* Additional payment status for COD delivered orders (awaiting payment) */}
      {paymentMethod === "cash_on_delivery" && status === "delivered" && (
        <div className="mt-6 pt-4 border-t border-orange-200/50">
          <div className="flex items-center gap-3 text-sm">
            <div className="flex items-center justify-center w-6 h-6 rounded-full border-2 border-amber-400 bg-amber-50">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
            </div>
            <span className="text-amber-600 font-medium">{t("awaitingPaymentConfirmation")}</span>
          </div>
        </div>
      )}
    </div>
  );
};
//  Order Items Card ---
const OrderItemsCard = ({ items, t }) => (
  <div className="lg:col-span-2 bg-gradient-to-r from-orange-50 to-orange-100 backdrop-blur-lg rounded-2xl p-6 border border-orange-200/50 shadow-md space-y-4">
    <div className="flex items-center gap-3">
      <span className="text-orange-500">{Icons.package}</span>
      <h4 className="font-semibold text-slate-800 text-lg">
        {t("itemsInOrder")} ({items.length})
      </h4>
    </div>
    {items.map((item) => (
      <div
        key={item._id}
        className="flex items-start gap-4 py-4 border-b border-orange-200/50 last:border-b-0"
      >
        <div className="relative w-20 h-20">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="rounded-lg object-cover border border-orange-200/50"
          />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-slate-800">{item.name}</p>
          <p className="text-sm text-slate-600">
            {t("quantity")}: {item.quantity}
          </p>
          <p className="text-sm text-slate-700 font-medium">
            ${item.price.toFixed(2)} {t("each")}
          </p>
        </div>
        <div className="text-right">
          <p className="font-semibold text-slate-800">
            ${(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>
    ))}
  </div>
);

// --- Order Sidebar ---
const OrderSidebar = ({
  order,
  isCancellable,
  isCancelling,
  onCancelClick,
  t,
  tOrders,
}) => (
  <div className="space-y-6">
    <div className="bg-gradient-to-r from-orange-50 to-orange-100 backdrop-blur-lg rounded-2xl p-6 border border-orange-200/50 shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-orange-500">{Icons.location}</span>
        <h4 className="font-semibold text-slate-800 text-lg">
          {t("shippingAddress")}
        </h4>
      </div>
      <address className="not-italic text-slate-700">
        {order.shippingAddress.street}
        <br />
        {order.shippingAddress.city}, {order.shippingAddress.postalCode}
        <br />
        {order.shippingAddress.country}
      </address>
    </div>

    {/* Payment Method Info */}
    <div className="bg-gradient-to-r from-orange-50 to-orange-100 backdrop-blur-lg rounded-2xl p-6 border border-orange-200/50 shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-orange-500">
          {order.paymentMethod === "cash_on_delivery" ? 
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"/>
              <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"/>
            </svg>
            :
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v2H4V6zm0 4h12v4H4v-4z" clipRule="evenodd"/>
            </svg>
          }
        </span>
        <h4 className="font-semibold text-slate-800 text-lg">
          {t("paymentMethod")}
        </h4>
      </div>
      <div className="space-y-2">
        <p className="text-slate-700">
          {order.paymentMethod === "cash_on_delivery" ? t("cashOnDelivery") : t("creditCard")}
        </p>
        {order.paymentMethod === "cash_on_delivery" && (
          <div className={`text-sm px-3 py-2 rounded-lg ${
            order.status === "paid" 
              ? "bg-green-50 text-green-700 border border-green-200"
              : order.status === "delivered" 
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "bg-blue-50 text-blue-700 border border-blue-200"
          }`}>
            {order.status === "paid" 
              ? t("paymentCompleted")
              : order.status === "delivered" 
                ? t("paymentDueOnDelivery")
                : t("paymentOnDeliveryInfo")
            }
          </div>
        )}
        {order.paymentMethod === "credit_card" && (
          <div className="text-sm px-3 py-2 rounded-lg bg-green-50 text-green-700 border border-green-200">
            {t("paymentProcessed")}
          </div>
        )}
      </div>
    </div>

    <div className="bg-gradient-to-r from-orange-50 to-orange-100 backdrop-blur-lg rounded-2xl p-6 border border-orange-200/50 shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-orange-500">{Icons.receipt}</span>
        <h4 className="font-semibold text-slate-800 text-lg">
          {t("orderSummary")}
        </h4>
      </div>
      <div className="space-y-2 text-slate-700">
        <div className="flex justify-between">
          <span>{t("subtotal")}</span>
          <span>${order.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>{t("shippingFee")}</span>
          <span>${order.shippingFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>{t("tax")}</span>
          <span>${order.tax.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-slate-800 text-lg pt-2 border-t border-orange-200/50 mt-2">
          <span>{t("total")}</span>
          <span>${order.totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>

    {/* Action Card */}
    <div className="bg-gradient-to-r from-orange-50 to-orange-100 backdrop-blur-lg rounded-2xl p-6 border border-orange-200/50 shadow-md text-center">
      {order.status === "cancelled" ? (
        <div className="text-center">
          <div className="text-red-500 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-sm text-slate-600">{t("orderWasCancelled")}</p>
        </div>
      ) : isCancellable ? (
        <>
          <p className="text-sm text-slate-600 mb-4">{t("cancelPrompt")}</p>
          <button
            onClick={onCancelClick}
            disabled={isCancelling}
            className="w-full px-4 py-2.5 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCancelling ? tOrders("cancelling") : tOrders("cancelOrder")}
          </button>
        </>
      ) : (
        <div className="text-center">
          <div className="text-green-500 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
          </div>
          <p className="text-sm text-slate-700">{t("orderInProgress")}</p>
          <p className="text-xs text-slate-600 mt-1">{t("supportPrompt")}</p>
        </div>
      )}
    </div>
  </div>
);

function OrderDetailsPage() {
  const params = useParams();
  const { orderId } = params;
  const t = useTranslations("orderDetails");
  const tOrders = useTranslations("orders");

  const {
    data: order,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetUserOrderById(orderId);

  const { mutate: cancelOrder, isLoading: isCancelling } = useCancelOrder({
    onSuccess: () => {
      toast.success(tOrders("orderCancelled"));
      refetch();
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.error || tOrders("error")
      );
    },
  });

  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success(t("refreshed") || "Order details refreshed");
    } catch (err) {
      toast.error(t("refreshError") || "Failed to refresh order details");
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return (
      <p className="text-center py-10 text-red-500">Error: {error.message}</p>
    );
  if (!order) return <p className="text-center py-10">Order not found.</p>;

  // Updated cancellation logic
  const isCancellable = order.paymentMethod === "cash_on_delivery" 
    ? ["pending"].includes(order.status) // COD orders can only be cancelled when pending
    : ["paid"].includes(order.status); // Credit card orders can be cancelled when paid

  const handleCancelClick = () => {
    if (confirm(tOrders("areYouSure"))) {
      cancelOrder(orderId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/customer-profile"
              className="text-slate-600 hover:text-orange-600 transition-colors"
            >
              {Icons.back}
            </Link>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{t("title")}</h3>
              <p className="text-slate-700">
                Order #{order._id.slice(-8)} &bull; Placed on{" "}
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={isFetching}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-orange-200 text-orange-600 font-medium rounded-lg shadow-sm hover:bg-orange-50 hover:border-orange-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg 
              className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span className="hidden sm:inline">
              {isFetching ? (t("refreshing") || "Refreshing...") : (t("refresh") || "Refresh")}
            </span>
          </button>
        </div>

        <OrderStatusTracker 
          status={order.status} 
          paymentMethod={order.paymentMethod}
          t={t} 
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <OrderItemsCard items={order.orderItems} t={t} />
          <OrderSidebar
            order={order}
            isCancellable={isCancellable}
            isCancelling={isCancelling}
            onCancelClick={handleCancelClick}
            t={t}
            tOrders={tOrders}
          />
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsPage;