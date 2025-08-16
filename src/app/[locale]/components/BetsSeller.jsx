"use client";
import React, { useState } from "react";
import { useTranslations } from "use-intl";

function BestSeller() {
    const t = useTranslations('BestSeller')
  const categories = [
    { name: t('name1') },
    { name: t('name2') },
    { name: t('name3') },
  ];

  const products = [
    // Wood
    {
      id: 1,
      title: t('title1'),
      price: 999,
      category: t('cat1'),
      image: "/1.jpg",
    },
    {
      id: 2,
      title: t('title2'),
      price: 1000,
      category: t('cat1'),
      image: "/2.jpg",
    },
    {
      id: 3,
      title: t('title3'),
      price: 500,
      category: t('cat1'),
      image: "/3.jpg",
    },

    // Leather products
    {
      id: 4,
      title: t('title4'),
      price: 1500,
      category: t('cat2'),
      image: "/1.jpg",
    },
    {
      id: 5,
      title: t('title4'),
      price: 2000,
      category: t('cat2'),
      image: "/2.jpg",
    },
    {
      id: 6,
      title: t('title5'),
      price: 600,
      category: t('cat2'),
      image: "/3.jpg",
    },

    // Decoupage products
    {
      id: 7,
      title: t('title6'),
      price: 800,
      category: t('cat3'),
      image: "/8.jpg",
    },
    {
      id: 8,
      title: t('title7'),
      price: 1000,
      category: t('cat3'),
      image: "/9.jpg",
    },
    {
      id: 9,
      title: t('title8'),
      price: 1200,
      category: t('cat3'),
      image: "/6.jpg",
    },
  ];

  const [activeCategory, setActiveCategory] = useState(categories[0].name);

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text">
            {t('title')}
          </h2>
          <div className="w-24 h-1 bg-orange-400 mx-auto rounded-full"></div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-8 mb-16">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`relative px-6 py-3 text-lg font-medium transition-all duration-300 rounded-full ${
                activeCategory === cat.name
                  ? "text-white bg-orange-400 shadow-lg transform scale-105"
                  : "text-gray-600 bg-white hover:text-gray-900 hover:bg-gray-100 hover:shadow-md hover:scale-102 shadow-sm"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products Grid - Centered */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl">
            {products
              .filter((p) => p.category === activeCategory)
              .map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group transform hover:-translate-y-2 border border-gray-100"
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    {/* Wishlist button */}
                    <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 group-hover:shadow-xl">
                      <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </button>

                    {/* Category tag */}
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      {activeCategory}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
                      {product.title}
                    </h3>
                    <div className="flex items-center justify-between">
                      <p className="text-2xl font-bold text-gray-900">
                        <span className="text-lg text-gray-600">EGP</span> {product.price.toLocaleString()}
                      </p>
                      <button className="bg-orange-400 text-white px-4 py-2 rounded-full font-medium hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default BestSeller;