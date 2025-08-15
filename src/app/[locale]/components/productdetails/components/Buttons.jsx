
function Buttons() {
  return (
    <div className="space-y-4 pt-4">
        <button className="w-full px-6 py-4 bg-gradient-to-r from-orange-600 to-amber-500 hover:from-orange-700 hover:to-amber-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200">
          Add to Cart
        </button>
        <button className="w-full px-6 py-4 border-2 border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white font-semibold rounded-xl transition-all duration-200">
          Buy Now
        </button>
    </div>
  )
}

export default Buttons