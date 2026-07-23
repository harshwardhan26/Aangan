import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer>
      <div className="footer-content">
        <div className="footer-col brand-col">
          <Link href="/" className="logo">
            <img src="/assets/images/logo-white.png" alt="Aangan" className="logo-img" />
          </Link>
          <p>Your trusted real estate partner for finding the perfect home.</p>
        </div>
        <div className="footer-col">
          <h4>Company</h4>
          <Link href="/about">About Us</Link>
          <Link href="/careers">Careers</Link>
          <Link href="/contact">Contact Us</Link>
        </div>
        <div className="footer-col">
          <h4>Services</h4>
          <Link href="/search">Buy Property</Link>
          <Link href="/search?type=rent">Rent Property</Link>
          <Link href="/search?type=coliving">Co-living</Link>
        </div>
        <div className="footer-col">
          <h4>Legal</h4>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/terms">Terms of Service</Link>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2026 Aangan Real Estate. All rights reserved.</p>
      </div>
    </footer>
  );
}
