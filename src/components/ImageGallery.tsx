'use client';

import React, { useState } from 'react';

export default function ImageGallery({ images, primaryImage, title }: { images: { url: string }[], primaryImage: string, title: string }) {
  const allImages = [primaryImage, ...images.map(i => i.url)];
  const [currentIndex, setCurrentIndex] = useState(0);

  if (allImages.length <= 1) {
    return (
      <img 
        src={primaryImage} 
        alt={title} 
        className="property-hero-img"
      />
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <img 
        src={allImages[currentIndex]} 
        alt={`${title} - Image ${currentIndex + 1}`} 
        className="property-hero-img"
        style={{ objectFit: 'cover', width: '100%', height: '100%', transition: 'opacity 0.3s ease-in-out' }}
      />
      
      {/* Navigation Arrows */}
      <button 
        onClick={() => setCurrentIndex(prev => prev === 0 ? allImages.length - 1 : prev - 1)}
        style={{
          position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(255, 255, 255, 0.8)',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          cursor: 'pointer',
          zIndex: 10,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <button 
        onClick={() => setCurrentIndex(prev => prev === allImages.length - 1 ? 0 : prev + 1)}
        style={{
          position: 'absolute',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          background: 'rgba(255, 255, 255, 0.8)',
          border: 'none',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          cursor: 'pointer',
          zIndex: 10,
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      {/* Thumbnails Indicator */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
        zIndex: 10,
        background: 'rgba(0, 0, 0, 0.5)',
        padding: '8px 16px',
        borderRadius: '20px'
      }}>
        {allImages.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: idx === currentIndex ? '#fff' : 'rgba(255, 255, 255, 0.5)',
              border: 'none',
              padding: 0,
              cursor: 'pointer',
              transition: 'background 0.3s ease'
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
