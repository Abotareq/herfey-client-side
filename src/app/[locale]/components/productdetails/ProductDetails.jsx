"use client";
import { useState } from "react";
import ReviewsSection from "./components/ReviewData";
import SkeletonLoader from "../SkeltonLoader";
import NotFoundPage from "../NotFoundComponent";
import { useTranslations } from "next-intl";
import { useGetProductById } from "../../../../service/product";
import ProductPageSkeleton from "./components/ProductPageSkeleton";

function ProductDetails({ id }) {
  const { data, isLoading, isError } = useGetProductById(id);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const t = useTranslations("products");
  const [selectColor, setSelectedColor] = useState("");
  const [selectSize, setSelectedSize] = useState("");
  if (isLoading) {
    return <ProductPageSkeleton />;
  }

  if (isError) {
    return <NotFoundPage />;
  }

  const product = data?.data || {};
  console.log(product);
  // Create array of images (using same image multiple times for demo)
  const productImages = [
    product.images,
    product.images,
    product.images,
    product.images,
  ].filter(Boolean);
  const isDisabled =
    (product.variants?.some((e) => e.name.toLowerCase() === "color") &&
      !selectColor) ||
    (product.variants?.some((i) => i.name.toLowerCase() === "size") &&
      !selectSize);
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="flex flex-wrap">
            {/* Image Section */}
            <div className="w-full lg:w-1/2 p-6">
              <div className="relative">
                <div className="w-full max-w-md mx-auto aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg mb-6">
                  <img
                    src={productImages[selectedImage] || product.images}
                    alt={product.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                  />
                </div>

                {/* Thumbnail Images */}
                <div className="flex gap-4 justify-center">
                  {productImages.map((image, index) => (
                    <div
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-xl overflow-hidden cursor-pointer border-4 transition-all duration-300 ${
                        selectedImage === index
                          ? "border-blue-500 shadow-lg scale-105"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Product Info Section */}
            <div className="w-full lg:w-1/2 p-6 lg:p-8">
              <div className="space-y-6">
                {/* Product Title & Category */}
                <div>
                  <div className="inline-block px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
                    {product.category?.name || "Product"}
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                    {product.name}
                  </h1>
                  <p className="text-gray-600 text-lg mt-2">{product.slug}</p>
                </div>
                {/* color dropdown */}
                {product.variants
                  ?.filter((variant) => variant.name.toLowerCase() === "color")
                  .map((variant) => (
                    <div key={variant._id} className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Color:
                      </label>
                      <select
                        defaultValue=""
                        className="w-full border rounded-md p-2 text-sm"
                        value={selectColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                      >
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
                      <select
                        defaultValue=""
                        className="w-full border rounded-md p-2 text-sm"
                        value={selectSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                      >
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
                {/* Rating */}
                <div className="flex items-center space-x-3">
                  <div className="flex space-x-1">
                    {Array.from({ length: 5 }, (_, index) => (
                      <svg
                        key={index}
                        className={`w-6 h-6 ${
                          index < Math.round(product.averageRating || 4)
                            ? "text-yellow-400 fill-current"
                            : "text-gray-300"
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={
                          index < Math.round(product.averageRating || 4)
                            ? "currentColor"
                            : "none"
                        }
                        stroke="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 
                            5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 
                            1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 
                            18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425
                            l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305
                            l5.404-.434 2.082-5.005Z"
                        />
                      </svg>
                    ))}
                  </div>
                  <span className="text-gray-700 font-medium">
                    {product.averageRating || "4.0"} (
                    {product.reviewCount || "127"} {t("review")})
                  </span>
                </div>
                {/* Price */}
                <div className="flex items-center space-x-4">
                  <span className="text-4xl font-bold text-gray-900">
                    ${product.basePrice}
                  </span>
                  {product.discountPrice && (
                    <span className="text-2xl text-gray-500 line-through">
                      ${product.discountPrice}
                    </span>
                  )}
                </div>

                {/* Description */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {t("desc")}:{" "}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {product.description ||
                      "This is a premium quality product designed with attention to detail and crafted for excellence."}
                  </p>
                </div>

                {/* Status */}
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700 font-medium">
                    {t("status")}:
                  </span>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-medium ${
                      product.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.status || "Available"}
                  </span>
                </div>

                {/* Quantity Selector */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-900">
                    {t("quantity")}:
                  </label>
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M20 12H4"
                        />
                      </svg>
                    </button>
                    <span className="text-2xl font-bold w-16 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6">
                  <button
                    disabled={isDisabled}
                    className={`flex-1 px-8 py-4 rounded-2xl font-semibold text-lg flex items-center justify-center space-x-3 transition-all duration-300 transform hover:scale-105 shadow-lg ${
                      isDisabled
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    }`}
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6 0a2 2 0 100 4 2 2 0 000-4zm-6 0a2 2 0 100 4 2 2 0 000-4z"
                      />
                    </svg>
                    <span>{t("addtocart")}</span>
                  </button>

                  <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-8 py-4 rounded-2xl font-semibold text-lg flex items-center justify-center space-x-3 transition-all duration-300 border-2 border-gray-200 hover:border-gray-300">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    <span>{t("fav")}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ReviewsSection productId={product?._id} />
      </div>
    </div>
  );
}

export default ProductDetails;
