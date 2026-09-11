import React from 'react'

function Pricing() {
  return (
   <div className="bg-gradient-to-r from-gray-50 to-orange-50 rounded-2xl p-6 border border-gray-200">
        <div className="flex items-baseline space-x-4">
          <span className="text-5xl font-bold text-gray-900">$30</span>
          <div className="flex flex-col">
            <span className="text-gray-400 text-lg line-through">
              $42
            </span>
            <span className="text-green-600 text-sm font-semibold">
              Save 29%
            </span>
          </div>
        </div>
        <p className="text-gray-500 text-sm mt-2">
          Tax included • Free shipping over $50
        </p>
    </div>
  )
}

export default Pricing