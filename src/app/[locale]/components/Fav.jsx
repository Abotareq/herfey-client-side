"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useTranslations } from "next-intl";
import { useGetUserWishlistById, useUpdateUser } from "@/service/user";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FavouritesPage() {
  const { user, loading: authLoading } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [userId, setUserId] = useState(null);

  const t = useTranslations("Fav");
  const updateUser = useUpdateUser();
  const {
    data: userData,
    isLoading: userLoading,
    isError,
  } = useGetUserWishlistById(userId);

  useEffect(() => {
    if (!authLoading && user?.id) {
      setUserId(user.id);
    }
  }, [authLoading, user]);

  useEffect(() => {
    setWishlist(userData?.data?.user?.wishlist || []);
  }, [userData]);

  const isProductInWishlist = (productId) =>
    wishlist.some((item) => item._id === productId);

  const toggleWishlist = (productId) => {
    if (!user) return;

    const newWishlist = isProductInWishlist(productId)
      ? wishlist.filter((item) => item._id !== productId)
      : [...wishlist, { _id: productId }];

    setWishlist(newWishlist);
    const wishlistIds = newWishlist.map((item) => item._id);

    updateUser.mutate(
      { userId: user.id, wishlist: wishlistIds },
      {
        onError: () => {
          setWishlist(wishlist); // revert on error
        },
      }
    );
  };

  const isLoading = authLoading || userLoading || (!wishlist && !isError);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {t("myfav")}
          </h3>
          <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-pink-600 rounded-full mx-auto"></div>
        </div>

        {/* Grid of Skeleton Cards (Inlined) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-2xl p-4 bg-white shadow-sm animate-pulse"
            >
              {/* Image Skeleton */}
              <div className="rounded-lg mb-4 h-40 bg-gray-300"></div>

              {/* Title Skeleton */}
              <div className="h-5 bg-gray-300 rounded mx-auto mb-3 w-4/5"></div>

              {/* Price Skeleton */}
              <div className="h-4 bg-gray-300 rounded mx-auto mb-4 w-3/5"></div>

              {/* Button Skeleton */}
              <div className="h-10 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!user || isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-2xl font-bold text-red-500">{t("error")} ❌</h2>
        <p className="text-gray-500 mt-2">{t("errorLoadingFav")}</p>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-2xl font-bold">{t("title")} ❤️</h2>
        <p className="text-gray-500 mt-2">{t("desc")}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{t("myfav")}</h3>
        <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-pink-600 rounded-full mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <Link href={`/products/${product._id}`} key={product._id}>
            <div className="group relative border border-gray-200 rounded-2xl p-4 bg-white shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1">
              <div className="relative overflow-hidden rounded-lg mb-4 h-40">
                {product.images && product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500">No Image</span>
                  </div>
                )}
              </div>
              <div className="space-y-2 h-16">
                <h4 className="text-center text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors duration-200 line-clamp-2 leading-tight">
                  {product.name || `Product #${product._id.substring(0, 6)}`}
                </h4>
                {product.basePrice && (
                  <p className="text-center text-gray-600 font-medium">
                    ${parseFloat(product.basePrice).toFixed(2)}
                  </p>
                )}
              </div>
              <Button
                variant="destructive"
                className="w-full mt-4"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  toggleWishlist(product._id);
                }}
                disabled={updateUser.isPending}
              >
                {updateUser.isPending ? t("updating") : t("remove")}
              </Button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
