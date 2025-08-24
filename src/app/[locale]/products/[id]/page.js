import ProductDetails from "../../components/productdetails/ProductDetails";

export default  function Page({ params }) {
  const { id } = params; 
  return <ProductDetails id={id} />;
}
