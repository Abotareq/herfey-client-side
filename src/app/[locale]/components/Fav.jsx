"use client";

import { useFav } from "@/app/context/FavouriteContext";

export default function FavouritesPage() {
  const { fav, toggleFav } = useFav();

  if (fav.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-2xl font-bold">No favourites yet ❤️</h2>
        <p className="text-gray-500 mt-2">Start adding some products!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          My Favourites
        </h3>
        <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-pink-600 rounded-full mx-auto"></div>
      </div>

      {/* Products Grid */}
      <div className="space-y-4">
        {fav.map((product, index) => (
          <div
            key={product._id}
            className="group relative border border-gray-200 rounded-2xl p-4 bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 w-full max-w-sm mx-auto"
          >
            {/* Product Image */}
            <div className="relative overflow-hidden rounded-lg mb-4 h-40">
              <img
                src={product.images?.[0] || "/placeholder.png"}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 flex items-center justify-center bg-opacity-40 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <button
                  className="bg-red-600 text-white rounded-full px-6 py-3 shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFav(product);
                  }}
                >
                  Remove from Favourites
                </button>
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-2 h-16">
              <h4 className="text-center text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors duration-200 line-clamp-2 leading-tight">
                {product.name}
              </h4>
            </div>

            {/* Price Badge */}
            <div className="absolute top-3 right-3">
              <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg">
                {product.basePrice} EGP
              </div>
            </div>

            {/* Favourite Badge */}
            <div className="absolute top-3 left-3">
              <div className="bg-gradient-to-r from-red-400 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                ❤️ Favourite
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}