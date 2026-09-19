import React from 'react'

function ProductInfo() {
  return (
    <div className="space-y-4">
        <div className="bg-white inline-flex items-center px-3 py-1 rounded-full text-xs font-medium text-orange-800 shadow-xs">
          <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
          In Stock
        </div>
        <h1 className="text-4xl font-bold text-gray-900 leading-tight">
          Adjective Attire
          <span className="block text-2xl font-medium text-gray-600 mt-1">
            Premium T-shirt
          </span>
        </h1>
        <p className="text-gray-500 font-medium">Well-Versed Commerce</p>
    </div>
  )
}

export default ProductInfo