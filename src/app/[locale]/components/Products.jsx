import image1 from '../photos/image1.png';
import image2 from '../photos/image2.png';

function Products() {
  const products = [
    { title: 'vase', price: 800, image: image1 },
    { title: 'vase', price: 900, image: image2 },
    { title: 'green vase', price: 1000, image: image1 },
    { title: 'white vase', price: 1200, image: image2 },
    { title: 'white vase', price: 1200, image: image2 },
    { title: 'white vase', price: 1200, image: image2 },
    { title: 'white vase', price: 1200, image: image2 },
    { title: 'white vase', price: 1200, image: image2 },
    { title: 'white vase', price: 1200, image: image2 },
    { title: 'white vase', price: 1200, image: image2 },
  ];

  return (
    <div className="flex flex-wrap justify-center">
      {products.map((pro, index) => (
        <div
          key={index}
          className="flex-shrink-0 m-6 relative overflow-hidden bg-orange-500 rounded-lg max-w-xs shadow-lg group"
        >
          {/* Background SVG */}
          <svg
            className="absolute bottom-0 left-0 mb-8 scale-150 group-hover:scale-[1.65] transition-transform"
            viewBox="0 0 375 283"
            fill="none"
            style={{ opacity: 0.1 }}
          >
            <rect
              x="159.52"
              y="175"
              width="152"
              height="152"
              rx="8"
              transform="rotate(-45 159.52 175)"
              fill="white"
            />
            <rect
              y="107.48"
              width="152"
              height="152"
              rx="8"
              transform="rotate(-45 0 107.48)"
              fill="white"
            />
          </svg>

          {/* Product Image */}
          <div className="relative pt-10 px-10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <div
              className="block absolute w-48 h-48 bottom-0 left-0 -mb-24 ml-3"
              style={{
                background: "radial-gradient(black, transparent 60%)",
                transform: "rotate3d(0, 0, 1, 20deg) scale3d(1, 0.6, 1)",
                opacity: 0.2,
              }}
            ></div>
            <img
              className="relative w-40"
              src={pro.image}
              alt={pro.title}
            />
          </div>

          {/* Product Details */}
          <div className="relative text-white px-6 pb-6 mt-6">
            <span className="block opacity-75 -mb-1">Outdoor</span>
            <div className="flex justify-between">
              <span className="block font-semibold text-xl capitalize">{pro.title}</span>
              <span className="block bg-white rounded-full text-teal-500 text-xs font-bold px-3 py-2 leading-none flex items-center">
                ${pro.price}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Products;
