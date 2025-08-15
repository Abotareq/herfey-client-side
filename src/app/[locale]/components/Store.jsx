export default function HerafyStorePage() {
  const stores = [
    {
      id: 1,
      name: "Herafy Wood Works",
      description: "Handcrafted wood furniture and décor.",
      image: "/1.jpg",
      link: "/stores/wood",
    },
    {
      id: 2,
      name: "Herafy Leather",
      description: "Premium handmade leather bags and accessories.",
      image: "/2.jpg",
      link: "/stores/leather",
    },
    {
      id: 3,
      name: "Herafy Découpage",
      description: "Artistic découpage creations for unique home décor.",
      image: "/3.jpg",
      link: "/stores/decoupage",
    },
    {
      id: 4,
      name: "Herafy Sports",
      description: "Custom sports gear and branded merchandise.",
      image: "/4.jpg",
      link: "/stores/sports",
    },
    {
      id: 5,
      name: "Herafy Fashion",
      description: "Trendy fashion items crafted by local artisans.",
      image: "/5.jpg",
      link: "/stores/fashion",
    },
    {
      id: 6,
      name: "Herafy Arts",
      description: "Exclusive handcrafted art pieces for your space.",
      image: "/6.jpg",
      link: "/stores/arts",
    },
  ];

  return (
    <div className="flex">
      {/* Sidebar Filter */}
      <div className="w-full max-w-[300px] shrink-0 shadow-md px-6 sm:px-8 min-h-screen py-6">
        <div className="flex items-center border-b border-gray-300 pb-2 mb-6">
          <h3 className="text-slate-900 text-lg font-semibold">Filter</h3>
          <button
            type="button"
            className="text-sm text-red-500 font-semibold ml-auto cursor-pointer"
          >
            Clear all
          </button>
        </div>

        {/* Brand Filter */}
        <div>
          <h6 className="text-slate-900 text-sm font-semibold">Brand</h6>
          <div className="flex px-3 py-1.5 rounded-md border border-gray-300 bg-gray-100 overflow-hidden mt-2">
            <input
              type="text"
              placeholder="Search brand"
              className="w-full bg-transparent outline-none text-gray-900 text-sm"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 192.904 192.904"
              className="w-3 fill-gray-600"
            >
              <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
            </svg>
          </div>
          <ul className="mt-6 space-y-4">
            {["Zara", "H&M", "Uniqlo", "Levi’s", "Nike", "Adidas", "Puma", "Tommy Hilfiger"].map(
              (brand, index) => (
                <li key={index} className="flex items-center gap-3">
                  <input
                    id={brand.toLowerCase()}
                    type="checkbox"
                    className="w-4 h-4 cursor-pointer"
                  />
                  <label
                    htmlFor={brand.toLowerCase()}
                    className="text-slate-600 font-medium text-sm cursor-pointer"
                  >
                    {brand}
                  </label>
                </li>
              )
            )}
          </ul>
        </div>

        <hr className="my-6 border-gray-300" />
        {/* Price Filter */}
        <div>
          <h6 className="text-slate-900 text-sm font-semibold">Price</h6>
          <div className="relative mt-6">
            <div className="h-1.5 bg-gray-300 relative">
              <div
                id="activeTrack"
                className="absolute h-1.5 bg-pink-500 rounded-full w-9/12"
              ></div>
            </div>
            <input type="range" min="0" max="1000" defaultValue="0" />
            <input type="range" min="0" max="1000" defaultValue="750" />
            <div className="flex justify-between text-slate-600 font-medium text-sm mt-4">
              <span>$750</span>
              <span>$1000</span>
            </div>
          </div>
        </div>

        <hr className="my-6 border-gray-300" />

        {/* Color Filter */}
        {/* <div>
          <h6 className="text-slate-900 text-sm font-semibold">Color</h6>
          <div className="flex flex-wrap gap-3 mt-4">
            {[
              "bg-blue-700",
              "bg-purple-700",
              "bg-pink-700",
              "bg-orange-700",
              "bg-red-700",
              "bg-yellow-700",
              "bg-black",
              "bg-gray-700",
            ].map((color, index) => (
              <button
                key={index}
                type="button"
                className={`cursor-pointer rounded-full w-8 h-8 hover:scale-[1.05] transition-all ${color}`}
              ></button>
            ))}
          </div>
        </div> */}
      </div>

      {/* Store Cards */}
      <div className="w-full p-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores.map((store) => (
            <div
              key={store.id}
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition"
            >
              <img
                src={store.image}
                alt={store.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-slate-900">
                  {store.name}
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  {store.description}
                </p>
                <a
                  href={store.link}
                  className="mt-3 inline-block px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-700 rounded"
                >
                  View Store
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
