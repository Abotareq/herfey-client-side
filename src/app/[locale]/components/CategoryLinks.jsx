"use client";
import Link from "next/link";
import { getCategoriesById, getAllCategories } from "@/service/category.js";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

function CategoryLinks() {
  const [selectedId, setSelectedId] = useState(null);

  // get all categories
  const { data: categories, isLoading: loadingList } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategories,
  });

  // get category by id
  const { data: categoryDetails, isLoading: loadingDetails } = useQuery({
    queryKey: ["category", selectedId],
    queryFn: () => getCategoriesById(selectedId),
    enabled: !!selectedId,
  });

  if (loadingList) return <p>Loading Categories...</p>;

  return (
    <div className="w-full bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.data.allCategories.map((item) => (
            <Link
              key={item._id}
              href={{
                pathname: "/categories",
                query: { id: item._id }, // pass id in query
              }}
              onClick={() => setSelectedId(item._id)}
              className="cursor-pointer bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="h-64 relative overflow-hidden">
                <img
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  src={item.image || "/placeholder.jpg"}
                  alt={item.name}
                />
                <div className="absolute inset-0 bg-opacity-20 hover:bg-opacity-10 transition-all duration-300"></div>
              </div>
              <div className="p-6 text-center">
                <h3
                  className="text-xl font-bold text-gray-800 mb-2"
                  style={{ direction: "rtl" }}
                >
                  {item.name}
                </h3>
                <div className="w-16 h-0.5 bg-amber-600 mx-auto"></div>
              </div>
            </Link>
          ))}
        </div>

        {/* Show details when clicked */}
        {loadingDetails && <p>Loading details...</p>}
        {categoryDetails && (
          <div className="mt-6 p-4 bg-white shadow rounded">
            <h2 className="text-lg font-bold">Category Details</h2>
            <p>
              <strong>ID:</strong> {categoryDetails._id}
            </p>
            <p>
              <strong>Name:</strong> {categoryDetails.name}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryLinks;
