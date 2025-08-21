import CreateProductForm from "../../components/CreateProductForm.jsx";

export default function CreateProductPage() {

  const storeId = "689d9d82b8dc3b5131399ca2";
  const categoryId = "68895bd225e59a1915813ce4";

  return (
  
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-200 p-4 sm:p-6 md:p-8">
     
      <div className="max-w-7xl mx-auto">
        <CreateProductForm storeId={storeId} categoryId={categoryId} />
      </div>
    </main>
  );
}