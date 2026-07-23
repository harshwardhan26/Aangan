import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="dashboard-container" style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto', minHeight: '60vh' }}>
        
        {/* Header Skeleton */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingBottom: '20px', marginBottom: '20px' }}>
          <div style={{ width: '100%' }}>
            <div className="skeleton-shimmer" style={{ height: '45px', width: '300px', marginBottom: '15px', borderRadius: '8px', backgroundColor: '#e2e8f0' }}></div>
            <div className="skeleton-shimmer" style={{ height: '20px', width: '400px', borderRadius: '4px', backgroundColor: '#e2e8f0' }}></div>
          </div>
        </div>

        {/* Tabs Skeleton */}
        <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid var(--border)', marginBottom: '30px' }}>
          <div className="skeleton-shimmer" style={{ height: '30px', width: '120px', borderRadius: '4px', backgroundColor: '#e2e8f0' }}></div>
          <div className="skeleton-shimmer" style={{ height: '30px', width: '120px', borderRadius: '4px', backgroundColor: '#e2e8f0' }}></div>
        </div>

        {/* Content Grid Skeleton */}
        <div className="property-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
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
