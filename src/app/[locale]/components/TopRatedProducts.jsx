"use client";
import { useGetAllProducts } from "@/service/product";
import { useTranslations } from "next-intl";
import ProductSection from "./ProductSection";

export default function TopRatedProducts() {
  const { data, isPending, isError, refetch } = useGetAllProducts();
  const t = useTranslations("BestSeller");

  const products = data?.products || [];
  let topRated = products
    .filter((p) => p.averageRating > 0)
    .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
  // no reviews yet: show something rather than an empty block
  if (topRated.length === 0) {
    topRated = [...products].sort(
      (a, b) => (b.averageRating || 0) - (a.averageRating || 0),
    );
  }

  return (
    <ProductSection
      title={t("toptitlle")}
      products={topRated}
      isLoading={isPending}
      isError={isError}
      onRetry={refetch}
      errorMessage={t("errortop")}
      emptyMessage={t("toperror")}
      badgeFor={(_, index) => (index === 0 ? t("top") : undefined)}
    />
  );
}
