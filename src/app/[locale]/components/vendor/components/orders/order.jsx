"use client";

import { useState } from "react";
import {
  useGetSellerOrders,
  useUpdateVendorOrderStatus,
} from "@/service/customerOrderService";
import { useUpdatePaymentStatusByOrderId } from "@/service/payment";
import toast, { Toaster } from "react-hot-toast";
import {
  Loader2,
  Package,
  Clock,
  CheckCircle,
  Truck,
  MapPin,
  Calendar,
  DollarSign,
  Eye,
  Filter,
  Search,
  Download,
  MoreVertical,
  CreditCard,
  Banknote,
  AlertCircle,
  X,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import OrdersSkeleton from "./orderSkelton";
import { useTranslations } from "next-intl";

// Credit Card Order Component
const CreditCardOrderActions = ({ order, updateStatus, router }) => {
  const t = useTranslations('VendorOrder')
  const getNextStatus = (currentStatus) => {
    
    const statusFlow = {
      // paid: "processing",
      processing: "shipped",
      shipped: "delivered",
    };
    return statusFlow[currentStatus];
  };
  
  const getStatusAction = (status) => {
    const actions = {
      paid: "Accept Order",
      processing: "Mark Shipped",
      shipped: "Mark Delivered",
    };
    return actions[status];
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateStatus.mutateAsync({
        orderId: order._id,
        status: newStatus,
      });

      toast.success(
        `Order ${getStatusAction(order.status).toLowerCase()} successfully!`,
        {
          style: {
            border: "1px solid #10B981",
            padding: "16px",
            color: "#000000",
          },
          iconTheme: {
            primary: "#10B981",
            secondary: "#FFFFFF",
          },
        }
      );
    } catch (error) {
      toast.error(`Failed to update order status. Please try again.`, {
        style: {
          border: "1px solid #EF4444",
          padding: "16px",
          color: "#000000",
        },
        iconTheme: {
          primary: "#EF4444",
          secondary: "#FFFFFF",
        },
      });
    }
  };
  
  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 hover:from-blue-100 hover:to-blue-150 transition-all duration-300">
      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <CreditCard className="w-4 h-4 text-blue-600" />
        {t('cridit')}
      </h4>
      <div className="flex flex-col gap-3">
        <Button
          onClick={() => {
            router.push(`/vendor-profile/orders/${order._id}`);
            toast(t('orderdetails'), {
              style: {
                border: "1px solid #FF8C00",
                padding: "16px",
                color: "#000000",
              },
              iconTheme: {
                primary: "#FF8C00",
                secondary: "#FFFFFF",
              },
            });
          }}
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 hover:bg-white hover:shadow-sm transition-all duration-200 bg-white"
        >
          <Eye className="w-4 h-4" />
          {t('view')}
        </Button>

        {order.status !== "delivered" && order.status !== "cancelled" && (
          <Button
            size="sm"
            className="w-full justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:shadow-md hover:scale-105"
            onClick={() => handleStatusUpdate(getNextStatus(order.status))}
            disabled={updateStatus.isPending}
          >
            {updateStatus.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                {getStatusAction(order.status)}
              </>
            )}
          </Button>
        )}

        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center gap-2 text-green-700 text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            {t('confirmed')}
          </div>
        </div>
      </div>
    </div>
  );
};

