"use client"
import { useStoreContext } from "@/app/context/StoreContext"
import Products from "../components/Products"

function Page() {
  const  {customerStoreId} = useStoreContext();
  return (
    <Products  customerStoreId={customerStoreId} />
  )
}

export default Page