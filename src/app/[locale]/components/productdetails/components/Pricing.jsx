import React from 'react'

function Pricing() {
  return (
   <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-200">
        <div className="flex items-baseline space-x-4">
          <span className="text-5xl font-bold text-slate-900">$30</span>
          <div className="flex flex-col">
            <span className="text-slate-400 text-lg line-through">
              $42
            </span>
            <span className="text-green-600 text-sm font-semibold">
              Save 29%
            </span>
          </div>
        </div>
        <p className="text-slate-500 text-sm mt-2">
          Tax included • Free shipping over $50
        </p>
    </div>
  )
}

export default Pricing