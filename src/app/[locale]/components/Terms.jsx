"use client";
import { useLocale, useTranslations } from "next-intl";

function Terms() {
  const locale = useLocale();
  const isArabic = locale === "ar";
  const t = useTranslations('Terms & Conditions')
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center items-center gap-x-16 gap-y-5 xl:gap-28 lg:flex-row lg:justify-between max-lg:max-w-2xl mx-auto max-w-full">

          {/* Left Image */}
          <div className="w-full lg:w-1/2">
            <img
              src="https://images.unsplash.com/photo-1607083206968-13611e3e97c1"
              alt="Terms & Conditions"
              className="w-full rounded-xl object-cover"
            />
          </div>

          {/* Right Content */}
          <div className={`w-full lg:w-1/2 ${isArabic ? "rtl" : "ltr"}`}>
            <div className="lg:max-w-xl">
              <div className="mb-6 lg:mb-16">
                <h6 className="text-lg font-medium text-orange-600 mb-2">
                  {t('title')}
                </h6>
                <h2 className="text-4xl font-bold text-gray-900 leading-[3.25rem] mb-5">
                  {t('desc')}
                </h2>
              </div>

              <div className="space-y-6 text-gray-600 leading-relaxed">
                <p>
                 {t('p1')} <strong>{t('strong')}</strong> {t('p11')}
                </p>
                <p>
                  {t('p2')}
                </p>
                <p>
                  {t('p3')}
                  <span className="text-orange-600"> {t('pspan')}</span> {t('p31')}
                </p>
                <p>
                  {t('p4')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );

}

export default Terms