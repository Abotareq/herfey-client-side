import Link from "next/link";
import "./[locale]/globals.css";
import Image from "next/image";
import background from "../../public/1234.jpg";
function NotFound() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Sidebar Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src={background}
          alt="Lost man in desert"
          className="h-full w-full object-cover"
          layout="fill"
        />
        <div className="absolute inset-0 bg-black opacity-30"></div>
      </div>

      {/* Main content */}
      <main className="flex flex-1 items-center justify-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center max-w-md">
          <p className="text-base font-semibold text-orange-600">404</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
            Page not found
          </h1>
          <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
            Sorry, we couldn&apos;t find the page you&apos;re looking for.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/"
              className="rounded-md bg-orange-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-orange-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Go back home
            </Link>
            <Link
              href="/contact"
              className="text-sm font-semibold text-gray-900"
            >
              Contact support <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default NotFound;
