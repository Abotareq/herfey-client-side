"use client";
import Link from "next/link";
import { useGetAllCategories, useGetCategoryById } from "@/service/category";
import { useState } from "react";

function CategoryLinks() {
  const [selectedId, setSelectedId] = useState(null);

  // Get all categories using the service hook
  const { data: categories, isLoading: loadingList, error: categoriesError } = useGetAllCategories();

  // Get category by ID using the service hook
  const { data: categoryDetails, isLoading: loadingDetails, error: categoryError } = useGetCategoryById(selectedId);

  // Handle loading state for categories
  if (loadingList) return <p>Loading Categories...</p>;

  // Handle error state for categories
  if (categoriesError) return <p>Error loading categories: {categoriesError.message}</p>;

  // Handle case where categories data is empty or invalid
  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    return <p>No categories available</p>;
  }

  return (
    <div className="w-full bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((item) => (
            <Link
              key={item._id}
              href={{
                pathname: "/categories",
                query: { id: item._id }, // Pass ID in query
              }}
              onClick={() => setSelectedId(item._id)}
              className="cursor-pointer bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="h-64 relative overflow-hidden">
                <img
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  src={item.image || "/6.jpg"}
                  alt={item.name || "Category"}
                />
                <div className="absolute inset-0 bg-opacity-20 hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <div className="p-6 text-center">
                <h3
                  className="text-xl font-bold text-gray-800 mb-2"
                  style={{ direction: "rtl" }}
                >
                  {item.name || "Unnamed Category"}
                </h3>
                <div className="w-16 h-0.5 bg-amber-600 mx-auto"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Show details when clicked */}
        {loadingDetails && <p>Loading details...</p>}
        {categoryError && <p>Error loading category details: {categoryError.message}</p>}
        {categoryDetails && (
          <div className="mt-6 p-4 bg-white shadow rounded">
            <h2 className="text-lg font-bold">Category Details</h2>
            <p>
              <strong>ID:</strong> {categoryDetails._id}
            </p>
            <p>
              <strong>Name:</strong> {categoryDetails.name || "Unnamed Category"}
            </p>
            <p>
              <strong>Slug:</strong> {categoryDetails.slug || "N/A"}
            </p>
            <p>
              <strong>Product Count:</strong> {categoryDetails.productCount ?? 0}
            </p>
            <p>
              <strong>Stores Count:</strong> {categoryDetails.storesCount ?? 0}
            </p>
            {categoryDetails.parent && (
              <p>
                <strong>Parent Category:</strong> {categoryDetails.parent}
              </p>
            )}
            <p>
              <strong>Created At:</strong> {new Date(categoryDetails.createdAt).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryLinks;