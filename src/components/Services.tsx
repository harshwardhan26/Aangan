'use client';

import React, { useEffect, useRef } from 'react';

export default function Services() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          (entry.target as HTMLElement).style.opacity = '1';
          (entry.target as HTMLElement).style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    if (gridRef.current) {
      const cards = gridRef.current.querySelectorAll('.service-card');
      cards.forEach(card => {
        (card as HTMLElement).style.opacity = '0';
        (card as HTMLElement).style.transform = 'translateY(20px)';
        (card as HTMLElement).style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(card);
      });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section className="services">
      <div className="section-header text-center">
        <h3>Why Choose Aangan?</h3>
        <p>We provide the best end-to-end real estate solutions</p>
      </div>
      <div className="services-grid" ref={gridRef}>
        <div className="service-card">
          <div className="service-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <h4>100% Verified Listings</h4>
          <p>Every property is physically verified to ensure you get exactly what you see.</p>
        </div>
        <div className="service-card">
          <div className="service-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
          </div>
          <h4>Save Time & Money</h4>
          <p>Direct contact with owners and trusted builders without hidden brokerage fees.</p>
        </div>
        <div className="service-card">
          <div className="service-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <h4>End-to-End Support</h4>
          <p>From property search to home loans and legal assistance, we have got you covered.</p>
        </div>
      </div>
    </section>
  );
}
