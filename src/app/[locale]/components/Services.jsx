'use client';
import { BadgePoundSterling, HandCoins, BanknoteArrowDown, Headset, Truck } from 'lucide-react';
import { useTranslations } from 'next-intl';
function Services() {
    const t = useTranslations('Services');
    const services = [
        {title: t('t1'), desc: t('desc1'), icon:BadgePoundSterling },
        {title: t('t2'), desc: t('desc2'), icon: HandCoins},
        {title: t('t3'), desc: t('desc3'), icon: BanknoteArrowDown},
        {title: t('t4'), desc: t('desc4'), icon: Headset},
        {title: t('t5'), desc: t('desc5'), icon: Truck}
    ]
  return (
    
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 text-center mx-2 bg-white pt-[50px] pb-[40px] cursor-pointer'>
        {services.map((index, i) => {
            const Icon = index.icon;
            return (
                <div
                key={i}
                className='flex flex-col items-center p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition duration-300'>
                    <Icon className="text-orange-500 w-10 h-10 mb-4"/>
                    <h3 className='text-lg font-semibold mb-2'>{index.title}</h3>
                    <p className='text-gray-500 text-sm'>{index.desc}</p>
                </div>
            )
        })}
        
    </div>
  )
}

export default Services