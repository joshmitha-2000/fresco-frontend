import React from 'react';

export default function Skeleton() {
  return (
    <div className="w-full">
      {/* Hero Section Skeleton */}
      <div className="w-full h-[95vh] bg-gray-300 animate-pulse rounded-lg mb-8"></div>

      {/* Placeholder Sections */}
      <div className="space-y-8 px-4">
        {/* Section 1 */}
        <div className="w-full h-64 bg-gray-300 animate-pulse rounded-lg"></div>

        {/* Section 2 */}
        <div className="w-full h-64 bg-gray-300 animate-pulse rounded-lg"></div>

        {/* Section 3 */}
        <div className="w-full h-64 bg-gray-300 animate-pulse rounded-lg"></div>

        {/* Section 4 */}
        <div className="w-full h-64 bg-gray-300 animate-pulse rounded-lg"></div>
      </div>
    </div>
  );
}