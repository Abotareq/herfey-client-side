import { useState } from "react";
import React from 'react'

function Quantity() {
      const [quantity, setQuantity] = useState(1);

  return (
    <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Quantity</h3>
        <div className="flex items-center space-x-4">
          <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-colors"
            >
              −
            </button>
            <span className="px-6 py-2 bg-white font-semibold text-gray-900">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition-colors"
            >
              +
            </button>
          </div>
        </div>
    </div>
  )
}

export default Quantity