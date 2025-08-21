import ProductDetails from "../../components/productdetails/ProductDetails";

export default function Page({ params }) {
  const { id } = params;   // ✅ must match folder name [id]
  return <ProductDetails id={id} />;
}
