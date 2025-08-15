import React from 'react'

function page() {
  return (

    <div class="bg-gray-100 min-h-screen flex items-center justify-center p-4">
          <div class="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-xl">
              <div class="bg-indigo-600 px-6 py-4">
                  <div class="flex items-center justify-between gap-2">
                      <h2 class="text-lg font-semibold text-white">Order Confirmation</h2>
                      <span class="bg-white/20 text-white text-xs font-medium px-2.5 py-1 rounded-full">Paid</span>
                  </div>
                  <p class="text-slate-200 text-sm mt-2">Thank you for your order!</p>
              </div>

              <div class="p-6">
                  <div class="flex flex-wrap justify-between items-center gap-4">
                      <div>
                          <p class="text-slate-500 text-sm font-medium">Order Number</p>
                          <p class="text-slate-900 text-sm font-medium mt-2">#ORD-78945</p>
                      </div>
                      <div>
                          <p class="text-slate-500 text-sm font-medium">Date</p>
                          <p class="text-slate-900 text-sm font-medium mt-2">June 15, 2025</p>
                      </div>
                      <div>
                          <p class="text-slate-500 text-sm font-medium">Total</p>
                          <p class="text-sm font-medium text-indigo-700 mt-2">$367.00</p>
                      </div>
                  </div>

                  <div class="bg-gray-100 rounded-xl p-4 mt-8">
                      <h3 class="text-base font-medium text-slate-900 mb-6">Shipping Information</h3>
                      <div class="grid sm:grid-cols-2 gap-4">
                          <div>
                              <p class="text-slate-500 text-sm font-medium">Customer</p>
                              <p class="text-slate-900 text-sm font-medium mt-2">Alex Johnson</p>
                          </div>
                          <div>
                              <p class="text-slate-500 text-sm font-medium">Shipping Method</p>
                              <p class="text-slate-900 text-sm font-medium mt-2">Express Delivery</p>
                          </div>
                          <div>
                              <p class="text-slate-500 text-sm font-medium">Address</p>
                              <p class="text-slate-900 text-sm font-medium mt-2">123 Main St, Apt 4B</p>
                          </div>
                          <div>
                              <p class="text-slate-500 text-sm font-medium">Phone</p>
                              <p class="text-slate-900 text-sm font-medium mt-2">(555) 123-4567</p>
                          </div>
                      </div>
                  </div>

                  <div class="mt-8">
                      <h3 class="text-base font-medium text-slate-900 mb-6">Order Items (2)</h3>
                      <div class="space-y-4">
                          <div class="flex items-start gap-4 max-sm:flex-col">
                              <div class="w-[70px] h-[70px] bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
                                  <img src="https://readymadeui.com/images/watch1.webp" alt="Product" class="w-14 h-14 object-contain rounded-sm" />
                              </div>
                              <div class="flex-1">
                                  <h4 class="text-sm font-medium text-slate-900">Stylish Golden Watch</h4>
                                  <p class="text-slate-500 text-xs font-medium mt-2">Color: Golden</p>
                                  <p class="text-slate-500 text-xs font-medium mt-1">Qty: 1</p>
                              </div>
                              <div class="text-right">
                                  <p class="text-slate-900 text-sm font-semibold">$129.00</p>
                              </div>
                          </div>

                          <div class="flex items-start gap-4 max-sm:flex-col max-sm:border-t max-sm:pt-4 max-sm:border-gray-300">
                              <div class="w-[70px] h-[70px] bg-gray-200 rounded-lg flex items-center justify-center shrink-0">
                                  <img src="https://readymadeui.com/images/product14.webp" alt="Product" class="w-14 h-14 object-contain rounded-sm" />
                              </div>
                              <div class="flex-1">
                                  <h4 class="text-sm font-medium text-slate-900">Velvet Sneaker</h4>
                                  <p class="text-slate-500 text-xs font-medium mt-2">Color: Black/White</p>
                                  <p class="text-slate-500 text-xs font-medium mt-1">Qty: 1</p>
                              </div>
                              <div class="text-right">
                                  <p class="text-slate-900 text-sm font-semibold">$238.00</p>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div class="bg-gray-100 rounded-xl p-4 mt-8">
                      <h3 class="text-base font-medium text-slate-900 mb-6">Order Summary</h3>
                      <div class="space-y-4">
                          <div class="flex justify-between">
                              <p class="text-sm text-slate-500 font-medium">Subtotal</p>
                              <p class="text-slate-900 text-sm font-semibold">$367.00</p>
                          </div>
                          <div class="flex justify-between">
                              <p class="text-sm text-slate-500 font-medium">Shipping</p>
                              <p class="text-slate-900 text-sm font-semibold">$0.00</p>
                          </div>
                          <div class="flex justify-between">
                              <p class="text-sm text-slate-500 font-medium">Tax</p>
                              <p class="text-slate-900 text-sm font-semibold">$29.36</p>
                          </div>
                          <div class="flex justify-between pt-3 border-t border-gray-300">
                              <p class="text-[15px] font-semibold text-slate-900">Total</p>
                              <p class="text-[15px] font-semibold text-indigo-700">$396.36</p>
                          </div>
                      </div>
                  </div>
              </div>

              <div class="bg-gray-100 px-6 py-4">
                  <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
                      <p class="text-slate-500 text-sm font-medium">Need help? <a href="javascript:void(0)" class="text-indigo-700 hover:underline">Contact us</a></p>
                      <button class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-[15px] py-2 px-4 rounded-lg max-sm:-order-1 cursor-pointer transition duration-200">
                          Download Invoice
                      </button>
                  </div>
              </div>
          </div>
      </div>
)
}

export default page