import ProductDetails from "@/components/productdetails/ProductDetails";
import Product from './../../components/Products';

export default function Page({ params }) {
  const { ProductId } = params;
  return <ProductDetails id={ProductId} />;
}
