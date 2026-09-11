"use client";

/**
 * Same box as a category tile (image block, centred title, short underline)
 * so the grid holds its shape while categories load.
 */
export function CategoryTileSkeleton() {
  return (
    <div
      className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md"
      aria-hidden="true"
    >
      <div className="skeleton h-64 w-full rounded-none" />
      <div className="flex flex-col items-center gap-3 p-6">
        <div className="skeleton h-6 w-1/2" />
        <div className="skeleton h-0.5 w-12" />
      </div>
    </div>
  );
}

/** The categories page grid, filled with tiles. */
export function CategoryGridSkeleton({ count = 6 }) {
  return (
    <div className="w-full bg-gray-100 p-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {Array.from({ length: count }, (_, i) => (
            <CategoryTileSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
