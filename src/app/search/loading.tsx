import React from 'react';
import PropertySkeleton from '@/components/PropertySkeleton';
import Navbar from '@/components/Navbar';

export default function Loading() {
  return (
    <>
      <Navbar />
      <div className="search-page-container" style={{ padding: '40px 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <div className="search-header" style={{ marginBottom: '30px' }}>
          <div className="skeleton-shimmer" style={{ height: '36px', width: '300px', marginBottom: '10px', borderRadius: '4px', backgroundColor: '#e2e8f0' }}></div>
          <div className="skeleton-shimmer" style={{ height: '20px', width: '200px', borderRadius: '4px', backgroundColor: '#e2e8f0' }}></div>
        </div>
        
        <div className="property-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <PropertySkeleton key={i} />
          ))}
        </div>
      </div>
    </>
  );
}
