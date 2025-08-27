"use client";
import { useStoreContext } from "@/app/context/StoreContext";
import Products from "../components/Products";
import ProductsList from "../components/ProductsList";

function Page() {
  const  {customerStoreId} = useStoreContext();
  return (
    // <Products  customerStoreId={customerStoreId} />
    <ProductsList  customerStoreId={customerStoreId} />
  )
}

export default Page;
