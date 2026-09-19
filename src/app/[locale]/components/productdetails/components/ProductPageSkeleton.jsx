"use client";

/** Same shape as the loaded product page: stage image and thumbnail strip on the left, details on the right. */
function ProductPageSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-4 md:px-8 md:pt-6">
        <div className="mb-6 flex items-center gap-2" aria-hidden="true">
          <div className="skeleton h-3 w-12" />
          <div className="skeleton h-3 w-16" />
          <div className="skeleton h-3 w-32" />
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16" aria-hidden="true">
          <div className="lg:col-span-7">
            <div className="skeleton aspect-[4/5] w-full rounded-2xl sm:aspect-square" />
            <div className="mt-3 grid grid-cols-5 gap-2.5 px-4">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="skeleton aspect-square w-full rounded-lg" />
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 lg:py-2">
            <div className="flex flex-col gap-7">
              <div>
                <div className="skeleton mb-3 h-3 w-24" />
                <div className="skeleton h-9 w-4/5" />
                <div className="skeleton mt-2 h-9 w-1/2" />
                <div className="mt-3 flex items-center gap-2">
                  <div className="skeleton h-5 w-28" />
                  <div className="skeleton h-4 w-20" />
                </div>
              </div>
              <div className="flex items-baseline gap-3">
                <div className="skeleton h-9 w-32" />
                <div className="skeleton h-5 w-16" />
              </div>
              <div className="space-y-2">
                <div className="skeleton h-4 w-full" />
                <div className="skeleton h-4 w-11/12" />
                <div className="skeleton h-4 w-2/3" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <div className="skeleton mb-1.5 h-4 w-12" />
                  <div className="skeleton h-11 w-full rounded-xl" />
                </div>
              </div>
              <div className="flex gap-4 border-t border-gray-900/8 pt-6">
                <div className="skeleton h-12 w-36 rounded-full" />
                <div className="skeleton h-12 flex-1 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPageSkeleton;
