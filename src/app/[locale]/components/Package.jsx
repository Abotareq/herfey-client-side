'use client';
import { CheckIcon, XMarkIcon, ExclamationTriangleIcon, CameraIcon } from '@heroicons/react/24/outline'
import { useTranslations } from 'use-intl'

function Package() {
    const t = useTranslations('TermsOfSale');
  const t1 = useTranslations('Avoid These');
  const t2 = useTranslations('Best Practices');
  const t3 = useTranslations('Logo & Layout');
  const t4 = useTranslations('Packaging');
  return (
    <section className="py-24 relative">
      <div className="w-full max-w-7xl px-4 md:px-5 lg:px-5 mx-auto">
        <div className="w-full flex-col justify-start items-center lg:gap-12 gap-10 inline-flex">
          <div className="w-full flex-col justify-start items-center gap-3 flex">
            <h2 className="w-full text-center text-gray-900 text-4xl font-bold font-manrope leading-normal">
              {t('title')}
            </h2>
            <p className="w-full text-center text-gray-500 text-base font-normal leading-relaxed">
              {t('guideline')}
              <br />
              {t('requiremnts')}
            </p>
          </div>

          {/* Terms of Sale Section */}
          <div className="w-full bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t('termsofsale')}</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">{t('warning')}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">{t('imagequality')}</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">
                   {t('productquality')}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">
                   {t('policy')}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">
                    {t('productremarked')}
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-gray-700">
                    {t('productimage')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Image Guidelines */}
          <div className="w-full bg-gradient-to-br from-indigo-50 to-blue-50 rounded-2xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t('productimage')}</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <XMarkIcon className="w-6 h-6 text-red-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{t1('avoid')}</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• {t1('one')}</li>
                  <li>• {t1('two')}</li>
                  <li>• {t1('three')}</li>
                  <li>• {t1('four')}</li>
                  <li>• {t1('five')}</li>
                  <li>• {t1('six')}</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <CheckIcon className="w-6 h-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{t2('best')}</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• {t2('one')}</li>
                  <li>• {t2('two')}</li>
                  <li>• {t2('three')}</li>
                  <li>• {t2('four')}</li>
                  <li>• {t2('five')}</li>
                  <li>• {t2('six')}</li>
                </ul>
              </div>
              
              <div className="bg-white rounded-lg p-6 shadow-sm md:col-span-2 lg:col-span-1">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <CameraIcon className="w-6 h-6 text-blue-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{t3('logo')}</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• {t3('one')}</li>
                  <li>• {t3('two')}</li>
                  <li>• {t3('three')}</li>
                  <li>• {t3('four')}</li>
                  <li>• {t3('five')}</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Packaging Guidelines */}
          <div className="w-full bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">{t4('title')}</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-indigo-600 font-bold text-sm">{t4('one')}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t4('title1')}</h4>
                    <p className="text-gray-600 text-sm">
                     {t4('des')}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-indigo-600 font-bold text-sm">{t4('two')}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{t4('title2')}</h4>
                    <p className="text-gray-600 text-sm">
                      {t4('desc2')}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                    <ExclamationTriangleIcon className="w-4 h-4 text-red-600" />
                  </div>
                  <h4 className="font-semibold text-red-900">{t4('note')}</h4>
                </div>
                <p className="text-red-800 text-sm leading-relaxed">
                  {t4('notedes')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )

}

export default Package