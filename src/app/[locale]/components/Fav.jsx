"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useTranslations } from "next-intl";
import { useGetUserWishlistById, useUpdateUser } from "@/service/user";
import { Button } from "@/components/ui/button";
import en from "zod/v4/locales/en.cjs";

export default function FavouritesPage() {
  const { user, loading: authLoading } = useAuth();
  const [wishlist, setWishlist] = useState(null);
  const [userId, setUserId] = useState(null);

  const t = useTranslations("Fav");
  const updateUser = useUpdateUser();
  const {
    data: userData,
    isLoading: userLoading,
    isError,
  } = useGetUserWishlistById(userId);
  console.log("User wishlist data:", userData);

  useEffect(() => {
    if (!authLoading && user?.id) {
      setUserId(user.id);
    }
  }, [authLoading, user]);

  useEffect(() => {
    setWishlist(userData?.data?.user?.wishlist || []);
    console.log("Wishlist set to:", userData?.data?.wishlist || []);
  }, [userData]);

  const isProductInWishlist = (productId) =>
    wishlist?.some((item) => item._id === productId) ?? false;

  const toggleWishlist = (productId) => {
    if (!user) return;

    const newWishlist = isProductInWishlist(productId)
      ? wishlist.filter((item) => item._id !== productId)
      : [...wishlist, { _id: productId }];

    setWishlist(newWishlist);

    const wishlistIds = newWishlist.map((item) => item._id || item);

    updateUser.mutate(
      { userId: user.id, wishlist: wishlistIds },
      {
        onError: (error) => {
          console.error("Wishlist update failed:", error);
          setWishlist(wishlist);
        },
      }
    );
  };

  if (authLoading || userLoading || (!wishlist && !isError)) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (!user && !authLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-2xl font-bold text-red-500">{t("error")} ❌</h2>
        <p className="text-gray-500 mt-2">{t("errorLoadingFav")}</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-2xl font-bold text-red-500">{t("error")} ❌</h2>
        <p className="text-gray-500 mt-2">{t("errorLoadingFav")}</p>
      </div>
    );
  }

  if (wishlist && wishlist.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-2xl font-bold">{t("title")} ❤️</h2>
        <p className="text-gray-500 mt-2">{t("desc")}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{t("myfav")}</h3>
        <div className="w-16 h-1 bg-gradient-to-r from-red-500 to-pink-600 rounded-full mx-auto"></div>
      </div>
      <div className="space-y-4">
        {wishlist.map((product) => (
          <div
            key={product._id}
            className="group relative border border-gray-200 rounded-2xl p-4 bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 w-full max-w-sm mx-auto"
          >
            <div className="relative overflow-hidden rounded-lg mb-4 h-40">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
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
                  ${product.basePrice}
                </p>
              )}
            </div>
            <Button
              variant="destructive"
              className="w-full mt-4"
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(product._id);
              }}
              disabled={updateUser.isPending}
            >
              {updateUser.isPending ? t("updating") : t("remove")}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
