"use client";
import { useTranslations } from "use-intl";
import NotFoundPage from "./NotFoundComponent";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGetAllProducts } from "../../../service/product";

function Products() {
  const [page, setPage] = useState(1);
  const { data, isLoading, isError } = useGetAllProducts({ page, limit: 6 });
  const t = useTranslations("products");

  const router = useRouter();

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <div className="flex items-center justify-center w-56 h-56 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
          <div className="px-3 py-1 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
            {t('loading')}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-between">
        <div className="p-4 text-center">
          <p className="text-red-500">{t('error')}</p>
        </div>
      </div>
    );
  }

  const products = data?.products || [];
  const totalPages = data?.totalPages || 1;

  return (
    <section className="container mx-auto p-10 md:py-12 md:p-8">
      {/* Product Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10 items-start">
        {products.length > 0 ? (
          products.map((product) => (
            <div
              key={product._id}
              className="group relative rounded-lg overflow-hidden shadow-lg cursor-pointer"
              onClick={() => router.push(`/products/${product._id}`)}
            >
              {/* Product image */}
              <img
                src={product.images || "/placeholder.png"}
                alt={product.name}
                className="w-full h-72 object-cover transform group-hover:scale-110 transition-transform duration-300"
              />

              {/* Overlay */}
              <div className="absolute inset-0 hover:bg-black/50 flex flex-col justify-between p-4">
                {/* Category & Status tags */}
                <div className="flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                    {t("category")}: {product.category?.name || "N/A"}
                  </span>
                  {/* <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                    {t("status")}: {product.status}
                  </span> */}
                </div>

                {/* Center Button */}
                <div className="flex-grow flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
                  <button
                    className="bg-blue-600 text-white rounded-full px-6 py-3 shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/products/${product._id}`);
                    }}
                  >
                    {t("details")}
                  </button>
                </div>

                {/* Price */}
                <div className="flex justify-center opacity-0 group-hover:opacity-100 mb-6 transition-opacity duration-300">
                  <div className="bg-white/70 px-5 py-2 rounded-full text-lg font-bold shadow-lg">
                    ${product.basePrice}
                  </div>
                </div>
              </div>

              {/* Bottom gradient info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <h3 className="text-white text-lg font-bold text-center">
                  {product.name}
                </h3>
              </div>
            </div>
          ))
        ) : (
          <NotFoundPage />
        )}
      </section>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-10">
        {/* Previous */}
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
        >
          {t('Previous')}
        </button>

        {/* Page Numbers */}
        <div className="flex gap-1">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                page === i + 1
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* Next */}
        <button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 font-medium"
        >
          {t('next')}
        </button>
      </div>
    </section>
  );
}

export default Products;
