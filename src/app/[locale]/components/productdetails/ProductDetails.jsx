"use client";
import { useState, useMemo, useEffect } from "react";
import ReviewsSection from "./components/ReviewData";
import ProductGallery from "./components/ProductGallery";
import NotFoundPage from "../NotFoundComponent";
import { useTranslations } from "next-intl";
import { Star, Heart, Minus, Plus, ShoppingCart } from "lucide-react";
import { useAddItemToCart, addToGuestCart } from "@/service/cart";
import { useAuth } from "../../../context/AuthContext";
import ProductPageSkeleton from "./components/ProductPageSkeleton";
import { useGetProductById } from "../../../../service/product";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Breadcrumbs from "../Breadcrumbs";
import { useGetUserWishlistById, useUpdateUser } from "@/service/user";
import toast, { Toaster } from "react-hot-toast";
import { useLocale } from "next-intl";
function ProductDetails({ id }) {
  const isArabic = useLocale() === "ar";
  const [mounted, setMounted] = useState(false);
  const { user, loading: authLoading } = useAuth();
  const { data, isLoading, isError } = useGetProductById(id);
  const [quantity, setQuantity] = useState(1);
  const t = useTranslations("products");
  const [selectColor, setSelectedColor] = useState("");
  const [selectSize, setSelectedSize] = useState("");
  const addToCartMutation = useAddItemToCart();
  const [wishlist, setWishlist] = useState([]);
  const updateUser = useUpdateUser();
  const [userId, setUserId] = useState(null);
  const { data: userData, isLoading: userLoading } =
    useGetUserWishlistById(userId);

  useEffect(() => {
    if (!authLoading && user?.id) {
      setUserId(user?.id);
    }
  }, [authLoading, user]);

  useEffect(() => {
    if (userData?.data?.user?.wishlist) {
      setWishlist(userData?.data?.user?.wishlist);
      console.log("Wishlist set to:", userData?.data?.user?.wishlist);
    } else {
      setWishlist([]);
    }
  }, [userData]);

  const isProductInWishlist = (productId) =>
    wishlist?.some((item) => item?._id === productId) ?? false;

  const toggleWishlist = (productId) => {
    if (!user) return;

    const isCurrentlyInWishlist = isProductInWishlist(productId);
    const newWishlist = isCurrentlyInWishlist
      ? wishlist.filter((item) => item?._id !== productId)
      : [...wishlist, { _id: productId }];

    setWishlist(newWishlist);

    const wishlistIds = newWishlist.map((item) => item?._id);

    updateUser.mutate(
      { userId: user?.id, wishlist: wishlistIds },
      {
        onSuccess: (data) => {
          toast.success(
            isCurrentlyInWishlist ? t("producrremoved") : t("productadded"),
          );
        },
        onError: (error) => {
          toast.error("Wishlist update failed:", error);
          setWishlist(wishlist); // Revert on error
        },
      },
    );
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  const product = data?.data?.product || data?.data || {};
  console.log("Full API response:", data); // Debug this!
  console.log("Product object:", product);
  console.log("Base price:", product?.basePrice);
  console.log("Images:", product?.images);
  const isFav = isProductInWishlist(product._id);

  const selectedVariants = useMemo(() => {
    const variants = {};
    if (selectColor) variants.Color = selectColor;
    if (selectSize) variants.Size = selectSize;
    return variants;
  }, [selectColor, selectSize]);

  const finalPrice = useMemo(() => {
    let modifiers = 0;
    product.variants?.forEach((variant) => {
      const selected = selectedVariants[variant.name];
      const opt = variant.options?.find((o) => o.value === selected);
      if (opt) modifiers += opt.priceModifier || 0;
    });
    const onSale =
      product.discountPrice > 0 && product.discountPrice < product.basePrice;
    const unit = onSale ? product.discountPrice : product.basePrice;
    return (unit + modifiers) * quantity;
  }, [product, selectedVariants, quantity]);

  if (isLoading) {
    return <ProductPageSkeleton />;
  }

  if (isError) {
    return <NotFoundPage />;
  }

  const handleAddToCart = () => {
    const formattedVariants = Object.entries(selectedVariants).map(
      ([name, value]) => ({ name, value }),
    );

    if (user) {
      const item = {
        product: product._id,
        quantity,
        variant: formattedVariants,
      };
      addToCartMutation.mutate(item);
    } else {
      const item = {
        product: product,
        quantity,
        variant: formattedVariants,
        price: product?.basePrice,
      };
      addToGuestCart(item);
      if (typeof window !== "undefined") {
        toast.success(t("guestcart"));
      }
    }
  };

  /*   const productImages = [
    product.images,
    product.images,
    product.images,
    product.images,
  ].filter(Boolean);
 */

  const productImages = Array.isArray(product?.images)
    ? product.images.filter(Boolean)
    : [];
  const ratingValue = Number(product?.averageRating) || 0;
  const reviewTotal = Number(product?.reviewCount) || 0;
  const onSale =
    product?.discountPrice > 0 && product.discountPrice < product.basePrice;
  const percentOff = onSale
    ? Math.round(((product.basePrice - product.discountPrice) / product.basePrice) * 100)
    : 0;
  const formatMoney = (n) =>
    Number(n).toLocaleString("en-EG", { maximumFractionDigits: 0 });

  const isDisabled =
    (product?.variants?.some((e) => e.name.toLowerCase() === "color") &&
      !selectColor) ||
    (product?.variants?.some((i) => i.name.toLowerCase() === "size") &&
      !selectSize);

  return (
    <div>
      <Breadcrumbs />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-orange-50">
        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="bg-white rounded-3xl shadow-xl shadow-orange-100/60 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* gallery: a warm board for the tiles to move on, kept in view while reading */}
              <div className="p-4 sm:p-6 lg:p-8 lg:sticky lg:top-24 lg:self-start">
                <div className="rounded-2xl bg-orange-50/70 p-2 sm:p-3">
                  <ProductGallery images={productImages} name={product?.name} />
                </div>
              </div>

              <div className="p-6 lg:p-10 lg:border-l lg:border-gray-100">
                <div className="flex flex-col gap-6">
                  {/* identity */}
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      {product?.category?.name && (
                        <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-orange-700">
                          {product.category.name}
                        </span>
                      )}
                      {product?.store?.name && (
                        <span className="text-sm text-gray-500">{product.store.name}</span>
                      )}
                    </div>
                    <h1 className="text-3xl font-bold leading-tight text-gray-900 lg:text-4xl">
                      {product?.name}
                    </h1>

                    {/* rating comes from the data; no reviews means no stars lit */}
                    <div className="mt-3 flex items-center gap-2">
                      <span className="flex items-center" aria-label={`${ratingValue} out of 5`}>
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i <= Math.round(ratingValue)
                                ? "fill-amber-400 text-amber-400"
                                : "fill-gray-200 text-gray-200"
                            }`}
                            aria-hidden="true"
                          />
                        ))}
                      </span>
                      <span className="text-sm text-gray-600">
                        {reviewTotal > 0
                          ? `${ratingValue.toFixed(1)} · ${reviewTotal} ${t("review")}`
                          : t("noreviews")}
                      </span>
                    </div>
                  </div>

                  {/* price */}
                  <div className="flex flex-wrap items-baseline gap-3">
                    <span className="text-4xl font-bold text-orange-600">
                      <span className="mr-1 text-base font-medium text-gray-500">{t("currency")}</span>
                      {formatMoney(finalPrice)}
                    </span>
                    {onSale && (
                      <>
                        <span className="text-xl text-gray-400 line-through">
                          {formatMoney(product.basePrice * quantity)}
                        </span>
                        <span className="rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white">
                          -{percentOff}%
                        </span>
                      </>
                    )}
                    {quantity > 1 && (
                      <span className="w-full text-sm text-gray-500">
                        {formatMoney(finalPrice / quantity)} × {quantity}
                      </span>
                    )}
                  </div>

                  {/* description */}
                  <p className="leading-relaxed text-gray-700">
                    {product?.description ||
                      "This is a premium quality product designed with attention to detail and crafted for excellence."}
                  </p>

                  {/* variants */}
                  {(product?.variants?.length ?? 0) > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {product.variants
                        .filter((v) => v?.name?.toLowerCase() === "color")
                        .map((variant) => (
                          <label key={variant._id} className="block">
                            <span className="mb-1.5 block text-sm font-medium text-gray-700">{t("color")}</span>
                            <select
                              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                              value={selectColor}
                              onChange={(e) => setSelectedColor(e.target.value)}
                            >
                              <option value="" disabled>{t("colorq")}</option>
                              {variant?.options?.map((o) => (
                                <option key={o._id} value={o.value}>{o.value}</option>
                              ))}
                            </select>
                          </label>
                        ))}
                      {product.variants
                        .filter((v) => v?.name?.toLowerCase() === "size")
                        .map((variant) => (
                          <label key={variant._id} className="block">
                            <span className="mb-1.5 block text-sm font-medium text-gray-700">{t("size")}</span>
                            <select
                              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
                              value={selectSize}
                              onChange={(e) => setSelectedSize(e.target.value)}
                            >
                              <option value="" disabled>{t("sizeq")}</option>
                              {variant?.options?.map((o) => (
                                <option key={o._id} value={o.value}>
                                  {o.value}
                                  {o.priceModifier ? ` (+${formatMoney(o.priceModifier)})` : ""}
                                </option>
                              ))}
                            </select>
                          </label>
                        ))}
                    </div>
                  )}

                  {/* quantity + actions */}
                  <div className="flex flex-col gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center">
                    <div className="flex items-center rounded-xl border border-gray-200">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        aria-label="Decrease quantity"
                        className="flex h-12 w-12 items-center justify-center rounded-l-xl text-gray-600 transition-colors hover:bg-gray-50"
                      >
                        <Minus className="h-4 w-4" aria-hidden="true" />
                      </button>
                      <span className="w-12 text-center text-lg font-semibold tabular-nums">{quantity}</span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        aria-label="Increase quantity"
                        className="flex h-12 w-12 items-center justify-center rounded-r-xl text-gray-600 transition-colors hover:bg-gray-50"
                      >
                        <Plus className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <button
                          disabled={isDisabled || addToCartMutation.isPending}
                          className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-xl px-6 text-base font-semibold shadow-md transition-all ${
                            isDisabled || addToCartMutation.isPending
                              ? "cursor-not-allowed bg-gray-300 text-white shadow-none"
                              : "bg-orange-600 text-white shadow-orange-200 hover:bg-orange-700"
                          }`}
                        >
                          <ShoppingCart className="h-5 w-5" aria-hidden="true" />
                          <span>{addToCartMutation.isPending ? t("Adding") : t("addtocart")}</span>
                        </button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>{t("cart")}</AlertDialogTitle>
                          <AlertDialogDescription>
                            {t("cartq")} <b>{product?.name}</b> (x{quantity})
                            with:{" "}
                            {Object.entries(selectedVariants)
                              .map(([name, value]) => `${name}: ${value}`)
                              .join(", ") || "No variants selected"}{" "}
                            for <b>{t("currency")} {formatMoney(finalPrice)}</b>?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                          <AlertDialogAction onClick={handleAddToCart}>
                            {t("confirm")}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>

                    {user && (
                      <button
                        type="button"
                        disabled={updateUser.isPending}
                        onClick={() => toggleWishlist(product._id)}
                        aria-pressed={isFav}
                        aria-label={isFav ? t("removefav") : t("addtofav")}
                        title={isFav ? t("removefav") : t("addtofav")}
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border-2 transition-colors ${
                          isFav
                            ? "border-red-500 bg-red-50 text-red-500"
                            : "border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500"
                        } ${updateUser.isPending ? "cursor-not-allowed opacity-50" : ""}`}
                      >
                        <Heart className={`h-5 w-5 ${isFav ? "fill-red-500" : ""}`} aria-hidden="true" />
                      </button>
                    )}
                  </div>

                  {isDisabled && (
                    <p className="text-sm text-gray-500">{t("selectoptions")}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <ReviewsSection productId={product?._id} />
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
