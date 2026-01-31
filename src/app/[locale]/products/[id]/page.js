import ProductDetails from "../../components/productdetails/ProductDetails";

export default async function Page({ params }) {
  const { id } = await params;
  console.log("Product ID:", id);
  return <ProductDetails id={id} />;
}
