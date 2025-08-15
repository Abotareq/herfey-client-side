import React from "react";

function ProductDesc() {
  return (
    <>
      {" "}
      <div className="space-y-6 pt-6 border-t border-slate-200">
        <h3 className="text-2xl font-bold text-slate-900">
          Product Description
        </h3>
        <p className="text-slate-600 leading-relaxed">
          Elevate your casual style with our premium men's t-shirt. Crafted for
          comfort and designed with a modern fit, this versatile shirt is an
          essential addition to your wardrobe. The soft and breathable fabric
          ensures all-day comfort, making it perfect for everyday wear.
        </p>

        <div className="space-y-3">
          {[
            "Versatile wardrobe essential for any occasion",
            "Available in sizes XS to XXL, including tall and petite",
            "Easy care - machine washable and low heat dry",
            "Customizable design for personal expression",
          ].map((feature, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-slate-600">{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default ProductDesc;
