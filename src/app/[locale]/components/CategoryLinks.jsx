import Link from "next/link";

function CategoryLinks() {
  const categories = [
    { title: "Wood Products", image: "/wood1.jpg", href: "/productpage" },
    { title: "Decoupage products", image: "/decopage1.jpg", href: "/productpage" },
    { title: "Leather Products", image: "/product2.jpg", href: "/productpage" },
  ];

  return (
    <div className="w-full bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((item, index) => (
            <Link href={item.href} key={index} className="block">
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="h-64 relative overflow-hidden">
                  <img
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                    src={item.image}
                    alt={item.title}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-10 transition-all duration-300"></div>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-800 mb-2" style={{direction: 'rtl'}}>
                    {item.title}
                  </h3>
                  <div className="w-16 h-0.5 bg-amber-600 mx-auto"></div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CategoryLinks;
