"use client";
import { useGetAllProducts } from "@/service/product";
import { useTranslations } from "next-intl";
import ProductSection from "./ProductSection";

export default function MostRecentProducts() {
  const { data, isPending, isError, refetch } = useGetAllProducts();
  const t = useTranslations("BestSeller");

  const recent = (data?.products || [])
    .filter((p) => p.createdAt)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <ProductSection
      title={t("recent")}
      products={recent}
      isLoading={isPending}
      isError={isError}
      onRetry={refetch}
      errorMessage={t("errormost")}
      emptyMessage={t("mosterror")}
      badgeFor={(_, index) => (index === 0 ? t("new") : undefined)}
    />
  );
}
