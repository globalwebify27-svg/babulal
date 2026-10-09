
import React from 'react';

export default function ProductLoading() {
  return (
    <div className="bg-white min-h-screen pt-28 md:pt-48 lg:pt-64 pb-24 animate-pulse">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-12">
        {/* Breadcrumbs Skeleton */}
        <div className="flex gap-4 mb-12">
          <div className="w-24 h-4 bg-gray-100 rounded" />
          <div className="w-4 h-4 bg-gray-100 rounded" />
          <div className="w-32 h-4 bg-gray-100 rounded" />
          <div className="w-4 h-4 bg-gray-100 rounded" />
          <div className="w-48 h-4 bg-gray-100 rounded" />
        </div>

        <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start">
          {/* Left: Gallery Skeleton */}
          <div className="lg:col-span-7">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1 aspect-square bg-gray-50 rounded-[2.5rem]" />
              <div className="flex md:flex-col gap-4 md:w-24">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-16 md:w-full aspect-square bg-gray-50 rounded-xl" />
                ))}
              </div>
            </div>
          </div>

          {/* Right: Details Skeleton */}
          <div className="lg:col-span-5 space-y-12">
            <div className="space-y-6">
              <div className="w-32 h-6 bg-gray-100 rounded-full" />
              <div className="w-full h-16 bg-gray-100 rounded" />
              <div className="w-3/4 h-8 bg-gray-100 rounded" />
            </div>

            <div className="flex gap-4">
              <div className="flex-1 h-14 bg-gray-100 rounded" />
              <div className="flex-1 h-14 bg-gray-100 rounded" />
            </div>

            <div className="space-y-4 pt-12 border-t border-gray-100">
              <div className="w-48 h-6 bg-gray-100 rounded mb-6" />
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex justify-between py-4 border-b border-gray-50">
                  <div className="w-32 h-4 bg-gray-100 rounded" />
                  <div className="w-48 h-4 bg-gray-100 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
