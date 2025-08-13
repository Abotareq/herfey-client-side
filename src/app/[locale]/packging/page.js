import { CheckIcon, XMarkIcon, ExclamationTriangleIcon, CameraIcon } from '@heroicons/react/24/outline'

export default function TermsOfSaleSection() {
  return (
    <section className="py-24 relative">
      <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
        <div className="w-full flex-col justify-start items-center lg:gap-12 gap-10 inline-flex">
          <div className="w-full flex-col justify-start items-center gap-3 flex">
            <h2 className="w-full text-center text-gray-900 text-4xl font-bold font-manrope leading-normal">
              Terms of Sale and Packaging
            </h2>
            <p className="w-full text-center text-gray-500 text-base font-normal leading-relaxed">
              Comprehensive guidelines for handmade product sellers on quality standards,
              <br />
              packaging requirements, and image specifications for Harfi platforms.
            </p>
          </div>

          {/* Terms of Sale Section */}
          <div className="w-full bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Terms of Sale</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">All products are handmade, any non-handmade product will be removed.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">The seller is committed to providing high-quality product images.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">
                    Products must meet agreed quality and specifications with proper packaging to maintain quality during shipping.
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">
                    Each seller must display their own sales policies regarding order preparation and delivery.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">
                    Products will be marketed on all Harfi platforms throughout the Arab Republic of Egypt.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">
                    The seller offers a 10% marketing commission on the cost of the product sold to the craftsman.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Image Guidelines */}
          <div className="w-full bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Product Image Acceptance Terms</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <XMarkIcon className="w-6 h-6 text-red-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Avoid These</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Light source behind product</li>
                  <li>• Phone flash creating shadows</li>
                  <li>• Bed sheets as background</li>
                  <li>• Shaky or blurry images</li>
                  <li>• Too many decorations nearby</li>
                  <li>• Tilted product positioning</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckIcon className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Best Practices</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• White background (white board)</li>
                  <li>• Good lighting conditions</li>
                  <li>• Photography box if possible</li>
                  <li>• Horizontal product position</li>
                  <li>• Clear product colors</li>
                  <li>• Professional photographer when possible</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm md:col-span-2 lg:col-span-1">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <CameraIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Logo & Layout</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Small logo at bottom only</li>
                  <li>• One image per product display</li>
                  <li>• Minimal decorations</li>
                  <li>• Don&apos;t combine multiple images</li>
                  <li>• Logo should not be large on product</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Packaging Guidelines */}
          <div className="w-full bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Packaging Products for Shipping</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-indigo-600 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Brand Packaging</h4>
                    <p className="text-gray-600 text-sm">
                      All packaging types permitted with brand logo, but no direct contact information 
                      (phone numbers, social media pages).
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-indigo-600 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Fragile Items</h4>
                    <p className="text-gray-600 text-sm">
                      Fragile products must be packaged appropriately and labeled as &quot;fragile&quot; 
                      to prevent damage during shipping.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />
                  </div>
                  <h4 className="font-semibold text-red-900">Important Notice</h4>
                </div>
                <p className="text-red-800 text-sm leading-relaxed">
                  The seller is fully responsible for providing proper packaging. Any damage due to 
                  negligent packaging is not covered by the platform. Seller losses from poor packaging 
                  are not compensated.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}