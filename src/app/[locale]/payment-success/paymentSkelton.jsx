function PaymentSkeleton() {
  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-100 animate-pulse">
      {/* large title */}
      <div className="h-8 bg-gray-200 rounded w-2/3 mx-auto mb-6"></div>

      {/* icon */}
      <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto mb-6"></div>

      {/* Order Details Box */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        </div>
      </div>

      {/* Email info box */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
        <div className="h-10 bg-gray-200 rounded w-40"></div>
        <div className="h-10 bg-gray-200 rounded w-40"></div>
      </div>
    </div>
  );
}

export default PaymentSkeleton;