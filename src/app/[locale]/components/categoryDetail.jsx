"use client";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import Link from "next/link";

export default function CategoryPage() {
  const { id } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["category", id],
    queryFn: () => getCategoriesById(id),
    enabled: !!id,
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading category</p>;

  const category = data?.data?.category;

  return (
  /*   <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-sm w-full">
        <h2 className="text-xl font-bold text-gray-800 mb-2">{category?.name}</h2>
        <p className="text-sm text-gray-600 mb-4">
          Products: {category?.productCount} | Stores: {category?.storesCount}
        </p>
        <p className="text-gray-500 text-sm">ID: {category?._id}</p>

        <div className="mt-4">
          <Link
            href="/"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Categories
          </Link>
        </div>
      </div>
    </div> */
  );
}
