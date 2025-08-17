"use client";
import React from "react";
import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "use-intl";
import Image from "next/image";
import background from "../../../../public/login.jpg";
import { useSignIn } from "@/service/auth"; // adjust path if needed
import { useRouter } from "next/navigation";

export default function LogIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signInMutation = useSignIn();
  const router = useRouter();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => password.length >= 8;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    signInMutation.mutate(
      { email, password },
      {
        onSuccess: (data) => {
          setLoading(false);
          alert("Logged in successfully!");
          // if backend sets cookies, session is set. If token returned it's stored by service.
          window.location.href = "/";
        },
        onError: (err) => {
          setLoading(false);
          alert(err.message || "Login failed");
        },
      }
    );
  };

  const t = useTranslations("Login");
  const t2 = useTranslations("Herafy");
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Left - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <i className="fas fa-sign-in-alt text-orange-500 fa-lg"></i>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{t("welcome")}</h2>
            <p className="text-gray-600 mt-2">{t("sign")}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("email")}
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder={t("emailplace")}
                />
                <i className="fas fa-envelope absolute right-2 top-4 w-6 h-6 text-gray-400"></i>
              </div>
              {email && !validateEmail(email) && (
                <p className="mt-2 text-sm text-orange-500">
                  {t("wrongemail")}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t("password")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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
              {password && !validatePassword(password) && (
                <p className="mt-2 text-sm text-orange-500">
                  {t("wrongpasswrod")}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={
                loading ||
                (email && !validateEmail(email)) ||
                (password && !validatePassword(password))
              }
              className="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-600 focus:ring-4 focus:ring-orange-500 focus:ring-opacity-50 disabled:opacity-50"
            >
              {loading ? (
                <span className="inline-flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0..."
                    ></path>
                  </svg>
                  {t("signing")}
                </span>
              ) : (
                `${t("button")}`
              )}
            </button>
            <button
              type="button"
              onClick={() => alert("Google Sign-In Clicked!")}
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
                {t("goolgesignin")}
              </span>
            </button>

            {/* Switch */}
            <p className="mt-6 text-center text-gray-600">
              {t("signup")}{" "}
              <Link
                href="/signup"
                className="ml-1 text-orange-500 hover:text-orange-600 font-semibold"
              >
                {t("newsignup")}
              </Link>
              {/* Minimal delete account link placed next to the switch (keeps layout) */}
            </p>

            <p className="mt-6 text-center text-gray-600">
              {"process as a guest"}
              <Link
                href="/"
                className="ml-1 text-orange-500 hover:text-orange-600 font-semibold"
              >
                {"guest"}
              </Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right - Image */}
      {/* Right - Image */}
      <div className="hidden lg:block lg:w-1/2 relative min-h-full">
        {/* Background Image */}
        <Image
          src={background}
          alt="Herafy background"
          fill
          priority
          className="object-cover"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white px-12">
          <div className="text-center">
            <h2 className="text-4xl font-bold mb-6">{t2("herafy")}</h2>
            <p className="text-xl">{t("worksentence")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
