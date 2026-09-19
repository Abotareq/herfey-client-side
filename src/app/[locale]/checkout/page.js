"use client";

import { useState } from "react";
import { useCheckout } from "@/app/context/CheckoutContext";
import { useAuth } from "@/app/context/AuthContext";
import { useGetUserById } from "@/service/user";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";
import toast from "react-hot-toast";
import { AlertCircle, ArrowLeft, ArrowRight, MapPin } from "lucide-react";

export default function CheckoutStep1() {
  const { state, setUseExisting, setNewAddress } = useCheckout();
  const router = useRouter();
  const [form, setForm] = useState({
    street: "",
    city: "",
    postalCode: "",
    country: "Egypt",
  });
  const t = useTranslations("CheckoutStep1");
  const [errors, setErrors] = useState({});

  // "Use existing address" needs the profile, not the JWT -- the JWT carries
  // only id and role. Step 2 would otherwise fail after the user had moved on.
  const { user } = useAuth();
  const { data: profile, isLoading: profileLoading } = useGetUserById(
    user?.id || user?._id,
  );
  const addresses = profile?.data?.user?.addresses || [];
  const defaultAddress =
    addresses.find((a) => a.isDefault) || addresses[0] || null;
  const hasExistingAddress = addresses.length > 0;
  const [addressError, setAddressError] = useState(null);

  const validateForm = () => {
    const newErrors = {};
    if (!form.street.trim()) newErrors.street = t("streetrequire");
    if (!form.city.trim()) newErrors.city = t("cityrequire");
    if (!form.postalCode.trim()) newErrors.postalCode = t("postrequire");
    if (!form.country.trim()) newErrors.country = t("countryrequire");
    return newErrors;
  };

  const handleContinue = () => {
    if (state.useExisting) {
      if (profileLoading) return;
      if (!hasExistingAddress) {
        setAddressError(t("noaddress"));
        toast.error(t("noaddress"));
        return;
      }
      setAddressError(null);
    } else {
      const validationErrors = validateForm();
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      setNewAddress(form); // shippingAddress
    }
    router.push("/checkout/step2");
  };

  const chooseExisting = () => {
    setUseExisting(true);
    setAddressError(null);
  };

  const chooseNew = () => {
    setUseExisting(false);
    setAddressError(null);
  };

  const handleGoBack = () => {
    router.back(); // Goes to previous page in history
    // Alternative: router.push("/cart") if you want to go to a specific page
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 md:py-14">
      {/* where we are in the flow */}
      <div className="mb-8">
        <p className="label">{t("stepOf", { step: 1, total: 2 })}</p>
        <h1 className="mt-2 text-3xl text-gray-900 sm:text-4xl">{t("title")}</h1>
        <div className="mt-5 grid grid-cols-2 gap-2" aria-hidden="true">
          <div className="h-1 rounded-full bg-orange-600" />
          <div className="h-1 rounded-full bg-gray-900/10" />
        </div>
      </div>

      {/* Address Selection with enhanced styling */}
      <div className="space-y-3 mb-6">
        <label className="flex cursor-pointer items-start gap-4 rounded-2xl bg-white p-5 ring-1 ring-gray-900/10 ring-inset transition duration-200 has-[:checked]:ring-2 has-[:checked]:ring-orange-500 hover:ring-gray-900/20">
          <input
            type="radio"
            name="addressOption"
            checked={state.useExisting}
            onChange={chooseExisting}
            className="mt-0.5 h-5 w-5 shrink-0 accent-orange-600"
          />
          <div className="flex-1">
            <span className="font-medium text-gray-900">
              {t("useexistingaddress")}
            </span>
            <p className="mt-0.5 text-sm text-gray-500">{t("profileaddress")}</p>

            {state.useExisting && (
              <div className="mt-3">
                {profileLoading ? (
                  <div className="space-y-2" aria-hidden="true">
                    <div className="skeleton h-3 w-2/3" />
                    <div className="skeleton h-3 w-1/2" />
                  </div>
                ) : defaultAddress ? (
                  <div className="flex items-start gap-2 rounded-xl bg-gray-50 px-3 py-2.5 text-sm text-gray-700">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" aria-hidden="true" />
                    <span>
                      {defaultAddress.street}, {defaultAddress.city}
                      {defaultAddress.postalCode ? `, ${defaultAddress.postalCode}` : ""}
                      {defaultAddress.country ? `, ${defaultAddress.country}` : ""}
                    </span>
                  </div>
                ) : (
                  <div
                    role="alert"
                    className={`flex items-start gap-2 rounded-lg border px-3 py-2 text-sm ${
                      addressError
                        ? "border-red-300 bg-red-50 text-red-700"
                        : "border-amber-200 bg-amber-50 text-amber-800"
                    }`}
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>
                      {t("noaddress")}{" "}
                      <Link
                        href="/customer-profile"
                        className="font-semibold underline underline-offset-2 hover:text-orange-700"
                      >
                        {t("addaddress")}
                      </Link>
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </label>

        <label className="flex cursor-pointer items-start gap-4 rounded-2xl bg-white p-5 ring-1 ring-gray-900/10 ring-inset transition duration-200 has-[:checked]:ring-2 has-[:checked]:ring-orange-500 hover:ring-gray-900/20">
          <input
            type="radio"
            name="addressOption"
            checked={!state.useExisting}
            onChange={chooseNew}
            className="mt-0.5 h-5 w-5 shrink-0 accent-orange-600"
          />
          <div className="flex-1">
            <span className="font-medium text-gray-900">
              {t("usenewaddress")}
            </span>
            <p className="mt-0.5 text-sm text-gray-500">
              {t("differentshippingaddress")}
            </p>
          </div>
        </label>
      </div>

      {/* New Address Form with enhanced styling */}
      {!state.useExisting && (
        <div className="enter mt-6 rounded-2xl bg-white p-6 shadow-xs">
          <h2 className="row-title mb-5">{t("newaddress")}</h2>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {t("street")}
              </label>
              <input
                type="text"
                placeholder={t("streetplace")}
                className={`field ${errors.street ? "border-red-400 focus:border-red-500 focus:ring-red-500/15" : ""}`}
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
              />
              {errors.street && (
                <p className="mt-2 flex items-center gap-1.5 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {errors.street}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {t("city")}
              </label>
              <input
                type="text"
                placeholder={t("cityplace")}
                className={`field ${errors.city ? "border-red-400 focus:border-red-500 focus:ring-red-500/15" : ""}`}
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
              />
              {errors.city && (
                <p className="mt-2 flex items-center gap-1.5 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {errors.city}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {t("postcode")}
              </label>
              <input
                type="text"
                placeholder={t("postplace")}
                className={`field ${errors.postalCode ? "border-red-400 focus:border-red-500 focus:ring-red-500/15" : ""}`}
                value={form.postalCode}
                onChange={(e) =>
                  setForm({ ...form, postalCode: e.target.value })
                }
              />
              {errors.postalCode && (
                <p className="mt-2 flex items-center gap-1.5 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {errors.postalCode}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                {t("country")}
              </label>
              <input
                type="text"
                placeholder={t("countryplace")}
                className={`field ${errors.country ? "border-red-400 focus:border-red-500 focus:ring-red-500/15" : ""}`}
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
              />
              {errors.country && (
                <p className="mt-2 flex items-center gap-1.5 text-sm text-red-700">
                  <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {errors.country}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button type="button" onClick={handleGoBack} className="btn btn-ghost">
          <ArrowLeft className="h-4 w-4 rtl:-scale-x-100" aria-hidden="true" />
          {t("goback")}
        </button>
        <button
          type="button"
          onClick={handleContinue}
          aria-disabled={state.useExisting && (profileLoading || !hasExistingAddress)}
          className={`btn btn-primary ${
            state.useExisting && (profileLoading || !hasExistingAddress) ? "opacity-50" : ""
          }`}
        >
          {t("continuepayment")}
          <span className="btn-disc" aria-hidden="true">
            <ArrowRight />
          </span>
        </button>
      </div>
    </div>
  );
}
