// export default Signup;
"use client";
import React, { useState } from "react";
import { useLocale, useTranslations } from "use-intl";
import Link from "next/link";
import Image from "next/image";
import background from "../../../../public/singup.jpg";
import { useSignUp } from "@/service/auth.js";
import { useRouter } from "next/navigation";
import {
  getGuestCart,
  clearGuestCart,
  useCreateOrUpdateCart,
} from "@/service/cart";

function Signup() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const { mutateAsync: signUp, isPending } = useSignUp();
  const createOrUpdateCartMutation = useCreateOrUpdateCart();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 8;
  const passwordsMatch = formData.password === formData.confirmPassword;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordsMatch) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Sign up user
      await signUp(formData);
      // Check guest cart
      const guestCart = getGuestCart();
      if (guestCart && guestCart.length > 0) {
        const formattedItems = guestCart.map((item) => ({
          product: item.product._id,
          quantity: item.quantity,
          price: item.price,
          variant: item.variant || [],
        }));
        console.log("Guest cart items:", formattedItems);
        await createOrUpdateCartMutation.mutateAsync({
          items: formattedItems,
          coupon: null,
        });

        clearGuestCart();
      }

      // 3️⃣ Redirect
      router.push("/");
    } catch (err) {
      alert(err.message || "Signup failed");
    }
  };

  const t = useTranslations("Signup");
  const t2 = useTranslations("Login");
  const locale = useLocale();
  const isArabic = locale === "ar";

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-100 rounded-full mb-4">
              <i className="fas fa-user-plus text-orange-500 fa-lg"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{t("newacount")}</h2>
            <p className="text-gray-600 mt-2">{t("details")}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* First & Last Name */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("firstname")}
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder={t("fnameplace")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t("lastname")}
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder={t("lnameplace")}
                />
              </div>
            </div>

            {/* Username */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("Username")}
              </label>
              <input
                type="text"
                name="userName"
                value={formData.userName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder={t("Username")}
              />
            </div>

            {/* Email */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("emailaddress")}
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder={t("pemail")}
              />
              {formData.email && !validateEmail(formData.email) && (
                <p className="mt-2 text-sm text-orange-500">{t("wemail")}</p>
              )}
            </div>

            {/* Phone */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("phonenumber")}
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                pattern="[0-9]{10,15}"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder={t("pplace")}
              />
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("Password")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i
                    className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"}
                  ></i>
                </button>
              </div>
              {formData.password && !validatePassword(formData.password) && (
                <p className="mt-2 text-sm text-green-500">{t("wpassword")}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("cpassword")}
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  <i
                    className={
                      showConfirmPassword ? "fas fa-eye-slash" : "fas fa-eye"
                    }
                  ></i>
                </button>
              </div>
              {formData.confirmPassword && !passwordsMatch && (
                <p className="mt-2 text-sm text-red-500">{t("wcpswword")}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={
                isPending ||
                !validateEmail(formData.email) ||
                !validatePassword(formData.password) ||
                !passwordsMatch
              }
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 focus:ring-4 focus:ring-orange-500 focus:ring-opacity-50 disabled:opacity-50"
            >
              {isPending ? `${t("signingup")}` : `${t("signUp")}`}
            </button>

            {/* Switch */}
            <p className="mt-6 text-center text-gray-600">
              {t("accountexists")}{" "}
              <Link
                href="/signin"
                className="ml-1 text-orange-500 hover:text-orange-600 font-semibold"
              >
                {t("signin")}
              </Link>
            </p>
            <p className="mt-6 text-center text-gray-600">
              {t2("guest")}
              <Link
                href="/"
                className={`ml-1 text-orange-500 hover:text-orange-600 font-semibold ${
                  isArabic ? "pr-1" : ""
                }`}
              >
                {t2("guestl")}
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right - Image */}
      <div className="hidden lg:block lg:w-1/2 bg-cover bg-center relative">
        <Image
          src={background}
          alt="Herafy background"
          fill
          priority
          className="object-cover"
        />
        <div className="h-full bg-black opacity-50 flex items-center justify-center text-white px-12">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">{t("join")}</h2>
            <p className="text-xl">{t2("worksentence")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;