// Cash on Delivery Order Component - Improved with React Query Refetch
const CODOrderActions = ({ order, updateStatus, updatePaymentStatus, router, refetch }) => {
  const t = useTranslations('VendorOrder')
  const getNextStatus = (currentStatus) => {
    const statusFlow = {
      pending: "processing",
      processing: "shipped", 
      shipped: "delivered"
    };
    return statusFlow[currentStatus];
  };

  const getStatusAction = (status) => {
    const actions = {
      pending: "Accept Order",
      processing: "Mark Shipped",
      shipped: "Mark Delivered"
    };
    return actions[status];
  };

  const handlePaymentConfirmation = async () => {
    try {
      await updatePaymentStatus.mutateAsync({
        id: order._id,
        status: "completed",
      });
      
      toast.success(t('paymentsuccess'), {
        style: {
          border: '1px solid #10B981',
          padding: '16px',
          color: '#000000',
        },
        iconTheme: {
          primary: '#10B981',
          secondary: '#FFFFFF',
        },
      });
      
      // Refetch orders data to update UI without reload
      await refetch();
      
    } catch (error) {
      toast.error(t('paymentfail'), {
        style: {
          border: '1px solid #EF4444',
          padding: '16px',
          color: '#000000',
        },
        iconTheme: {
          primary: '#EF4444',
          secondary: '#FFFFFF',
        },
      });
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await updateStatus.mutateAsync({
        orderId: order._id,
        status: newStatus,
      });
      
      toast.success(`Order ${getStatusAction(order.status).toLowerCase()} successfully!`, {
        style: {
          border: '1px solid #10B981',
          padding: '16px',
          color: '#000000',
        },
        iconTheme: {
          primary: '#10B981',
          secondary: '#FFFFFF',
        },
      });

      // No refetch here - let React Query handle automatic updates
      
    } catch (error) {
      toast.error(`Failed to update order status. Please try again.`, {
        style: {
          border: '1px solid #EF4444',
          padding: '16px',
          color: '#000000',
        },
        iconTheme: {
          primary: '#EF4444',
          secondary: '#FFFFFF',
        },
      });
    }
  };

  const handleCancelOrder = async () => {
    const confirmCancel = window.confirm(t('question'));
    if (confirmCancel) {
      try {
        await updateStatus.mutateAsync({
          orderId: order._id,
          status: "cancelled",
        });
        
        toast.success(t('ordercancel'), {
          style: {
            border: '1px solid #EF4444',
            padding: '16px',
            color: '#000000',
          },
          iconTheme: {
            primary: '#EF4444',
            secondary: '#FFFFFF',
          },
        });
        
        // No refetch here - let React Query handle automatic updates
        
      } catch (error) {
        toast.error(t('ordercancelerror'), {
          style: {
            border: '1px solid #EF4444',
            padding: '16px',
            color: '#000000',
          },
          iconTheme: {
            primary: '#EF4444',
            secondary: '#FFFFFF',
          },
        });
      }
    }
  };

  return (
    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 hover:from-orange-100 hover:to-orange-150 transition-all duration-300">
      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Banknote className="w-4 h-4 text-orange-600" />
        {t('cash')}
      </h4>
      <div className="flex flex-col gap-3">
        {/* View Details Button - Always visible */}
        <Button
          onClick={() => {
            router.push(`/vendor-profile/orders/${order._id}`);
            toast('Opening order details...', {
              style: {
                border: '1px solid #FF8C00',
                padding: '16px',
                color: '#000000',
              },
              iconTheme: {
                primary: '#FF8C00',
                secondary: '#FFFFFF',
              },
            });
          }}
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 hover:bg-white hover:shadow-sm transition-all duration-200 bg-white"
        >
          <Eye className="w-4 h-4" />
          {t('view')}
        </Button>
        
        {/* Order Progress Buttons - From pending to delivered */}
        {order.status !== "delivered" && order.status !== "cancelled" && (
          <Button
            size="sm"
            className="w-full justify-center gap-2 bg-orange-600 hover:bg-orange-700 transition-all duration-200 hover:shadow-md hover:scale-105"
            onClick={() => handleStatusUpdate(getNextStatus(order.status))}
            disabled={updateStatus.isPending}
          >
            {updateStatus.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                {getStatusAction(order.status)}
              </>
            )}
          </Button>
        )}

        {/* Payment and Cancel Buttons - Only show when delivered */}
        {order.status === "delivered" && (
          <>
            <Button
              size="sm"
              className="w-full justify-center gap-2 bg-green-600 hover:bg-green-700 transition-all duration-200 hover:shadow-md hover:scale-105"
              onClick={handlePaymentConfirmation}
              disabled={updatePaymentStatus.isPending}
            >
              {updatePaymentStatus.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <DollarSign className="w-4 h-4" />
                  {t('confirm')}
                </>
              )}
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              className="w-full justify-center gap-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300 transition-all duration-200"
              onClick={handleCancelOrder}
              disabled={updateStatus.isPending}
            >
              {updateStatus.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <XCircle className="w-4 h-4" />
                  {t('cancel')}
                </>
              )}
            </Button>
          </>
        )}
        
        {/* Status Indicators */}
        {order.status === "pending" && (
          <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 text-amber-700 text-xs font-medium">
              <AlertCircle className="w-3 h-3" />
              {t('pending')}
            </div>
          </div>
        )}
        
        {order.status === "processing" && (
          <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700 text-xs font-medium">
              <Package className="w-3 h-3" />
              {t('processing')}
            </div>
          </div>
        )}
        
        {order.status === "shipped" && (
          <div className="p-2 bg-purple-50 border border-purple-200 rounded-lg">
            <div className="flex items-center gap-2 text-purple-700 text-xs font-medium">
              <Truck className="w-3 h-3" />
              {t('shipped')}
            </div>
          </div>
        )}
        
        {order.status === "delivered" && (
          <div className="p-2 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-2 text-blue-700 text-xs font-medium">
              <CheckCircle className="w-3 h-3" />
              {t('delivered')}
            </div>
          </div>
        )}
        
        {order.status === "cancelled" && (
          <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 text-xs font-medium">
              <XCircle className="w-3 h-3" />
              {t('ocancel')}
            </div>
          </div>
        )}

        {/* Payment Completed Indicator */}
        {order.paymentStatus === "completed" && (
          <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-700 text-xs font-medium">
              <CheckCircle className="w-3 h-3" />
              {t('pconfirm')}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function OrdersSection() {
  const t = useTranslations("VendorOrder")
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const limit = 6;
  const router = useRouter();

  // Fetch seller orders
  const { data, isLoading, isError, refetch } = useGetSellerOrders({
    page,
    limit,
    searchQuery,
    statusFilter,
    paymentMethodFilter,
  });
  
  // Update order status mutation
  const updateStatus = useUpdateVendorOrderStatus();

  // Update payment status mutation
  const updatePaymentStatus = useUpdatePaymentStatusByOrderId();

  // Helper function to determine if order is COD
  const isCODOrder = (order) => {
    return order?.paymentMethod === "cash_on_delivery";
  };

  // Helper function to determine if order is Credit Card
  const isCreditCardOrder = (order) => {
    return order?.paymentMethod === "credit_card";
  };

  // Status configuration with cancelled status
  const statusConfig = {
    pending: {
      color: "bg-amber-50 text-amber-700 border-amber-200",
      icon: Clock,
      badge: "bg-amber-100 text-amber-800",
      hover: "hover:bg-amber-100",
    },
    paid: {
      color: "bg-green-50 text-green-700 border-green-200",
      icon: CheckCircle,
      badge: "bg-green-100 text-green-800",
      hover: "hover:bg-green-100",
    },
    processing: {
      color: "bg-blue-50 text-blue-700 border-blue-200",
      icon: Package,
      badge: "bg-blue-100 text-blue-800",
      hover: "hover:bg-blue-100",
    },
    shipped: {
      color: "bg-purple-50 text-purple-700 border-purple-200",
      icon: Truck,
      badge: "bg-purple-100 text-purple-800",
      hover: "hover:bg-purple-100",
    },
    delivered: {
      color: "bg-green-50 text-green-700 border-green-200",
      icon: CheckCircle,
      badge: "bg-green-100 text-green-800",
      hover: "hover:bg-green-100",
    },
    cancelled: {
      color: "bg-red-50 text-red-700 border-red-200",
      icon: XCircle,
      badge: "bg-red-100 text-red-800",
      hover: "hover:bg-red-100",
    },
  };

  // Refresh orders with toast notification
  const handleRefresh = async () => {
    try {
      await refetch();
      toast.success("Orders refreshed successfully!", {
        style: {
          border: "1px solid #10B981",
          padding: "16px",
          color: "#000000",
        },
        iconTheme: {
          primary: "#10B981",
          secondary: "#FFFFFF",
        },
      });
    } catch (error) {
      toast.error("Failed to refresh orders.", {
        style: {
          border: "1px solid #EF4444",
          padding: "16px",
          color: "#000000",
        },
        iconTheme: {
          primary: "#EF4444",
          secondary: "#FFFFFF",
        },
      });
    }
  };

  if (isLoading) {
    return <OrdersSkeleton />
  }

  if (isError) {
    return (
      <div className="text-center py-16">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-600" />
          </div>
          <div className="text-red-600 text-lg font-semibold mb-2">
            {t('failedloadingo')}
          </div>
          <p className="text-red-500 text-sm">
            {t('faildesc')}
          </p>
          <Button className="mt-4" onClick={handleRefresh}>
            {t('tryagain')}
          </Button>
        </div>
      </div>
    );
  }

  const orders = data?.orders || [];
  const totalPages = data?.pages || 1;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-orange-10 to-orange-30 min-h-screen">

      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-orange-600 mb-2 tracking-tight">
              {t('ordermanage')}
            </h1>
            <p className="text-gray-600">
              {t('ordermanagdesc')}
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:shadow-sm"
              onClick={() => {
                toast(t('exportf'), {
                  style: {
                    border: "1px solid #FF8C00",
                    padding: "16px",
                    color: "#000000",
                  },
                  iconTheme: {
                    primary: "#FF8C00",
                    secondary: "#FFFFFF",
                  },
                });
              }}
            >
              <Download className="w-4 h-4" />
              {t('export')}
            </Button>
            <Button
              variant="outline"
              className="flex items-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:shadow-sm"
              onClick={handleRefresh}
            >
              <Filter className="w-4 h-4" />
              {t('refresh')}
            </Button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200" />
            <input
              type="text"
              placeholder="Search by order ID or customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-200 hover:border-gray-300 bg-white shadow-sm"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white hover:border-gray-300 transition-all duration-200 shadow-sm cursor-pointer"
          >
            <option value="all">{t('all')}</option>
            <option value="pending">{t('pendings')}</option>
            <option value="paid">{t('paid')}</option>
            <option value="processing">{t('processings')}</option>
            <option value="shipped">{t('shipped')}</option>
            <option value="delivered">{t('delivereds')}</option>
            <option value="cancelled">{t('cancells')}</option>
          </select>

          <select
            value={paymentMethodFilter}
            onChange={(e) => {
              setPaymentMethodFilter(e.target.value);
              setPage(1);
            }}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white hover:border-gray-300 transition-all duration-200 shadow-sm cursor-pointer"
          >
            <option value="all">{t('allpayment')}</option>
            <option value="credit_card">{t('creditcard')}</option>
            <option value="cash_on_delivery">{t('cash')}</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {Object.entries(statusConfig).map(([status, config], index) => {
          const count = orders.filter(
            (order) => order.status === status
          ).length;
          const Icon = config.icon;
          return (
            <Card
              key={status}
              className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white hover:translate-y-[-2px] cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 capitalize mb-1">
                      {status}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 transition-all duration-300">
                      {count}
                    </p>
                  </div>
                  <div
                    className={`p-2 rounded-lg ${config.color.split(" ")[0]} ${
                      config.color.split(" ")[1]
                    } ${config.hover} transition-all duration-200`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Payment Method Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {t('criditcardorders')}
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {orders.filter((order) => isCreditCardOrder(order)).length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                <CreditCard className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {t('cashorders')}
                </p>
                <p className="text-3xl font-bold text-orange-600">
                  {orders.filter((order) => isCODOrder(order)).length}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-orange-50 text-orange-600">
                <Banknote className="w-6 h-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.length === 0 ? (
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {t('noorders')}
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                {t('noordersdesc')}
              </p>
            </CardContent>
          </Card>
        ) : (
          orders.map((order, index) => {
            const StatusIcon = statusConfig[order.status]?.icon || Package;
            const isCODOrder = order.paymentMethod === "cash_on_delivery";
            const isCreditCardOrder = order.paymentMethod === "credit_card";

            return (
              <Card
                key={order._id}
                className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 bg-white group hover:translate-y-[-2px]"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-0">
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-xl ${
                            statusConfig[order.status]?.color ||
                            "bg-gray-100 text-gray-600"
                          } ${
                            statusConfig[order.status]?.hover
                          } transition-all duration-200 group-hover:scale-105`}
                        >
                          <StatusIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-gray-900 tracking-tight flex items-center gap-3">
                            Order #{order._id.slice(-8).toUpperCase()}
                            {/* Payment Method Badge */}
                            {isCODOrder && (
                              <span className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                                <Banknote className="w-3 h-3" />
                                {t('cod')}
                              </span>
                            )}
                            {isCreditCardOrder && (
                              <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                <CreditCard className="w-3 h-3" />
                                {t('card')}
                              </span>
                            )}
                          </h3>
                          <div className="flex items-center gap-6 text-sm text-gray-500 mt-2">
                            <span className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {new Date(
                                order.createdAt || Date.now()
                              ).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {order.user?.userName ||
                                order.user?.name ||
                                t('unkown')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${
                            statusConfig[order.status]?.badge ||
                            "bg-gray-100 text-gray-700"
                          } transition-all duration-200`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="p-2 hover:bg-gray-100 hover:rotate-90 transition-all duration-200"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Order Details Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Order Summary */}
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 hover:from-gray-100 hover:to-gray-150 transition-all duration-300">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <DollarSign className="w-4 h-4" />
                          {t('ordersummary')}
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">{t('Items')}:</span>
                            <span className="font-medium px-2 py-1 bg-white rounded-lg">
                              {order.orderItems?.length || 0} {t('items')}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">{t('subtotal')}:</span>
                            <span className="font-medium">
                              ${order.subtotal?.toFixed(2) || "0.00"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">{t('shipping')}:</span>
                            <span className="font-medium">
                              ${order.shippingFee?.toFixed(2) || "0.00"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">{t('tax')}:</span>
                            <span className="font-medium">
                              ${order.tax?.toFixed(2) || "0.00"}
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                            <span className="text-gray-600">{t('total')}:</span>
                            <span className="font-bold text-xl text-green-600 flex items-center gap-1">
                              <DollarSign className="w-5 h-5" />
                              {order.totalAmount?.toFixed(2) || "0.00"}
                            </span>
                          </div>
                        </div>
                      </div>
                      {/* Product Images */}
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 hover:from-gray-100 hover:to-gray-150 transition-all duration-300">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          {t('products')}
                        </h4>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {order.orderItems?.slice(0, 4).map((item, index) => (
                            <div
                              key={item._id || index}
                              className="relative flex-shrink-0 group"
                            >
                              <img
                                src={item.image || "/api/placeholder/60/60"}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg border-2 border-white shadow-sm group-hover:scale-105 transition-transform duration-200"
                              />
                              <div className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold shadow-sm">
                                {item.quantity}
                              </div>
                            </div>
                          )) || []}
                          {(order.orderItems?.length || 0) > 4 && (
                            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-sm font-medium text-gray-600 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors duration-200">
                              +{(order.orderItems?.length || 0) - 4}
                            </div>
                          )}
                        </div>
                      </div>
                      {/* Actions - Conditional rendering based on payment method */}
                      {isCODOrder ? (
                        <CODOrderActions
                          order={order}
                          updateStatus={updateStatus}
                          updatePaymentStatus={updatePaymentStatus}
                          router={router}
                          refetch={refetch} // Add this line
                        />
                      ) : (
                        <CreditCardOrderActions
                          order={order}
                          updateStatus={updateStatus}
                          router={router}
                          refetch={refetch}  // Add this line
                        />
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <Card className="border-0 shadow-sm mt-8 bg-white">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600 font-medium">
                {t('show')}{" "}
                <span className="font-bold text-gray-900">{page}</span> {t('of')}{" "}
                <span className="font-bold text-gray-900">{totalPages}</span>
                <span className="text-gray-400 ml-2">
                  ({data?.totalOrders || 0} {t('totalorders')})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(1)}
                  className="px-3 hover:bg-gray-50 transition-all duration-200"
                >
                  {t('first')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="px-3 hover:bg-gray-50 transition-all duration-200"
                >
                  {t('prev')}
                </Button>

                <div className="flex items-center gap-1">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = Math.max(1, page - 2) + i;
                    if (pageNum > totalPages) return null;

                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === page ? t('default') : t('outline')}
                        size="sm"
                        onClick={() => setPage(pageNum)}
                        className="w-10 h-10 p-0 transition-all duration-200 hover:scale-110"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 hover:bg-gray-50 transition-all duration-200"
                >
                  {t('next')}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(totalPages)}
                  className="px-3 hover:bg-gray-50 transition-all duration-200"
                >
                  {t('last')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
