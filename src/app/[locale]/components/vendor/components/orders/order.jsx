"use client";

import { useState } from "react";
import { useGetSellerOrders, useUpdateVendorOrderStatus } from "@/service/customerOrderService";
import { useUpdatePaymentStatus } from "@/service/payment";
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
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useRouter } from "next/navigation";



// Credit Card Order Component
const CreditCardOrderActions = ({ order, updateStatus }) => {
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

  return (
    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 hover:from-blue-100 hover:to-blue-150 transition-all duration-300">
      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <CreditCard className="w-4 h-4 text-blue-600" />
        Credit Card Order
      </h4>
      <div className="flex flex-col gap-3">
        <Button
          onClick={() => router.push(`/vendor-profile/orders/${order._id}`)}
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 hover:bg-white hover:shadow-sm transition-all duration-200 bg-white"
        >
          <Eye className="w-4 h-4" />
          View Details
        </Button>
        
        {order.status !== "delivered" && (
          <Button
            size="sm"
            className="w-full justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition-all duration-200 hover:shadow-md hover:scale-105"
            onClick={() =>
              updateStatus.mutate({
                orderId: order._id,
                status: getNextStatus(order.status),
              })
            }
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
            Payment Confirmed
          </div>
        </div>
      </div>
    </div>
  );
};

// Cash on Delivery Order Component
const CODOrderActions = ({ order, updateStatus, updatePaymentStatus, router }) => {
  const isPaid = order?.status === "paid";
  
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

  return (
    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 hover:from-orange-100 hover:to-orange-150 transition-all duration-300">
      <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Banknote className="w-4 h-4 text-orange-600" />
        Cash on Delivery
      </h4>
      <div className="flex flex-col gap-3">
        <Button
          onClick={() => router.push(`/vendor-profile/orders/${order._id}`)}
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2 hover:bg-white hover:shadow-sm transition-all duration-200 bg-white"
        >
          <Eye className="w-4 h-4" />
          View Details
        </Button>
        
        {/* Payment Status Button */}
        {!isPaid ? (
          <Button
            size="sm"
            className="w-full justify-center gap-2 bg-green-600 hover:bg-green-700 transition-all duration-200 hover:shadow-md hover:scale-105"
            onClick={() =>
              updatePaymentStatus.mutate({
                id: order?._id,
                status: "completed",
              })
            }
            disabled={updatePaymentStatus.isPending}
          >
            {updatePaymentStatus.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <DollarSign className="w-4 h-4" />
                Confirm Payment Received
              </>
            )}
          </Button>
        ) : (
          <div className="p-2 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-700 text-xs font-medium">
              <CheckCircle className="w-3 h-3" />
              Payment Confirmed
            </div>
          </div>
        )}
        
        {/* Order Status Button */}
        {order.status !== "delivered" && isPaid && (
          <Button
            size="sm"
            className="w-full justify-center gap-2 bg-orange-600 hover:bg-orange-700 transition-all duration-200 hover:shadow-md hover:scale-105"
            onClick={() =>
              updateStatus.mutate({
                orderId: order._id,
                status: getNextStatus(order.status),
              })
            }
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
        
        {/* Warning for unpaid orders */}
        {!isPaid && (
          <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 text-amber-700 text-xs font-medium">
              <AlertCircle className="w-3 h-3" />
              Payment pending - Confirm payment before processing
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function OrdersSection() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const limit = 10;
  const router = useRouter();
  
  // Fetch seller orders
  const { data, isLoading, isError } = useGetSellerOrders({page, limit, searchQuery, statusFilter});

  // Update order status mutation
  const updateStatus = useUpdateVendorOrderStatus();
  
  // Update payment status mutation
  const updatePaymentStatus = useUpdatePaymentStatus();

  // Helper function to determine if order is COD
  const isCODOrder = (order) => {

    return order?.status === "pending" ;
  
  };

  // Helper function to determine if order is Credit Card
  const isCreditCardOrder = (order) => {
    return order?.status === "paid" ;
  };

  // Status configuration
  const statusConfig = {
    pending: { 
      color: "bg-amber-50 text-amber-700 border-amber-200", 
      icon: Clock,
      badge: "bg-amber-100 text-amber-800",
      hover: "hover:bg-amber-100"
    },
    processing: { 
      color: "bg-blue-50 text-blue-700 border-blue-200", 
      icon: Package,
      badge: "bg-blue-100 text-blue-800",
      hover: "hover:bg-blue-100"
    },
    shipped: { 
      color: "bg-purple-50 text-purple-700 border-purple-200", 
      icon: Truck,
      badge: "bg-purple-100 text-purple-800",
      hover: "hover:bg-purple-100"
    },
    delivered: { 
      color: "bg-green-50 text-green-700 border-green-200", 
      icon: CheckCircle,
      badge: "bg-green-100 text-green-800",
      hover: "hover:bg-green-100"
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-16">
        <div className="animate-pulse space-y-4 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
            <div className="h-3 bg-gray-100 rounded w-24 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-16">
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-600" />
          </div>
          <div className="text-red-600 text-lg font-semibold mb-2">Failed to load orders</div>
          <p className="text-red-500 text-sm">Please check your connection and try again.</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const orders = data?.orders || [];
  const totalPages = data.pages;

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gradient-to-br from-orange-10 to-orange-30 min-h-screen">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Order Management</h1>
            <p className="text-gray-600">Track and manage all your customer orders efficiently</p>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex items-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:shadow-sm"
            >
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-2 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:shadow-sm"
            >
              <Filter className="w-4 h-4" />
              Filter
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
            onChange={(e) => {setStatusFilter(e.target.value);setPage(1);}}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white hover:border-gray-300 transition-all duration-200 shadow-sm cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {Object.entries(statusConfig).map(([status, config], index) => {
          const count = orders.filter(order => order.status === status).length;
          const Icon = config.icon;
          return (
            <Card 
              key={status} 
              className="border-0 shadow-sm hover:shadow-md transition-all duration-300 bg-white hover:translate-y-[-2px] cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 capitalize mb-1">{status}</p>
                    <p className="text-3xl font-bold text-gray-900 transition-all duration-300">{count}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${config.color.split(' ')[0]} ${config.color.split(' ')[1]} ${config.hover} transition-all duration-200`}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {orders.length === 0 ? (
          <Card className="border-0 shadow-sm bg-white">
            <CardContent className="text-center py-16">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-12 h-12 text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500 max-w-md mx-auto">Orders will appear here when customers make purchases. Your dashboard will show all order details and status updates.</p>
            </CardContent>
          </Card>
        ) : (
          orders.map((order, index) => {
            const StatusIcon = statusConfig[order.status]?.icon || Package;
            const isCodeOrder = isCODOrder(order);
            const isCreditOrder = isCreditCardOrder(order);
            
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
                        <div className={`p-3 rounded-xl ${statusConfig[order.status]?.color || 'bg-gray-100 text-gray-600'} ${statusConfig[order.status]?.hover} transition-all duration-200 group-hover:scale-105`}>
                          <StatusIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-gray-900 tracking-tight flex items-center gap-3">
                            Order #{order._id.slice(-8).toUpperCase()}
                            {/* Payment Method Badge */}
                            {isCodeOrder && (
                              <span className="flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                                <Banknote className="w-3 h-3" />
                                COD
                              </span>
                            )}
                            {isCreditOrder && (
                              <span className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                <CreditCard className="w-3 h-3" />
                                Card
                              </span>
                            )}
                          </h3>
                          <div className="flex items-center gap-6 text-sm text-gray-500 mt-2">
                            <span className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {order.user?.userName || "Unknown Customer"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusConfig[order.status]?.badge || 'bg-gray-100 text-gray-700'} transition-all duration-200`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
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
                          Order Summary
                        </h4>
                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Items:</span>
                            <span className="font-medium px-2 py-1 bg-white rounded-lg">{order.orderItems.length} items</span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                            <span className="text-gray-600">Total Amount:</span>
                            <span className="font-bold text-xl text-green-600 flex items-center gap-1">
                              <DollarSign className="w-5 h-5" />
                              {order.totalAmount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Product Images */}
                      <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 hover:from-gray-100 hover:to-gray-150 transition-all duration-300">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          Products
                        </h4>
                        <div className="flex gap-2 overflow-x-auto pb-2">
                          {order.orderItems.slice(0, 4).map((item, index) => (
                            <div key={item._id} className="relative flex-shrink-0 group">
                              <img
                                src={item.image || "/api/placeholder/60/60"}
                                alt={item.name}
                                className="w-16 h-16 object-cover rounded-lg border-2 border-white shadow-sm group-hover:scale-101 transition-transform duration-200"
                              />
                              <div className="absolute -top-0 -right-2 bg-orange-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold shadow-sm">
                                {item.quantity}
                              </div>
                            </div>
                          ))}
                          {order.orderItems.length > 4 && (
                            <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center text-sm font-medium text-gray-600 border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors duration-200">
                              +{order.orderItems.length - 4}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions - Conditional rendering based on payment method */}
                      {isCodeOrder ? (
                        <CODOrderActions 
                          order={order} 
                          updateStatus={updateStatus} 
                          updatePaymentStatus={updatePaymentStatus}
                          router={router}
                        />
                      ) : (
                        <CreditCardOrderActions 
                          order={order} 
                          updateStatus={updateStatus}
                          router={router}
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
                Showing page <span className="font-bold text-gray-900">{page}</span> of <span className="font-bold text-gray-900">{totalPages}</span>
                <span className="text-gray-400 ml-2">({data?.totalOrders || 0} total orders)</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(1)}
                  className="px-3 hover:bg-gray-50 transition-all duration-200"
                >
                  First
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-3 hover:bg-gray-50 transition-all duration-200"
                >
                  Previous
                </Button>
                
                <div className="flex items-center gap-1">
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = Math.max(1, page - 2) + i;
                    if (pageNum > totalPages) return null;
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === page ? "default" : "outline"}
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
                  onClick={() => setPage(p => p + 1)}
                  className="px-3 hover:bg-gray-50 transition-all duration-200"
                >
                  Next
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(totalPages)}
                  className="px-3 hover:bg-gray-50 transition-all duration-200"
                >
                  Last
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}