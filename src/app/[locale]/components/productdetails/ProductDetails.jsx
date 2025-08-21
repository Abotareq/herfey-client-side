'use client';
import { useGetProductById } from "@/service/ProductService";
import { useParams } from "next/navigation";

function ProductDetails() {
  const productId = useParams()
  const {data, isLoading, isError} = useGetProductById(productId)
    if(isLoading){
    return(
      <div className="flex items-center justify-center w-56 h-56 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
          <div className="px-3 py-1 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">loading...</div>
      </div>
    )
  }
  if(isError){
    return(
      <div className="p-4 text-center">
        <p className="text-red-500">Failed to load products</p>
      </div>
    )
  }
  const product = data;
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* map over an array with one product (just for consistency) */}
        {[product].map((item) => (
          <div
            key={item._id}
            className="grid items-start grid-cols-1 lg:grid-cols-2 gap-12"
          >
            {/* Product Info */}
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-slate-900">{item.name}</h1>
              <p className="text-slate-600">{item.description}</p>

              {/* Ratings */}
              <div className="flex items-center gap-2">
                <span className="text-yellow-500">★ {item.rating || 0}</span>
                <span className="text-sm text-slate-500">
                  ({item.reviews?.length || 0} reviews)
                </span>
              </div>

              {/* Pricing */}
              <div className="text-2xl font-bold text-slate-900">
                ${item.price}
              </div>

              {/* Sizes */}
              {item.sizes && item.sizes.length > 0 && (
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">Available Sizes</h3>
                  <div className="flex gap-2">
                    {item.sizes.map((size) => (
                      <span
                        key={size}
                        className="px-3 py-1 border rounded-md bg-slate-100"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              {item.features && item.features.length > 0 && (
                <ul className="list-disc pl-6 space-y-1 text-slate-700">
                  {item.features.map((feature, idx) => (
                    <li key={idx}>{feature}</li>
                  ))}
                </ul>
              )}

              {/* Buttons */}
              <div className="flex gap-4">
                <button className="px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600">
                  Add to Cart
                </button>
                <button className="px-6 py-2 bg-slate-200 rounded-md hover:bg-slate-300">
                  Wishlist
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Reviews */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
            <div className="space-y-4">
              {product.reviews.map((review, idx) => (
                <div
                  key={idx}
                  className="p-4 border rounded-md bg-white shadow-sm"
                >
                  <p className="font-semibold">{review.user}</p>
                  <p className="text-yellow-500">★ {review.rating}</p>
                  <p>{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;
