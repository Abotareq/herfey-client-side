"use client";
import { useTranslations } from "use-intl";
import NotFoundPage from "./NotFoundComponent";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useGetAllProducts } from './../../../service/productService';
function Products() {
  const { data, isLoading, isError } = useGetAllProducts({ page: 1 });
  const t = useTranslations('products')
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("")
  
  const router = useRouter()
  if (isLoading) {
    return (
      <div className="flex justify-center">
        <div className="flex items-center justify-center w-56 h-56 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
          <div className="px-3 py-1 text-xs font-medium leading-none text-center text-blue-800 bg-blue-200 rounded-full animate-pulse dark:bg-blue-900 dark:text-blue-200">
            loading...
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-between">
        <div className="p-4 text-center">
          <p className="text-red-500">Failed to load products</p>
        </div>
      </div>
    );
  }

  const products = data?.products || [];
 // Star rating component
  // const StarRating = ({ rating = 4 }) => {
  //   return (
  //     <div className="space-x-1 flex justify-center mt-10">
  //       {[1, 2, 3, 4, 5].map((star) => (
  //         <svg
  //           key={star}
  //           className={`w-4 h-4 mx-px fill-current ${
  //             star <= rating ? "text-orange-600" : "text-gray-300"
  //           }`}
  //           xmlns="http://www.w3.org/2000/svg"
  //           viewBox="0 0 14 14"
  //         >
  //           <path d="M6.43 12l-2.36 1.64a1 1 0 0 1-1.53-1.11l.83-2.75a1 1 0 0 0-.35-1.09L.73 6.96a1 1 0 0 1 .59-1.8l2.87-.06a1 1 0 0 0 .92-.67l.95-2.71a1 1 0 0 1 1.88 0l.95 2.71c.13.4.5.66.92.67l2.87.06a1 1 0 0 1 .59 1.8l-2.3 1.73a1 1 0 0 0-.34 1.09l.83 2.75a1 1 0 0 1-1.53 1.1L7.57 12a1 1 0 0 0-1.14 0z"></path>
  //         </svg>
  //       ))}
  //     </div>
  //   );
  // };

  // Color options for different products
  const getProductColors = (index) => {
    const colors = [
      { bg: "bg-purple-50", button: "bg-purple-500 hover:bg-purple-600" },
      { bg: "bg-green-50", button: "bg-green-500 hover:bg-green-600" },
      { bg: "bg-red-50", button: "bg-red-500 hover:bg-red-600" },
      { bg: "bg-blue-50", button: "bg-blue-500 hover:bg-blue-600" },
      { bg: "bg-yellow-50", button: "bg-yellow-500 hover:bg-yellow-600" },
      { bg: "bg-indigo-50", button: "bg-indigo-500 hover:bg-indigo-600" },
    ];
    return colors[index % colors.length];
  };
  return (
    <section className="container mx-auto p-10 md:py-12 px-0 md:p-8 md:px-0">
      <section className="p-5 md:p-0 grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10 items-start">
        {products.length > 0 ? (
          products.map((product, index) => {
            const colors = getProductColors(index);
            const isDisabled =
                            (product.variants?.some((e) => e.name.toLowerCase() === "color") && !selectedColor) ||
                            (product.variants?.some((i) => i.name.toLowerCase() === "size") && !selectedSize);
            return (
              <section key={product._id}>
                <section className={`p-5 py-10 ${colors.bg} text-center transform duration-500 hover:-translate-y-2 cursor-pointer`}>
                  <img 
                    src={product.images || "/placeholder.png"} 
                    alt={product.name}
                    className="w-full h-32 object-cover mx-auto"
                  />
                  
                  {/* <StarRating rating={4} /> */}
                  
                  <h1 className="text-3xl my-5">{product.name}</h1>
                  
                  <p className="mb-5">{product.description}</p>
                  
                  <div className="mb-3">
                    <p className="text-sm text-gray-600">{t('category')}: {product.category?.name}</p>
                    <p className="text-sm text-gray-600">{t('status')}: {product.status}</p>
                  </div>
                  {/* variants */}
                  {product.variants
                    ?.filter((variant) => variant.name.toLowerCase() === "color")
                      .map((variant) => (
                          <div key={variant._id} className="mb-3">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Color:
                            </label>
                            <select defaultValue="" className="w-full border rounded-md p-2 text-sm" onChange={(e) => setSelectedColor(e.target.value)}>
                              <option value="" disabled>
                                Select Color
                              </option>
                              {variant.options?.map((option) => (
                                <option key={option._id} value={option.value}>
                                  {option.value}
                                </option>
                              ))}
                            </select>
                          </div>
                          ))}
                    {/** Size Dropdown */}
                  {product.variants
                      ?.filter((variant) => variant.name.toLowerCase() === "size")
                      .map((variant) => (
                        <div key={variant._id} className="mb-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Size:
                          </label>
                          <select defaultValue="" className="w-full border rounded-md p-2 text-sm" onChange={(e) => setSelectedSize(e.target.value)}>
                            <option value="" disabled>
                              Select Size
                            </option>
                            {variant.options?.map((option) => (
                              <option key={option._id} value={option.value}>
                                {option.value}
                              </option>
                            ))}
                          </select>
                        </div>
                    ))}
                  <h2 className="font-semibold mb-5">${product.basePrice}</h2>
                  {/* product details */}
                  <button 
                  onClick={() => router.push(`/products/${product._id}`)}
                  className={`p-2 px-6 ${colors.button} text-white rounded-md mr-3`}>
                    {t('details')}
                  </button>
                  <button 
                    disabled={isDisabled}
                    className={`p-2 px-6 text-white rounded-md ${
                      isDisabled
                        ? "bg-gray-400 cursor-not-allowed"
                        : colors.button
                    }`}
                  >
                    {t('cart')}
                  </button>
                </section>
              </section>
            );
          })
        ) : (
          // <p className="col-span-full text-center text-gray-500">
          //   No products found
          // </p>
          <NotFoundPage />
        )}
      </section>
    </section>
  );
}

export default Products;