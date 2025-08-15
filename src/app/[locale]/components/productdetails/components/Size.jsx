import React, { useState } from "react";

function Size() {
      const [selectedVariant, setSelectedVariant] = useState("M");
      const Variants = ["Osama", "Mina", "Refaat", "Ali"];

  return (
    <div>
        <h3 className="text-lg font-semibold text-slate-900">Variants</h3>
              <div className="flex flex-wrap gap-3">
                {Variants.map((variant) => (
                  <button
                    key={variant}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-4 py-2 rounded-lg border-2 font-medium transition-all duration-200 ${
                      selectedVariant === variant
                        ? "border-blue-500 bg-blue-500 text-white shadow-lg scale-105"
                        : "border-slate-300 text-slate-700 hover:border-blue-300 hover:bg-blue-50"
                    }`}
                  >
                    {variant}
                  </button>
                ))}
              </div>


    </div>
  )
}

export default Size