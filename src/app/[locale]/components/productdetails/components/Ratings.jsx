import React from 'react'

function Ratings() {
  return (
    <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-5 h-5 ${
                i < 4 ? "fill-amber-400" : "fill-slate-300"
              }`}
              viewBox="0 0 14 13"
            >
              <path d="M7 0L9.4687 3.60213L13.6574 4.83688L10.9944 8.29787L11.1145 12.6631L7 11.2L2.8855 12.6631L3.00556 8.29787L0.342604 4.83688L4.5313 3.60213L7 0Z" />
            </svg>
          ))}
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <span className="font-semibold text-slate-700">4.2</span>
          <span className="text-slate-500">•</span>
          <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
            87 Reviews
          </button>
        </div>
    </div>
  )
}

export default Ratings