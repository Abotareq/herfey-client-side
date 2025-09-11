'use client';
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import background from "../../../../public/contact.webp";
import Breadcrumbs from "../components/Breadcrumbs";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import toast, { Toaster } from "react-hot-toast";

export default function ContactPage() {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const t = useTranslations("Contct");

  const [formdata, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formdata, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await emailjs.send(
        process.env.NEXT_PUBLIC_SERVICE_ID,
        process.env.NEXT_PUBLIC_EMAIL_TEMPELATE_ID,
        {
          name: formdata.name,
          email: formdata.email, 
          phone: formdata.phone,
          message: formdata.message
        },
        process.env.NEXT_PUBLIC_EMAIL_PUBLIC_KEY
      );
      setLoading(false);
      toast.success(t('sendalert'));
      setFormData({ name: "", email: "", message: "", phone: "" });
    } catch (error) {
      setLoading(false);
      toast.error(t('failalert', error));
    }
  };

  return (
    <div>
      <Breadcrumbs />
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 grid-cols-1">
            {/* Left side */}
            <div className="lg:mb-0 mb-10">
              <div className="group w-full h-full">
                <div className="relative h-full">
                  <Image
                    src={background}
                    width={800}
                    height={800}
                    alt={t("title")}
                    className="w-full h-full lg:rounded-l-2xl rounded-2xl bg-blend-multiply bg-orange-500 object-cover"
                  />
                  <h1 className="font-manrope text-zinc-700 text-4xl font-bold leading-10 absolute top-11 left-11">
                    {t("title")}
                  </h1>
                  <div className="absolute bottom-0 w-full lg:p-11 p-5">
                    <div className="bg-white rounded-lg p-6 block">
                      {/* Phone */}
                      <Link href="#" className="flex items-center mb-6">
                        <svg
                          width="30"
                          height="30"
                          viewBox="0 0 30 30"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M22.3092 18.3098C22.0157 18.198 21.8689 18.1421 21.7145 18.1287C21.56 18.1154 21.4058 18.1453 21.0975 18.205L17.8126 18.8416C17.4392 18.9139 17.2525 18.9501 17.0616 18.9206C16.8707 18.891 16.7141 18.8058 16.4008 18.6353C13.8644 17.2551 12.1853 15.6617 11.1192 13.3695C10.9964 13.1055 10.935 12.9735 10.9133 12.8017C10.8917 12.6298 10.9218 12.4684 10.982 12.1456L11.6196 8.72559C11.6759 8.42342 11.7041 8.27233 11.6908 8.12115C11.6775 7.96998 11.6234 7.82612 11.5153 7.5384L10.6314 5.18758C10.37 4.49217 10.2392 4.14447 9.95437 3.94723C9.6695 3.75 9.29804 3.75 8.5551 3.75H5.85778C4.58478 3.75 3.58264 4.8018 3.77336 6.06012C4.24735 9.20085 5.64674 14.8966 9.73544 18.9853C14.0295 23.2794 20.2151 25.1426 23.6187 25.884C24.9335 26.1696 26.0993 25.1448 26.0993 23.7985V21.2824C26.0993 20.5428 26.0993 20.173 25.9034 19.8888C25.7076 19.6046 25.362 19.4729 24.6708 19.2096L22.3092 18.3098Z"
                            stroke="#F97316"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <h5 className="text-black text-base font-normal leading-6 ml-5 hover:text-orange-400 transition-transform duration-300 hover:scale-105">
                          {t("phone")}
                        </h5>
                      </Link>

                      {/* Email */}
                      <Link
                          href="mailto:herafyecommerce@gmail.com?subject=Inquiry&body=Hello%20team,"
                          className="flex items-center mb-6"
                        >
                          <h5 className="text-black text-base font-normal leading-6 ml-5 hover:text-orange-400 transition-transform duration-300 hover:scale-105">
                            {t("email")}
                          </h5>
                        </Link>
                      {/* Address */}
                      <Link href="#" className="flex items-center">
                        <h5 className="text-black text-base font-normal leading-6 ml-5 hover:text-orange-400 transition-transform duration-300 hover:scale-105">
                          {t("address")}
                        </h5>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side */}
            <form
              className="p-5 lg:p-11 lg:rounded-r-2xl rounded-2xl"
              onSubmit={handleSubmit}
            >
              <h2 className="text-orange-500 font-manrope text-4xl font-semibold leading-10 mb-11">
                {t("send")}
              </h2>

              <input
                type="text"
                name="name"
                className={`w-full h-12 text-gray-600 placeholder-gray-400 shadow-sm bg-transparent text-lg font-normal leading-7 rounded-full border border-gray-200 focus:outline-none pl-4 mb-10 ${isArabic ? "pr-[10px]" : ""}`}
                placeholder={t("nplace")}
                value={formdata.name}
                onChange={handleChange}
              />

              <input
                type="text"
                name="email"
                className={`w-full h-12 text-gray-600 placeholder-gray-400 shadow-sm bg-transparent text-lg font-normal leading-7 rounded-full border border-gray-200 focus:outline-none pl-4 mb-10 ${isArabic ? "pr-[10px]" : ""}`}
                placeholder={t("ePlace")}
                value={formdata.email}
                onChange={handleChange}
              />

              <input
                type="text"
                name="phone"
                className={`w-full h-12 text-gray-600 placeholder-gray-400 shadow-sm bg-transparent text-lg font-normal leading-7 rounded-full border border-gray-200 focus:outline-none pl-4 mb-10 ${isArabic ? "pr-[10px]" : ""}`}
                placeholder={t("pplace")}
                value={formdata.phone}
                onChange={handleChange}
              />

              <textarea
                name="message"
                className={`w-full h-28 text-gray-600 placeholder-gray-400 bg-transparent text-lg shadow-sm font-normal leading-7 rounded-2xl border border-gray-200 focus:outline-none p-4 mb-10 ${isArabic ? "pr-[10px]" : ""}`}
                value={formdata.message}
                onChange={handleChange}
                placeholder={t("mpalce")}
              />

              <button
                type="submit"
                className="w-full h-12 text-white text-base font-semibold leading-6 rounded-full transition-all duration-700 hover:bg-orange-800 bg-orange-600 shadow-sm"
                disabled={loading}
              >
                {loading ? t('sending') : t("Buttonsend")}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
