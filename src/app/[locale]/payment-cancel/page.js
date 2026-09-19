"use client";

import { useRouter } from "next/navigation";
import { XCircle, RefreshCw, Home, HeadphonesIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export default function PaymentFailedPage() {
  const t = useTranslations('PaymentFailedPage')
  const router = useRouter();

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-14">
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-[2rem] bg-white shadow-xs">
        {/* Header with gradient background */}
        <div className="px-8 pt-10 text-center">
          <div className="mb-5 flex justify-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-red-50 text-red-700">
              <XCircle className="h-8 w-8" strokeWidth={1.75} aria-hidden="true" />
            </div>
          </div>
          <h1 className="mb-2 text-3xl text-gray-900">
            {t('Paymentfailed')}
          </h1>
          <p className="text-sm text-gray-500">
            {t('paymentfaileddesc')}
          </p>
        </div>

        {/* Content */}
        <div className="p-8">
          <div className="text-center mb-8">
            <p className="text-gray-600 leading-relaxed">
              {t('payentfailedmessage')}
            </p>
          </div>

          {/* Common reasons */}
          <div className="mb-8 rounded-2xl bg-gray-50 p-5">
            <h3 className="label mb-3">{t('commonreason')}</h3>
            <ul className="space-y-1.5 text-sm text-gray-600">
              <li>• {t('1')}</li>
              <li>• {t('2')}</li>
              <li>• {t('3')}</li>
              <li>• {t('4')}</li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="space-y-3">
            {/* Try Again Button */}
            <button
              className="btn btn-primary w-full"
              onClick={() => router.push("/checkout")}
            >
              <div className="flex items-center justify-center gap-2">
                <RefreshCw className="w-5 h-5" />
                <span>{t('tryagain')}</span>
              </div>
            </button>

            {/* Secondary actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                className="btn btn-secondary w-full"
                onClick={() => router.push("/")}
              >
                <Home className="w-4 h-4" />
                <span>{t('home')}</span>
              </button>

              <button
                className="btn btn-secondary w-full"
                onClick={() => router.push("/support")}
              >
                <HeadphonesIcon className="w-4 h-4" />
                <span>{t('support')}</span>
              </button>
            </div>
          </div>

          {/* Help text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              {t('supportmessage')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}