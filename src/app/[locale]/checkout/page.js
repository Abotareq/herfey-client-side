"use client";

import { useState } from "react";
import { useCheckout } from "@/app/context/CheckoutContext";
import { useRouter } from "next/navigation";

export default function CheckoutStep1() {
  const { state, setUseExisting, setNewAddress } = useCheckout();
  const router = useRouter();
  const [form, setForm] = useState({
    street: "",
    city: "",
    postalCode: "",
    country: "Egypt",
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!form.street.trim()) newErrors.street = "Street Address is required";
    if (!form.city.trim()) newErrors.city = "City is required";
    if (!form.postalCode.trim()) newErrors.postalCode = "Postal Code is required";
    if (!form.country.trim()) newErrors.country = "Country is required";
    return newErrors;
  };

  const handleContinue = () => {
    if (!state.useExisting) {
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      setNewAddress(form); // shippingAddress
    }
   router.push("/checkout/step2")
  };

  return (
    <div className="max-w-2xl mx-auto p-8 bg-gradient-to-br from-orange-50 to-amber-50 shadow-xl rounded-3xl border border-orange-100">
      {/* Header with orange accent */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">1</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
            Shipping Address
          </h2>
        </div>
        <div className="w-full bg-orange-200 rounded-full h-2">
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full w-1/3 shadow-sm"></div>
        </div>
      </div>

      {/* Address Selection with enhanced styling */}
      <div className="space-y-4 mb-6">
        <label className="flex items-center space-x-4 p-4 border-2 border-orange-200 rounded-xl hover:border-orange-300 transition-all duration-200 cursor-pointer group">
          <input
            type="radio"
            name="addressOption"
            checked={state.useExisting}
            onChange={() => setUseExisting(true)}
            className="w-5 h-5 text-orange-600 focus:ring-orange-500 focus:ring-2"
          />
          <div className="flex-1">
            <span className="text-gray-800 font-medium group-hover:text-orange-700 transition-colors">
              Use existing address
            </span>
            <p className="text-sm text-gray-600 mt-1">Use the address from your profile</p>
          </div>
        </label>

        <label className="flex items-center space-x-4 p-4 border-2 border-orange-200 rounded-xl hover:border-orange-300 transition-all duration-200 cursor-pointer group">
          <input
            type="radio"
            name="addressOption"
            checked={!state.useExisting}
            onChange={() => setUseExisting(false)}
            className="w-5 h-5 text-orange-600 focus:ring-orange-500 focus:ring-2"
          />
          <div className="flex-1">
            <span className="text-gray-800 font-medium group-hover:text-orange-700 transition-colors">
              Use a new address
            </span>
            <p className="text-sm text-gray-600 mt-1">Enter a different shipping address</p>
          </div>
        </label>
      </div>

      {/* New Address Form with enhanced styling */}
      {!state.useExisting && (
        <div className="mt-8 space-y-6 border-t-2 border-orange-200 pt-6 bg-white/50 rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-orange-800 mb-4">Enter New Address</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <input
                type="text"
                placeholder="Enter your street address"
                className={`w-full p-4 border-2 rounded-xl transition-all duration-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
                  errors.street 
                    ? "border-red-400 focus:border-red-500" 
                    : "border-orange-200 focus:border-orange-400 hover:border-orange-300"
                }`}
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
              />
              {errors.street && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.street}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                type="text"
                placeholder="Enter your city"
                className={`w-full p-4 border-2 rounded-xl transition-all duration-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
                  errors.city 
                    ? "border-red-400 focus:border-red-500" 
                    : "border-orange-200 focus:border-orange-400 hover:border-orange-300"
                }`}
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.city}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Postal Code
              </label>
              <input
                type="text"
                placeholder="Enter your postal code"
                className={`w-full p-4 border-2 rounded-xl transition-all duration-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
                  errors.postalCode 
                    ? "border-red-400 focus:border-red-500" 
                    : "border-orange-200 focus:border-orange-400 hover:border-orange-300"
                }`}
                value={form.postalCode}
                onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
              />
              {errors.postalCode && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.postalCode}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                type="text"
                placeholder="Enter your country"
                className={`w-full p-4 border-2 rounded-xl transition-all duration-200 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${
                  errors.country 
                    ? "border-red-400 focus:border-red-500" 
                    : "border-orange-200 focus:border-orange-400 hover:border-orange-300"
                }`}
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
              />
              {errors.country && (
                <p className="text-red-500 text-sm mt-2 flex items-center">
                  <span className="mr-1">⚠️</span>
                  {errors.country}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Continue Button with enhanced orange styling */}
      <button
        onClick={handleContinue}
        className="mt-8 w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-orange-600 hover:to-amber-600 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-500/30"
      >
        Continue to Payment Method →
      </button>
    </div>
  );
}