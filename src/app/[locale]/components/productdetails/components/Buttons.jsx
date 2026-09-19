'use client';
import { useTranslations } from 'next-intl';

function Buttons() {
  const t = useTranslations('Buttons')
  return (
    <div className="space-y-4 pt-4">
        <button className="bg-orange-600 w-full px-6 py-4 hover:from-orange-700 hover:to-amber-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200">
          {t('add')}
        </button>
        <button className="btn btn-secondary w-full">
          {t('buy')}
        </button>
    </div>
  )
}

export default Buttons