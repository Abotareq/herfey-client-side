// export default Signup;
"use client";
import React, { useState } from "react";
import { useLocale, useTranslations } from "use-intl";
import Link from "next/link";
import Image from "next/image";
import background from "../../../../public/singup.jpg";
import { useSignUp, useGoogleSignIn } from "@/service/auth.js";
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
  const googleSignInMutation = useGoogleSignIn();
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
            <h2 className="text-2xl font-bold text-gray-800">
              {t("newacount")}
            </h2>
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
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
            <button
              type="button"
              onClick={() => {
                googleSignInMutation.mutate();
                alert("Google Sign-In Clicked!");
              }}
              className="mt-4 w-full flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg py-3 hover:bg-gray-50 transition"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
                focusable="false"
                className="inline-block"
              >
                <defs />
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.9 0 7.1 1.4 9.4 3.3l7-7C35.3 2.1 30 0 24 0 14.7 0 6.9 5.4 3 13.2l8.2 6.4C12.6 13.3 17.7 9.5 24 9.5z"
                />
                <path
                  fill="#34A853"
                  d="M46.5 24c0-1.6-.1-3.1-.4-4.6H24v9.1h12.7c-.6 3.4-2.7 6.3-5.8 8.1l9 7.1C43.7 39.8 46.5 32.7 46.5 24z"
                />
                <path
                  fill="#4A90E2"
                  d="M11.2 28.6A14.9 14.9 0 0 1 10 24c0-1.5.2-2.9.6-4.2L3.4 13.4C1.2 16.9 0 20.9 0 25c0 4.2 1.3 8 3.6 11.2l7.6-7.6z"
                />
                <path
                  fill="#FBBC05"
                  d="M24 48c6.4 0 11.8-2.1 15.7-5.8l-7.6-6.1C29.3 36.1 26.8 37 24 37c-6.2 0-11.4-3.4-14-8.3l-7.6 5.9C6.9 42.6 14.7 48 24 48z"
                />
              </svg>

              <span className="text-gray-700 font-medium">
                {t2("goolgesignin")}
              </span>
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
