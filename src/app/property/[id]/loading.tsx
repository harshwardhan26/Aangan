import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Loading() {
  return (
    <>
      <Navbar />
      <main className="property-detail-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
        
        {/* Header Skeleton */}
        <div className="property-header-section" style={{ marginBottom: '30px' }}>
          <div className="skeleton-shimmer" style={{ height: '40px', width: '60%', marginBottom: '15px', borderRadius: '8px', backgroundColor: '#e2e8f0' }}></div>
          <div className="skeleton-shimmer" style={{ height: '20px', width: '30%', borderRadius: '4px', backgroundColor: '#e2e8f0' }}></div>
        </div>

        {/* Two Column Layout */}
        <div className="property-content-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '40px' }}>
          
          {/* Left Column: Image & Details Skeleton */}
          <div className="property-main-details">
            <div className="skeleton-shimmer" style={{ height: '400px', width: '100%', borderRadius: '16px', marginBottom: '30px', backgroundColor: '#e2e8f0' }}></div>
            
            <div className="skeleton-shimmer" style={{ height: '30px', width: '40%', marginBottom: '20px', borderRadius: '4px', backgroundColor: '#e2e8f0' }}></div>
            <div className="skeleton-shimmer" style={{ height: '15px', width: '100%', marginBottom: '10px', borderRadius: '4px', backgroundColor: '#e2e8f0' }}></div>
            <div className="skeleton-shimmer" style={{ height: '15px', width: '100%', marginBottom: '10px', borderRadius: '4px', backgroundColor: '#e2e8f0' }}></div>
            <div className="skeleton-shimmer" style={{ height: '15px', width: '80%', marginBottom: '30px', borderRadius: '4px', backgroundColor: '#e2e8f0' }}></div>
          </div>

          {/* Right Column: Lead Capture Skeleton */}
          <div className="property-sidebar">
            <div className="skeleton-shimmer" style={{ height: '450px', width: '100%', borderRadius: '16px', backgroundColor: '#e2e8f0' }}></div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
