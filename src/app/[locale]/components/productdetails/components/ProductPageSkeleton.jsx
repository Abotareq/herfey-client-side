"use client";

/** Same shape as the loaded product page: tile board on the left, details on the right. */
function ProductPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-orange-50">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center gap-2" aria-hidden="true">
          <div className="skeleton h-3 w-12" />
          <div className="skeleton h-3 w-16" />
          <div className="skeleton h-3 w-32" />
        </div>

        <div className="overflow-hidden rounded-3xl bg-white shadow-xl shadow-orange-100/60">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-4 sm:p-6 lg:p-8">
              <div className="rounded-2xl bg-orange-50/70 p-2 sm:p-3">
                <div
                  className="grid grid-cols-3 gap-3"
                  style={{ padding: "calc((100% - 24px) / 8)" }}
                  aria-hidden="true"
                >
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="skeleton aspect-square w-full rounded-xl" />
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 lg:border-l lg:border-gray-100 lg:p-10" aria-hidden="true">
              <div className="flex flex-col gap-6">
                <div>
                  <div className="skeleton mb-3 h-5 w-24 rounded-full" />
                  <div className="skeleton h-9 w-4/5" />
                  <div className="skeleton mt-2 h-9 w-1/2" />
                  <div className="mt-3 flex items-center gap-2">
                    <div className="skeleton h-5 w-28" />
                    <div className="skeleton h-4 w-20" />
                  </div>
                </div>
                <div className="flex items-baseline gap-3">
                  <div className="skeleton h-10 w-36" />
                  <div className="skeleton h-6 w-20" />
                </div>
                <div className="space-y-2">
                  <div className="skeleton h-4 w-full" />
                  <div className="skeleton h-4 w-11/12" />
                  <div className="skeleton h-4 w-2/3" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="skeleton h-11 w-full rounded-xl" />
                </div>
                <div className="flex gap-4 border-t border-gray-100 pt-6">
                  <div className="skeleton h-12 w-36 rounded-xl" />
                  <div className="skeleton h-12 flex-1 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPageSkeleton;
