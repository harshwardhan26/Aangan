'use client';

import React from 'react';
import Link from 'next/link';

export default function PopularSearches() {
  const searchLinks = [
    'Studio Apartments in Kolhapur',
    'Duplex Villas in Tarabai Park',
    'Resale House in Nagala Park',
    'Gated Townships in Rajarampuri',
    'Penthouse in Shahupuri',
    'House for sale without brokerage in Kolhapur',
    'Rowhouse in Kadamwadi',
    '4 BHK Luxury Flats in Pratibha Nagar',
    'Agricultural Land near Kolhapur',
    '2 BHK Budget Flats in Ruikar Colony'
  ];

  return (
    <section className="popular-searches-section">
      <div className="section-header">
        <h3>Browse top links to search your home</h3>
      </div>

      <div className="search-links-card">
        <h4 className="links-group-title">People Also Search For</h4>
        
        <div className="links-grid">
          {searchLinks.map((link, idx) => (
            <Link key={idx} href={`/search?q=${encodeURIComponent(link.replace(' in Kolhapur', '').replace(' near Kolhapur', ''))}`} className="search-link-item">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              {link}
            </Link>
          ))}
        </div>
      </div>

      <div className="rea-group-footer">
        <p className="brand-affiliation">
          Part of <span className="brand-accent">Aangan Media & Real Estate Group</span>
        </p>
      </div>
    </section>
  );
}
