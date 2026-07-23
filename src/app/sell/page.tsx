import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Sell Your Property | Aangan Kolhapur',
  description: 'List your property on Aangan for free and connect directly with verified buyers and tenants in Kolhapur.',
};

export default function SellPage() {
  return (
    <>
      <Navbar />
      
      <main className="sell-page-container">
        {/* HERO SECTION */}
        <section className="sell-hero">
          <div className="sell-hero-content">
            <h1>Sell your property faster with Aangan</h1>
            <p>
              Reach thousands of genuine buyers and tenants in Kolhapur without paying hefty brokerage fees. 
              Take control of your listings and close deals directly.
            </p>
            <Link href="/list-property" className="btn-primary" style={{ padding: '15px 40px', fontSize: '1.2rem', display: 'inline-block' }}>
              Post Property for Free
            </Link>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="sell-section">
          <h2 className="sell-section-title">How It Works</h2>
          <div className="sell-steps-grid">
            <div className="sell-step-card">
              <div className="sell-step-icon">📝</div>
              <h3>1. List for Free</h3>
              <p>Create a detailed listing of your property in minutes. Add high-quality photos, amenities, and price expectations instantly.</p>
            </div>
            <div className="sell-step-card">
              <div className="sell-step-icon">🛡️</div>
              <h3>2. Get Verified</h3>
              <p>Our team quickly verifies your listing to ensure quality and trust, making it highly visible to potential buyers.</p>
            </div>
            <div className="sell-step-card">
              <div className="sell-step-icon">🤝</div>
              <h3>3. Connect with Buyers</h3>
              <p>Receive inquiries directly in your dashboard from genuine buyers interested in properties in Kolhapur.</p>
            </div>
            <div className="sell-step-card">
              <div className="sell-step-icon">📊</div>
              <h3>4. Track & Close</h3>
              <p>Use our built-in CRM tools to track leads, schedule site visits, and finalize deals without a middleman.</p>
            </div>
          </div>
        </section>

        {/* TRUST / VALUE SECTION */}
        <section className="sell-trust-section">
          <div className="sell-trust-grid">
            <div className="trust-item">
              <div className="trust-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <div className="trust-content">
                <h3>100% Verified Buyers</h3>
                <p>We strictly monitor the platform to ensure you only deal with genuine buyers and avoid spam or unverified agents.</p>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="1" x2="12" y2="23"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
              </div>
              <div className="trust-content">
                <h3>Zero Brokerage Option</h3>
                <p>By connecting directly through our platform, you can save thousands of rupees in brokerage commissions.</p>
              </div>
            </div>
            <div className="trust-item">
              <div className="trust-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
              </div>
              <div className="trust-content">
                <h3>Built for Kolhapur</h3>
                <p>A local platform dedicated specifically to the Kolhapur market, giving your property maximum local relevance.</p>
              </div>
            </div>
          </div>
        </section>

        {/* TRACK YOUR CLIENTS SECTION */}
        <section className="sell-tracker-section">
          <div className="tracker-text">
            <h2>Take Control with Client Tracker</h2>
            <p>
              No more messy spreadsheets or lost WhatsApp messages. Our built-in dashboard gives you professional CRM tools to manage every buyer effectively.
            </p>
            <ul>
              <li>
                <span style={{ color: 'var(--primary)' }}>✓</span> 
                Organize leads by stage: <em>New, Site Visit, Negotiating</em>
              </li>
              <li>
                <span style={{ color: 'var(--primary)' }}>✓</span> 
                Track buyer budgets vs. your asking price instantly
              </li>
              <li>
                <span style={{ color: 'var(--primary)' }}>✓</span> 
                Add private notes and set follow-up reminders
              </li>
            </ul>
            <Link href="/dashboard" className="btn-primary" style={{ display: 'inline-block', padding: '12px 24px', boxShadow: 'var(--shadow-md)' }}>
              Go to Your Dashboard
            </Link>
          </div>
          <div className="tracker-visual">
            <div style={{ padding: '15px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '0.9rem' }}>Buyer Pipeline</strong>
              <span className="badge-verified" style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 600 }}>3 Active Leads</span>
            </div>
            <div style={{ padding: '15px' }}>
              <div style={{ background: '#f8fafc', border: '1px solid var(--border)', padding: '12px', borderRadius: '8px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 500 }}>
                <span>Amit Joshi</span>
                <span style={{ color: '#10b981' }}>Site Visit Done</span>
              </div>
              <div style={{ background: '#f8fafc', border: '1px solid var(--border)', padding: '12px', borderRadius: '8px', marginBottom: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 500 }}>
                <span>Rahul Patil</span>
                <span style={{ color: 'var(--primary)' }}>Negotiating</span>
              </div>
              <div style={{ background: '#f8fafc', border: '1px solid var(--border)', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 500 }}>
                <span>Sneha Kulkarni</span>
                <span style={{ color: 'var(--text-muted)' }}>New Lead</span>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="sell-section sell-faq-section">
          <h2 className="sell-section-title">Frequently Asked Questions</h2>
          <div className="faq-grid">
            <div className="faq-item">
              <h4>Is listing my property actually free?</h4>
              <p>Yes! Creating a standard property listing on Aangan is 100% free. You can add photos, descriptions, and receive leads at no cost.</p>
            </div>
            <div className="faq-item">
              <h4>How does the verification process work?</h4>
              <p>Once you submit your listing, our team reviews the details to ensure accuracy and prevent spam. Verified listings receive a special badge and higher visibility.</p>
            </div>
            <div className="faq-item">
              <h4>How will buyers contact me?</h4>
              <p>When a buyer is interested, their contact details will appear directly in your Aangan dashboard under the "Client Tracker" tab. You will also receive an email notification.</p>
            </div>
            <div className="faq-item">
              <h4>Can I edit or remove my listing later?</h4>
              <p>Absolutely. You retain full control over your listings. You can update the price, change photos, or mark the property as sold at any time from your dashboard.</p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  );
}
