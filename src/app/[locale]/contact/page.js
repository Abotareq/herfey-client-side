'use client';
import { useTranslations } from "next-intl";
import Image from "next/image";
import background from "../../../../public/contact.webp";
import Breadcrumbs from "../components/Breadcrumbs";
import { useState } from "react";
import emailjs from "@emailjs/browser";
import toast, { Toaster } from "react-hot-toast";

export default function ContactPage() {
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
      <section className="px-4 pb-24 pt-8 md:px-8 md:pb-32 md:pt-12">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-12 lg:gap-16">
          {/* who to reach, and a face for the workshop */}
          <div className="lg:col-span-5">
            <h1 className="text-5xl leading-[1.05] text-gray-900 sm:text-6xl">{t("title")}</h1>
            <dl className="mt-8 space-y-4 text-base">
              <div>
                <dt className="text-sm text-gray-500">{t("pplace")}</dt>
                <dd className="mt-0.5">
                  <a href={`tel:${t("phone").replace(/\s+/g, "")}`} dir="ltr" className="inline-block py-1 font-medium tabular-nums text-gray-900 hover:underline">
                    {t("phone")}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-500">{t("ePlace")}</dt>
                <dd className="mt-0.5">
                  <a href={`mailto:${t("email")}`} className="inline-block py-1 font-medium text-gray-900 hover:underline">
                    {t("email")}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="sr-only">Address</dt>
                <dd className="text-gray-700">{t("address")}</dd>
              </div>
            </dl>
            <div className="relative mt-10 aspect-[4/3] overflow-hidden rounded-[2rem] bg-orange-950 shadow-md">
              <Image
                src={background}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                placeholder="blur"
                className="object-cover"
              />
            </div>
          </div>

          {/* the form */}
          <form
            className="rounded-[2rem] bg-white p-6 shadow-xs sm:p-10 lg:col-span-7"
            onSubmit={handleSubmit}
          >
            <h2 className="text-3xl text-gray-900 sm:text-4xl">{t("send")}</h2>

            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-gray-700">{t("nplace")}</span>
                <input
                  type="text"
                  name="name"
                  value={formdata.name}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  className="field"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-gray-700">{t("ePlace")}</span>
                <input
                  type="email"
                  name="email"
                  value={formdata.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="field"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-gray-700">{t("pplace")}</span>
                <input
                  type="tel"
                  name="phone"
                  value={formdata.phone}
                  onChange={handleChange}
                  autoComplete="tel"
                  dir="ltr"
                  className="field text-start"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-1.5 block text-sm font-medium text-gray-700">{t("mpalce")}</span>
                <textarea
                  name="message"
                  value={formdata.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="field resize-y"
                />
              </label>
            </div>

            <button type="submit" className="btn btn-primary mt-8 w-full sm:w-auto" disabled={loading}>
              {loading ? t("sending") : t("Buttonsend")}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
