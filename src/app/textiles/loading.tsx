
import React from 'react';

export default function TextilesLoading() {
  return (
    <div className="bg-white min-h-screen pt-24 lg:pt-[140px] animate-pulse">
      {/* Hero Skeleton */}
      <section className="relative h-[85vh] min-h-[650px] bg-gray-100 overflow-hidden">
        <div className="max-w-[1700px] mx-auto px-6 md:px-12 lg:px-32 h-full flex flex-col justify-center items-start">
          <div className="w-32 h-6 bg-gray-200 rounded mb-6" />
          <div className="w-2/3 h-20 bg-gray-200 rounded mb-4" />
          <div className="w-1/2 h-16 bg-gray-200 rounded mb-10" />
          <div className="w-48 h-12 bg-gray-200 rounded" />
        </div>
      </section>

      {/* Value Pillars Skeleton */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-[1700px] mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full" />
              <div className="space-y-2">
                <div className="w-24 h-3 bg-gray-200 rounded" />
                <div className="w-16 h-2 bg-gray-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories Horizontal Nav Skeleton */}
      <div className="bg-white border-b border-gray-100 py-4 sticky top-24 z-40 hidden lg:block">
        <div className="max-w-[1700px] mx-auto px-12 flex gap-10">
          {[1,2,3,4,5,6,7,8].map(i => (
            <div key={i} className="w-20 h-4 bg-gray-100 rounded" />
          ))}
        </div>
      </div>

      {/* Categories Grid Skeleton (Curated) */}
      <section className="py-24 max-w-[1700px] mx-auto px-6 lg:px-24">
        <div className="flex flex-col items-center mb-20">
          <div className="w-48 h-10 bg-gray-100 rounded mb-4" />
          <div className="w-96 h-4 bg-gray-50 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-6">
              <div className="aspect-[4/5] bg-gray-50 rounded-[2rem]" />
              <div className="h-6 w-1/2 bg-gray-100 rounded mx-auto" />
            </div>
          ))}
        </div>
      </section>

      {/* Horizontal Boutique Sections Skeleton */}
      {[1, 2].map((section) => (
        <section key={section} className="py-24 border-t border-gray-50 overflow-hidden">
          <div className="max-w-[1700px] mx-auto px-6 lg:px-24">
            <div className="flex flex-col items-center mb-16">
              <div className="w-64 h-10 bg-gray-100 rounded mb-4" />
              <div className="w-full max-w-2xl h-4 bg-gray-50 rounded" />
            </div>
            <div className="flex gap-8 overflow-hidden">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="min-w-[300px] aspect-[3/4] bg-gray-50 rounded-xl" />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
