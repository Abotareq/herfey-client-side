
function Header() {
  return (
    <div className="space-y-4">
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 border border-blue-200">
          <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
          In Stock
        </div>
        <h1 className="text-4xl font-bold text-slate-900 leading-tight">
          Adjective Attire
          <span className="block text-2xl font-medium text-slate-600 mt-1">
            Premium T-shirt
          </span>
        </h1>
        <p className="text-slate-500 font-medium">Well-Versed Commerce</p>
    </div>
  )
}

export default Header