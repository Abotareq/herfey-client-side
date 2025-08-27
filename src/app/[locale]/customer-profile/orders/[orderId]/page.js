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

const OrderStatusTracker = ({ status, t }) => {
  const statuses = ["pending", "paid", "processing", "shipped", "delivered"];
  const currentStatusIndex = statuses.indexOf(status);
  const getStatusLabel = (s) => {
    if (s === "pending" || s === "paid") return t("orderPlaced");
    return t(s);
  };

  return (
    <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-md">
      <ol className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm font-medium text-slate-500">
        {statuses.slice(1).map((s, index) => {
          const isActive = index <= currentStatusIndex - 1;
          return (
            <li
              key={s}
              className="flex items-center gap-2 transition-colors duration-300"
            >
              <span className={isActive ? "text-orange-500" : "text-slate-400"}>
                {Icons.checkmark}
              </span>
              <span className={isActive ? "text-slate-800 font-semibold" : ""}>
                {getStatusLabel(s)}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

//  Order Items Card ---
const OrderItemsCard = ({ items, t }) => (
  <div className="lg:col-span-2 bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-md space-y-4">
    <div className="flex items-center gap-3">
      <span className="text-orange-500">{Icons.package}</span>
      <h4 className="font-semibold text-slate-800 text-lg">
        {t("itemsInOrder")} ({items.length})
      </h4>
    </div>
    {items.map((item) => (
      <div
        key={item._id}
        className="flex items-start gap-4 py-4 border-b border-slate-200/50 last:border-b-0"
      >
        <div className="relative w-30 h-30">
          <Image
            src={item.image}
            alt={item.name}
            fill
            className="rounded-lg object-cover border border-slate-200/50"
          />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-slate-800">{item.name}</p>
          <p className="text-sm text-slate-500">
            {t("quantity")}: {item.quantity}
          </p>
        </div>
        <p className="font-semibold text-slate-800">
          ${(item.price * item.quantity).toFixed(2)}
        </p>
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
    <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-orange-500">{Icons.location}</span>
        <h4 className="font-semibold text-slate-800 text-lg">
          {t("shippingAddress")}
        </h4>
      </div>
      <address className="not-italic text-slate-600">
        {order.shippingAddress.street}
        <br />
        {order.shippingAddress.city}, {order.shippingAddress.postalCode}
        <br />
        {order.shippingAddress.country}
      </address>
    </div>
    <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-orange-500">{Icons.receipt}</span>
        <h4 className="font-semibold text-slate-800 text-lg">
          {t("orderSummary")}
        </h4>
      </div>
      <div className="space-y-2 text-slate-600">
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
        <div className="flex justify-between font-bold text-slate-800 text-lg pt-2 border-t border-slate-200/50 mt-2">
          <span>{t("total")}</span>
          <span>${order.totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
    <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-6 border border-white/20 shadow-md text-center">
      {isCancellable ? (
        <>
          <p className="text-sm text-slate-500 mb-4">{t("cancelPrompt")}</p>
          <button
            onClick={onCancelClick}
            disabled={isCancelling}
            className="w-full px-4 py-2.5 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCancelling ? tOrders("cancelling") : tOrders("cancelOrder")}
          </button>
        </>
      ) : (
        <p className="text-sm text-slate-600">{t("supportPrompt")}</p>
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
  } = useGetUserOrderById(orderId);

  const { mutate: cancelOrder, isLoading: isCancelling } = useCancelOrder({
    onSuccess: () => {
      toast.success(tOrders("orderCancelledSuccess"));
      refetch();
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.error || tOrders("orderCancellationFailed")
      );
    },
  });

  if (isLoading) return <LoadingSpinner />;
  if (isError)
    return (
      <p className="text-center py-10 text-red-500">Error: {error.message}</p>
    );
  if (!order) return <p className="text-center py-10">Order not found.</p>;

  const isCancellable = ["pending", "paid"].includes(order.status);

  const handleCancelClick = () => {
    if (confirm(tOrders("areYouSure"))) {
      cancelOrder(orderId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-200 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/customer-profile"
            className="text-slate-500 hover:text-orange-600 transition-colors"
          >
            {Icons.back}
          </Link>
          <div>
            <h3 className="text-2xl font-bold text-slate-900">{t("title")}</h3>
            <p className="text-slate-600">
              Order #{order._id.slice(-8)} &bull; Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        <OrderStatusTracker status={order.status} t={t} />

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
