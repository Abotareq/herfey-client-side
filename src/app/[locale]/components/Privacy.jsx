"use client";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import background from "../../../../public/prv.jpg";
import Link from "next/link";
function Privacy() {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const t = useTranslations("Privacy");
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center items-center gap-x-16 gap-y-5 xl:gap-28 lg:flex-row lg:justify-between max-lg:max-w-2xl mx-auto max-w-full">
          {/* Left Image */}
          <div className="w-full lg:w-1/2">
            {" "}
            <Image
              src={background}
              alt="Privacy Policy"
              className="w-full rounded-xl object-cover"
            />{" "}
          </div>

          {/* Right Content */}
          <div className={`w-full lg:w-1/2 ${isArabic ? "rtl" : "ltr"}`}>
            <div className="lg:max-w-xl">
              <div className="mb-6 lg:mb-16">
                <h6 className="text-lg font-medium text-orange-600 mb-2">
                  {t("title")}
                </h6>
                <h2 className="text-4xl font-bold text-gray-900 leading-[3.25rem] mb-5">
                  {t("desc")}
                </h2>
              </div>

              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                  {t("p1")} <strong>{t("strong")}</strong>
                  {t("p11")}
                </p>
                <p>{t("p2")}</p>
                <p>{t("p3")}</p>
                <p>
                  {t("p4")}{" "}
                  <Link
                    href="mailto:herafyecommerce@gmail.com"
                    className="text-orange-600 underline"
                  >
                    {t("link")}
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Privacy;
