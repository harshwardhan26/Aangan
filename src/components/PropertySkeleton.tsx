import React from 'react';

export default function PropertySkeleton() {
  return (
    <div className="property-card" style={{ cursor: 'default' }}>
      <div 
        className="card-img-wrapper skeleton-shimmer" 
        style={{ height: '200px', width: '100%', backgroundColor: '#e2e8f0' }}
      >
      </div>
      <div className="card-content">
        <div className="skeleton-shimmer" style={{ height: '24px', width: '40%', marginBottom: '12px', borderRadius: '4px', backgroundColor: '#e2e8f0' }}></div>
        <div className="skeleton-shimmer" style={{ height: '20px', width: '80%', marginBottom: '8px', borderRadius: '4px', backgroundColor: '#e2e8f0' }}></div>
        <div className="skeleton-shimmer" style={{ height: '16px', width: '60%', marginBottom: '20px', borderRadius: '4px', backgroundColor: '#e2e8f0' }}></div>
        
        <div className="features" style={{ marginBottom: '20px', paddingBottom: '15px' }}>
          <div className="skeleton-shimmer" style={{ height: '16px', width: '30%', borderRadius: '4px', backgroundColor: '#e2e8f0', display: 'inline-block' }}></div>
          <span className="dot" style={{ opacity: 0 }}>·</span>
          <div className="skeleton-shimmer" style={{ height: '16px', width: '30%', borderRadius: '4px', backgroundColor: '#e2e8f0', display: 'inline-block' }}></div>
        </div>
        <div className="skeleton-shimmer" style={{ height: '44px', width: '100%', borderRadius: '8px', backgroundColor: '#e2e8f0' }}></div>
      </div>
    </div>
  );
}
