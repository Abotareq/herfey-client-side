'use client';
import { useGetAllProducts } from "@/service/product";
import { useRouter } from "next/navigation";

export default function TopRatedProducts() {
  const { data, isLoading, isError } = useGetAllProducts();
  const router = useRouter();

  if (isLoading) return <div className="text-center py-8"><p>Loading top rated products...</p></div>;
  if (isError) return <div className="text-center py-8"><p>Error loading top rated products.</p></div>;

  const products = data?.products || [];
  const topRatedProducts = products
    .filter((product) => product.createdAt)
    .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));

  if (topRatedProducts.length === 0) {
    return <div className="text-center py-8"><p>No rated products available.</p></div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {/* Section Header */}
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Top Rated Products
        </h3>
        <div className="w-16 h-1 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full mx-auto"></div>
      </div>

      {/* Products Grid */}
      <div className="space-y-4">
        {topRatedProducts
          .slice(0, 3)
          .map((product, index) => (
            <div
              key={product._id}
              className="group relative border border-gray-200 rounded-2xl p-4 bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 w-full max-w-sm mx-auto"
              onClick={() => router.push(`/products/${product._id}`)}
            >
              {/* Product Image */}
              <div className="relative overflow-hidden rounded-lg mb-4 h-40">
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 flex items-center justify-center bg-opacity-40 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    className="bg-blue-600 text-white rounded-full px-6 py-3 shadow-lg transform scale-90 group-hover:scale-100 transition-all duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/products/${product._id}`);
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-2 h-16">
                <h4 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2 leading-tight">
                  {product.name}
                </h4>
                
                {/* Rating Stars */}
                <div className="flex items-center space-x-1 mt-2">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(product.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'} fill-current`} 
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
                    </svg>
                  ))}
                  <span className="text-sm text-gray-500 ml-2">({product.averageRating?.toFixed(1)})</span>
                </div>
              </div>

              {/* Price Badge */}
              <div className="absolute top-3 right-3">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg">
                  {product.discountPrice
                    ? `$${product.discountPrice.toFixed(2)}`
                    : `$${product.basePrice.toFixed(2)}`}
                </div>
              </div>

              {/* Top Rated Badge */}
              {index === 0 && (
                <div className="absolute top-3 left-3">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    ⭐ Top Rated
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
