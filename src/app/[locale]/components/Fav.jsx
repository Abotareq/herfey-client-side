"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useTranslations } from "next-intl";
import { useGetUserById, useUpdateUser } from "@/service/user"; // Added missing import
import { Button } from "@/components/ui/button";

export default function FavouritesPage() {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const t = useTranslations("Fav");
  const updateUser = useUpdateUser(); // Initialize the mutation
  
  // Fetch user data and initialize wishlist
  const { data: userData, isLoading, isError } = useGetUserById(user?.id, {
    enabled: !!user,
    onSuccess: (data) => {
      const userWishlist = data?.data?.user?.wishlist || [];
      setWishlist(userWishlist);
      console.log("Wishlist data loaded:", userWishlist); // This log should now appear
    },
  });

  // Debug logs for component state
  useEffect(() => {
    console.log("Component mounted. User:", user);
    if (user && !isLoading && !isError) {
      console.log("Wishlist state:", wishlist);
    }
  }, [user, isLoading, isError, wishlist]);

  // Helper function to check if product is in wishlist
  const isProductInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  const toggleWishlist = (productId) => {
    if (!user) return;

    const newWishlist = isProductInWishlist(productId)
      ? wishlist.filter((id) => id !== productId)
      : [...wishlist, productId];

    // Optimistic UI update
    setWishlist(newWishlist);
    console.log("Updating wishlist to:", newWishlist); // Debug log

    // Send update to server
    updateUser.mutate(
      { wishlist: newWishlist },
      {
        onError: (error) => {
          console.error("Wishlist update failed:", error);
          // Revert on error
          setWishlist(wishlist);
        },
        onSuccess: (data) => {
          console.log("Wishlist updated successfully:", data);
        }
      }
    );
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <h2 className="text-2xl font-bold">{t("loginRequired")} 🔒</h2>
        <p className="text-gray-500 mt-2">{t("loginToViewFav")}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
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

  if (wishlist.length === 0) {
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
        {wishlist.map((productId, index) => (
          <div
            key={productId}
            className="group relative border border-gray-200 rounded-2xl p-4 bg-white shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer transform hover:-translate-y-1 w-full max-w-sm mx-auto"
          >
            {/* Product details would be fetched based on productId */}
            <div className="relative overflow-hidden rounded-lg mb-4 h-40">
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Product {productId}</span>
              </div>
            </div>
            <div className="space-y-2 h-16">
              <h4 className="text-center text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors duration-200 line-clamp-2 leading-tight">
                Product #{productId.substring(0, 6)}
              </h4>
            </div>
            <div className="absolute top-3 right-3">
              <div className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-2 rounded-full text-sm font-bold shadow-lg">
                Price
              </div>
            </div>
            <div className="absolute top-3 left-3">
              <div className="bg-gradient-to-r from-red-400 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                ❤️ {t("fav")}
              </div>
            </div>
            <Button
              variant="destructive"
              className="w-full mt-4"
              onClick={(e) => {
                e.stopPropagation();
                toggleWishlist(productId);
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