
import React from 'react';

export default function CategoryLoading() {
  return (
    <div className="bg-white min-h-screen pt-40 md:pt-64 pb-24 animate-pulse">
      <div className="max-w-[1700px] mx-auto px-6 md:px-12 flex flex-col lg:flex-row gap-12">
        {/* Sidebar Skeleton */}
        <aside className="lg:w-64 shrink-0 hidden lg:block space-y-8">
          <div className="h-6 w-32 bg-gray-100 rounded" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-4 w-full bg-gray-50 rounded" />
            ))}
          </div>
          <div className="pt-12">
            <div className="h-32 w-full bg-gray-50 rounded-xl" />
          </div>
        </aside>

        {/* Product Grid Skeleton */}
        <div className="flex-1">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="flex flex-col border border-gray-50">
                <div className="aspect-[3/4] bg-gray-50" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-full bg-gray-100 rounded" />
                  <div className="h-3 w-2/3 bg-gray-100 rounded" />
                  <div className="h-10 w-full bg-gray-100 rounded mt-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
