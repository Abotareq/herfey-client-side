import React from 'react'

function PaymentForm() {
  return (
    <div class="p-4">
    <div class="max-w-xl mx-auto bg-white">
      <div class="rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div class="bg-gradient-to-r from-purple-500 to-indigo-600 p-6">
          <h2 class="text-xl font-semibold text-white">Complete Your Payment</h2>
          <p class="text-sm text-slate-100 mt-2">Fast, secure payment processing</p>
        </div>

        <div class="p-6">
          <div class="flex mb-6 border border-gray-300 rounded-md overflow-hidden">
            <button
              class="cursor-pointer flex-1 py-3 px-1 text-sm text-center bg-indigo-50 text-indigo-600 font-medium">
              Credit Card
            </button>
            <button
              class="cursor-pointer flex-1 py-3 px-1 text-sm text-center text-slate-500 hover:bg-gray-50 font-medium">
              PayPal
            </button>
            <button
              class="cursor-pointer flex-1 py-3 px-1 text-sm text-center text-slate-500 hover:bg-gray-50 font-medium">
              Bank Transfer
            </button>
          </div>

          <form>
            <div class="mb-4">
              <label class="block text-slate-900 text-sm font-medium mb-2" for="cardName">
                Cardholder Name
              </label>
              <input
                type="text"
                id="cardName"
                class="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-orange-600"
                placeholder="John Smith"
                required
              />
            </div>
            <div class="mb-4">
              <label class="block text-slate-900 text-sm font-medium mb-2" for="cardNumber">
                Card Number
              </label>
              <div class="relative">
                <input
                  type="text"
                  id="cardNumber"
                  class="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-orange-600"
                  placeholder="1234 5678 9012 3456"
                  required
                />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label class="block text-slate-900 text-sm font-medium mb-2" for="expDate">
                  Expiry Date
                </label>
                <input
                  type="text"
                  id="expDate"
                  class="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-orange-600"
                  placeholder="MM/YY"
                  required
                />
              </div>
              <div>
                <label class="block text-slate-900 text-sm font-medium mb-2" for="cvv">
                  CVV
                </label>
                <input
                  type="text"
                  id="cvv"
                  class="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-orange-600"
                  placeholder="123"
                  required
                />
              </div>
            </div>

            <div class="mb-6">
              <div class="flex items-center">
                <input
                  type="checkbox"
                  id="saveCard"
                  class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  required
                />
                <label for="saveCard" class="ml-2 block text-sm text-slate-900 font-medium">
                  I agree to the <a href="#" class="text-indigo-600 hover:text-indigo-500">Terms and Conditions</a>
                </label>
              </div>
            </div>

            <div class="flex flex-col space-y-4">
              <button
                type="submit"
                class="cursor-pointer w-full py-2.5 px-4 rounded-md flex items-center justify-center bg-orange-600 hover:bg-orange-700 text-sm text-white font-medium transition-colors"
              >
                Pay $49.99
              </button>
              <div class="flex items-center justify-center text-slate-500 text-sm">
                <span>Secure payment powered by Stripe</span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>

    <div class="flex justify-center gap-2 mt-4">
      <img src="https://readymadeui.com/images/visa.webp" class="w-12" alt="card1" />
      <img src="https://readymadeui.com/images/american-express.webp" class="w-12" alt="card2" />
      <img src="https://readymadeui.com/images/master.webp" class="w-12" alt="card3" />
    </div>
</div>
)
}

export default PaymentForm