import ProductDetails from "../../components/productdetails/ProductDetails";

export default async function Page({ params }) {
  const { id } = await params; // await params
  return <ProductDetails id={id} />;
}
