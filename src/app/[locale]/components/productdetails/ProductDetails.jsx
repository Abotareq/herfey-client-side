"use client";
import ReviewsSection from "./components/ReviewData";
import ProductDesc from "./components/ProductDesc";
import Images from "./components/Images";
import ProductInfo from "./components/ProductInfo";
import Ratings from "./components/Ratings";
import Pricing from "./components/Pricing";
import Size from "./components/Size";
import Header from "./components/Header";
import Rating from "./components/Rating";
import Quantity from "./components/Quantity";
import Features from "./components/Features";
import Buttons from "./components/Buttons";

function ProductDetails() {
  

  


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid items-start grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <Images />
          {/* Product Info */}
          <div className="space-y-8">
            {/* Header */}
            <ProductInfo />
            {/* Rating */}
            <Ratings />
            {/* Pricing */}
            <Pricing />
            {/* Size Selection */}
            <div className="space-y-4">
              <Size />
              <div className="space-y-8">
            {/* Header */}
            <Header />
            {/* Rating */}
            <Rating />
            {/* Quantity */}
            <Quantity />
            {/* Features */}
            <Features />
            {/* Product Description */}
            <ProductDesc />
              </div>
            </div>
            {/* Action Buttons */}
            <Buttons />
            {/* Product Description */}
            <ProductDesc />
          </div>
        </div>
        <ReviewsSection />
      </div>
    </div>
  );
}

export default ProductDetails;
