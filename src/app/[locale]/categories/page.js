"use client";
import Link from "next/link";
import { useGetAllCategories, useGetCategoryById } from "@/service/category";
import { useState } from "react";
import SkeletonLoader from "../components/SkeltonLoader";
import NotFoundPage from "../components/NotFoundComponent";
import Breadcrumbs from "../components/Breadcrumbs";
import { useTranslations } from "use-intl";
import Image from "next/image.js";

function CategoryLinks() {
  const [selectedId, setSelectedId] = useState(null);
  const t = useTranslations('category')
  // Get all categories using the service hook
  const { data: categories, isLoading: loadingList, error: categoriesError } = useGetAllCategories();

  // Get category by ID using the service hook
  const { data: categoryDetails, isLoading: loadingDetails, error: categoryError } = useGetCategoryById(selectedId);

  // Handle loading state for categories
  if (loadingList) return <SkeletonLoader />;

  // Handle error state for categories
  if (categoriesError) return <p>{t('error')}: {categoriesError.message}</p>;

  // Handle case where categories data is empty or invalid
  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    return <NotFoundPage />;
  }

  return (
    <div>
      <Breadcrumbs />
      <div className="w-full bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((item) => (
            <Link
              key={item._id}
              href={{
                pathname: "/categories",
                query: { id: item._id },
              }}
              onClick={() => setSelectedId(item._id)}
              className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border border-gray-200 hover:border-amber-300"
            >
              <div className="w-full h-64 relative overflow-hidden">
                <img
                  className="w-full h-full object-cover transition-transform duration-500"
                  src={item.image || "/1.jpg"} 
                  alt={item.name || "Category"}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <div className="w-3 h-3 border-t-2 border-r-2 border-white transform rotate-45"></div>
                </div>
              </div>
              <div className="p-6 text-center relative">
                <h3
                  className="text-xl font-bold text-gray-800 mb-3 group-hover:text-amber-600 transition-colors duration-300"
                  style={{ direction: "rtl" }}
                >
                  {item.name || "Unnamed Category"}
                </h3>
                <div className="w-12 h-0.5 bg-amber-600 mx-auto transition-all duration-300 group-hover:w-20 group-hover:bg-amber-500"></div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-amber-400 to-amber-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Show details when clicked */}
        {loadingDetails && <p>{t('loading')}</p>}
        {categoryError && <p>{t('errorlpading')}: {categoryError.message}</p>}
        {categoryDetails && (
          <div className="mt-6 p-4 bg-white shadow rounded">
            <h2 className="text-lg font-bold">{t('categorydetails')}</h2>
            <p>
              <strong>{t('id')}:</strong> {categoryDetails._id}
            </p>
            <p>
              <strong>{t('name')}:</strong> {categoryDetails.name || "Unnamed Category"}
            </p>
            <p>
              <strong>{t('slug')}:</strong> {categoryDetails.slug || "N/A"}
            </p>
            <p>
              <strong>{t('productcount')}:</strong> {categoryDetails.productCount ?? 0}
            </p>
            <p>
              <strong>{t('storecount')}:</strong> {categoryDetails.storesCount ?? 0}
            </p>
            {categoryDetails.parent && (
              <p>
                <strong>{t('parentcategory')}:</strong> {categoryDetails.parent}
              </p>
            )}
            <p>
              <strong>{t('createdat')}:</strong> {new Date(categoryDetails.createdAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}

export default CategoryLinks;