// "use client";
// import Link from 'next/link';
// import React from 'react'
// import { useTranslations } from 'use-intl';

// function SignIn() {
//     const t = useTranslations('Herafy')
//   return (
//     <>
//         <div class="bg-white dark:bg-gray-800 flex justify-center items-center w-screen h-screen p-5">
//   <div class="min-h-screen flex">
//   <div class="hidden lg:flex lg:w-1/2 bg-gradient-to-tr from-blue-800 to-purple-700 justify-center items-center relative overflow-hidden">
//     <div class="absolute inset-0 bg-black opacity-20"></div>
//     <div class="relative z-10 px-10 text-center">
//       <div class="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center mb-8 shadow-2xl">
//         <svg class="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//           <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path>
//         </svg>
//       </div>
//       <h1 class="text-4xl font-bold text-white mb-4">{t('herafy')}</h1>
//       <p class="text-white/80 text-lg mb-8">Verileriniz %100 güvende. En son güvenlik protokolleriyle korunuyorsunuz.</p>
//       <div class="flex justify-center space-x-4">
//         <div class="w-3 h-3 rounded-full bg-white/30"></div>
//         <div class="w-3 h-3 rounded-full bg-white"></div>
//         <div class="w-3 h-3 rounded-full bg-white/30"></div>
//       </div>
//     </div>
//     <div class="absolute -bottom-32 -left-40 w-80 h-80 border-4 border-white/30 rounded-full"></div>
//     <div class="absolute -bottom-40 -left-20 w-80 h-80 border-4 border-white/30 rounded-full"></div>
//     <div class="absolute top-0 -right-20 w-80 h-80 border-4 border-white/30 rounded-full"></div>
//   </div>
  
//   <div class="w-full lg:w-1/2 flex items-center justify-center bg-white p-8">
//     <div class="w-full max-w-md">
//       <div class="text-center lg:text-left">
//         <h2 class="text-3xl font-extrabold text-gray-900 mb-2">Tekrar Hoş Geldiniz</h2>
//         <p class="text-gray-600 mb-8">Lütfen hesabınıza giriş yapın</p>
//       </div>
      
//       <form class="space-y-6">
//         <div>
//           <label for="email" class="block text-sm font-medium text-gray-700">E-posta Adresi</label>
//           <input type="email" id="email" name="email" class="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="ornek@mail.com" />
//         </div>
        
//         <div>
//           <label for="password" class="block text-sm font-medium text-gray-700">Şifre</label>
//           <input type="password" id="password" name="password" class="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="••••••••" />
//         </div>
        
//         <div class="flex items-center justify-between">
//           <div class="flex items-center">
//             <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
//             <label for="remember-me" class="ml-2 block text-sm text-gray-700">Beni hatırla</label>
//           </div>
//           <Link href="#" class="text-sm font-medium text-blue-600 hover:text-blue-500">Şifremi unuttum</Link>
//         </div>
        
//         <div>
//           <button type="submit" class="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//             Giriş Yap
//           </button>
//         </div>
//       </form>
      
//       <div class="mt-6">
//         <div class="relative">
//           <div class="absolute inset-0 flex items-center">
//             <div class="w-full border-t border-gray-300"></div>
//           </div>
//           <div class="relative flex justify-center text-sm">
//             <span class="px-2 bg-white text-gray-500">veya şununla devam et</span>
//           </div>
//         </div>
        
//         <div class="mt-6 grid grid-cols-2 gap-3">
//           <button class="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
//             <svg class="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
//               <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
//             </svg>
//             <span class="ml-2">Facebook</span>
//           </button>
//           <button class="w-full inline-flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
//             <svg class="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
//               <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/>
//             </svg>
//             <span class="ml-2">Google</span>
//           </button>
//         </div>
//       </div>
      
//       <p class="mt-8 text-center text-sm text-gray-600">
//         Hesabınız yok mu?
//         <Link href="#" class="font-medium text-blue-600 hover:text-blue-500">Hemen kaydolun</Link>
//       </p>
//     </div>
//   </div>
// </div>

// </div>
//     </>
//   )
// }

// export default SignIn