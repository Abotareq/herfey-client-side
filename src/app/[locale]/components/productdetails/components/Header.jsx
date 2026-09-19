'use client';
import { useTranslations } from 'next-intl';

function Header() {
  const t = useTranslations('prroductdetailsheader')
  return (
    <div className="space-y-4">
        <div className="bg-white inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-orange-800 shadow-xs">
          <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
          {t('Stock')}
        </div>
        <h1 className="text-4xl font-bold text-gray-900 leading-tight">
          {t('Adjective')}
          <span className="block text-2xl font-medium text-gray-600 mt-1">
            {t('premium')}
          </span>
        </h1>
        <p className="text-gray-500 font-medium">{t('wellverced')}</p>
    </div>
  )
}

export default Header