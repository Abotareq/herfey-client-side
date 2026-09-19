'use client';
import { useTranslations } from 'next-intl';
import Link from 'next/link';

const NotFoundPage = () => {
  const t = useTranslations('NotFound')
  return (
    <div className="flex items-center justify-center min-h-screen">
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0); }
          }

          .animate-float {
            animation: float 3s infinite;
          }

          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }

          . {
            animation: fadeIn 0.8s ease-in-out;
          }
        `}
      </style>

      <div className="text-center">
        <img
          src="https://yemca-services.net/404.png"
          alt="404 Illustration"
          className="mx-auto w-80 animate-float shadow-xl rounded-lg"
        />
        <h1 className="text-7xl font-extrabold text-orange-700 mt-6">
          {t('title')}
        </h1>
        <p className="text-xl text-gray-700 mt-2">
          {t('desc')}
        </p>
        <Link
          href="/"
          className="btn btn-primary mt-6 inline-block text-lg"
        >
          {t('home')}
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
