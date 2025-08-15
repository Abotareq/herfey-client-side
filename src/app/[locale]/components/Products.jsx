import Link from "next/link";

function Products() {
  const products = [
    { title: "vase", price: 800, image: "/1.jpg" },
    { title: "vase", price: 900, image: "/1.jpg" },
    { title: "green vase", price: 1000, image: "/2.jpg" },
    { title: "white vase", price: 1200, image: "/3.jpg" },
    { title: "white vase", price: 1200, image: "/4.jpg" },
    { title: "white vase", price: 1200, image: "/5.jpg" },
    { title: "white vase", price: 1200, image: "/6.jpg" },
    { title: "white vase", price: 1200, image: "/7.jpg" },
    { title: "white vase", price: 1200, image: "/8.jpg" },
    { title: "white vase", price: 1200, image: "/9.jpg" },
  ];

  return (
    <div className="p-4 mx-auto lg:max-w-6xl md:max-w-4xl">
      <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6 sm:mb-8">
        Products page
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`} // dynamic product page
            className="bg-white flex flex-col rounded-sm overflow-hidden shadow-md hover:scale-[1.01] transition-all relative"
          >
            <div className="w-full">
              <img
                src={product.image}
                alt={product.title}
                className="w-full aspect-[18/24] object-cover object-top"
              />
            </div>
            <div className="p-4">
              <h5 className="text-sm sm:text-base font-semibold text-slate-900 line-clamp-2">
                {product.title}
              </h5>
              <div className="mt-2 flex items-center flex-wrap gap-2">
                <h6 className="text-sm sm:text-base font-semibold text-slate-900">
                  ${product.price}
                </h6>
                <div
                  className="bg-slate-100 w-8 h-8 flex items-center justify-center rounded-full ml-auto"
                  title="Wishlist"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16px"
                    className="fill-slate-800 inline-block"
                    viewBox="0 0 64 64"
                  >
                    <path d="M45.5 4A18.53 18.53 0 0 0 32 9.86 18.5 18.5 0 0 0 0 22.5C0 40.92 29.71 59 31 59.71a2 2 0 0 0 2.06 0C34.29 59 64 40.92 64 22.5A18.52 18.52 0 0 0 45.5 4ZM32 55.64C26.83 52.34 4 36.92 4 22.5a14.5 14.5 0 0 1 26.36-8.33 2 2 0 0 0 3.27 0A14.5 14.5 0 0 1 60 22.5c0 14.41-22.83 29.83-28 33.14Z"></path>
                  </svg>
                </div>
              </div>
            </div>
            <div className="min-h-[50px] p-4 !pt-0">
              <button
                type="button"
                className="absolute left-0 right-0 bottom-3 cursor-pointer max-w-[88%] mx-auto text-sm px-2 py-2 font-medium w-full bg-orange-400 hover:bg-blue-700 text-white tracking-wide outline-none border-none rounded-sm"
              >
                Add to cart
              </button>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Products;
