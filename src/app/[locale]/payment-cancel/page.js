"use client";

import { useRouter } from "next/navigation";
import { XCircle, RefreshCw, Home, HeadphonesIcon } from "lucide-react";
import { useTranslations } from "next-intl";

export default function PaymentFailedPage() {
  const t = useTranslations('PaymentFailedPage')
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto bg-white shadow-xl rounded-3xl border border-orange-100 overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 px-8 py-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
              <XCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            {t('Paymentfailed')}
          </h1>
          <p className="text-red-100 text-sm">
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
          <div className="mb-8 p-4 bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl border border-orange-100">
            <h3 className="font-semibold text-orange-800 mb-3 text-sm">{t('commonreason')}:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
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
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-orange-600 hover:to-amber-600 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-500/30"
              onClick={() => router.push("/checkout")}
            >
              <div className="flex items-center justify-center space-x-2">
                <RefreshCw className="w-5 h-5" />
                <span>{t('tryagain')}</span>
              </div>
            </button>

            {/* Secondary actions */}
            <div className="grid grid-cols-2 gap-3">
              <button
                className="flex items-center justify-center space-x-2 py-3 px-4 bg-orange-100 text-orange-700 rounded-xl font-medium hover:bg-orange-200 transition-colors duration-200"
                onClick={() => router.push("/")}
              >
                <Home className="w-4 h-4" />
                <span>{t('home')}</span>
              </button>

              <button
                className="flex items-center justify-center space-x-2 py-3 px-4 bg-orange-100 text-orange-700 rounded-xl font-medium hover:bg-orange-200 transition-colors duration-200"
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