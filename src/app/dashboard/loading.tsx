import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="dashboard-container page-container-standard">
        
        {/* Header Skeleton */}
        <div className="page-header-flex">
          <div style={{ width: '100%' }}>
            <div className="skeleton-shimmer" style={{ height: '45px', width: '300px', marginBottom: '15px', borderRadius: '8px', backgroundColor: '#e2e8f0' }}></div>
            <div className="skeleton-shimmer" style={{ height: '20px', width: '400px', borderRadius: '4px', backgroundColor: '#e2e8f0' }}></div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div className="dashboard-tabs">
          <div className="skeleton-shimmer" style={{ height: '30px', width: '120px', borderRadius: '4px', backgroundColor: '#e2e8f0' }}></div>
          <div className="skeleton-shimmer" style={{ height: '30px', width: '120px', borderRadius: '4px', backgroundColor: '#e2e8f0' }}></div>
        </div>

        {/* Content Grid Skeleton */}
        <div className="property-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="property-card" style={{ height: '350px' }}>
               <div className="skeleton-shimmer" style={{ height: '100%', width: '100%', borderRadius: '12px', backgroundColor: '#e2e8f0' }}></div>
            </div>
          ))}
        </div>

      </main>
      <Footer />
    </>
  );
}
