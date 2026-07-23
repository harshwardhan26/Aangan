import React from 'react';
import Link from 'next/link';

export default function SellPropertyBanner() {
  return (
    <section className="sell-banner-section">
      <div className="sell-banner-card">
        <div className="sell-banner-content">
          <span className="sell-badge">FOR OWNERS & SELLERS</span>
          <h2>Have a property to sell or rent in Kolhapur?</h2>
          <p>List your property on Aangan for FREE and connect with thousands of genuine buyers & tenants faster.</p>
          <div className="sell-banner-features">
            <span>✓ Zero Brokerage Option</span>
            <span>✓ Verified Buyer Leads</span>
            <span>✓ Instant Visibility</span>
          </div>
        </div>

        <div className="sell-banner-cta">
          <Link href="/list-property" className="btn-post-property">
            Post Property <span className="free-tag">FREE</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
