"use client";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import background from "../../../../public/faq.jpg";
export default function FAQSection() {
  const t = useTranslations("FAQ");
  const [openIndex, setOpenIndex] = useState(0); // First one open by default

  const toggleAccordion = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };
  const faqs = [
    { question: t("q1"), answer: t("A1") },
    { question: t("q2"), answer: t("A2") },
    { question: t("q3"), answer: t("A3") },
    { question: t("q4"), answer: t("A4") },
  ];
  const locale = useLocale();
  const isArabic = locale === "ar";
  return (
    <section className="py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-center items-center gap-x-16 gap-y-5 xl:gap-28 lg:flex-row lg:justify-between max-lg:max-w-2xl mx-auto max-w-full">
          {/* Left Image */}
          <div className="w-full lg:w-1/2">
            <Image
              src={background}
              alt="FAQ tailwind section"
              width={500}
              height={500}
              className="w-full rounded-xl object-cover"
            />
          </div>

          {/* Right FAQ List */}
          <div className="w-full lg:w-1/2">
            <div className="lg:max-w-xl">
              <div className="mb-6 lg:mb-16">
                <h6
                  className={`text-lg font-medium text-orange-600 mb-2 ${
                    isArabic ? "rtl" : "ltr"
                  }`}
                >
                  {t("faq")}
                </h6>
                <h2 className="text-4xl font-bold text-gray-900 leading-[3.25rem] mb-5 ">
                  {t("answer")}
                </h2>
              </div>

              <div className="accordion-group">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className={`accordion py-8 border-b border-solid border-gray-200 ${
                      openIndex === index ? "active" : ""
                    }`}
                  >
                    <button
                      onClick={() => toggleAccordion(index)}
                      className={`accordion-toggle group inline-flex items-center justify-between text-xl font-normal leading-8 w-full transition duration-500 ${
                        openIndex === index
                          ? "text-orange-600 font-medium"
                          : "text-gray-600 hover:text-orange-600"
                      }`}
                    >
                      <h5>{faq.question}</h5>
                      <svg
                        className={`transition duration-500 ${
                          openIndex === index
                            ? "text-orange-600 rotate-180"
                            : "text-gray-900 group-hover:text-orange-600"
                        }`}
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.5 8.25L12.4142 12.3358C11.7475 13.0025 11.4142 13.3358 11 13.3358C10.5858 13.3358 10.2525 13.0025 9.58579 12.3358L5.5 8.25"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    <div
                      className="accordion-content w-full px-0 overflow-hidden pr-4 transition-all duration-300"
                      style={{
                        maxHeight: openIndex === index ? "300px" : "0px",
                        opacity: openIndex === index ? 1 : 0,
                      }}
                    >
                      <p className="text-base font-normal text-gray-600 mt-3">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
