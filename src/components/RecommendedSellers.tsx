'use client';

import React from 'react';

type Seller = {
  id: string;
  name: string;
  experience: string;
  totalListings: number;
  localities: string[];
  phone: string;
  bgGradient: string;
};

const sellers: Seller[] = [
  {
    id: '1',
    name: 'Ghodake Properties',
    experience: '12 Yrs',
    totalListings: 39,
    localities: ['Tarabai Park', 'Nagala Park'],
    phone: '+91 98220 12345',
    bgGradient: 'linear-gradient(135deg, #4f46e5, #3b82f6)'
  },
  {
    id: '2',
    name: 'Dream Rise Realtor',
    experience: '21 Yrs',
    totalListings: 53,
    localities: ['Rajarampuri', 'Shahupuri'],
    phone: '+91 98225 67890',
    bgGradient: 'linear-gradient(135deg, #059669, #10b981)'
  },
  {
    id: '3',
    name: 'Homefindr Kolhapur',
    experience: '8 Yrs',
    totalListings: 56,
    localities: ['Kadamwadi', 'Ruikar Colony'],
    phone: '+91 94224 11223',
    bgGradient: 'linear-gradient(135deg, #ea580c, #fa5a5a)'
  },
  {
    id: '4',
    name: 'Sukoon Estates',
    experience: '15 Yrs',
    totalListings: 42,
    localities: ['Pratibha Nagar', 'Tarabai Park'],
    phone: '+91 98900 44556',
    bgGradient: 'linear-gradient(135deg, #0284c7, #06b6d4)'
  }
];

export default function RecommendedSellers() {
  return (
    <section className="sellers-section">
      <div className="section-header">
        <h3>Recommended Sellers</h3>
        <p>Sellers with complete knowledge about localities in Kolhapur</p>
      </div>

      <div className="sellers-grid">
        {sellers.map((seller) => (
          <div key={seller.id} className="seller-card">
            <div className="seller-card-header" style={{ background: seller.bgGradient }}>
              <div className="seller-avatar">
                {seller.name.substring(0, 2).toUpperCase()}
              </div>
              <div className="seller-title">
                <h4>{seller.name}</h4>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            </div>

            <div className="seller-card-body">
              <div className="seller-stats">
                <div>
                  <span className="stat-num">{seller.experience}</span>
                  <span className="stat-lbl">Experience</span>
                </div>
                <div className="stat-divider"></div>
                <div>
                  <span className="stat-num">{seller.totalListings}</span>
                  <span className="stat-lbl">Total Listings</span>
                </div>
              </div>

              <div className="seller-localities">
                {seller.localities.map((loc, i) => (
                  <span key={i} className="locality-tag">{loc}</span>
                ))}
              </div>

              <button 
                className="btn-show-contact"
                onClick={() => alert(`Contact ${seller.name} at ${seller.phone}`)}
              >
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                Show Contact
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
