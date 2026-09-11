"use client";
import { useGetAllProducts } from "@/service/product";
import { useTranslations } from "next-intl";
import ProductSection from "./ProductSection";

export default function DiscountedProducts() {
  const { data, isPending, isError, refetch } = useGetAllProducts();
  const t = useTranslations("BestSeller");

  const products = data?.products || [];
  let discounted = products.filter(
    (p) => p.discountPrice > 0 && p.discountPrice < p.basePrice,
  );
  // nothing on sale: fall back to the biggest markdowns so the block is not empty
  if (discounted.length === 0) {
    discounted = [...products].sort(
      (a, b) => (b.discountPrice || 0) - (a.discountPrice || 0),
    );
  }

  return (
    <ProductSection
      title={t("discounttitle")}
      products={discounted}
      isLoading={isPending}
      isError={isError}
      onRetry={refetch}
      errorMessage={t("errorloading")}
      emptyMessage={t("discounterror")}
      badgeFor={(_, index) => (index === 0 ? t("best") : undefined)}
    />
  );
}
